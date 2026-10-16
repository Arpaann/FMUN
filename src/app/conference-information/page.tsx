import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Calendar, MapPin, CreditCard, BookOpen, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { formatDiplomaticDate, formatNPR } from '@/lib/utils';

export default async function ConferenceInformationPage() {
  const settings = await db.getSettings();

  return (
    <div className="min-h-screen flex flex-col bg-[#07111F] text-[#F6F2E9]">
      <Navbar registrationOpen={settings.registration_open} />

      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
              Diplomatic Protocols & Operations
            </span>
            <h1 className="font-serif-heading text-4xl sm:text-5xl font-bold text-[#F6F2E9]">
              Conference Information & Logistics
            </h1>
            <p className="text-sm text-[#8B95A5] leading-relaxed">
              Official parameters governing delegates, faculty advisors, dress code, parliamentary procedure, and
              the academic schedule for FMUN 2026.
            </p>
          </div>

          {/* Operational Matrix Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-3">
              <Calendar className="w-6 h-6 text-[#C9A96E]" />
              <h3 className="font-serif-heading text-lg font-bold text-[#F6F2E9]">Summit Schedule</h3>
              <p className="text-xs text-[#8B95A5] leading-relaxed">
                {settings.start_date
                  ? `${formatDiplomaticDate(settings.start_date)} to ${formatDiplomaticDate(settings.end_date)}`
                  : 'Official schedule under formulation by the Secretariat. Coming soon.'}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-3">
              <MapPin className="w-6 h-6 text-[#C9A96E]" />
              <h3 className="font-serif-heading text-lg font-bold text-[#F6F2E9]">Official Venue</h3>
              <p className="text-xs text-[#8B95A5] leading-relaxed">
                {settings.venue || 'Fluorescent Secondary School Campus, Banasthali, Kathmandu'}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-3">
              <CreditCard className="w-6 h-6 text-[#C9A96E]" />
              <h3 className="font-serif-heading text-lg font-bold text-[#F6F2E9]">Registration Fee</h3>
              <p className="text-xs text-[#8B95A5] leading-relaxed">
                {formatNPR(settings.registration_fee)} (Includes delegate kit, meals, and social events)
              </p>
            </div>
          </div>

          {/* Rules of Procedure */}
          <div id="rules" className="p-8 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#101E33] border border-[#C9A96E]/30 flex items-center justify-center text-[#C9A96E]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif-heading text-2xl font-bold text-[#F6F2E9]">
                  Rules of Procedure (UNA-USA)
                </h2>
                <p className="text-xs text-[#8B95A5]">Formal parliamentary diplomacy standards</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#8B95A5] leading-relaxed">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-[#F6F2E9]">1. Roll Call & Quorum</h4>
                <p>
                  Delegates must respond with &quot;Present&quot; or &quot;Present and Voting&quot;. A delegate who is
                  &quot;Present and Voting&quot; may not abstain during substantive voting on draft resolutions. A
                  two-thirds majority is required for procedural changes.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-[#F6F2E9]">2. General Speakers List (GSL)</h4>
                <p>
                  The default state of the committee chamber. Speeches are time-limited (typically 90 seconds).
                  Remaining time may be yielded to the Executive Board, to another delegate, or to points of
                  information (questions).
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-[#F6F2E9]">3. Moderated Caucus</h4>
                <p>
                  Delegates motion for a moderated caucus to debate specific sub-issues of the agenda, designating
                  total duration and individual speaking time (e.g. 10 minutes total, 60 seconds per speaker).
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-[#F6F2E9]">4. Unmoderated Caucus</h4>
                <p>
                  Informal lobbying and drafting period where parliamentary rules are temporarily suspended.
                  Delegates negotiate multilateral blocs, resolve differences, and formulate working papers.
                </p>
              </div>
            </div>
          </div>

          {/* Delegate Dress Code & Conduct */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-4">
              <h3 className="font-serif-heading text-xl font-bold text-[#F6F2E9]">
                Diplomatic Dress Code
              </h3>
              <ul className="space-y-2 text-xs text-[#8B95A5] list-disc list-inside leading-relaxed">
                <li>Western Business Attire (suits, blazers, dress shirts, formal trousers or skirts).</li>
                <li>National Diplomatic Attire representing the delegate&apos;s allocated state is welcomed.</li>
                <li>Casual wear, t-shirts, sneakers, and denim are strictly prohibited in committee sessions.</li>
              </ul>
            </div>

            <div className="p-8 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-4">
              <h3 className="font-serif-heading text-xl font-bold text-[#F6F2E9]">
                Diplomatic Code of Conduct
              </h3>
              <ul className="space-y-2 text-xs text-[#8B95A5] list-disc list-inside leading-relaxed">
                <li>Respectful third-person diplomatic language is mandatory during formal session.</li>
                <li>Zero-tolerance policy toward harassment, discrimination, or unsportsmanlike conduct.</li>
                <li>Strict adherence to original scholarship; pre-written resolutions are invalid.</li>
              </ul>
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
