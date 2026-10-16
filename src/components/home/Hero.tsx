'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Shield, Sparkles } from 'lucide-react';
import { DiplomaticGlobe } from './DiplomaticGlobe';

interface HeroProps {
  tagline?: string;
  year?: number;
  registrationOpen?: boolean;
}

export function Hero({
  tagline = 'Where Nations Meet. Ideas Move.',
  year = 2026,
  registrationOpen = false,
}: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#1F304B]">
      {/* Subtle Diplomatic Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1F304B_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

      {/* Ambient Lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#101E33] rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C9A96E]/10 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Diplomatic Typography & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Diplomatic Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#101E33] border border-[#C9A96E]/40 text-xs tracking-wider uppercase text-[#C9A96E]">
              <Shield className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span>Inaugural Model United Nations Conference</span>
            </div>

            {/* Main Headline (Editorial Serif) */}
            <h1 className="font-serif-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F6F2E9] leading-[1.15]">
              {tagline.split('. ').map((part, index, array) => (
                <React.Fragment key={index}>
                  <span className={index === 1 ? 'gold-gradient-text block mt-1' : ''}>
                    {part}{index < array.length - 1 ? '.' : ''}
                  </span>{' '}
                </React.Fragment>
              ))}
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#8B95A5] max-w-2xl leading-relaxed">
              Organized by <strong className="text-[#F6F2E9]">Fluorescent Secondary School</strong>, Kathmandu.
              Bringing together aspiring delegates to navigate complex multilateral diplomacy, international law,
              and global consensus.
            </p>

            {/* Conference Status Indicator */}
            <div className="p-4 rounded-md bg-[#0B1728] border border-[#1F304B] max-w-xl">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8B95A5]">Registration Status:</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${
                    registrationOpen
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                      : 'bg-[#101E33] text-[#C9A96E] border border-[#C9A96E]/30'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      registrationOpen ? 'bg-emerald-400 animate-pulse' : 'bg-[#C9A96E]'
                    }`}
                  />
                  {registrationOpen ? 'Official Registration Open' : 'Opening Soon (Secretariat Notice)'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/register"
                className={`inline-flex items-center space-x-2.5 px-6 py-3.5 rounded font-semibold text-xs tracking-widest uppercase transition-all duration-200 ${
                  registrationOpen
                    ? 'bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] shadow-lg shadow-[#C9A96E]/20'
                    : 'bg-[#101E33] hover:bg-[#15253F] text-[#F6F2E9] border border-[#C9A96E]/40'
                }`}
              >
                <span>{registrationOpen ? 'Register as Delegate' : 'Explore Delegate Portal'}</span>
                <ArrowRight className="w-4 h-4 text-[#07111F]" />
              </Link>

              <Link
                href="/committees"
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded bg-transparent hover:bg-[#101E33]/70 text-[#F6F2E9] border border-[#1F304B] hover:border-[#C9A96E]/40 font-medium text-xs tracking-widest uppercase transition-all"
              >
                <Globe className="w-4 h-4 text-[#C9A96E]" />
                <span>View Committees</span>
              </Link>

              <Link
                href="/country-allocation"
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded bg-transparent hover:bg-[#101E33]/70 text-[#8B95A5] hover:text-[#F6F2E9] border border-[#1F304B] font-medium text-xs tracking-widest uppercase transition-all"
              >
                <span>Live Allocation Matrix</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Rotating Diplomatic Globe */}
          <div className="lg:col-span-5 flex justify-center">
            <DiplomaticGlobe />
          </div>
        </div>
      </div>
    </section>
  );
}
