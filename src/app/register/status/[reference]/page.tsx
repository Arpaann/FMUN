import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, Clock, Globe, Shield, User, Building, CreditCard, Sparkles, AlertCircle } from 'lucide-react';
import { formatDiplomaticDate, formatNPR } from '@/lib/utils';

export default async function RegistrationStatusPage(props: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await props.params;
  const settings = await db.getSettings();
  const record = await db.getDelegateByReference(reference);

  if (!record) {
    return (
      <div className="min-h-screen flex flex-col bg-[#07111F] text-[#F6F2E9]">
        <Navbar registrationOpen={settings.registration_open} />
        <main className="flex-1 py-20 flex items-center justify-center">
          <div className="max-w-md mx-auto p-8 rounded-xl bg-[#0B1728] border border-[#1F304B] text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h1 className="font-serif-heading text-2xl font-bold text-[#F6F2E9]">
              Registration Not Found
            </h1>
            <p className="text-xs text-[#8B95A5]">
              No delegate record was found matching reference code: <strong className="text-[#C9A96E]">{reference}</strong>.
            </p>
            <Link
              href="/register"
              className="inline-block px-4 py-2 rounded bg-[#C9A96E] text-[#07111F] text-xs font-semibold uppercase tracking-wider"
            >
              Go to Delegate Portal
            </Link>
          </div>
        </main>
        <Footer contactEmail={settings.contact_email} />
      </div>
    );
  }

  const { delegate, committee, country, payment } = record;
  const isConfirmed = delegate.status === 'confirmed' || payment?.status === 'verified';

  return (
    <div className="min-h-screen flex flex-col bg-[#07111F] text-[#F6F2E9]">
      <Navbar registrationOpen={settings.registration_open} />

      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
              Official Delegate Credential Pass
            </span>
            <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#F6F2E9]">
              Registration Status & Sovereign Pass
            </h1>
          </div>

          {/* Diplomatic Pass Card */}
          <div className="p-8 rounded-2xl bg-[#0B1728] border-2 border-[#C9A96E]/40 shadow-2xl space-y-8">
            {/* Top Bar with reference & status badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F304B] pb-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#8B95A5]">
                  Reference Code
                </span>
                <div className="font-mono text-2xl font-bold text-[#C9A96E] tracking-wider">
                  {delegate.reference_code}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    isConfirmed
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {isConfirmed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Registration Confirmed</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>Payment Verification Pending</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Delegate & Allocation Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[#8B95A5] uppercase tracking-wider text-[10px] font-semibold">
                    Delegate Name
                  </span>
                  <p className="font-serif-heading text-xl font-bold text-[#F6F2E9]">
                    {delegate.full_name}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[#8B95A5] uppercase tracking-wider text-[10px] font-semibold">
                    Institution / School
                  </span>
                  <p className="text-[#F6F2E9] font-medium">{delegate.institution}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[#8B95A5] uppercase tracking-wider text-[10px] font-semibold">
                    Academic Level
                  </span>
                  <p className="text-[#F6F2E9] font-medium">{delegate.academic_level || 'General Delegate'}</p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#101E33] border border-[#1F304B] space-y-4">
                <div className="space-y-1">
                  <span className="text-[#C9A96E] uppercase tracking-wider text-[10px] font-bold">
                    Assigned Sovereign State
                  </span>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-3xl">{country?.flag_emoji || '🌐'}</span>
                    <div>
                      <h3 className="font-serif-heading text-lg font-bold text-[#F6F2E9]">
                        {country?.display_name || 'Pending Allocation'}
                      </h3>
                      <span className="text-xs text-[#8B95A5] font-mono">{country?.code}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1F304B] space-y-1">
                  <span className="text-[#8B95A5] uppercase tracking-wider text-[10px]">
                    Assigned Chamber
                  </span>
                  <p className="text-[#F6F2E9] font-bold">
                    {committee?.acronym} — {committee?.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Record Bar */}
            <div className="p-4 rounded-lg bg-[#07111F] border border-[#1F304B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[#8B95A5]">Payment Status: </span>
                <span className="font-semibold uppercase text-[#F6F2E9]">
                  {payment?.status || 'unrecorded'} ({payment?.payment_method})
                </span>
              </div>
              <div>
                <span className="text-[#8B95A5]">Amount: </span>
                <span className="font-bold text-[#C9A96E]">{formatNPR(payment?.amount)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/after-party/submit"
                className="w-full sm:w-auto text-center px-5 py-2.5 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-semibold text-xs uppercase tracking-wider transition-colors"
              >
                Recommend After-Party Track →
              </Link>

              <Link
                href="/country-allocation"
                className="w-full sm:w-auto text-center px-4 py-2.5 rounded bg-[#101E33] hover:bg-[#15253F] text-[#F6F2E9] text-xs uppercase tracking-wider border border-[#1F304B]"
              >
                Back to Country Matrix
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer
        contactEmail={settings.contact_email}
        contactPhone={settings.contact_phone}
        address={settings.address}
      />
    </div>
  );
}
