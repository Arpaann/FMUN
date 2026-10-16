'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Committee } from '@/types/database';

export function CommitteesSection({ committees }: { committees: Committee[] }) {
  return (
    <section className="py-20 bg-[#050D17] border-b border-[#1F304B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
              Deliberative Chambers
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#F6F2E9]">
              Committees & Agendas
            </h2>
            <p className="text-sm text-[#8B95A5] max-w-xl">
              Authentic simulation of United Nations organs, regional security bodies, and specialized agencies.
            </p>
          </div>
          <Link
            href="/committees"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#C9A96E] hover:text-[#DFCA9B] font-semibold group"
          >
            <span>Explore All Committees</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {committees.length === 0 ? (
          <div className="p-12 text-center rounded-lg bg-[#0B1728] border border-[#1F304B]">
            <p className="text-[#8B95A5] text-sm">
              Committees are currently being finalized by the Secretariat. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {committees.map((comm) => (
              <div
                key={comm.id}
                className="group relative p-6 rounded-lg bg-[#0B1728] border border-[#1F304B] hover:border-[#C9A96E]/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-serif-heading font-bold text-2xl text-[#C9A96E]">
                      {comm.acronym}
                    </span>
                    <span
                      className={`text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full font-medium ${
                        comm.is_open
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-950/80 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {comm.is_open ? 'Open for Selection' : 'Closed'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif-heading text-lg font-bold text-[#F6F2E9] group-hover:text-[#C9A96E] transition-colors">
                      {comm.name}
                    </h3>
                    <p className="text-xs text-[#8B95A5] mt-2 line-clamp-3 leading-relaxed">
                      {comm.description || 'Agenda guide under formulation by the Executive Board.'}
                    </p>
                  </div>

                  {comm.agenda && (
                    <div className="pt-2 text-xs">
                      <span className="text-[#C9A96E] font-medium">Agenda: </span>
                      <span className="text-[#F6F2E9]">{comm.agenda}</span>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-[#1F304B]/60 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-[#8B95A5]">
                    <Users className="w-3.5 h-3.5 text-[#C9A96E]" />
                    <span>Capacity: {comm.capacity} delegates</span>
                  </div>
                  <Link
                    href={`/country-allocation?committee=${comm.id}`}
                    className="text-[#C9A96E] hover:underline font-medium text-xs"
                  >
                    Country Roster →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
