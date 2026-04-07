'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import WireBinding from './WireBinding';
import CalendarHero from './CalendarHero';
import ChevronDivider from './ChevronDivider';
import CalendarBody from './CalendarBody';
import OnboardingTour from './OnboardingTour';
import MonthNavigation from './MonthNavigation';
import AddEventModal, { CalendarEvent } from './AddEventModal';
import MonthTransitionEffect from './MonthTransitionEffect';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface DateRange {
  start: string | null;
  end:   string | null;
}

export interface MonthNotes {
  [monthKey: string]: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function monthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

// ─── Main Client Component ────────────────────────────────────────────────────
export default function WallCalendarClient() {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState<number>(today.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(today.getMonth());

  const [range,     setRange]     = useState<DateRange>({ start: null, end: null });
  const [selecting, setSelecting] = useState<boolean>(false);

  // Track the last single-clicked date for notes context
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [notes, setNotes] = useState<MonthNotes>({});
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [pendingRange, setPendingRange] = useState<DateRange>({ start: null, end: null });

  // Page flip animation state
  const [flipClass, setFlipClass] = useState<string>('');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);

  // Thematic transition effect state
  const [transitionActive, setTransitionActive] = useState<boolean>(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev'>('next');
  const [transitionMonth, setTransitionMonth] = useState<number>(today.getMonth());

  // Onboarding
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(0);

  const heroRef   = useRef<HTMLDivElement>(null);
  const gridRef   = useRef<HTMLDivElement>(null);
  const notesRef  = useRef<HTMLDivElement>(null);
  const navRef    = useRef<HTMLDivElement>(null);

  // ── Load persisted data ──────────────────────────────────────────────────
  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem('wallcal-notes');
      if (storedNotes) setNotes(JSON.parse(storedNotes));

      const storedRange = localStorage.getItem('wallcal-range');
      if (storedRange) setRange(JSON.parse(storedRange));

      const storedEvents = localStorage.getItem('wallcal-events');
      if (storedEvents) setEvents(JSON.parse(storedEvents));

      const hasSeenTour = localStorage.getItem('wallcal-tour-done');
      if (!hasSeenTour) {
        setTimeout(() => setShowOnboarding(true), 900);
      }
    } catch {
      // silently ignore parse errors
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem('wallcal-notes', JSON.stringify(notes)); } catch { /* quota */ }
  }, [notes]);

  useEffect(() => {
    try { localStorage.setItem('wallcal-range', JSON.stringify(range)); } catch { /* quota */ }
  }, [range]);

  useEffect(() => {
    try { localStorage.setItem('wallcal-events', JSON.stringify(events)); } catch { /* quota */ }
  }, [events]);

  // ── Month navigation with flip + thematic animation ───────────────────────
  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    if (isFlipping) return;
    setIsFlipping(true);

    // Clear selected date when changing months so notes don't show wrong month context
    setSelectedDate(null);

    const outClass = direction === 'next' ? 'flip-out-forward' : 'flip-out-backward';
    setFlipClass(outClass);

    // Compute the incoming month for the effect
    const incomingMonth = (() => {
      let m = viewMonth + (direction === 'next' ? 1 : -1);
      if (m > 11) m = 0;
      if (m < 0)  m = 11;
      return m;
    })();

    // Start thematic particle effect
    setTransitionMonth(incomingMonth);
    setTransitionDirection(direction);
    setTransitionActive(true);

    setTimeout(() => {
      setViewMonth(prev => {
        let m = prev + (direction === 'next' ? 1 : -1);
        let y = viewYear;
        if (m > 11) { m = 0;  y += 1; }
        if (m < 0)  { m = 11; y -= 1; }
        setViewYear(y);
        return m;
      });

      const inClass = direction === 'next' ? 'flip-in-forward' : 'flip-in-backward';
      setFlipClass(inClass);

      setTimeout(() => {
        setFlipClass('');
        setIsFlipping(false);
        // Stop particle effect after animation completes
        setTimeout(() => setTransitionActive(false), 800);
      }, 340);
    }, 290);
  }, [isFlipping, viewYear, viewMonth]);

  // ── Date selection & Double Click ──────────────────────────────────────────
  const handleDayClick = useCallback((isoDate: string) => {
    setRange((prev) => {
      // 1. If we click a DIFFERENT date while a SINGLE date is already selected
      if (prev.start && prev.start === prev.end && prev.start !== isoDate) {
        const s = prev.start;
        let newRange: DateRange;
        if (isoDate < s) {
          newRange = { start: isoDate, end: s };
        } else {
          newRange = { start: s, end: isoDate };
        }
        
        setSelectedDate(isoDate);
        setSelecting(false);
        setPendingRange(newRange);
        setModalOpen(true);
        return newRange;
      }

      // 2. If we click the EXACT SAME lone selected date (Toggle off)
      if (prev.start === isoDate && prev.end === isoDate) {
        setSelectedDate(null);
        setSelecting(false);
        return { start: null, end: null };
      }

      // 3. Fallback: Select the single date (e.g. if nothing selected, or clearing an old range)
      setSelectedDate(isoDate);
      setSelecting(false);
      return { start: isoDate, end: isoDate };
    });
  }, []);

  const handleDayDoubleClick = useCallback((isoDate: string) => {
    setSelectedDate(isoDate);
    const newRange = { start: isoDate, end: isoDate };
    setRange(newRange);
    setSelecting(false);
    setPendingRange(newRange);
    setModalOpen(true);
  }, []);

  const clearRange = useCallback(() => {
    setRange({ start: null, end: null });
    setSelecting(false);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleEventSave = useCallback((event: CalendarEvent) => {
    setEvents(prev => [...prev, event]);
    setModalOpen(false);
  }, []);

  const handleDeleteEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  }, []);

  const handleNotesChange = useCallback((text: string) => {
    const key = monthKey(viewYear, viewMonth);
    setNotes(prev => ({ ...prev, [key]: text }));
  }, [viewYear, viewMonth]);

  const finishOnboarding = useCallback(() => {
    setShowOnboarding(false);
    try { localStorage.setItem('wallcal-tour-done', '1'); } catch { /* ignore */ }
  }, []);

  const currentNotes = notes[monthKey(viewYear, viewMonth)] ?? '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-300 via-slate-200 to-blue-100 flex items-start justify-center py-8 px-4">

      {showOnboarding && (
        <OnboardingTour
          step={onboardingStep}
          totalSteps={4}
          onNext={() => setOnboardingStep(s => Math.min(s + 1, 3))}
          onPrev={() => setOnboardingStep(s => Math.max(s - 1, 0))}
          onFinish={finishOnboarding}
          heroRef={heroRef}
          gridRef={gridRef}
          notesRef={notesRef}
          navRef={navRef}
        />
      )}

      <AddEventModal
        isOpen={modalOpen}
        startDate={pendingRange.start}
        endDate={pendingRange.end}
        onClose={handleModalClose}
        onSave={handleEventSave}
      />

      <div className="flip-perspective w-full max-w-xl mx-auto">
        <WireBinding />

        <div
          className={`calendar-shadow rounded-b-2xl overflow-hidden bg-white relative ${flipClass || 'calendar-enter'}`}
          style={{ transformOrigin: 'top center' }}
        >
          {/* Thematic month transition particle effect */}
          <MonthTransitionEffect
            month={transitionMonth}
            active={transitionActive}
            direction={transitionDirection}
          />

          <div ref={navRef}>
            <MonthNavigation
              onPrev={() => navigateMonth('prev')}
              onNext={() => navigateMonth('next')}
              isFlipping={isFlipping}
            />
          </div>

          <div ref={heroRef}>
            <CalendarHero month={viewMonth} year={viewYear} />
          </div>

          <ChevronDivider month={viewMonth} year={viewYear} />

          <div ref={gridRef}>
            <CalendarBody
              year={viewYear}
              month={viewMonth}
              range={range}
              today={todayISO()}
              onDayClick={handleDayClick}
              onDayDoubleClick={handleDayDoubleClick}
              onClearRange={clearRange}
              selecting={selecting}
              notesRef={notesRef}
              notes={currentNotes}
              onNotesChange={handleNotesChange}
              events={events}
              selectedDate={selectedDate}
              onDeleteEvent={handleDeleteEvent}
              onAddEvent={() => {
                const newRange = range.start ? range : { start: todayISO(), end: todayISO() };
                setPendingRange(newRange);
                setModalOpen(true);
              }}
            />
          </div>
        </div>

        <div className="mx-6 h-4 bg-black/10 rounded-b-full blur-md" />
      </div>
    </div>
  );
}