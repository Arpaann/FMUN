'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Award, Music, Coffee, Sparkles } from 'lucide-react';
import { ScheduleItemConfig } from '@/types/database';

const DEFAULT_SCHEDULE: ScheduleItemConfig[] = [
  {
    id: 'd1-1',
    day: 1,
    time: '08:30 AM - 09:30 AM',
    title: 'Registration & Delegate Kit Distribution',
    desc: 'Pick up your official badge, country placard, research handbook, and stationery.',
    tag: 'Check-in',
  },
  {
    id: 'd1-2',
    day: 1,
    time: '09:30 AM - 10:30 AM',
    title: 'Opening Ceremony & Secretariat Welcome',
    desc: 'Opening address by school leadership and introduction of the Executive Board.',
    tag: 'Plenary',
  },
  {
    id: 'd1-3',
    day: 1,
    time: '10:30 AM - 01:00 PM',
    title: 'Committee Session I: Agenda Setting & General Debate',
    desc: 'Roll call, setting the primary agenda, and opening statements.',
    tag: 'Debate',
  },
  {
    id: 'd1-4',
    day: 1,
    time: '01:00 PM - 02:00 PM',
    title: 'Lunch & Informal Lobbying',
    desc: 'Lunch provided at the school cafeteria. Connect with fellow delegates.',
    tag: 'Meal',
  },
  {
    id: 'd1-5',
    day: 1,
    time: '02:00 PM - 04:30 PM',
    title: 'Committee Session II: Moderated Caucus',
    desc: 'Structured debate on working papers and sub-issues.',
    tag: 'Debate',
  },
  {
    id: 'd2-1',
    day: 2,
    time: '09:00 AM - 11:30 AM',
    title: 'Committee Session III: Working Papers & Bloc Debates',
    desc: 'Formation of draft resolution blocs and clause writing.',
    tag: 'Debate',
  },
  {
    id: 'd2-2',
    day: 2,
    time: '11:30 AM - 01:00 PM',
    title: 'Committee Session IV: Caucuses & Negotiations',
    desc: 'Active negotiations across blocs to finalize draft papers.',
    tag: 'Debate',
  },
  {
    id: 'd2-3',
    day: 2,
    time: '01:00 PM - 02:00 PM',
    title: 'Delegate Lunch',
    desc: 'Lunch and informal strategy discussions with committee peers.',
    tag: 'Meal',
  },
  {
    id: 'd2-4',
    day: 2,
    time: '02:00 PM - 04:30 PM',
    title: 'Committee Session V: Amendments & Review',
    desc: 'Reviewing proposed amendments to draft resolutions.',
    tag: 'Debate',
  },
  {
    id: 'd3-1',
    day: 3,
    time: '09:00 AM - 11:30 AM',
    title: 'Committee Session VI: Crisis Simulation',
    desc: 'Urgent crisis scenario introduced by the Executive Board.',
    tag: 'Crisis',
  },
  {
    id: 'd3-2',
    day: 3,
    time: '11:30 AM - 01:00 PM',
    title: 'Committee Session VII: Substantive Voting',
    desc: 'Formal roll-call voting on final draft resolutions.',
    tag: 'Voting',
  },
  {
    id: 'd3-3',
    day: 3,
    time: '01:00 PM - 02:00 PM',
    title: 'Delegate Lunch & Official Photos',
    desc: 'Lunch and committee photo session.',
    tag: 'Meal',
  },
  {
    id: 'd3-4',
    day: 3,
    time: '02:30 PM - 04:00 PM',
    title: 'Closing Plenary & Awards Ceremony',
    desc: 'Presentation of delegate awards and certificates.',
    tag: 'Awards',
  },
  {
    id: 'd3-5',
    day: 3,
    time: '04:30 PM - 07:30 PM',
    title: 'FMUN 2026 Closing Party',
    desc: 'Celebration featuring student-recommended party songs, snacks, and music.',
    tag: 'Social',
    highlight: true,
  },
];

export function EventsSection({ items }: { items?: ScheduleItemConfig[] }) {
  const [activeDay, setActiveDay] = useState<number>(1);

  const allItems = items && items.length > 0 ? items : DEFAULT_SCHEDULE;
  const currentItems = allItems.filter((item) => item.day === activeDay);

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'debate':
      case 'voting':
        return 'bg-sky-950/60 text-sky-300 border-sky-800/40';
      case 'crisis':
        return 'bg-rose-950/60 text-rose-300 border-rose-800/40';
      case 'social':
        return 'bg-purple-950/60 text-purple-300 border-purple-800/40';
      case 'awards':
        return 'bg-amber-950/60 text-amber-300 border-amber-800/40';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700/40';
    }
  };

  return (
    <section id="events" className="py-20 bg-[#000000] border-b border-[#1C1F26] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#38BDF8] mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Three-Day Conference Timeline</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Schedule & Events
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 max-w-xl">
              From morning opening gavels to the closing party, here is the full three-day schedule for our delegates.
            </p>
          </div>

          {/* Day Selector Tabs (3 Days) */}
          <div className="mt-6 md:mt-0 flex items-center p-1 rounded-full bg-[#0A0D14] border border-[#272E3B] self-start md:self-auto">
            <button
              onClick={() => setActiveDay(1)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeDay === 1
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Day 1
            </button>
            <button
              onClick={() => setActiveDay(2)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeDay === 2
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Day 2
            </button>
            <button
              onClick={() => setActiveDay(3)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeDay === 3
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Day 3
            </button>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-3.5">
          {currentItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`p-5 rounded-2xl border transition-all duration-200 ${
                item.highlight
                  ? 'bg-gradient-to-r from-[#120D1D] to-[#0A0D14] border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.15)]'
                  : 'bg-[#0A0D14] border-[#1C2331] hover:border-[#38BDF8]/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1.5 text-xs font-mono font-medium text-[#38BDF8]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.time}</span>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${getTagColor(
                      item.tag
                    )}`}
                  >
                    {item.tag}
                  </span>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white mb-1">{item.title}</h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
