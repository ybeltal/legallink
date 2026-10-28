'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

// 1. Tactile Spring Button (Smooth compression + release)
interface SpringButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'emerald' | 'amber';
}

export function SpringButton({ 
  children, 
  className = '', 
  variant = 'primary', 
  ...props 
}: SpringButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.025, y: -1 }}
      whileTap={{ scale: 0.96, y: 1 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className={`cursor-pointer transition-shadow relative overflow-hidden ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}

// 2. Interactive Tactile Card (Subtle elevation and soft border illumination)
export function InteractiveCard({ 
  children, 
  className = '', 
  onClick 
}: { 
  children: React.ReactNode; 
  className?: string; 
  onClick?: () => void;
}) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.008 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 350, damping: 24 }}
      className={`transition-colors cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
}

// 3. Sliding Magnetic Pill for Tabs & Filters
export function SlidingPillTab({
  tabs,
  activeId,
  onSelect,
  className = ''
}: {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl relative ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer z-10 flex items-center gap-1.5 whitespace-nowrap ${
              isActive ? 'text-[#0A1128]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="activeSlidingTabPill"
                className="absolute inset-0 bg-white rounded-xl shadow-xs -z-10 border border-slate-200/80"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// 4. 3D Gyroscope & Holographic Shimmer for Credentials & Badges
export function HolographicBadgeWrapper({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}

// 5. Escrow Release Confirmation Ripple & Burst
export function EscrowCheckBurst({ onComplete }: { onComplete?: () => void }) {
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="flex flex-col items-center justify-center p-6 space-y-3"
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.4, 1.2] }}
          transition={{ duration: 0.6, times: [0, 0.7, 1] }}
          className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30"
        >
          <motion.svg
            className="w-8 h-8 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M20 6L9 17l-5-5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, delay: 0.2 }}
            />
          </motion.svg>
        </motion.div>

        {/* Concentric expanding wave */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 0.5 }}
          className="absolute inset-0 rounded-full border-2 border-emerald-400 -z-10"
        />
      </div>
    </motion.div>
  );
}