'use client';

// Guided onboarding tooltip tour for first-time users.
// 4 steps: Hero image, Month navigation, Date grid, Notes.
// Persists completion state to localStorage.

import React, { useEffect, useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface OnboardingTourProps {
  step:       number;
  totalSteps: number;
  onNext:     () => void;
  onPrev:     () => void;
  onFinish:   () => void;
  heroRef:    React.RefObject<HTMLDivElement>;
  gridRef:    React.RefObject<HTMLDivElement>;
  notesRef:   React.RefObject<HTMLDivElement>;
  navRef:     React.RefObject<HTMLDivElement>;
}

interface StepConfig {
  title:       string;
  description: string;
  icon:        string;
  position:    'top' | 'bottom' | 'left' | 'right';
}

const STEPS: StepConfig[] = [
  {
    title:       'Welcome to WallCal! 🗓️',
    description: 'Your beautiful interactive wall calendar. Each month features a stunning full-width photograph that captures the season\'s spirit.',
    icon:        '🏔️',
    position:    'bottom',
  },
  {
    title:       'Flip Between Months',
    description: 'Use the arrow buttons on either side of the hero image to navigate months. Watch the satisfying page-flip animation as you go!',
    icon:        '↔️',
    position:    'bottom',
  },
  {
    title:       'Select Date Ranges',
    description: 'Click any date to start a range, then click another date to complete it. Your selection is highlighted in blue and saved automatically.',
    icon:        '📅',
    position:    'top',
  },
  {
    title:       'Monthly Notes',
    description: 'Jot down reminders, plans, or thoughts in the notes area. Each month has its own notepad — everything saves automatically to your browser.',
    icon:        '📝',
    position:    'top',
  },
];

export default function OnboardingTour({
  step, totalSteps, onNext, onPrev, onFinish,
}: OnboardingTourProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slight delay for entry animation
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const currentStep = STEPS[step];
  const isLast = step === totalSteps - 1;

  return (
    <>
      {/* Dark overlay */}
      <div
        className="fixed inset-0 overlay-fade"
        style={{
          background: 'rgba(10, 20, 40, 0.55)',
          zIndex: 9998,
          backdropFilter: 'blur(2px)',
        }}
        onClick={onFinish}
        aria-hidden="true"
      />

      {/* Tooltip card — centered on screen */}
      <div
        className="fixed z-[9999] transition-all duration-300"
        style={{
          left: '50%',
          top: '50%',
          transform: visible
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -52%) scale(0.95)',
          opacity: visible ? 1 : 0,
          width: 'min(340px, calc(100vw - 32px))',
        }}
        role="dialog"
        aria-modal="true"
        aria-label={`Onboarding step ${step + 1} of ${totalSteps}`}
      >
        <div
          className="tooltip-bounce"
          style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 24px 64px rgba(0,120,212,0.25), 0 8px 24px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          }}
        >
          {/* Blue header band */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0078D4 0%, #1E90FF 100%)',
              padding: '20px 20px 16px',
              position: 'relative',
            }}
          >
            {/* Close button */}
            <button
              onClick={onFinish}
              aria-label="Skip tour"
              className="absolute top-3 right-3 transition-transform duration-150 hover:scale-110 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
              }}
            >
              <X size={14} />
            </button>

            {/* Step icon */}
            <div
              style={{
                fontSize: '32px',
                marginBottom: '8px',
                lineHeight: 1,
              }}
              aria-hidden="true"
            >
              {currentStep.icon}
            </div>

            {/* Title */}
            <h2
              style={{
                fontSize: '17px',
                fontWeight: 700,
                color: 'white',
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {currentStep.title}
            </h2>
          </div>

          {/* Body */}
          <div style={{ padding: '16px 20px 20px' }}>
            {/* Description */}
            <p
              style={{
                fontSize: '13.5px',
                color: '#4A5568',
                lineHeight: 1.6,
                margin: '0 0 20px 0',
              }}
            >
              {currentStep.description}
            </p>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={`tour-dot-${i}`}
                  style={{
                    width: i === step ? '20px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: i === step ? '#0078D4' : '#D0DCE8',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-3">
              {/* Prev button */}
              <button
                onClick={onPrev}
                disabled={step === 0}
                className="flex items-center gap-1 transition-all duration-150 hover:scale-105 active:scale-95"
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: step === 0 ? '#C0CDD8' : '#6B7A8D',
                  background: 'transparent',
                  border: '1.5px solid',
                  borderColor: step === 0 ? '#E8EDF2' : '#D0DCE8',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  cursor: step === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ChevronLeft size={14} />
                Back
              </button>

              {/* Next / Finish button */}
              <button
                onClick={isLast ? onFinish : onNext}
                className="flex items-center gap-2 transition-all duration-150 hover:scale-105 active:scale-95 flex-1"
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'white',
                  background: 'linear-gradient(135deg, #0078D4 0%, #1E90FF 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,120,212,0.35)',
                }}
              >
                {isLast ? (
                  <>
                    <Sparkles size={14} />
                    Start Using WallCal
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight size={14} />
                  </>
                )}
              </button>
            </div>

            {/* Skip link */}
            <div className="text-center mt-3">
              <button
                onClick={onFinish}
                style={{
                  fontSize: '11px',
                  color: '#94A3B8',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Skip tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}