import { db } from '@/lib/db';
import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Globe,
  Music,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { formatNPR } from '@/lib/utils';

export default async function AdminOverviewPage() {
  const metrics = await db.getAdminOverviewMetrics();
  const settings = await db.getSettings();
  const auditLogs = await db.getAuditLogs();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F304B] pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
            Live Secretariat Console
          </span>
          <h1 className="font-serif-heading text-3xl font-bold text-[#F6F2E9] mt-1">
            FMUN 2026 Executive Overview
          </h1>
          <p className="text-xs text-[#8B95A5] mt-1">
            Real-time telemetry across registrations, sovereign allocations, payment verification, and social submissions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/settings"
            className="px-4 py-2 rounded bg-[#101E33] hover:bg-[#15253F] text-[#F6F2E9] text-xs font-medium border border-[#1F304B] transition-colors"
          >
            Configure Settings
          </Link>
          <Link
            href="/admin/delegates"
            className="px-4 py-2 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Review Delegates
          </Link>
        </div>
      </div>

      {/* Live Database Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Registrations */}
        <div className="p-5 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-2">
          <div className="flex items-center justify-between text-[#8B95A5]">
            <span className="text-xs font-medium uppercase tracking-wider">Total Delegates</span>
            <Users className="w-4 h-4 text-[#C9A96E]" />
          </div>
          <div className="text-3xl font-serif-heading font-bold text-[#F6F2E9]">
            {metrics.totalRegistrations}
          </div>
          <p className="text-[11px] text-[#8B95A5]">Registered via delegation portal</p>
        </div>

        {/* Metric 2: Confirmed Delegates */}
        <div className="p-5 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-2">
          <div className="flex items-center justify-between text-[#8B95A5]">
            <span className="text-xs font-medium uppercase tracking-wider">Confirmed Seats</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-serif-heading font-bold text-emerald-400">
            {metrics.confirmedDelegates}
          </div>
          <p className="text-[11px] text-[#8B95A5]">{metrics.pendingRegistrations} pending approval</p>
        </div>

        {/* Metric 3: Verified Revenue */}
        <div className="p-5 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-2">
          <div className="flex items-center justify-between text-[#8B95A5]">
            <span className="text-xs font-medium uppercase tracking-wider">Verified Revenue</span>
            <CreditCard className="w-4 h-4 text-[#C9A96E]" />
          </div>
          <div className="text-3xl font-serif-heading font-bold text-[#C9A96E]">
            {formatNPR(metrics.verifiedRevenue)}
          </div>
          <p className="text-[11px] text-amber-400">
            {metrics.paymentsAwaitingVerification} payments awaiting verification
          </p>
        </div>

        {/* Metric 4: Sovereign Allocations */}
        <div className="p-5 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-2">
          <div className="flex items-center justify-between text-[#8B95A5]">
            <span className="text-xs font-medium uppercase tracking-wider">Country Allocations</span>
            <Globe className="w-4 h-4 text-[#C9A96E]" />
          </div>
          <div className="text-3xl font-serif-heading font-bold text-[#F6F2E9]">
            {metrics.assignedCountries}
          </div>
          <p className="text-[11px] text-[#8B95A5]">
            {metrics.heldCountries} currently under 15-min hold
          </p>
        </div>
      </div>

      {/* Operational Highlights & Action Gates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quick Action Console */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-serif-heading text-lg font-bold text-[#F6F2E9]">
            Management Portals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/delegates"
              className="p-5 rounded-lg bg-[#0B1728] border border-[#1F304B] hover:border-[#C9A96E]/50 transition-colors space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <Users className="w-5 h-5 text-[#C9A96E]" />
                <ArrowRight className="w-4 h-4 text-[#8B95A5] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-semibold text-sm text-[#F6F2E9]">Delegate Roster & CSV Export</h3>
              <p className="text-xs text-[#8B95A5]">
                Search, filter, view credentials, and export comprehensive delegate records.
              </p>
            </Link>

            <Link
              href="/admin/finance"
              className="p-5 rounded-lg bg-[#0B1728] border border-[#1F304B] hover:border-[#C9A96E]/50 transition-colors space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <CreditCard className="w-5 h-5 text-[#C9A96E]" />
                <ArrowRight className="w-4 h-4 text-[#8B95A5] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-semibold text-sm text-[#F6F2E9]">Finance & Payment Verification</h3>
              <p className="text-xs text-[#8B95A5]">
                Review manual bank vouchers, eSewa and Khalti transactions, and approve payments.
              </p>
            </Link>

            <Link
              href="/admin/countries"
              className="p-5 rounded-lg bg-[#0B1728] border border-[#1F304B] hover:border-[#C9A96E]/50 transition-colors space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <Globe className="w-5 h-5 text-[#C9A96E]" />
                <ArrowRight className="w-4 h-4 text-[#8B95A5] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-semibold text-sm text-[#F6F2E9]">Country & Committee Matrix</h3>
              <p className="text-xs text-[#8B95A5]">
                Manage committee quotas, release expired holds, and manually reassign sovereign seats.
              </p>
            </Link>

            <Link
              href="/admin/dj"
              className="p-5 rounded-lg bg-[#0B1728] border border-[#1F304B] hover:border-[#C9A96E]/50 transition-colors space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <Music className="w-5 h-5 text-[#C9A96E]" />
                <ArrowRight className="w-4 h-4 text-[#8B95A5] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-semibold text-sm text-[#F6F2E9]">DJ Song Moderation Portal</h3>
              <p className="text-xs text-[#8B95A5]">
                {metrics.pendingSongs} pending tracks. Approve or reject recommendations and export playlist.
              </p>
            </Link>
          </div>
        </div>

        {/* Right Col: Recent Audit Activity */}
        <div className="p-6 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-4">
          <h2 className="font-serif-heading text-lg font-bold text-[#F6F2E9]">
            Recent Audit Trail
          </h2>
          {auditLogs.length === 0 ? (
            <p className="text-xs text-[#8B95A5]">No actions logged yet.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {auditLogs.slice(0, 8).map((log) => (
                <div key={log.id} className="p-3 rounded bg-[#101E33] border border-[#1F304B] space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-semibold text-[#C9A96E]">{log.action}</span>
                    <span className="text-[#8B95A5]">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8B95A5] truncate">
                    Entity: {log.entity_type} {log.entity_id ? `(${log.entity_id})` : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
