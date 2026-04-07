'use client';

// Small badge below the chevron showing the currently selected date range.
// Shows a helper instruction when no range is selected.

import React from 'react';
import { CalendarRange, X, Info, Plus } from 'lucide-react';
import { DateRange } from './WallCalendarClient';

interface RangeBadgeProps {
  range:      DateRange;
  selecting:  boolean;
  onClear:    () => void;
  onAddEvent?: () => void;
}

function formatDisplay(iso: string | null): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function RangeBadge({ range, selecting, onClear, onAddEvent }: RangeBadgeProps) {
  const hasRange   = range.start && range.end;
  const hasStart   = range.start && !range.end;

  if (selecting || hasStart) {
    return (
      <div
        className="flex items-center gap-2 mb-1"
        style={{
          background: '#FFF8E1',
          border: '1px solid #FFD54F',
          borderRadius: '6px',
          padding: '5px 10px',
          fontSize: '11px',
          color: '#E65100',
          fontWeight: 500,
        }}
      >
        <Info size={12} />
        <span>
          Start: <strong>{formatDisplay(range.start)}</strong> — now click an end date
        </span>
      </div>
    );
  }

  if (hasRange) {
    const isSingleDate = range.start === range.end;

    return (
      <div
        className="flex items-center justify-between mb-1"
        style={{
          background: '#E8F4FD',
          border: '1px solid #90CAF9',
          borderRadius: '6px',
          padding: '5px 10px',
        }}
      >
        <div className="flex items-center gap-2">
          <CalendarRange size={13} color="#0078D4" />
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#005A9E' }}>
            {isSingleDate 
              ? `Selected: ${formatDisplay(range.start)}` 
              : `${formatDisplay(range.start)} → ${formatDisplay(range.end)}`
            }
          </span>
        </div>
        <div className="flex gap-2 items-center">
          {onAddEvent && (
            <button
              onClick={onAddEvent}
              aria-label="Add event"
              className="flex items-center gap-1 transition-transform duration-150 hover:scale-105 active:scale-95"
              style={{
                background: '#0078D4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '10px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Plus size={10} strokeWidth={3} /> Add Event
            </button>
          )}
          <button
            onClick={onClear}
            aria-label="Clear date selection"
            className="transition-transform duration-150 hover:scale-110 active:scale-95"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#0078D4',
              padding: '2px',
              borderRadius: '50%',
            }}
          >
            <X size={13} />
          </button>
        </div>
      </div>
    );
  }

  // No selection — show subtle hint
  return (
    <div
      className="flex items-center gap-2 mb-1"
      style={{
        fontSize: '10.5px',
        color: '#94A3B8',
        fontStyle: 'italic',
        padding: '4px 2px',
      }}
    >
      <CalendarRange size={11} />
      <span>Click any date to start selecting a range</span>
    </div>
  );
}