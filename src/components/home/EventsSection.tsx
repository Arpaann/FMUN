'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Award, Music, Coffee, Sparkles, LucideIcon } from 'lucide-react';

interface ScheduleItem {
  time: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  tag: string;
  highlight?: boolean;
}

const DAY_1_SCHEDULE: ScheduleItem[] = [
  {
    time: '08:30 AM - 09:30 AM',
    title: 'Registration & Delegate Kit Distribution',
    desc: 'Pick up your official badge, country placard, research handbook, and stationery.',
    icon: Calendar,
    tag: 'Check-in',
  },
  {
    time: '09:30 AM - 10:30 AM',
    title: 'Opening Ceremony & Secretariat Welcome',
    desc: 'Keynote address by the Principal and introduction of the Executive Board.',
    icon: Sparkles,
    tag: 'Plenary',
  },
  {
    time: '10:30 AM - 01:00 PM',
    title: 'Committee Session I: Agenda Setting & GSL',
    desc: 'Roll call, setting the primary agenda, and opening statements on the General Speakers List.',
    icon: Clock,
    tag: 'Debate',
  },
  {
    time: '01:00 PM - 02:00 PM',
    title: 'Diplomatic Lunch & Informal Lobbying',
    desc: 'Lunch provided at the school cafeteria. Connect with delegates and form regional blocs.',
    icon: Coffee,
    tag: 'Meal',
  },
  {
    time: '02:00 PM - 04:30 PM',
    title: 'Committee Session II: Moderated Caucus',
    desc: 'Structured debate on working papers, sub-issues, and bloc formation.',
    icon: Clock,
    tag: 'Debate',
  },
];

const DAY_2_SCHEDULE: ScheduleItem[] = [
  {
    time: '09:00 AM - 11:30 AM',
    title: 'Committee Session III: Crisis Scenario & Draft Resolutions',
    desc: 'Urgent crisis update introduced by the Executive Board followed by operative clause drafting.',
    icon: Clock,
    tag: 'Crisis',
  },
  {
    time: '11:30 AM - 01:00 PM',
    title: 'Committee Session IV: Resolution Voting',
    desc: 'Formal presentation of draft resolutions, amendments, and roll-call substantive voting.',
    icon: Award,
    tag: 'Voting',
  },
  {
    time: '01:00 PM - 02:00 PM',
    title: 'Delegate Lunch & Photo Session',
    desc: 'Lunch and committee photo session in official diplomatic attire.',
    icon: Coffee,
    tag: 'Meal',
  },
  {
    time: '02:30 PM - 04:00 PM',
    title: 'Closing Plenary & Awards Ceremony',
    desc: 'Announcement of Best Delegate, Outstanding Delegate, and Verbal Commendation certificates.',
    icon: Award,
    tag: 'Awards',
  },
  {
    time: '04:30 PM - 07:30 PM',
    title: 'FMUN 2026 After-Party & DJ Night',
    desc: 'Social celebration featuring our live resident DJ, student-recommended tracks, lights, and food.',
    icon: Music,
    tag: 'Social',
    highlight: true,
  },
];

export function EventsSection() {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);

  const schedule = activeDay === 1 ? DAY_1_SCHEDULE : DAY_2_SCHEDULE;

  return (
    <section id="events" className="py-20 bg-[#07111F] border-b border-[#1F304B]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A96E]">
            Two Days of Diplomacy & Celebration
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F6F2E9]">
            Conference Events & Schedule
          </h2>
          <p className="text-xs sm:text-sm text-[#8B95A5] max-w-xl mx-auto">
            Everything planned for our 30 delegates from Fluorescent Secondary School +2 Science & Management.
          </p>
        </div>

        {/* Day Toggle Buttons */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 rounded-lg bg-[#0B1728] border border-[#1F304B]">
            <button
              onClick={() => setActiveDay(1)}
              className={`px-6 py-2.5 rounded-md text-xs font-semibold tracking-wider uppercase transition-all ${
                activeDay === 1
                  ? 'bg-[#C9A96E] text-[#07111F] shadow-sm'
                  : 'text-[#8B95A5] hover:text-[#F6F2E9]'
              }`}
            >
              Day 1 • Committee & Caucuses
            </button>
            <button
              onClick={() => setActiveDay(2)}
              className={`px-6 py-2.5 rounded-md text-xs font-semibold tracking-wider uppercase transition-all ${
                activeDay === 2
                  ? 'bg-[#C9A96E] text-[#07111F] shadow-sm'
                  : 'text-[#8B95A5] hover:text-[#F6F2E9]'
              }`}
            >
              Day 2 • Resolutions & After-Party DJ
            </button>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {schedule.map((item, idx) => {
            const Icon = item.icon;
            const isHighlight = item.highlight;

            return (
              <div
                key={idx}
                className={`p-5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isHighlight
                    ? 'bg-gradient-to-r from-[#101E33] via-[#15253F] to-[#101E33] border-[#C9A96E]/50 shadow-md'
                    : 'bg-[#0B1728] border-[#1F304B] hover:border-[#C9A96E]/30'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isHighlight
                        ? 'bg-[#C9A96E] text-[#07111F]'
                        : 'bg-[#101E33] text-[#C9A96E] border border-[#C9A96E]/20'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-serif font-bold text-base text-[#F6F2E9]">
                        {item.title}
                      </h3>
                      {isHighlight && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C9A96E] text-[#07111F]">
                          Main Event
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8B95A5] leading-relaxed max-w-xl">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="inline-block px-2.5 py-1 rounded bg-[#101E33] text-[11px] font-mono text-[#C9A96E] border border-[#1F304B]">
                    {item.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Venue reminder badge */}
        <div className="mt-10 p-4 rounded-lg bg-[#0B1728] border border-[#1F304B] max-w-md mx-auto text-center text-xs text-[#8B95A5] flex items-center justify-center space-x-2">
          <MapPin className="w-4 h-4 text-[#C9A96E]" />
          <span>Location: Fluorescent Secondary School Main Campus, Banasthali</span>
        </div>
      </div>
    </section>
  );
}
