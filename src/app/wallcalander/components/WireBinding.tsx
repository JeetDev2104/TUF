// Renders the spiral wire binding at the top of the calendar
// Mimics the physical coil binding visible in the reference image

import React from 'react';

export default function WireBinding() {
  // Generate 18 wire loops evenly spaced across the top
  const loopCount = 18;

  return (
    <div
      className="relative w-full flex justify-center items-end"
      style={{ height: '36px', zIndex: 10 }}
      aria-hidden="true"
    >
      {/* Horizontal bar the wire threads through */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: '10px',
          height: '4px',
          background: 'linear-gradient(180deg, #b0b8c4 0%, #8a9ab0 50%, #6b7a8d 100%)',
          borderRadius: '2px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
        }}
      />
      {/* Wire loops */}
      <div className="relative w-full flex justify-around items-end px-3" style={{ bottom: 0 }}>
        {Array.from({ length: loopCount })?.map((_, i) => (
          <div
            key={`wire-loop-${i}`}
            className="relative flex flex-col items-center"
            style={{ width: `${100 / loopCount}%` }}
          >
            {/* Top half of loop (above bar) */}
            <div
              style={{
                width: '12px',
                height: '14px',
                border: '2.5px solid #7a8a9a',
                borderBottom: 'none',
                borderRadius: '6px 6px 0 0',
                background: 'transparent',
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), 1px 0 2px rgba(0,0,0,0.15)',
                marginBottom: '8px',
              }}
            />
            {/* Bottom half of loop (below bar, into calendar) */}
            <div
              style={{
                width: '12px',
                height: '8px',
                border: '2.5px solid #7a8a9a',
                borderTop: 'none',
                borderRadius: '0 0 6px 6px',
                background: 'transparent',
                position: 'absolute',
                bottom: 0,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}