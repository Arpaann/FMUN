'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Globe, Filter, Sparkles } from 'lucide-react';
import { Committee, Country } from '@/types/database';

interface CountryAllocationMatrixProps {
  committees: Committee[];
  committeeAllocations: Record<
    string,
    { country: { id: string; name: string; display_name: string; code: string; flag_emoji: string | null }; status: 'available' | 'held' | 'assigned' }[]
  >;
}

export function CountryAllocationMatrix({
  committees,
  committeeAllocations,
}: CountryAllocationMatrixProps) {
  const [selectedCommitteeId, setSelectedCommitteeId] = useState(committees[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'held' | 'assigned'>('all');

  const activeRoster = committeeAllocations[selectedCommitteeId] || [];

  const filteredRoster = activeRoster.filter(({ country, status }) => {
    const matchesSearch =
      country.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const availableCount = activeRoster.filter((c) => c.status === 'available').length;
  const heldCount = activeRoster.filter((c) => c.status === 'held').length;
  const assignedCount = activeRoster.filter((c) => c.status === 'assigned').length;

  return (
    <div className="space-y-8">
      {/* Committee Tab Bar */}
      <div className="flex flex-wrap gap-2 border-b border-[#1F304B] pb-4">
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
              {comm.acronym} — {comm.name}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-[#0B1728] border border-[#1F304B]">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8B95A5] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search country or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] placeholder-[#8B95A5] focus:outline-none focus:border-[#C9A96E]"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded transition-colors ${
              statusFilter === 'all'
                ? 'bg-[#C9A96E] text-[#07111F] font-semibold'
                : 'bg-[#101E33] text-[#8B95A5] hover:text-[#F6F2E9]'
            }`}
          >
            All ({activeRoster.length})
          </button>
          <button
            onClick={() => setStatusFilter('available')}
            className={`px-3 py-1.5 rounded transition-colors ${
              statusFilter === 'available'
                ? 'bg-emerald-500 text-[#07111F] font-semibold'
                : 'bg-[#101E33] text-emerald-400 hover:text-emerald-300'
            }`}
          >
            Available ({availableCount})
          </button>
          <button
            onClick={() => setStatusFilter('held')}
            className={`px-3 py-1.5 rounded transition-colors ${
              statusFilter === 'held'
                ? 'bg-amber-500 text-[#07111F] font-semibold'
                : 'bg-[#101E33] text-amber-400 hover:text-amber-300'
            }`}
          >
            Held ({heldCount})
          </button>
          <button
            onClick={() => setStatusFilter('assigned')}
            className={`px-3 py-1.5 rounded transition-colors ${
              statusFilter === 'assigned'
                ? 'bg-[#8B95A5] text-[#07111F] font-semibold'
                : 'bg-[#101E33] text-[#8B95A5] hover:text-[#F6F2E9]'
            }`}
          >
            Assigned ({assignedCount})
          </button>
        </div>
      </div>

      {/* Sovereign Matrix Grid */}
      {filteredRoster.length === 0 ? (
        <div className="p-12 text-center rounded-lg bg-[#0B1728] border border-[#1F304B]">
          <p className="text-sm text-[#8B95A5]">No countries match the selected search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredRoster.map(({ country, status }) => {
            const isAvailable = status === 'available';
            const isHeld = status === 'held';

            return (
              <div
                key={country.id}
                className={`p-4 rounded-lg border transition-all flex flex-col justify-between space-y-3 ${
                  isAvailable
                    ? 'bg-[#0B1728] border-[#1F304B] hover:border-[#C9A96E]/50'
                    : isHeld
                    ? 'bg-[#0B1728] border-amber-500/30'
                    : 'bg-[#07111F] border-[#1F304B]/40 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-2xl">{country.flag_emoji || '🌐'}</span>
                    <div>
                      <h4 className="font-serif-heading font-medium text-sm text-[#F6F2E9]">
                        {country.display_name}
                      </h4>
                      <span className="text-[10px] font-mono text-[#8B95A5]">{country.code}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isAvailable
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                        : isHeld
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                        : 'bg-[#101E33] text-[#8B95A5] border border-[#1F304B]'
                    }`}
                  >
                    {isAvailable ? 'Available' : isHeld ? 'Held' : 'Assigned'}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#1F304B]/60 flex items-center justify-between text-xs">
                  {isAvailable ? (
                    <Link
                      href="/register"
                      className="text-[#C9A96E] hover:underline font-semibold text-[11px] uppercase tracking-wider inline-flex items-center space-x-1"
                    >
                      <span>Choose in Registration →</span>
                    </Link>
                  ) : (
                    <span className="text-[11px] text-[#8B95A5]">
                      {isHeld ? 'Under 15-min reservation hold' : 'Confirmed sovereign allocation'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
