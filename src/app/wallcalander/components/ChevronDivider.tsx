// Renders the blue chevron/zigzag shape that divides the hero image from the calendar body.
// This is the signature visual element of the reference design.

import React from 'react';

const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH',     'APRIL',   'MAY',      'JUNE',
  'JULY',    'AUGUST',   'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

interface ChevronDividerProps {
  month: number; // 0-indexed
  year:  number;
}

export default function ChevronDivider({ month, year }: ChevronDividerProps) {
  return (
    <div
      className="relative w-full"
      style={{ marginTop: '-2px', background: 'white' }}
      aria-label={`${MONTHS[month]} ${year}`}
    >
      {/*
        SVG chevron divider:
        - Left chevron points RIGHT (into the image), filled solid blue
        - Right chevron points LEFT (into the image), filled solid blue
        - Both meet in the middle creating the signature zigzag
        - Year + Month label sits on the right chevron
        Matches the reference image exactly.
      */}
      <svg
        viewBox="0 0 560 90"
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: '88px', display: 'block' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="chevronGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#0078D4" />
            <stop offset="100%" stopColor="#1E90FF" />
          </linearGradient>
        </defs>

        {/* Left chevron — spans left half, points right with a V notch on the right edge */}
        {/* Shape: top-left → top-center-right → middle-right-point → bottom-center-right → bottom-left */}
        <polygon
          points="0,0 310,0 280,44 310,88 0,88"
          fill="url(#chevronGrad)"
        />

        {/* Right chevron — spans right half, has V notch on left edge pointing left */}
        {/* Shape: left-top-notch → right-top → right-bottom → left-bottom-notch → middle-point */}
        <polygon
          points="290,0 560,0 560,88 290,88 320,44"
          fill="url(#chevronGrad)"
        />
      </svg>

      {/* Year + Month label overlaid on the right chevron */}
      <div
        className="absolute right-0 top-0 bottom-0 flex flex-col items-end justify-center"
        style={{ right: '24px' }}
      >
        <span
          className="text-white tabular-nums leading-none"
          style={{
            fontSize: '15px',
            fontWeight: 400,
            letterSpacing: '0.08em',
            opacity: 0.92,
          }}
        >
          {year}
        </span>
        <span
          className="text-white leading-none mt-1"
          style={{
            fontSize: '26px',
            fontWeight: 800,
            letterSpacing: '0.04em',
          }}
        >
          {MONTHS[month]}
        </span>
      </div>
    </div>
  );
}