'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Globe, ArrowRight, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { Committee, Country } from '@/types/database';

interface CountryAvailabilityPreviewProps {
  committees: Committee[];
  initialCommitteeCountries: { country: Country; status: 'available' | 'held' | 'assigned' }[];
  selectedCommitteeId: string;
}

export function CountryAvailabilityPreview({
  committees,
  initialCommitteeCountries,
  selectedCommitteeId,
}: CountryAvailabilityPreviewProps) {
  const [activeCommitteeId, setActiveCommitteeId] = useState(selectedCommitteeId || committees[0]?.id || '');

  const availableCount = initialCommitteeCountries.filter((c) => c.status === 'available').length;
  const heldCount = initialCommitteeCountries.filter((c) => c.status === 'held').length;
  const assignedCount = initialCommitteeCountries.filter((c) => c.status === 'assigned').length;

  return (
    <section className="py-20 bg-[#07111F] border-b border-[#1F304B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
              Live Sovereign Matrix
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#F6F2E9]">
              Country Allocation Roster
            </h2>
            <p className="text-sm text-[#8B95A5] max-w-xl">
              Real-time sovereign state assignments across all active committees. Select your preference or generate
              a random country during registration.
            </p>
          </div>
          <Link
            href="/country-allocation"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#C9A96E] hover:text-[#DFCA9B] font-semibold group"
          >
            <span>Full Sovereign Matrix</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Status Legend & Counts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-md bg-[#0B1728] border border-[#1F304B] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-[#8B95A5] font-medium uppercase tracking-wider">Available</span>
            </div>
            <span className="text-sm font-bold text-[#F6F2E9]">{availableCount} countries</span>
          </div>
          <div className="p-4 rounded-md bg-[#0B1728] border border-[#1F304B] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-xs text-[#8B95A5] font-medium uppercase tracking-wider">Temporarily Held</span>
            </div>
            <span className="text-sm font-bold text-[#F6F2E9]">{heldCount} countries</span>
          </div>
          <div className="p-4 rounded-md bg-[#0B1728] border border-[#1F304B] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B95A5]" />
              <span className="text-xs text-[#8B95A5] font-medium uppercase tracking-wider">Confirmed Assigned</span>
            </div>
            <span className="text-sm font-bold text-[#F6F2E9]">{assignedCount} countries</span>
          </div>
        </div>

        {/* Country Badge Cloud */}
        <div className="p-6 rounded-lg bg-[#0B1728] border border-[#1F304B]">
          <div className="flex flex-wrap gap-2.5 max-h-72 overflow-y-auto pr-2">
            {initialCommitteeCountries.slice(0, 36).map(({ country, status }) => {
              const isAvailable = status === 'available';
              const isHeld = status === 'held';

              return (
                <div
                  key={country.id}
                  className={`px-3 py-1.5 rounded text-xs flex items-center space-x-2 border transition-all ${
                    isAvailable
                      ? 'bg-[#101E33] border-[#1F304B] text-[#F6F2E9] hover:border-[#C9A96E]/40'
                      : isHeld
                      ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                      : 'bg-[#07111F] border-[#1F304B]/40 text-[#8B95A5] line-through'
                  }`}
                >
                  <span className="text-sm">{country.flag_emoji || '🌐'}</span>
                  <span>{country.display_name}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isAvailable ? 'bg-emerald-400' : isHeld ? 'bg-amber-400' : 'bg-[#8B95A5]'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#1F304B] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8B95A5] gap-3">
            <span>Displaying live sovereign matrix preview for UNGA</span>
            <Link
              href="/register"
              className="text-[#C9A96E] hover:underline font-semibold uppercase tracking-wider text-[11px]"
            >
              Select or Randomize Your Country in Registration →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
