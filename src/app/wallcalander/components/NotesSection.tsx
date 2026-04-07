'use client';

// Notes area on the left side of the calendar body.
// Displays 6 ruled lines mimicking a physical notepad.
// Notes are saved to localStorage via parent.
// When a date is selected, it's displayed aesthetically as a note header.

import React, { useRef, useState } from 'react';
import { Pencil, Check, CalendarDays, Trash2 } from 'lucide-react';

interface NotesSectionProps {
  notes:        string;
  onChange:     (text: string) => void;
  onDelete:     () => void;
  selectedDate?: string | null; // ISO YYYY-MM-DD
}

const LINE_COUNT = 7;

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// Month accent colors for the date header
const MONTH_ACCENTS: Record<number, { bg: string; text: string; accent: string }> = {
  0:  { bg: 'linear-gradient(135deg, #1E3A5F, #2563EB)', text: '#BFDBFE', accent: '#60A5FA' },  // Jan - deep blue
  1:  { bg: 'linear-gradient(135deg, #4C1D95, #7C3AED)', text: '#EDE9FE', accent: '#C4B5FD' },  // Feb - violet
  2:  { bg: 'linear-gradient(135deg, #064E3B, #059669)', text: '#D1FAE5', accent: '#6EE7B7' },  // Mar - emerald
  3:  { bg: 'linear-gradient(135deg, #831843, #EC4899)', text: '#FCE7F3', accent: '#F9A8D4' },  // Apr - pink
  4:  { bg: 'linear-gradient(135deg, #14532D, #16A34A)', text: '#DCFCE7', accent: '#86EFAC' },  // May - green
  5:  { bg: 'linear-gradient(135deg, #1E3A5F, #0EA5E9)', text: '#E0F2FE', accent: '#7DD3FC' },  // Jun - sky
  6:  { bg: 'linear-gradient(135deg, #7C2D12, #EA580C)', text: '#FFEDD5', accent: '#FDB97D' },  // Jul - orange
  7:  { bg: 'linear-gradient(135deg, #78350F, #D97706)', text: '#FEF3C7', accent: '#FCD34D' },  // Aug - amber
  8:  { bg: 'linear-gradient(135deg, #7C2D12, #B45309)', text: '#FEF3C7', accent: '#FCD34D' },  // Sep - warm amber
  9:  { bg: 'linear-gradient(135deg, #431407, #C2410C)', text: '#FFEDD5', accent: '#FB923C' },  // Oct - burnt orange
  10: { bg: 'linear-gradient(135deg, #1C1917, #44403C)', text: '#E7E5E4', accent: '#A8A29E' },  // Nov - stone
  11: { bg: 'linear-gradient(135deg, #0C1445, #1E3A8A)', text: '#DBEAFE', accent: '#93C5FD' },  // Dec - midnight blue
};

function formatSelectedDate(iso: string): { day: string; date: string; month: string; year: string; dayName: string } {
  const [y, m, d] = iso.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return {
    dayName: DAY_NAMES[dateObj.getDay()],
    day: String(d),
    month: MONTH_NAMES[m - 1],
    year: String(y),
    date: iso,
  };
}

