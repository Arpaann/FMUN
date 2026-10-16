import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { Users, Globe, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

export default async function CommitteesPage() {
  const settings = await db.getSettings();
  const committees = await db.getCommittees();

  return (
    <div className="min-h-screen flex flex-col bg-[#07111F] text-[#F6F2E9]">
      <Navbar registrationOpen={settings.registration_open} />

      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
              Deliberative Assemblies
            </span>
            <h1 className="font-serif-heading text-4xl sm:text-5xl font-bold text-[#F6F2E9]">
              Committees & Simulation Councils
            </h1>
            <p className="text-sm text-[#8B95A5] leading-relaxed">
              Explore the deliberative bodies convened at FMUN 2026. Each committee features specialized agendas,
              distinct parliamentary rules, and designated delegate capacities.
            </p>
          </div>

          {/* Committee List */}
          <div className="space-y-8">
            {committees.map(async (comm) => {
              const countryAllocations = await db.getCommitteeCountries(comm.id);
              const availableCountries = countryAllocations.filter((c) => c.status === 'available').length;

              return (
                <div
                  key={comm.id}
                  className="p-8 rounded-xl bg-[#0B1728] border border-[#1F304B] hover:border-[#C9A96E]/40 transition-all space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F304B] pb-4">
                    <div>
                      <span className="font-serif-heading text-3xl font-bold text-[#C9A96E]">
                        {comm.acronym}
                      </span>
                      <h2 className="font-serif-heading text-2xl font-bold text-[#F6F2E9] mt-1">
                        {comm.name}
                      </h2>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full font-medium ${
                          comm.is_open
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-950/80 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {comm.is_open ? 'Open for Allocation' : 'Closed'}
                      </span>
                      <span className="text-xs text-[#8B95A5] bg-[#101E33] px-3 py-1 rounded border border-[#1F304B]">
                        Capacity: {comm.capacity}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h3 className="font-semibold text-xs uppercase tracking-wider text-[#C9A96E]">
                          Mandate & Overview
                        </h3>
                        <p className="text-[#8B95A5] leading-relaxed mt-1.5">
                          {comm.description ||
                            'Committee mandate overview under publication by the Executive Board.'}
                        </p>
                      </div>

                      {comm.agenda && (
                        <div>
                          <h3 className="font-semibold text-xs uppercase tracking-wider text-[#C9A96E]">
                            Official Agenda
                          </h3>
                          <p className="text-[#F6F2E9] font-medium leading-relaxed mt-1.5">
                            {comm.agenda}
                          </p>
                        </div>
                      )}

                      {comm.eligibility_requirements && (
                        <div>
                          <h3 className="font-semibold text-xs uppercase tracking-wider text-[#8B95A5]">
                            Delegate Eligibility
                          </h3>
                          <p className="text-[#8B95A5] mt-1">{comm.eligibility_requirements}</p>
                        </div>
                      )}
                    </div>

                    <div className="p-5 rounded-lg bg-[#101E33] border border-[#1F304B] flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-[#C9A96E]">
                          <Globe className="w-4 h-4" />
                          <span className="font-semibold text-xs uppercase tracking-wider">
                            Country Pool
                          </span>
                        </div>
                        <div className="text-2xl font-serif-heading font-bold text-[#F6F2E9]">
                          {availableCountries}{' '}
                          <span className="text-xs font-sans text-[#8B95A5] font-normal">
                            / {countryAllocations.length} available
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-col space-y-2">
                        <Link
                          href={`/country-allocation?committee=${comm.id}`}
                          className="w-full text-center py-2 rounded bg-[#07111F] hover:bg-[#15253F] text-[#C9A96E] border border-[#C9A96E]/30 text-xs font-medium uppercase tracking-wider transition-colors"
                        >
                          View Country Matrix
                        </Link>
                        <Link
                          href="/register"
                          className="w-full text-center py-2 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] text-xs font-semibold uppercase tracking-wider transition-colors"
                        >
                          Select this Committee
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
