'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, CreditCard, BookOpen, AlertCircle } from 'lucide-react';
import { ConferenceSettings } from '@/types/database';
import { formatDiplomaticDate, formatNPR } from '@/lib/utils';

export function ConferenceDetails({ settings }: { settings: ConferenceSettings }) {
  return (
    <section className="py-20 bg-[#07111F] border-b border-[#1F304B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
            Diplomatic Assembly Overview
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#F6F2E9]">
            Conference Logistics & Protocols
          </h2>
          <p className="text-sm text-[#8B95A5] leading-relaxed">
            Essential operational parameters for delegates, faculty advisors, and observer delegations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Conference Dates */}
          <div className="p-6 rounded-lg bg-[#0B1728] border border-[#1F304B] hover:border-[#C9A96E]/30 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-md bg-[#101E33] border border-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[#8B95A5] font-medium">Conference Dates</h3>
              <p className="font-serif-heading text-lg font-bold text-[#F6F2E9] mt-1">
                {settings.start_date ? formatDiplomaticDate(settings.start_date) : 'Coming Soon'}
              </p>
              {settings.end_date && (
                <p className="text-xs text-[#8B95A5]">to {formatDiplomaticDate(settings.end_date)}</p>
              )}
            </div>
            <p className="text-xs text-[#8B95A5] leading-relaxed">
              {settings.start_date
                ? 'Official two-day diplomatic summit'
                : 'Secretariat finalizing the academic calendar. Official dates will be announced.'}
            </p>
          </div>

          {/* Card 2: Venue */}
          <div className="p-6 rounded-lg bg-[#0B1728] border border-[#1F304B] hover:border-[#C9A96E]/30 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-md bg-[#101E33] border border-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[#8B95A5] font-medium">Host Venue</h3>
              <p className="font-serif-heading text-lg font-bold text-[#F6F2E9] mt-1">
                {settings.venue || 'Fluorescent Campus'}
              </p>
              <p className="text-xs text-[#8B95A5]">Banasthali, Kathmandu</p>
            </div>
            <p className="text-xs text-[#8B95A5] leading-relaxed">
              Equipped with diplomatic caucus chambers, general assembly hall, and press center.
            </p>
          </div>

          {/* Card 3: Delegate Fee */}
          <div className="p-6 rounded-lg bg-[#0B1728] border border-[#1F304B] hover:border-[#C9A96E]/30 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-md bg-[#101E33] border border-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E]">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[#8B95A5] font-medium">Delegate Fee</h3>
              <p className="font-serif-heading text-lg font-bold text-[#F6F2E9] mt-1">
                {formatNPR(settings.registration_fee)}
              </p>
              <p className="text-xs text-[#8B95A5]">Physical, eSewa & Khalti</p>
            </div>
            <p className="text-xs text-[#8B95A5] leading-relaxed">
              Includes delegate kit, committee materials, meals, credentials, and after-party admission.
            </p>
          </div>

          {/* Card 4: Rules & Procedure */}
          <div className="p-6 rounded-lg bg-[#0B1728] border border-[#1F304B] hover:border-[#C9A96E]/30 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-md bg-[#101E33] border border-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[#8B95A5] font-medium">Handbook & Rules</h3>
              <p className="font-serif-heading text-lg font-bold text-[#F6F2E9] mt-1">UNA-USA Rules</p>
              <p className="text-xs text-[#8B95A5]">Formal Parliamentary Procedure</p>
            </div>
            <div className="pt-1">
              <Link
                href="/conference-information"
                className="text-xs text-[#C9A96E] hover:underline font-medium inline-flex items-center space-x-1"
              >
                <span>Read Delegate Guidelines →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Notice banner when details are pending */}
        {(!settings.start_date || !settings.registration_fee) && (
          <div className="mt-8 p-4 rounded-md bg-[#101E33]/60 border border-[#C9A96E]/30 flex items-center space-x-3 text-xs text-[#8B95A5]">
            <AlertCircle className="w-4 h-4 text-[#C9A96E] shrink-0" />
            <p>
              <strong className="text-[#F6F2E9]">Official Notice:</strong> Final conference dates, agenda guides,
              and registration fees are undergoing official verification by Fluorescent Secondary School
              administration. Delegate registration will officially open once published.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