export default function NotesSection({ notes, onChange, onDelete, selectedDate }: NotesSectionProps) {
  const [editing, setEditing] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleEdit() {
    setEditing(true);
    setSaved(false);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  function handleSave() {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleDeleteClick() {
    if (confirmDelete) {
      onDelete();
      setConfirmDelete(false);
      setEditing(false);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  }

  const lines = notes.split('\n');
  const parsedDate = selectedDate ? formatSelectedDate(selectedDate) : null;
  const monthIdx = parsedDate ? parseInt(selectedDate!.split('-')[1]) - 1 : new Date().getMonth();
  const accent = MONTH_ACCENTS[monthIdx] ?? MONTH_ACCENTS[0];

  return (
    <div>
      {/* Section label */}
      <div className="flex items-center justify-between mb-2">
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: '#6B7A8D',
            textTransform: 'uppercase',
          }}
        >
          Notes
        </span>

        <div className="flex items-center gap-1">
          {/* Delete note button — only shown when there are notes */}
          {notes && (
            <button
              onClick={handleDeleteClick}
              aria-label={confirmDelete ? 'Confirm delete note' : 'Delete note'}
              className="flex items-center gap-1 transition-all duration-150 hover:scale-105 active:scale-95"
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: confirmDelete ? '#DC2626' : '#9CA3AF',
                background: confirmDelete ? '#FEE2E2' : 'transparent',
                border: confirmDelete ? '1px solid #DC2626' : '1px solid transparent',
                borderRadius: '4px',
                padding: '2px 6px',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={10} />
              {confirmDelete && <span>Confirm?</span>}
            </button>
          )}

          {/* Edit / Save toggle */}
          <button
            onClick={editing ? handleSave : handleEdit}
            aria-label={editing ? 'Save notes' : 'Edit notes'}
            className="flex items-center gap-1 transition-all duration-150 hover:scale-105 active:scale-95"
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: editing ? '#0078D4' : '#6B7A8D',
              background: editing ? '#E8F4FD' : 'transparent',
              border: editing ? '1px solid #0078D4' : '1px solid transparent',
              borderRadius: '4px',
              padding: '2px 6px',
              cursor: 'pointer',
            }}
          >
            {editing ? (
              <><Check size={10} /><span>Save</span></>
            ) : (
              <><Pencil size={10} /><span>Edit</span></>
            )}
          </button>
        </div>
      </div>

      {/* Selected date header — shown when a date is selected */}
      {parsedDate && (
        <div
          style={{
            background: accent.bg,
            borderRadius: '8px',
            padding: '8px 10px',
            marginBottom: '8px',
            position: 'relative',
            overflow: 'hidden',
            animation: 'dateHeaderSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}
        >
          {/* Decorative circle */}
          <div style={{
            position: 'absolute',
            top: '-12px',
            right: '-12px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CalendarDays size={11} color={accent.accent} strokeWidth={2} />
            <span style={{ fontSize: '8px', fontWeight: 700, color: accent.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Note for
            </span>
          </div>

          <div style={{ marginTop: '3px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'white', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {parsedDate.day}
            </span>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: accent.text, lineHeight: 1.1 }}>
                {parsedDate.month} {parsedDate.year}
              </div>
              <div style={{ fontSize: '8px', color: accent.accent, fontWeight: 500 }}>
                {parsedDate.dayName}
              </div>
            </div>
          </div>

          {/* Keyframe style */}
          <style>{`
            @keyframes dateHeaderSlideIn {
              from { opacity: 0; transform: translateY(-6px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
        </div>
      )}

      {/* Ruled notepad area */}
      <div className="relative">
        {/* Ruled lines background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {Array.from({ length: LINE_COUNT }).map((_, i) => (
            <div
              key={`note-rule-${i}`}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${(i + 1) * 28}px`,
                height: '1px',
                background: '#D0DCE8',
              }}
            />
          ))}
        </div>

        {/* Editing mode — textarea */}
        {editing ? (
          <textarea
            ref={textareaRef}
            value={notes}
            onChange={e => onChange(e.target.value)}
            onBlur={handleSave}
            className="w-full resize-none focus:outline-none bg-transparent"
            style={{
              height: `${LINE_COUNT * 28}px`,
              fontSize: '12px',
              lineHeight: '28px',
              color: '#1A2B3C',
              fontFamily: 'DM Sans, sans-serif',
              padding: '0',
              border: 'none',
              caretColor: '#0078D4',
            }}
            placeholder={parsedDate ? `Add a note for ${parsedDate.month} ${parsedDate.day}…` : 'Tap to add notes for this month…'}
            maxLength={500}
            spellCheck={false}
          />
        ) : (
          <div
            style={{
              height: `${LINE_COUNT * 28}px`,
              fontSize: '12px',
              lineHeight: '28px',
              color: '#1A2B3C',
              cursor: 'text',
              overflow: 'hidden',
            }}
            onClick={handleEdit}
            role="button"
            aria-label="Click to edit notes"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter') handleEdit(); }}
          >
            {notes ? (
              lines.slice(0, LINE_COUNT).map((line, i) => (
                <div
                  key={`note-line-${i}`}
                  style={{
                    height: '28px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: line ? '#1A2B3C' : 'transparent',
                  }}
                >
                  {line || '·'}
                </div>
              ))
            ) : (
              <div
                style={{
                  color: '#B0BEC5',
                  fontSize: '11px',
                  paddingTop: '6px',
                  fontStyle: 'italic',
                }}
              >
                {parsedDate ? `Add a note for ${parsedDate.month} ${parsedDate.day}…` : 'Tap to add notes…'}
              </div>
            )}
          </div>
        )}

        {/* Saved indicator */}
        {saved && (
          <div
            className="absolute top-0 right-0 flex items-center gap-1 animate-fade-up"
            style={{
              fontSize: '10px',
              color: '#0078D4',
              fontWeight: 600,
              background: '#E8F4FD',
              borderRadius: '4px',
              padding: '2px 6px',
            }}
          >
            <Check size={9} />
            Saved
          </div>
        )}
      </div>

      {/* Character count when editing */}
      {editing && (
        <div
          className="text-right mt-1"
          style={{ fontSize: '10px', color: '#B0BEC5' }}
        >
          {notes.length}/500
        </div>
      )}
    </div>
  );
}