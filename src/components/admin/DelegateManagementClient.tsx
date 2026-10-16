'use client';

import React, { useState } from 'react';
import { Search, Download, Users, CheckCircle2, Clock, Eye, AlertCircle } from 'lucide-react';
import { formatNPR } from '@/lib/utils';

interface DelegateWithDetails {
  id: string;
  reference_code: string;
  full_name: string;
  email: string;
  phone: string;
  institution: string;
  academic_level: string | null;
  status: string;
  committeeName: string;
  committeeAcronym: string;
  countryName: string;
  countryFlag: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentAmount: number;
  created_at: string;
}

export function DelegateManagementClient({
  initialDelegates,
}: {
  initialDelegates: DelegateWithDetails[];
}) {
  const [delegates] = useState<DelegateWithDetails[]>(initialDelegates);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDelegate, setSelectedDelegate] = useState<DelegateWithDetails | null>(null);

  const filtered = delegates.filter((d) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      d.full_name.toLowerCase().includes(query) ||
      d.reference_code.toLowerCase().includes(query) ||
      d.email.toLowerCase().includes(query) ||
      d.institution.toLowerCase().includes(query) ||
      d.countryName.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F304B] pb-5">
        <div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#F6F2E9]">
            Delegate Roster & Management
          </h1>
          <p className="text-xs text-[#8B95A5] mt-1">
            Registered participants across all Fluorescent MUN simulation committees ({delegates.length} total)
          </p>
        </div>

        <a
          href="/api/admin/export/delegates"
          download
          className="inline-flex items-center space-x-2 px-4 py-2 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export Roster CSV</span>
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-[#0B1728] border border-[#1F304B]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8B95A5] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ref, email, country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          {['all', 'confirmed', 'pending'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded uppercase tracking-wider text-[11px] font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-[#C9A96E] text-[#07111F] font-bold'
                  : 'bg-[#101E33] text-[#8B95A5] hover:text-[#F6F2E9]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Delegates Table */}
      <div className="rounded-xl bg-[#0B1728] border border-[#1F304B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101E33] text-[#8B95A5] uppercase tracking-wider font-semibold border-b border-[#1F304B]">
              <tr>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Delegate Name</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Committee</th>
                <th className="py-3 px-4">Allocated Country</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F304B]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#8B95A5]">
                    No delegates found matching current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-[#101E33]/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#C9A96E]">
                      {d.reference_code}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#F6F2E9]">{d.full_name}</div>
                      <div className="text-[11px] text-[#8B95A5]">{d.email}</div>
                    </td>
                    <td className="py-3 px-4 text-[#8B95A5]">{d.institution}</td>
                    <td className="py-3 px-4 font-medium text-[#F6F2E9]">
                      {d.committeeAcronym}
                    </td>
                    <td className="py-3 px-4">
                      <span className="mr-1.5">{d.countryFlag}</span>
                      <span>{d.countryName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          d.status === 'confirmed'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#F6F2E9]">{formatNPR(d.paymentAmount)}</span>
                      <div className="text-[10px] text-[#8B95A5] capitalize">
                        {d.paymentMethod} ({d.paymentStatus})
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedDelegate(d)}
                        className="p-1.5 rounded hover:bg-[#15253F] text-[#8B95A5] hover:text-[#C9A96E] transition-colors"
                        title="View Delegate Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delegate Detail Modal */}
      {selectedDelegate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-xl bg-[#0B1728] border border-[#C9A96E]/40 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F304B] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#8B95A5]">
                  Delegate Credential Record
                </span>
                <h3 className="font-serif-heading text-xl font-bold text-[#F6F2E9]">
                  {selectedDelegate.full_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDelegate(null)}
                className="text-xs text-[#8B95A5] hover:text-[#F6F2E9] uppercase tracking-wider"
              >
                Close ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#8B95A5]">Reference:</span>
                <p className="font-mono text-[#C9A96E] font-bold">{selectedDelegate.reference_code}</p>
              </div>
              <div>
                <span className="text-[#8B95A5]">Phone:</span>
                <p className="text-[#F6F2E9]">{selectedDelegate.phone}</p>
              </div>
              <div>
                <span className="text-[#8B95A5]">Email:</span>
                <p className="text-[#F6F2E9]">{selectedDelegate.email}</p>
              </div>
              <div>
                <span className="text-[#8B95A5]">Institution:</span>
                <p className="text-[#F6F2E9]">{selectedDelegate.institution}</p>
              </div>
              <div>
                <span className="text-[#8B95A5]">Committee:</span>
                <p className="text-[#F6F2E9] font-medium">{selectedDelegate.committeeName}</p>
              </div>
              <div>
                <span className="text-[#8B95A5]">Allocated Country:</span>
                <p className="text-[#F6F2E9] font-medium">
                  {selectedDelegate.countryFlag} {selectedDelegate.countryName}
                </p>
              </div>
              <div>
                <span className="text-[#8B95A5]">Payment Status:</span>
                <p className="text-[#C9A96E] font-bold uppercase">{selectedDelegate.paymentStatus}</p>
              </div>
              <div>
                <span className="text-[#8B95A5]">Registered At:</span>
                <p className="text-[#8B95A5]">
                  {new Date(selectedDelegate.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDelegate(null)}
                className="px-4 py-2 rounded bg-[#101E33] hover:bg-[#15253F] text-[#F6F2E9] text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
