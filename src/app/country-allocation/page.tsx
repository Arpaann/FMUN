import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { CountryAllocationMatrix } from '@/components/allocation/CountryAllocationMatrix';

export default async function CountryAllocationPage() {
  const settings = await db.getSettings();
  const committees = await db.getCommittees();

  // Load committee country mappings for all committees
  const committeeAllocations: Record<
    string,
    { country: { id: string; name: string; display_name: string; code: string; flag_emoji: string | null }; status: 'available' | 'held' | 'assigned' }[]
  > = {};

  for (const c of committees) {
    committeeAllocations[c.id] = await db.getCommitteeCountries(c.id);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#07111F] text-[#F6F2E9]">
      <Navbar registrationOpen={settings.registration_open} />

      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
              Authoritative Database Records
            </span>
            <h1 className="font-serif-heading text-4xl sm:text-5xl font-bold text-[#F6F2E9]">
              Live Country Allocation Matrix
            </h1>
            <p className="text-sm text-[#8B95A5] leading-relaxed">
              Explore sovereign state rosters across all committees. All availability states are verified
              server-side in real time. Country allocations are locked upon successful delegate registration.
            </p>
          </div>

          <CountryAllocationMatrix
            committees={committees}
            committeeAllocations={committeeAllocations}
          />
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
