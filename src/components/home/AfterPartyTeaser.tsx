'use client';

import React from 'react';
import Link from 'next/link';
import { Music, Radio, Disc, Sparkles } from 'lucide-react';

export function AfterPartyTeaser() {
  return (
    <section className="relative py-20 bg-[#050D17] border-b border-[#1F304B] overflow-hidden">
      {/* Background Neon Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-[#101E33]/90 via-[#0B1728]/95 to-[#101E33]/90 border border-[#C9A96E]/30 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#07111F] border border-[#C9A96E]/30 text-xs text-[#C9A96E] font-medium tracking-wider uppercase">
                <Music className="w-3.5 h-3.5 text-[#C9A96E]" />
                <span>Curated Social Evening</span>
              </div>

              <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#F6F2E9]">
                FMUN 2026 Diplomatic After-Party
              </h2>

              <p className="text-sm text-[#8B95A5] leading-relaxed max-w-2xl">
                After vigorous diplomacy, negotiations, and resolution drafting, celebrate international solidarity at
                the FMUN After-Party. Directed by our resident DJ, featuring an eclectic mix of global anthems,
                delegate song recommendations, and celebration.
              </p>

              {/* Animated Sound Waves */}
              <div className="pt-2 flex items-center space-x-1.5 h-8">
                {[40, 75, 55, 90, 60, 85, 30, 95, 70, 50, 80, 65, 45, 90, 75, 40].map((height, i) => (
                  <span
                    key={i}
                    style={{
                      height: `${height}%`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                    className="w-1.5 bg-[#C9A96E] rounded-full animate-pulse opacity-80"
                  />
                ))}
                <span className="text-xs text-[#C9A96E] font-mono ml-3 uppercase tracking-widest">
                  Live DJ Setlist Portal
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/after-party/submit"
                  className="inline-flex items-center space-x-2 px-5 py-3 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-semibold text-xs tracking-wider uppercase shadow-md shadow-[#C9A96E]/20 transition-all"
                >
                  <Disc className="w-4 h-4 text-[#07111F]" />
                  <span>Recommend a Track</span>
                </Link>

                <Link
                  href="/after-party"
                  className="inline-flex items-center space-x-2 px-5 py-3 rounded bg-[#07111F] hover:bg-[#15253F] text-[#F6F2E9] border border-[#1F304B] font-medium text-xs tracking-wider uppercase transition-all"
                >
                  <Radio className="w-4 h-4 text-[#C9A96E]" />
                  <span>View Approved Playlist</span>
                </Link>
              </div>
            </div>

            {/* Right Card / DJ Badge */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="p-6 rounded-xl bg-[#07111F] border border-[#1F304B] text-center space-y-3 w-full max-w-xs shadow-lg">
                <div className="w-14 h-14 rounded-full bg-[#101E33] border-2 border-[#C9A96E] mx-auto flex items-center justify-center text-[#C9A96E] shadow-inner">
                  <Disc className="w-7 h-7 text-[#C9A96E] animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <h3 className="font-serif-heading font-bold text-lg text-[#F6F2E9]">Live DJ Portal</h3>
                <p className="text-xs text-[#8B95A5]">
                  Delegates can submit tracks from Spotify, YouTube, SoundCloud, or Apple Music for DJ review.
                </p>
                <div className="pt-2 text-[11px] text-[#C9A96E] border-t border-[#1F304B]">
                  Admission included with Delegate Badge
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
