'use client';

import React, { useEffect, useState } from 'react';

export function DiplomaticGlobe() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let animId: number;
    let start: number | null = null;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      // Smooth continuous slow rotation: 360 deg in ~45 seconds
      setRotation((progress * 0.008) % 360);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full max-w-[420px] aspect-square mx-auto flex items-center justify-center select-none">
      {/* Outer Golden Diplomatic Aura */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#C9A96E]/10 via-[#101E33]/30 to-transparent blur-2xl animate-pulse-subtle pointer-events-none" />

      {/* Diplomatic Meridian & Coordinate Rings */}
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-[0_0_35px_rgba(201,169,110,0.18)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="globeSphere" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#101E33" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#0B1728" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#07111F" stopOpacity="1" />
          </radialGradient>
          <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F6F2E9" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#C9A96E" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#101E33" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Outer Coordinate Outer Ring */}
        <circle cx="200" cy="200" r="190" stroke="#C9A96E" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="3 6" />
        <circle cx="200" cy="200" r="180" stroke="#1F304B" strokeWidth="1" />

        {/* Globe Base Sphere */}
        <circle cx="200" cy="200" r="160" fill="url(#globeSphere)" stroke="#C9A96E" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Latitude Lines (Static horizontal diplomatic parallels) */}
        <ellipse cx="200" cy="200" rx="160" ry="120" stroke="#C9A96E" strokeWidth="0.8" strokeOpacity="0.25" />
        <ellipse cx="200" cy="200" rx="160" ry="70" stroke="#C9A96E" strokeWidth="0.8" strokeOpacity="0.3" />
        <line x1="40" y1="200" x2="360" y2="200" stroke="#C9A96E" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="4 4" />
        <ellipse cx="200" cy="120" rx="138" ry="40" stroke="#C9A96E" strokeWidth="0.8" strokeOpacity="0.2" />
        <ellipse cx="200" cy="280" rx="138" ry="40" stroke="#C9A96E" strokeWidth="0.8" strokeOpacity="0.2" />

        {/* Rotating Longitude Meridians (Dynamic projection effect) */}
        <g style={{ transformOrigin: '200px 200px', transform: `rotate(${rotation * 0.1}deg)` }}>
          <ellipse cx="200" cy="200" rx="160" ry="160" stroke="#1F304B" strokeWidth="1" />
          <ellipse cx="200" cy="200" rx="120" ry="160" stroke="#C9A96E" strokeWidth="0.8" strokeOpacity="0.3" />
          <ellipse cx="200" cy="200" rx="70" ry="160" stroke="#C9A96E" strokeWidth="0.8" strokeOpacity="0.35" />
          <line x1="200" y1="40" x2="200" y2="360" stroke="#C9A96E" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="4 4" />
        </g>

        {/* Tilted Diplomatic Axis Orbit */}
        <ellipse
          cx="200"
          cy="200"
          rx="175"
          ry="65"
          transform="rotate(-23.5 200 200)"
          stroke="url(#goldRing)"
          strokeWidth="1.5"
        />

        {/* Diplomatic Node Pings (Representing global summits + Kathmandu) */}
        {/* Kathmandu Coordinates Indicator (27.7°N, 85.3°E projected) */}
        <g transform="translate(245, 145)">
          <circle cx="0" cy="0" r="5" fill="#D94B4B" />
          <circle cx="0" cy="0" r="10" stroke="#D94B4B" strokeWidth="1" opacity="0.6" className="animate-ping" />
          <text x="12" y="4" fill="#F6F2E9" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
            Kathmandu (Host)
          </text>
        </g>

        {/* UN Geneva Node */}
        <g transform="translate(170, 130)">
          <circle cx="0" cy="0" r="3.5" fill="#C9A96E" />
          <circle cx="0" cy="0" r="7" stroke="#C9A96E" strokeWidth="0.75" opacity="0.5" />
        </g>

        {/* UN HQ New York Node */}
        <g transform="translate(115, 140)">
          <circle cx="0" cy="0" r="3.5" fill="#C9A96E" />
          <circle cx="0" cy="0" r="7" stroke="#C9A96E" strokeWidth="0.75" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}
