'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, CreditCard, Shirt, AlertCircle } from 'lucide-react';
import { ConferenceSettings } from '@/types/database';
import { formatDiplomaticDate, formatNPR } from '@/lib/utils';

export function ConferenceDetails({ settings }: { settings: ConferenceSettings }) {
  return (
    <section className="py-16 bg-[#0B1728] border-b border-[#1F304B]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
            Quick Overview
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#F6F2E9]">
            Conference Essentials
          </h2>
          <p className="text-xs sm:text-sm text-[#8B95A5]">
            Key details for participating students and delegates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Conference Dates */}
          <div className="p-5 rounded-lg bg-[#07111F] border border-[#1F304B] space-y-2">
            <div className="w-8 h-8 rounded bg-[#101E33] border border-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E]">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-xs uppercase tracking-wider text-[#8B95A5] font-semibold">Dates</h3>
            <p className="font-serif text-base font-bold text-[#F6F2E9]">
              {settings.start_date ? formatDiplomaticDate(settings.start_date) : 'Announcing Soon'}
            </p>
            <p className="text-[11px] text-[#8B95A5]">2-day student summit</p>
          </div>

          {/* Card 2: Venue */}
          <div className="p-5 rounded-lg bg-[#07111F] border border-[#1F304B] space-y-2">
            <div className="w-8 h-8 rounded bg-[#101E33] border border-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E]">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-xs uppercase tracking-wider text-[#8B95A5] font-semibold">Venue</h3>
            <p className="font-serif text-base font-bold text-[#F6F2E9]">
              {settings.venue || 'Fluorescent Campus'}
            </p>
            <p className="text-[11px] text-[#8B95A5]">Banasthali, Kathmandu</p>
          </div>

          {/* Card 3: Delegate Fee */}
          <div className="p-5 rounded-lg bg-[#07111F] border border-[#1F304B] space-y-2">
            <div className="w-8 h-8 rounded bg-[#101E33] border border-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E]">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="text-xs uppercase tracking-wider text-[#8B95A5] font-semibold">Delegate Fee</h3>
            <p className="font-serif text-base font-bold text-[#F6F2E9]">
              {formatNPR(settings.registration_fee)}
            </p>
            <p className="text-[11px] text-[#8B95A5]">Cash, eSewa or Khalti</p>
          </div>

          {/* Card 4: What is included */}
          <div className="p-5 rounded-lg bg-[#07111F] border border-[#1F304B] space-y-2">
            <div className="w-8 h-8 rounded bg-[#101E33] border border-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E]">
              <Shirt className="w-4 h-4" />
            </div>
            <h3 className="text-xs uppercase tracking-wider text-[#8B95A5] font-semibold">What&apos;s Included</h3>
            <p className="font-serif text-base font-bold text-[#F6F2E9]">Kits, Meals & DJ Night</p>
            <p className="text-[11px] text-[#8B95A5]">Badge, placards & certificates</p>
          </div>
        </div>
      </div>
    </section>
  );
}
