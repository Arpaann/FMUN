'use client';

import React from 'react';
import { Calendar, MapPin, CreditCard, Shirt } from 'lucide-react';
import { ConferenceSettings } from '@/types/database';
import { formatDiplomaticDate, formatNPR } from '@/lib/utils';

export function ConferenceDetails({ settings }: { settings: ConferenceSettings }) {
  return (
    <section className="py-16 bg-[#000000] border-b border-[#1C1F26] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase tracking-widest text-[#38BDF8] font-semibold">
            Key Information
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            Conference Essentials
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Key details for participating students and delegates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Conference Dates */}
          <div className="p-5 rounded-2xl bg-[#0A0D14] border border-[#1C2331] space-y-2 hover:border-[#38BDF8]/40 transition-all">
            <div className="w-8 h-8 rounded-xl bg-[#0F172A] border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-xs uppercase tracking-wider text-[#94A3B8] font-semibold">Dates</h3>
            <p className="text-base font-bold text-white">
              {settings.start_date ? formatDiplomaticDate(settings.start_date) : 'Announcing Soon'}
            </p>
            <p className="text-[11px] text-[#64748B]">3-day student summit</p>
          </div>

          {/* Card 2: Venue */}
          <div className="p-5 rounded-2xl bg-[#0A0D14] border border-[#1C2331] space-y-2 hover:border-[#38BDF8]/40 transition-all">
            <div className="w-8 h-8 rounded-xl bg-[#0F172A] border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-xs uppercase tracking-wider text-[#94A3B8] font-semibold">Venue</h3>
            <p className="text-base font-bold text-white">
              {settings.venue || 'Fluorescent Campus'}
            </p>
            <p className="text-[11px] text-[#64748B]">Banasthali, Kathmandu</p>
          </div>

          {/* Card 3: Delegate Fee */}
          <div className="p-5 rounded-2xl bg-[#0A0D14] border border-[#1C2331] space-y-2 hover:border-[#38BDF8]/40 transition-all">
            <div className="w-8 h-8 rounded-xl bg-[#0F172A] border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="text-xs uppercase tracking-wider text-[#94A3B8] font-semibold">Delegate Fee</h3>
            <p className="text-base font-bold text-white">
              {formatNPR(settings.registration_fee)}
            </p>
            <p className="text-[11px] text-[#64748B]">Cash, eSewa or Khalti</p>
          </div>

          {/* Card 4: What is included */}
          <div className="p-5 rounded-2xl bg-[#0A0D14] border border-[#1C2331] space-y-2 hover:border-[#38BDF8]/40 transition-all">
            <div className="w-8 h-8 rounded-xl bg-[#0F172A] border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <Shirt className="w-4 h-4" />
            </div>
            <h3 className="text-xs uppercase tracking-wider text-[#94A3B8] font-semibold">What&apos;s Included</h3>
            <p className="text-base font-bold text-white">Kits, Meals & Party</p>
            <p className="text-[11px] text-[#64748B]">Badge, placards & certificates</p>
          </div>
        </div>
      </div>
    </section>
  );
}
