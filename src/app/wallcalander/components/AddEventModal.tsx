'use client';

import React, { useState, useEffect } from 'react';

interface AddEventModalProps {
  isOpen: boolean;
  startDate: string | null;
  endDate: string | null;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
}

export interface CalendarEvent {
  id: string;
  title: string;
  location: string;
  allDay: boolean;
  start: string;
  end: string;
  repeat: string;
  calendar: string;
  alert: string;
  attachment: string;
}

const REPEAT_OPTIONS = ['Never', 'Every Day', 'Every Week', 'Every 2 Weeks', 'Every Month', 'Every Year'];
const ALERT_OPTIONS = ['None', 'At time of event', '5 minutes before', '15 minutes before', '30 minutes before', '1 hour before', '1 day before'];
const CALENDAR_OPTIONS = ['Calendar', 'Work', 'Personal', 'Family', 'Holidays'];

function formatDateDisplay(iso: string | null): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AddEventModal({ isOpen, startDate, endDate, onClose, onSave }: AddEventModalProps) {
  const [activeTab, setActiveTab] = useState<'event' | 'reminder'>('event');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [allDay, setAllDay] = useState(true);
  const [start, setStart] = useState(startDate ?? '');
  const [end, setEnd] = useState(endDate ?? startDate ?? '');
  const [repeat, setRepeat] = useState('Never');
  const [calendar, setCalendar] = useState('Calendar');
  const [alert, setAlert] = useState('None');
  const [attachment, setAttachment] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStart(startDate ?? '');
      setEnd(endDate ?? startDate ?? '');
      setTitle('');
      setLocation('');
      setAllDay(true);
      setRepeat('Never');
      setCalendar('Calendar');
      setAlert('None');
      setAttachment('');
      setActiveTab('event');
      // Trigger entrance animation
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen, startDate, endDate]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: `evt-${Date.now()}`,
      title: title.trim(),
      location,
      allDay,
      start,
      end,
      repeat,
      calendar,
      alert,
      attachment,
    });
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: visible ? 'rgba(0,30,60,0.45)' : 'rgba(0,30,60,0)',
        backdropFilter: 'blur(4px)',
        transition: 'background 0.25s ease',
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(160deg, #f0f7ff 0%, #ffffff 60%, #e8f4fd 100%)',
          border: '1.5px solid rgba(0,120,212,0.18)',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.96)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            background: 'linear-gradient(135deg, #0078D4 0%, #1E90FF 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95"
            style={{ background: 'rgba(255,255,255,0.2)' }}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <span className="text-white font-semibold text-base tracking-wide">New</span>

          <button
            onClick={handleSave}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95"
            style={{ background: title.trim() ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)' }}
            aria-label="Save event"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1.5 7.5l3.5 3.5 7.5-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-4 pt-3 pb-2">
          <div
            className="flex rounded-xl p-1"
            style={{ background: 'rgba(0,120,212,0.08)', border: '1px solid rgba(0,120,212,0.12)' }}
          >
            {(['event', 'reminder'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize"
                style={{
                  background: activeTab === tab
                    ? 'linear-gradient(135deg, #0078D4, #1E90FF)'
                    : 'transparent',
                  color: activeTab === tab ? 'white' : '#0078D4',
                  boxShadow: activeTab === tab ? '0 2px 8px rgba(0,120,212,0.3)' : 'none',
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pb-4 space-y-3">
          {/* Title + Location */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: 'white',
              border: '1px solid rgba(0,120,212,0.15)',
              boxShadow: '0 1px 6px rgba(0,120,212,0.06)',
            }}
          >
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-sm outline-none bg-transparent"
              style={{
                color: '#1A2B3C',
                borderBottom: '1px solid rgba(0,120,212,0.1)',
                fontWeight: title ? '500' : '400',
              }}
            />
            <input
              type="text"
              placeholder="Location or Video Call"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-4 py-3 text-sm outline-none bg-transparent"
              style={{ color: '#1A2B3C' }}
            />
          </div>

          {/* All-day + Starts + Ends */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: 'white',
              border: '1px solid rgba(0,120,212,0.15)',
              boxShadow: '0 1px 6px rgba(0,120,212,0.06)',
            }}
          >
            {/* All-day toggle */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid rgba(0,120,212,0.08)' }}
            >
              <span className="text-sm font-medium" style={{ color: '#1A2B3C' }}>All-day</span>
              <button
                onClick={() => setAllDay(v => !v)}
                className="relative transition-all duration-300"
                style={{ width: '44px', height: '26px' }}
                aria-label="Toggle all day"
              >
                <div
                  className="absolute inset-0 rounded-full transition-all duration-300"
                  style={{
                    background: allDay
                      ? 'linear-gradient(135deg, #0078D4, #1E90FF)'
                      : 'rgba(0,0,0,0.15)',
                    boxShadow: allDay ? '0 2px 8px rgba(0,120,212,0.4)' : 'none',
                  }}
                />
                <div
                  className="absolute top-1 rounded-full bg-white shadow-sm transition-all duration-300"
                  style={{
                    width: '18px',
                    height: '18px',
                    left: allDay ? '23px' : '3px',
                  }}
                />
              </button>
            </div>

            {/* Starts */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid rgba(0,120,212,0.08)' }}
            >
              <span className="text-sm font-medium" style={{ color: '#1A2B3C' }}>Starts</span>
              <div
                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  background: 'rgba(0,120,212,0.08)',
                  color: '#0078D4',
                  border: '1px solid rgba(0,120,212,0.2)',
                }}
              >
                {formatDateDisplay(start) || '—'}
              </div>
            </div>

            {/* Ends */}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium" style={{ color: '#1A2B3C' }}>Ends</span>
              <div
                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  background: 'rgba(0,120,212,0.08)',
                  color: '#0078D4',
                  border: '1px solid rgba(0,120,212,0.2)',
                }}
              >
                {formatDateDisplay(end) || '—'}
              </div>
            </div>
          </div>

          {/* Repeat */}
          <div
            className="rounded-xl"
            style={{
              background: 'white',
              border: '1px solid rgba(0,120,212,0.15)',
              boxShadow: '0 1px 6px rgba(0,120,212,0.06)',
            }}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium" style={{ color: '#1A2B3C' }}>Repeat</span>
              <select
                value={repeat}
                onChange={e => setRepeat(e.target.value)}
                className="text-xs font-medium outline-none bg-transparent cursor-pointer"
                style={{ color: '#6B7A8D' }}
              >
                {REPEAT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Calendar */}
          <div
            className="rounded-xl"
            style={{
              background: 'white',
              border: '1px solid rgba(0,120,212,0.15)',
              boxShadow: '0 1px 6px rgba(0,120,212,0.06)',
            }}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium" style={{ color: '#1A2B3C' }}>Calendar</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #0078D4, #1E90FF)', boxShadow: '0 1px 4px rgba(0,120,212,0.4)' }}
                />
                <select
                  value={calendar}
                  onChange={e => setCalendar(e.target.value)}
                  className="text-xs font-medium outline-none bg-transparent cursor-pointer"
                  style={{ color: '#6B7A8D' }}
                >
                  {CALENDAR_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Alert */}
          <div
            className="rounded-xl"
            style={{
              background: 'white',
              border: '1px solid rgba(0,120,212,0.15)',
              boxShadow: '0 1px 6px rgba(0,120,212,0.06)',
            }}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium" style={{ color: '#1A2B3C' }}>Alert</span>
              <select
                value={alert}
                onChange={e => setAlert(e.target.value)}
                className="text-xs font-medium outline-none bg-transparent cursor-pointer"
                style={{ color: '#6B7A8D' }}
              >
                {ALERT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Add attachment */}
          <div
            className="rounded-xl"
            style={{
              background: 'white',
              border: '1px solid rgba(0,120,212,0.15)',
              boxShadow: '0 1px 6px rgba(0,120,212,0.06)',
            }}
          >
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 hover:bg-blue-50 rounded-xl"
              onClick={() => {
                const val = window.prompt('Enter attachment URL or note:');
                if (val) setAttachment(val);
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #0078D4, #1E90FF)' }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1v8M1 5h8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-sm" style={{ color: attachment ? '#0078D4' : '#6B7A8D' }}>
                {attachment || 'Add attachment...'}
              </span>
            </button>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: title.trim()
                ? 'linear-gradient(135deg, #0078D4 0%, #1E90FF 100%)'
                : 'rgba(0,120,212,0.2)',
              color: title.trim() ? 'white' : '#9BB5CC',
              boxShadow: title.trim() ? '0 4px 16px rgba(0,120,212,0.35)' : 'none',
              cursor: title.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
