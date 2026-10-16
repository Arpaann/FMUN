'use client';

import React, { useState } from 'react';
import { Search, Download, CreditCard, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';
import { formatNPR } from '@/lib/utils';

interface PaymentItem {
  id: string;
  reference_code: string;
  full_name: string;
  email: string;
  paymentId?: string;
  paymentAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionReference?: string | null;
  receiptFilePath?: string | null;
  created_at: string;
}

export function FinanceManagementClient({
  initialPayments,
}: {
  initialPayments: PaymentItem[];
}) {
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleVerify = async (paymentId: string, status: 'verified' | 'rejected', reason?: string) => {
    setProcessingId(paymentId);
    try {
      const res = await fetch('/api/admin/finance/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, status, rejectionReason: reason || null }),
      });
      const data = await res.json();
      if (data.success) {
        setPayments((prev) =>
          prev.map((p) => (p.paymentId === paymentId ? { ...p, paymentStatus: status } : p))
        );
      } else {
        alert(data.message || 'Action failed');
      }
    } catch {
      alert('Network error while processing verification');
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = payments.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.full_name.toLowerCase().includes(q) ||
      p.reference_code.toLowerCase().includes(q) ||
      (p.transactionReference && p.transactionReference.toLowerCase().includes(q));

    const matchesStatus = filterStatus === 'all' || p.paymentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalVerified = payments
    .filter((p) => p.paymentStatus === 'verified')
    .reduce((sum, p) => sum + p.paymentAmount, 0);

  const pendingCount = payments.filter((p) => p.paymentStatus === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F304B] pb-5">
        <div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#F6F2E9]">
            Finance & Payment Audit Console
          </h1>
          <p className="text-xs text-[#8B95A5] mt-1">
            Verified Total: <strong className="text-[#C9A96E]">{formatNPR(totalVerified)}</strong> ({pendingCount} pending verification)
          </p>
        </div>

        <a
          href="/api/admin/export/finance"
          download
          className="inline-flex items-center space-x-2 px-4 py-2 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export Financial CSV</span>
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-[#0B1728] border border-[#1F304B]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8B95A5] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference or transaction code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          {['all', 'pending', 'verified', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded uppercase tracking-wider text-[11px] font-medium transition-colors ${
                filterStatus === s
                  ? 'bg-[#C9A96E] text-[#07111F] font-bold'
                  : 'bg-[#101E33] text-[#8B95A5] hover:text-[#F6F2E9]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-xl bg-[#0B1728] border border-[#1F304B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101E33] text-[#8B95A5] uppercase tracking-wider font-semibold border-b border-[#1F304B]">
              <tr>
                <th className="py-3 px-4">Delegate</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Txn Code</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F304B]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8B95A5]">
                    No payment submissions found matching current criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isPending = p.paymentStatus === 'pending';
                  const isVerified = p.paymentStatus === 'verified';
                  const isProcessing = processingId === p.paymentId;

                  return (
                    <tr key={p.id} className="hover:bg-[#101E33]/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#F6F2E9]">{p.full_name}</div>
                        <div className="text-[11px] text-[#8B95A5]">{p.email}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#C9A96E]">{p.reference_code}</td>
                      <td className="py-3 px-4 uppercase text-[#8B95A5] font-semibold">{p.paymentMethod}</td>
                      <td className="py-3 px-4 font-mono text-xs text-[#8B95A5]">
                        {p.transactionReference || 'N/A (Physical/Pending)'}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#F6F2E9]">
                        {formatNPR(p.paymentAmount)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            isVerified
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                              : isPending
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                              : 'bg-red-950/80 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {p.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {p.paymentId && isPending ? (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              disabled={isProcessing}
                              onClick={() => handleVerify(p.paymentId!, 'verified')}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              disabled={isProcessing}
                              onClick={() => {
                                const reason = prompt('Please enter the reason for rejection:');
                                if (reason !== null) {
                                  handleVerify(p.paymentId!, 'rejected', reason);
                                }
                              }}
                              className="px-2.5 py-1 rounded bg-red-800 hover:bg-red-700 text-white text-[11px] font-semibold transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#8B95A5]">
                            {isVerified ? 'Verified ✓' : 'Settled'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
