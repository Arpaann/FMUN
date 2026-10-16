'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, MapPin, Users, Calendar, Music } from 'lucide-react';

interface HeroProps {
  tagline?: string;
  year?: number;
  registrationOpen?: boolean;
}

export function Hero({
  tagline = 'Think. Speak. Negotiate.',
  year = 2026,
  registrationOpen = true,
}: HeroProps) {
  return (
    <section className="relative w-full pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#1F304B] bg-[#07111F]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
        {/* Simple school badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#101E33] border border-[#C9A96E]/40 text-xs font-semibold uppercase tracking-wider text-[#C9A96E]">
          <span>Fluorescent Secondary School • Kathmandu</span>
        </div>

        {/* Human, approachable headline */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F6F2E9] leading-tight max-w-4xl mx-auto">
          Fluorescent Model United Nations <span className="text-[#C9A96E]">2026</span>
        </h1>

        <p className="text-base sm:text-lg text-[#8B95A5] max-w-2xl mx-auto leading-relaxed">
          An intimate 30-delegate diplomatic simulation designed specifically for{' '}
          <strong className="text-[#F6F2E9] font-medium">+2 Science & Management</strong> students.
          Step up to debate real global issues, draft resolutions, and celebrate at the closing DJ night.
        </p>

        {/* 4 Practical Key Highlights (Pills) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
          <div className="p-3 rounded-lg bg-[#0B1728] border border-[#1F304B] text-center">
            <Users className="w-4 h-4 text-[#C9A96E] mx-auto mb-1" />
            <span className="text-xs font-bold text-[#F6F2E9] block">30 Delegates</span>
            <span className="text-[10px] text-[#8B95A5]">Limited Capacity</span>
          </div>

          <div className="p-3 rounded-lg bg-[#0B1728] border border-[#1F304B] text-center">
            <Sparkles className="w-4 h-4 text-[#C9A96E] mx-auto mb-1" />
            <span className="text-xs font-bold text-[#F6F2E9] block">+2 Faculty</span>
            <span className="text-[10px] text-[#8B95A5]">Science & Mgmt</span>
          </div>

          <div className="p-3 rounded-lg bg-[#0B1728] border border-[#1F304B] text-center">
            <Calendar className="w-4 h-4 text-[#C9A96E] mx-auto mb-1" />
            <span className="text-xs font-bold text-[#F6F2E9] block">2 Days</span>
            <span className="text-[10px] text-[#8B95A5]">Debate & Awards</span>
          </div>

          <div className="p-3 rounded-lg bg-[#0B1728] border border-[#1F304B] text-center">
            <Music className="w-4 h-4 text-[#C9A96E] mx-auto mb-1" />
            <span className="text-xs font-bold text-[#F6F2E9] block">After-Party</span>
            <span className="text-[10px] text-[#8B95A5]">Live Student DJ</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="w-full sm:w-auto px-7 py-3.5 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <span>Register as Delegate</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/#events"
            className="w-full sm:w-auto px-6 py-3.5 rounded bg-[#101E33] hover:bg-[#15253F] text-[#F6F2E9] border border-[#1F304B] font-medium text-xs uppercase tracking-wider transition-all"
          >
            <span>View Events Schedule</span>
          </Link>
        </div>

        <p className="text-[11px] text-[#8B95A5] pt-1">
          ✓ All committee choices & country selection happen directly inside the quick registration form.
        </p>
      </div>
    </section>
  );
}
