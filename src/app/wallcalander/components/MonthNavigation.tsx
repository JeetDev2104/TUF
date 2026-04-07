'use client';

// Prev / Next navigation arrows overlaid on the hero image
// Positioned at left and right edges of the hero

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthNavigationProps {
  onPrev:     () => void;
  onNext:     () => void;
  isFlipping: boolean;
}

export default function MonthNavigation({ onPrev, onNext, isFlipping }: MonthNavigationProps) {
  const btnBase = `
    absolute top-1/2 -translate-y-1/2 z-20
    w-10 h-10 rounded-full
    flex items-center justify-center
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1
  `;

  return (
    <>
      {/* Previous month — left arrow */}
      <button
        onClick={onPrev}
        disabled={isFlipping}
        aria-label="Previous month"
        className={`${btnBase} left-3`}
        style={{
          background: 'rgba(255,255,255,0.22)',
          backdropFilter: 'blur(6px)',
          border: '1.5px solid rgba(255,255,255,0.4)',
          color: 'white',
          position: 'absolute',
          top: '120px', // vertically centered in hero
          cursor: isFlipping ? 'not-allowed' : 'pointer',
          opacity: isFlipping ? 0.5 : 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        }}
        onMouseEnter={e => {
          if (!isFlipping) {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,120,212,0.7)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%) scale(1.08)';
          }
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.22)';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      {/* Next month — right arrow */}
      <button
        onClick={onNext}
        disabled={isFlipping}
        aria-label="Next month"
        style={{
          background: 'rgba(255,255,255,0.22)',
          backdropFilter: 'blur(6px)',
          border: '1.5px solid rgba(255,255,255,0.4)',
          color: 'white',
          position: 'absolute',
          top: '120px',
          right: '12px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isFlipping ? 'not-allowed' : 'pointer',
          opacity: isFlipping ? 0.5 : 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          zIndex: 20,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          if (!isFlipping) {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,120,212,0.7)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
          }
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.22)';
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
        }}
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>
    </>
  );
}