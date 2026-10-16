'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, MapPin, Users, Calendar, ShieldCheck, ChevronDown } from 'lucide-react';

interface HeroProps {
  tagline?: string;
  year?: number;
  registrationOpen?: boolean;
}

export function Hero({
  tagline = 'Where Nations Meet. Ideas Move.',
  year = 2026,
  registrationOpen = true,
}: HeroProps) {
  return (
    <section className="relative w-full min-h-[88vh] flex flex-col justify-between items-center overflow-hidden bg-[#000000] text-white pt-12 pb-6 px-4">
      {/* Background Starfield Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 150px 80px, #38bdf8, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 280px 140px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 420px 40px, #7dd3fc, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 600px 190px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 750px 90px, #38bdf8, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 900px 220px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 1100px 120px, #38bdf8, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 1300px 70px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 1450px 260px, #7dd3fc, rgba(0,0,0,0))
          `,
          backgroundSize: '800px 400px',
        }}
      />

      {/* Top subtle ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-sky-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 pt-6 sm:pt-10">
        {/* Minds in motion / conference pill - exact match from uploaded image */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#031525]/80 border border-[#38BDF8]/40 shadow-[0_0_15px_rgba(56,189,248,0.2)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse shadow-[0_0_8px_#38bdf8]" />
          <span className="text-xs font-semibold tracking-widest text-[#38BDF8] uppercase">
            MINDS IN MOTION
          </span>
        </div>

        {/* Clean, massive, modern typography */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Fluorescent MUN <span className="text-[#38BDF8]">2026</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#94A3B8]">
            #FMUN2026 • FLUORESCENT SECONDARY SCHOOL • KATHMANDU
          </p>
        </div>

        {/* Direct, human narrative for +2 Science & Management */}
        <p className="text-sm sm:text-base md:text-lg text-[#CBD5E1] max-w-2xl mx-auto leading-relaxed font-light">
          An intimate, high-impact diplomatic summit strictly limited to{' '}
          <strong className="text-white font-semibold">30 delegates</strong>.
          Tailored exclusively for Fluorescent +2 Science & Management scholars to debate, negotiate, and resolve global crises.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-[#F1F5F9] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>Register as Delegate</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/#events"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#0A0D14] hover:bg-[#111622] text-[#E2E8F0] border border-[#272E3B] font-medium text-xs uppercase tracking-wider transition-all hover:border-[#38BDF8]/40"
          >
            <span>Conference Schedule</span>
          </Link>

          <Link
            href="/#suggestions"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#0A0D14] hover:bg-[#111622] text-[#94A3B8] hover:text-[#38BDF8] border border-[#272E3B] font-medium text-xs tracking-wider transition-all"
          >
            <span>💡 Submit Ideas</span>
          </Link>
        </div>

        {/* 4 Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl mx-auto pt-4 text-left">
          <div className="p-2.5 rounded-xl bg-[#080B11]/80 border border-[#1C2331] backdrop-blur-sm">
            <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">Quota</span>
            <span className="text-xs font-bold text-white">30 Delegates Max</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#080B11]/80 border border-[#1C2331] backdrop-blur-sm">
            <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">Faculty</span>
            <span className="text-xs font-bold text-white">+2 Sci & Mgmt</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#080B11]/80 border border-[#1C2331] backdrop-blur-sm">
            <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">Committees</span>
            <span className="text-xs font-bold text-white">In Form Selection</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#080B11]/80 border border-[#1C2331] backdrop-blur-sm">
            <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">Social</span>
            <span className="text-xs font-bold text-white">Live DJ Night</span>
          </div>
        </div>
      </div>

      {/* Realistic Curved Glowing Earth Horizon - matching uploaded mockup */}
      <div className="relative w-full max-w-6xl mx-auto mt-12 select-none pointer-events-none">
        {/* Horizon curvature wrapper */}
        <div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] overflow-hidden">
          {/* Cyan / Blue atmospheric glow arc */}
          <div
            className="absolute top-[40px] left-1/2 -translate-x-1/2 w-[180%] sm:w-[150%] md:w-[130%] h-[800px] rounded-[50%] pointer-events-none"
            style={{
              background: `
                radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.45) 0%, rgba(14, 165, 233, 0.25) 8%, rgba(2, 132, 199, 0.1) 18%, rgba(0, 0, 0, 0) 35%),
                linear-gradient(180deg, rgba(56, 189, 248, 0.3) 0%, rgba(2, 6, 23, 0.95) 15%, #000000 100%)
              `,
              boxShadow: '0 -20px 80px rgba(56, 189, 248, 0.35), inset 0 2px 20px rgba(255, 255, 255, 0.8)',
              borderTop: '2px solid rgba(224, 242, 254, 0.8)',
            }}
          >
            {/* Continent textures & city light specks inside the planet rim */}
            <div
              className="w-full h-full opacity-40"
              style={{
                backgroundImage: `
                  radial-gradient(1px 1px at 30% 8%, #fef08a, transparent),
                  radial-gradient(1px 1px at 35% 12%, #fef08a, transparent),
                  radial-gradient(1.5px 1.5px at 45% 9%, #bae6fd, transparent),
                  radial-gradient(1px 1px at 52% 14%, #fef08a, transparent),
                  radial-gradient(1px 1px at 60% 11%, #fed7aa, transparent),
                  radial-gradient(1.5px 1.5px at 68% 15%, #bae6fd, transparent)
                `,
              }}
            />
          </div>

          {/* Central bottom badge resting on the earth horizon */}
          <div className="absolute top-[30px] left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
            <div className="px-4 py-1.5 rounded-full bg-[#050B14]/90 border border-[#38BDF8]/40 backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.3)] flex items-center space-x-2 text-xs font-mono text-[#E2E8F0]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>fmun.fluorescent.edu.np</span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[#38BDF8]">Strictly 30 Seats</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
