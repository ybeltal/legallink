'use client';

import React, { useState } from 'react';
import { Volume2, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface VoiceBriefPlayerProps {
  filePath: string;
  duration?: string | null;
}

export default function VoiceBriefPlayer({
  filePath,
  duration,
}: VoiceBriefPlayerProps) {
  const supabase = createClient();

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoadAudio = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
        setAudioUrl(filePath);
        return;
      }

      const { data, error } = await supabase.storage
        .from('voice-briefs')
        .createSignedUrl(filePath, 600);

      if (error || !data?.signedUrl) {
        throw new Error(error?.message || 'Unable to load voice recording.');
      }

      setAudioUrl(data.signedUrl);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Could not load audio brief.');
    } finally {
      setLoading(false);
    }
  };

  if (audioUrl) {
    return (
      <div className="mt-2 p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-bold text-amber-900">
          <span className="inline-flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-amber-700" />
            <span>Client Voice Brief</span>
          </span>
          {duration && <span className="font-mono">{duration}</span>}
        </div>
        <audio controls autoPlay src={audioUrl} className="w-full h-8" />
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-1">
      <button
        type="button"
        onClick={handleLoadAudio}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-amber-700" />
        )}
        <span>
          {loading
            ? 'Loading Voice Brief...'
            : `Listen to Voice Brief${duration ? ` (${duration})` : ''}`}
        </span>
      </button>

      {errorMsg && (
        <p className="text-[10px] text-red-600 font-semibold flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{errorMsg}</span>
        </p>
      )}
    </div>
  );
}