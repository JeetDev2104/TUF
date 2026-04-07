'use client';

// The lower white section of the calendar:
// Left: Notes area with ruled lines
// Right: 7-column date grid with SAT/SUN in blue

import React, { useRef } from 'react';
import { DateRange } from './WallCalendarClient';
import NotesSection from './NotesSection';
import CalendarGrid from './CalendarGrid';
import RangeBadge from './RangeBadge';
import { CalendarEvent } from './AddEventModal';

interface CalendarBodyProps {
  year:           number;
  month:          number; // 0-indexed
  range:          DateRange;
  today:          string; // ISO YYYY-MM-DD
  onDayClick:     (iso: string) => void;
  onClearRange:   () => void;
  selecting:      boolean;
  notesRef:       React.RefObject<HTMLDivElement>;
  notes:          string;
  onNotesChange:  (text: string) => void;
  onDeleteEvent?: (eventId: string) => void;
  events?:        CalendarEvent[];
  selectedDate?:  string | null;
}

export default function CalendarBody({
  year, month, range, today,
  onDayClick, onClearRange, selecting,
  notesRef, notes, onNotesChange, events = [],
  selectedDate, onDeleteEvent,
}: CalendarBodyProps) {

  function handleDeleteNote() {
    onNotesChange('');
  }

  return (
    <div className="bg-white px-5 pt-4 pb-6">

      {/* Range status badge — shows selected range or instruction */}
      <RangeBadge
        range={range}
        selecting={selecting}
        onClear={onClearRange}
      />

      {/* Two-column layout: Notes | Calendar Grid */}
      <div className="flex gap-4 mt-3">

        {/* Notes section — left column */}
        <div
          ref={notesRef}
          className="flex-shrink-0"
          style={{ width: '38%' }}
        >
          <NotesSection
            notes={notes}
            onChange={onNotesChange}
            onDelete={handleDeleteNote}
            selectedDate={selectedDate}
          />
        </div>

        {/* Calendar grid — right column */}
        <div className="flex-1 min-w-0">
          <CalendarGrid
            year={year}
            month={month}
            range={range}
            today={today}
            onDayClick={onDayClick}
            selecting={selecting}
            events={events}
            onDeleteEvent={onDeleteEvent}
          />
        </div>
      </div>
    </div>
  );
}