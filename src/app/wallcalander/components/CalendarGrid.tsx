'use client';

// 7-column date grid matching the reference image layout.
// SAT and SUN columns are highlighted in cal-blue.
// Clicking a day cell selects/extends the date range.
// Holiday markers and event dots are shown on applicable dates.
// Hover tooltip reveals events on specific dates.

import React, { useMemo, useState } from 'react';
import { DateRange } from './WallCalendarClient';
import { CalendarEvent } from './AddEventModal';

interface CalendarGridProps {
  year:       number;
  month:      number; // 0-indexed
  range:      DateRange;
  today:      string; // ISO YYYY-MM-DD
  onDayClick: (iso: string) => void;
  onDayDoubleClick?: (iso: string) => void;
  selecting:  boolean;
  events?:    CalendarEvent[];
  onDeleteEvent?: (eventId: string) => void;
}

const DAY_HEADERS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// US Public Holidays (month is 1-indexed, day is date)
const FIXED_HOLIDAYS: Record<string, string> = {
  '01-01': "New Year's Day",
  '07-04': 'Independence Day',
  '11-11': 'Veterans Day',
  '12-25': 'Christmas Day',
  '12-31': "New Year's Eve",
  '02-14': "Valentine's Day",
  '10-31': 'Halloween',
  '03-17': "St. Patrick's Day",
};

function getFloatingHolidays(year: number): Record<string, string> {
  const result: Record<string, string> = {};
  result[nthWeekday(year, 0, 1, 3)] = 'MLK Day';
  result[nthWeekday(year, 1, 1, 3)] = "Presidents' Day";
  result[lastWeekday(year, 4, 1)] = 'Memorial Day';
  result[nthWeekday(year, 8, 1, 1)] = 'Labor Day';
  result[nthWeekday(year, 9, 1, 2)] = 'Columbus Day';
  result[nthWeekday(year, 10, 4, 4)] = 'Thanksgiving';
  result[nthWeekday(year, 4, 0, 2)] = "Mother's Day";
  result[nthWeekday(year, 5, 0, 3)] = "Father's Day";
  return result;
}

function nthWeekday(year: number, month: number, weekday: number, n: number): string {
  let count = 0;
  const days = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    if (new Date(year, month, d).getDay() === weekday) {
      count++;
      if (count === n) return toISO(year, month, d);
    }
  }
  return '';
}

function lastWeekday(year: number, month: number, weekday: number): string {
  const days = new Date(year, month + 1, 0).getDate();
  for (let d = days; d >= 1; d--) {
    if (new Date(year, month, d).getDay() === weekday) return toISO(year, month, d);
  }
  return '';
}

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function dayOfWeekMonFirst(year: number, month: number, day: number): number {
  const dow = new Date(year, month, day).getDay();
  return dow === 0 ? 6 : dow - 1;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function daysInPrevMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

interface DayCell {
  iso:            string;
  day:            number;
  isCurrentMonth: boolean;
  colIndex:       number;
}

// Format ISO date for display in tooltip
function formatDateLabel(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// Event Tooltip Component
interface EventTooltipProps {
  iso: string;
  events: CalendarEvent[];
  holiday?: string;
  colIndex: number;
  onDeleteEvent?: (eventId: string) => void;
}

function EventTooltip({ iso, events, holiday, colIndex, onDeleteEvent }: EventTooltipProps) {
  const eventsOnDay = events.filter(evt => {
    if (!evt.start) return false;
    const s = new Date(evt.start);
    const e = evt.end ? new Date(evt.end) : new Date(evt.start);
    const cur = new Date(iso);
    return cur >= s && cur <= e;
  });

  if (!holiday && eventsOnDay.length === 0) return null;

  // Position tooltip: if in last 2 columns (SAT/SUN), show to the left
  const isRightSide = colIndex >= 5;

  return (
    <div
      className="event-tooltip"
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 6px)',
        [isRightSide ? 'right' : 'left']: '50%',
        transform: isRightSide ? 'translateX(50%)' : 'translateX(-50%)',
        zIndex: 50,
        minWidth: '150px',
        maxWidth: '190px',
        background: 'linear-gradient(135deg, #0A1628 0%, #0D2040 100%)',
        borderRadius: '10px',
        padding: '8px 10px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)',
        pointerEvents: onDeleteEvent ? 'auto' : 'none',
        animation: 'tooltipFadeIn 0.18s ease-out forwards',
      }}
    >
      {/* Date label */}
      <div style={{
        fontSize: '9px',
        fontWeight: 700,
        color: '#60A5FA',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: '5px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '4px',
      }}>
        {formatDateLabel(iso)}
      </div>

      {/* Holiday */}
      {holiday && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: eventsOnDay.length > 0 ? '4px' : 0 }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B', flexShrink: 0 }} />
          <span style={{ fontSize: '10px', color: '#FCD34D', fontWeight: 600 }}>{holiday}</span>
        </div>
      )}

      {/* Events with delete button */}
      {eventsOnDay.map((evt, i) => (
        <div key={evt.id ?? i} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', marginBottom: i < eventsOnDay.length - 1 ? '4px' : 0 }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B82F6', flexShrink: 0, marginTop: '3px' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '10px', color: 'white', fontWeight: 600, lineHeight: '1.3' }}>
              {evt.title || 'Untitled Event'}
            </div>
            {evt.location && (
              <div style={{ fontSize: '9px', color: '#94A3B8', lineHeight: '1.2' }}>{evt.location}</div>
            )}
          </div>
          {onDeleteEvent && (
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteEvent(evt.id); }}
              title="Delete event"
              style={{
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '3px',
                color: '#F87171',
                cursor: 'pointer',
                padding: '1px 4px',
                fontSize: '9px',
                fontWeight: 700,
                lineHeight: 1,
                flexShrink: 0,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.15)')}
            >
              ✕
            </button>
          )}
        </div>
      ))}

      {/* Tooltip arrow */}
      <div style={{
        position: 'absolute',
        bottom: '-5px',
        [isRightSide ? 'right' : 'left']: '50%',
        transform: isRightSide ? 'translateX(50%)' : 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: '5px solid #0D2040',
      }} />
    </div>
  );
}

