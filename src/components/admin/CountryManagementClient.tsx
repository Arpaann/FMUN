'use client';

import React, { useState } from 'react';
import { Globe, Search, Shield, CheckCircle2, Clock, Users } from 'lucide-react';
import { Committee } from '@/types/database';

interface CountryItem {
  id: string;
  name: string;
  display_name: string;
  code: string;
  flag_emoji: string | null;
}

interface CountryManagementClientProps {
  committees: Committee[];
  initialAllocations: Record<string, { country: CountryItem; status: 'available' | 'held' | 'assigned' }[]>;
}

export function CountryManagementClient({
  committees,
  initialAllocations,
}: CountryManagementClientProps) {
  const [selectedCommitteeId, setSelectedCommitteeId] = useState(committees[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const activeRoster = initialAllocations[selectedCommitteeId] || [];

  const filtered = activeRoster.filter(({ country }) =>
    country.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableCount = activeRoster.filter((c) => c.status === 'available').length;
  const heldCount = activeRoster.filter((c) => c.status === 'held').length;
  const assignedCount = activeRoster.filter((c) => c.status === 'assigned').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F304B] pb-5">
        <div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#F6F2E9]">
            Country Allocation & Roster Console
          </h1>
          <p className="text-xs text-[#8B95A5] mt-1">
            Authoritative allocation matrix ensuring database-level uniqueness per committee.
          </p>
        </div>
      </div>

      {/* Committee Selector */}
      <div className="flex flex-wrap gap-2 border-b border-[#1F304B] pb-3">
        {committees.map((comm) => {
          const isActive = selectedCommitteeId === comm.id;
          return (
            <button
              key={comm.id}
              onClick={() => setSelectedCommitteeId(comm.id)}
              className={`px-4 py-2 rounded-t-md text-xs font-semibold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-[#101E33] text-[#C9A96E] border-t-2 border-[#C9A96E]'
                  : 'text-[#8B95A5] hover:text-[#F6F2E9] hover:bg-[#101E33]/40'
              }`}
            >
              {comm.acronym}
            </button>
          );
        })}
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[#0B1728] border border-[#1F304B] flex items-center justify-between">
          <span className="text-xs text-[#8B95A5]">Available Countries</span>
          <span className="text-base font-bold text-emerald-400">{availableCount}</span>
        </div>
        <div className="p-4 rounded-lg bg-[#0B1728] border border-[#1F304B] flex items-center justify-between">
          <span className="text-xs text-[#8B95A5]">Active 15-Min Holds</span>
          <span className="text-base font-bold text-amber-400">{heldCount}</span>
        </div>
        <div className="p-4 rounded-lg bg-[#0B1728] border border-[#1F304B] flex items-center justify-between">
          <span className="text-xs text-[#8B95A5]">Confirmed Assigned</span>
          <span className="text-base font-bold text-[#F6F2E9]">{assignedCount}</span>
        </div>
      </div>

      {/* Roster Grid */}
      <div className="p-6 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-heading text-lg font-bold text-[#F6F2E9]">
            Allocated State Pool
          </h3>
          <input
            type="text"
            placeholder="Search state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E] w-48"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto pr-2">
          {filtered.map(({ country, status }) => {
            const isAvailable = status === 'available';
            const isHeld = status === 'held';

            return (
              <div
                key={country.id}
                className={`p-3 rounded border text-xs flex flex-col justify-between space-y-2 ${
                  isAvailable
                    ? 'bg-[#101E33] border-[#1F304B]'
                    : isHeld
                    ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                    : 'bg-[#07111F] border-[#1F304B]/30 text-[#8B95A5]'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{country.flag_emoji || '🌐'}</span>
                  <div className="min-w-0">
                    <p className="font-medium text-[#F6F2E9] truncate">{country.display_name}</p>
                    <span className="text-[10px] font-mono text-[#8B95A5]">{country.code}</span>
                  </div>
                </div>

                <div className="pt-1 border-t border-[#1F304B]/40 flex items-center justify-between text-[10px] uppercase tracking-wider font-semibold">
                  <span
                    className={
                      isAvailable ? 'text-emerald-400' : isHeld ? 'text-amber-400' : 'text-[#8B95A5]'
                    }
                  >
                    {status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
