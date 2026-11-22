'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Play,
  Pause,
  Square,
  Volume2,
  AlertCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { LEGAL_ARTICLES } from '@/lib/legaltalk-data';
import { useLanguage } from '@/context/LanguageContext';

interface SpeechChunk {
  text: string;
  sectionIndex: number; // -1 = title/lead, 0+ = article.content.sections index
  label: string;
}

export default function LegalTalkArticleClient({ slug }: { slug: string }) {
  const { language } = useLanguage();

  const article = LEGAL_ARTICLES.find((a) => a.slug === slug) || LEGAL_ARTICLES[0];

  const [playbackState, setPlaybackState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [currentChunkIdx, setCurrentChunkIdx] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);

  const sessionIdRef = useRef<number>(0);
  const chunkIndexRef = useRef<number>(0);
  const rateRef = useRef<number>(1);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Build clean, sentence-sized chunks so Chrome/Edge never truncates long articles
  const chunks = useMemo<SpeechChunk[]>(() => {
    const list: SpeechChunk[] = [];

    const pushSentences = (rawText: string, sectionIndex: number, label: string) => {
      const cleaned = rawText.replace(/\s+/g, ' ').trim();
      if (!cleaned) return;
      const parts = cleaned.match(/[^.!?]+[.!?]*/g) || [cleaned];
      parts.forEach((part) => {
        const trimmed = part.trim();
        if (trimmed) {
          list.push({ text: trimmed, sectionIndex, label });
        }
      });
    };

    pushSentences(`${article.title}. Written by ${article.author}.`, -1, 'Introduction');
    pushSentences(article.content.lead, -1, 'Overview');

    article.content.sections.forEach((sec, sIdx) => {
      pushSentences(sec.heading, sIdx, sec.heading);
      sec.paragraphs?.forEach((p) => pushSentences(p, sIdx, sec.heading));
      sec.bullets?.forEach((b) => pushSentences(b, sIdx, sec.heading));
      if (sec.callout) {
        pushSentences(sec.callout, sIdx, sec.heading);
      }
    });

    return list;
  }, [article]);

  // Detect Web Speech support and load available voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    loadVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);

    return () => {
      sessionIdRef.current += 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.removeEventListener?.('voiceschanged', loadVoices);
    };
  }, [slug]);

  const pickBestVoice = useCallback((): SpeechSynthesisVoice | null => {
    const voices =
      voicesRef.current.length > 0
        ? voicesRef.current
        : typeof window !== 'undefined' && 'speechSynthesis' in window
        ? window.speechSynthesis.getVoices()
        : [];

    if (voices.length === 0) return null;

    const englishVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
    return (
      englishVoices.find((v) => /natural|google us english|aria|jenny|samantha/i.test(v.name)) ||
      englishVoices.find((v) => v.lang.toLowerCase() === 'en-us') ||
      englishVoices[0] ||
      voices[0]
    );
  }, []);

  const speakFromIndex = useCallback(
    (startIndex: number, rate: number) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setAudioError('Audio playback is not supported in this browser.');
        return;
      }

      if (startIndex >= chunks.length) {
        setPlaybackState('idle');
        setCurrentChunkIdx(0);
        chunkIndexRef.current = 0;
        return;
      }

      setAudioError(null);
      window.speechSynthesis.cancel();

      const activeSession = ++sessionIdRef.current;
      const voice = pickBestVoice();

      const playNext = (idx: number) => {
        if (sessionIdRef.current !== activeSession) return;
        if (idx >= chunks.length) {
          setPlaybackState('idle');
          setCurrentChunkIdx(0);
          chunkIndexRef.current = 0;
          return;
        }

        chunkIndexRef.current = idx;
        setCurrentChunkIdx(idx);

        const utterance = new SpeechSynthesisUtterance(chunks[idx].text);
        if (voice) utterance.voice = voice;
        utterance.lang = voice?.lang || 'en-US';
        utterance.rate = rate;
        utterance.pitch = 1;

        utterance.onend = () => {
          if (sessionIdRef.current !== activeSession) return;
          playNext(idx + 1);
        };

        utterance.onerror = (event) => {
          if (sessionIdRef.current !== activeSession) return;
          if (event.error === 'interrupted' || event.error === 'canceled') return;
          setAudioError('Could not play audio on this device. Check your system sound settings.');
          setPlaybackState('idle');
        };

        window.speechSynthesis.speak(utterance);
      };

      setPlaybackState('playing');
      playNext(startIndex);
    },
    [chunks, pickBestVoice]
  );

  const handleTogglePlayPause = () => {
    if (!speechSupported) {
      setAudioError('Your browser does not support built-in audio narration.');
      return;
    }

    if (playbackState === 'playing') {
      // Cancel cleanly and hold index (more reliable than speechSynthesis.pause on Windows)
      sessionIdRef.current += 1;
      window.speechSynthesis.cancel();
      setPlaybackState('paused');
      return;
    }

    const startIdx = playbackState === 'paused' ? chunkIndexRef.current : 0;
    speakFromIndex(startIdx, rateRef.current);
  };

  const handleStopAudio = () => {
    sessionIdRef.current += 1;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    chunkIndexRef.current = 0;
    setCurrentChunkIdx(0);
    setPlaybackState('idle');
  };

  const handleChangeSpeed = (nextRate: number) => {
    setPlaybackRate(nextRate);
    rateRef.current = nextRate;
    if (playbackState === 'playing') {
      speakFromIndex(chunkIndexRef.current, nextRate);
    }
  };

  const progressPercent =
    chunks.length > 0 ? Math.min(100, Math.round(((currentChunkIdx + 1) / chunks.length) * 100)) : 0;
  const activeChunk = chunks[currentChunkIdx];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* 2. Dark Hero Header */}
      <header className="bg-[#0A1128] text-white pt-10 pb-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/legaltalk"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>LegalTalk</span>
          </Link>

          <div className="pt-1">
            <span className="px-3 py-1 rounded-full bg-white/10 text-amber-400 border border-white/15 text-[10px] font-black uppercase tracking-wider font-mono">
              {language === 'am' ? article.amharicCategory : article.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {language === 'am' ? article.amharicTitle : article.title}
          </h1>

          {/* Author Byline & Audio Listen Button */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 text-xs text-slate-400 font-medium">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  {article.author.split(' ')[1]?.[0] || 'A'}
                </div>
                <div>
                  <span className="text-white font-bold block">
                    {language === 'am' ? article.amharicAuthor : article.author}
                  </span>
                  <span className="text-[10px] text-slate-400">{article.authorRole}</span>
                </div>
              </div>

              <span className="hidden sm:inline text-slate-600">•</span>

              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{article.date}</span>
              </div>

              <span className="hidden sm:inline text-slate-600">•</span>

              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{article.readTime} read</span>
              </div>
            </div>

            {/* Working Audio Narration Toggle */}
            <button
              type="button"
              onClick={handleTogglePlayPause}
              disabled={!speechSupported}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
                playbackState === 'playing'
                  ? 'bg-amber-500 text-[#0A1128] border-amber-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
              }`}
            >
              {playbackState === 'playing' ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 ml-0.5" />
              )}
              <span>
                {playbackState === 'playing'
                  ? 'Pause Audio'
                  : playbackState === 'paused'
                  ? 'Resume Audio'
                  : `Listen (${article.audioDuration || 'Audio'})`}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Live Sticky Audio Player Bar (Visible while Playing or Paused) */}
      {playbackState !== 'idle' && (
        <div className="sticky top-16 sm:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={handleTogglePlayPause}
                  aria-label={playbackState === 'playing' ? 'Pause narration' : 'Resume narration'}
                  className="w-8 h-8 rounded-full bg-[#0A1128] text-amber-400 flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#102A43]"
                >
                  {playbackState === 'playing' ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleStopAudio}
                  aria-label="Stop narration"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 cursor-pointer"
                  title="Stop & Reset"
                >
                  <Square className="w-3 h-3 fill-current" />
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 font-bold text-[#0A1128]">
                    <Volume2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">
                      {playbackState === 'playing' ? 'Reading:' : 'Paused:'}{' '}
                      {activeChunk?.label || article.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {progressPercent}% complete • English Audio Reader
                  </span>
                </div>
              </div>

              {/* Speed Controls */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {[0.9, 1, 1.25].map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => handleChangeSpeed(speed)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold cursor-pointer transition-colors ${
                      playbackRate === speed
                        ? 'bg-[#0A1128] text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Article Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-12">
        {audioError && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{audioError}</span>
          </div>
        )}

        <article className="bg-white p-8 sm:p-14 rounded-3xl border border-slate-200 shadow-xs space-y-8 text-slate-800 text-sm leading-relaxed">
          <p
            className={`text-base sm:text-lg font-medium text-slate-900 leading-relaxed border-l-4 border-amber-500 pl-4 py-1 rounded-r-xl transition-colors ${
              playbackState === 'playing' && activeChunk?.sectionIndex === -1
                ? 'bg-amber-50/60'
                : ''
            }`}
          >
            {article.content.lead}
          </p>

          {article.content.sections.map((sec, idx) => {
            const isActiveSection =
              playbackState === 'playing' && activeChunk?.sectionIndex === idx;

            return (
              <div
                key={idx}
                className={`space-y-4 pt-4 rounded-2xl transition-colors ${
                  isActiveSection ? 'bg-amber-50/40 px-4 pb-4 -mx-4' : ''
                }`}
              >
                <h2 className="text-lg sm:text-xl font-black text-[#0A1128] tracking-tight">
                  {sec.heading}
                </h2>

                {sec.paragraphs?.map((p, pIdx) => (
                  <p key={pIdx} className="text-slate-600 font-normal leading-relaxed">
                    {p}
                  </p>
                ))}

                {sec.bullets && (
                  <ul className="space-y-2 pt-1 text-slate-700">
                    {sec.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                        <span className="font-normal">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {sec.callout && (
                  <div className="p-5 bg-amber-50/80 border-l-4 border-amber-500 rounded-r-2xl my-4 text-xs font-medium text-amber-950 leading-relaxed">
                    {sec.callout}
                  </div>
                )}
              </div>
            );
          })}
        </article>

        {/* 4. Contextual Counsel Matching Card */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <strong className="text-base font-black text-[#0A1128] block">
              Need help with this?
            </strong>
            <p className="text-xs text-slate-600 font-normal max-w-xl">
              Connect for free with a verified Ethiopian advocate who specializes in{' '}
              <strong className="text-slate-900 font-semibold">{article.category}</strong>.
            </p>
          </div>

          <Link
            href={`/find-a-lawyer?category=${article.categoryParam}`}
            className="px-6 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-all shadow-sm group shrink-0"
          >
            <span>Request Free Consultation</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>
      </main>

      {/* 5. Footer */}
      <footer className="bg-[#0A1128] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 LegalLink Technologies PLC. All rights reserved.</p>
            <p>Direct representation provided exclusively by licensed Ethiopian advocates.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}