export default function CalendarGrid({
  year, month, range, today, onDayClick, onDayDoubleClick, selecting, events = [], onDeleteEvent,
}: CalendarGridProps) {
  const [hoveredIso, setHoveredIso] = useState<string | null>(null);

  const holidays = useMemo(() => {
    const fixed: Record<string, string> = {};
    Object.entries(FIXED_HOLIDAYS).forEach(([mmdd, name]) => {
      fixed[`${year}-${mmdd}`] = name;
    });
    return { ...fixed, ...getFloatingHolidays(year) };
  }, [year]);

  const eventMap = useMemo(() => {
    const map: Record<string, number> = {};
    events.forEach(evt => {
      if (!evt.start) return;
      const s = new Date(evt.start);
      const e = evt.end ? new Date(evt.end) : new Date(evt.start);
      const cur = new Date(s);
      while (cur <= e) {
        const iso = cur.toISOString().split('T')[0];
        map[iso] = (map[iso] ?? 0) + 1;
        cur.setDate(cur.getDate() + 1);
      }
    });
    return map;
  }, [events]);

  const cells = useMemo<DayCell[]>(() => {
    const result: DayCell[] = [];
    const totalDays = daysInMonth(year, month);
    const firstDow  = dayOfWeekMonFirst(year, month, 1);
    const prevDays  = daysInPrevMonth(year, month);

    for (let i = 0; i < firstDow; i++) {
      const day = prevDays - firstDow + 1 + i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear  = month === 0 ? year - 1 : year;
      result.push({ iso: toISO(prevYear, prevMonth, day), day, isCurrentMonth: false, colIndex: i });
    }

    for (let d = 1; d <= totalDays; d++) {
      const col = (firstDow + d - 1) % 7;
      result.push({ iso: toISO(year, month, d), day: d, isCurrentMonth: true, colIndex: col });
    }

    const trailing = 7 - (result.length % 7);
    if (trailing < 7) {
      const nextMonth = month === 11 ? 0  : month + 1;
      const nextYear  = month === 11 ? year + 1 : year;
      for (let d = 1; d <= trailing; d++) {
        const col = (result.length) % 7;
        result.push({ iso: toISO(nextYear, nextMonth, d), day: d, isCurrentMonth: false, colIndex: col });
      }
    }

    return result;
  }, [year, month]);

  const { start, end } = range;

  function isRangeStart(iso: string)  { return iso === start; }
  function isRangeEnd(iso: string)    { return iso === end; }
  function isInRange(iso: string) {
    if (!start || !end) return false;
    return iso > start && iso < end;
  }
  function isToday(iso: string)       { return iso === today; }
  function isWeekend(colIndex: number) { return colIndex >= 5; }

  const weeks = useMemo(() => {
    const rows: DayCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }
    return rows;
  }, [cells]);

  return (
    <div>
      {/* Tooltip animation keyframes */}
      <style>{`
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map((h, idx) => (
          <div
            key={`header-${h}`}
            className="text-center py-1"
            style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: idx >= 5 ? '#0078D4' : '#6B7A8D',
            }}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Divider line under headers */}
      <div style={{ height: '1px', background: '#D0DCE8', marginBottom: '4px' }} />

      {/* Week rows */}
      {weeks.map((week, wIdx) => (
        <div key={`week-${wIdx}`} className="grid grid-cols-7">
          {week.map((cell) => {
            const isStart     = isRangeStart(cell.iso);
            const isEnd       = isRangeEnd(cell.iso);
            const inRange     = isInRange(cell.iso);
            const isTodayCell = isToday(cell.iso);
            const weekend     = isWeekend(cell.colIndex);
            const isCurrent   = cell.isCurrentMonth;
            const holiday     = isCurrent ? holidays[cell.iso] : undefined;
            const evtCount    = isCurrent ? (eventMap[cell.iso] ?? 0) : 0;
            const isHovered   = hoveredIso === cell.iso;
            const hasTooltip  = isCurrent && (!!holiday || evtCount > 0);

            let bgStyle: React.CSSProperties = {};
            let textColor = '';
            let fontWeight = '400';

            if (isStart || isEnd) {
              bgStyle = {
                background: 'linear-gradient(135deg, #0078D4, #1E90FF)',
                borderRadius: '50%',
              };
              textColor = 'white';
              fontWeight = '700';
            } else if (inRange) {
              bgStyle = { background: '#E8F4FD', borderRadius: '4px' };
              textColor = '#005A9E';
              fontWeight = '500';
            } else if (isTodayCell && isCurrent) {
              bgStyle = {
                border: '2px solid #0078D4',
                borderRadius: '50%',
              };
              textColor = '#0078D4';
              fontWeight = '700';
            }

            const defaultColor = !isCurrent
              ? '#C0CDD8'
              : weekend
              ? '#0078D4' : '#1A2B3C';

            return (
              <div
                key={`cell-${cell.iso}`}
                onClick={() => isCurrent && onDayClick(cell.iso)}
                onDoubleClick={() => isCurrent && onDayDoubleClick?.(cell.iso)}
                onMouseEnter={() => isCurrent && setHoveredIso(cell.iso)}
                onMouseLeave={() => setHoveredIso(null)}
                className="flex flex-col items-center justify-center relative group"
                style={{
                  height: '36px',
                  cursor: isCurrent ? (selecting ? 'crosshair' : 'pointer') : 'default',
                  userSelect: 'none',
                }}
                role={isCurrent ? 'button' : undefined}
                aria-label={isCurrent ? `Select ${cell.iso}${holiday ? ` - ${holiday}` : ''}` : undefined}
                tabIndex={isCurrent ? 0 : -1}
                onKeyDown={e => {
                  if (isCurrent && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onDayClick(cell.iso);
                  }
                }}
              >
                {/* Range in-between background */}
                {inRange && (
                  <div
                    className="absolute inset-y-1 inset-x-0 range-pulse"
                    style={{ background: '#E8F4FD', borderRadius: '3px', zIndex: 0 }}
                    aria-hidden="true"
                  />
                )}

                {/* Day number */}
                <div
                  className="relative z-10 flex items-center justify-center transition-transform duration-150 group-hover:scale-110"
                  style={{
                    width: '28px',
                    height: '28px',
                    fontSize: '13px',
                    fontWeight,
                    color: (isStart || isEnd) ? 'white' : (textColor || defaultColor),
                    fontVariantNumeric: 'tabular-nums',
                    ...bgStyle,
                  }}
                >
                  {cell.day}
                </div>

                {/* Indicators row: holiday star + event dots */}
                {isCurrent && (holiday || evtCount > 0) && (
                  <div className="flex items-center gap-0.5 z-10 relative" style={{ height: '6px', marginTop: '1px' }}>
                    {holiday && (
                      <div
                        title={holiday}
                        style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: '#F59E0B',
                          boxShadow: '0 0 3px rgba(245,158,11,0.6)',
                          flexShrink: 0,
                        }}
                        aria-label={holiday}
                      />
                    )}
                    {evtCount > 0 && Array.from({ length: Math.min(evtCount, 3) }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: (isStart || isEnd) ? 'rgba(255,255,255,0.8)' : '#0078D4',
                          flexShrink: 0,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Hover ring */}
                {isCurrent && !isStart && !isEnd && !inRange && (
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-0"
                    aria-hidden="true"
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: hasTooltip ? 'rgba(0,120,212,0.12)' : 'rgba(0,120,212,0.08)',
                        border: hasTooltip ? '1.5px solid rgba(0,120,212,0.35)' : '1.5px solid rgba(0,120,212,0.2)',
                        transition: 'all 0.15s ease',
                      }}
                    />
                  </div>
                )}

                {/* Event Tooltip — shown on hover for dates with events or holidays */}
                {isHovered && hasTooltip && (
                  <EventTooltip
                    iso={cell.iso}
                    events={events}
                    holiday={holiday}
                    colIndex={cell.colIndex}
                    onDeleteEvent={onDeleteEvent}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Holiday legend */}
      <div className="flex items-center gap-1.5 mt-2 px-1" style={{ opacity: 0.7 }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 3px rgba(245,158,11,0.5)' }} />
        <span style={{ fontSize: '9px', color: '#6B7A8D', letterSpacing: '0.04em' }}>Holiday</span>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0078D4', marginLeft: '6px' }} />
        <span style={{ fontSize: '9px', color: '#6B7A8D', letterSpacing: '0.04em' }}>Event</span>
      </div>
    </div>
  );
}