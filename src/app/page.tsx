import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { ConferenceDetails } from '@/components/home/ConferenceDetails';
import { CommitteesSection } from '@/components/home/CommitteesSection';
import { CountryAvailabilityPreview } from '@/components/home/CountryAvailabilityPreview';
import { AfterPartyTeaser } from '@/components/home/AfterPartyTeaser';
import { FaqSection } from '@/components/home/FaqSection';

export default async function HomePage() {
  const settings = await db.getSettings();
  const committees = await db.getCommittees();
  const faqs = await db.getFaqs();

  const firstCommitteeId = committees[0]?.id || '';
  const initialCommitteeCountries = firstCommitteeId
    ? await db.getCommitteeCountries(firstCommitteeId)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#07111F] text-[#F6F2E9]">
      <Navbar registrationOpen={settings.registration_open} />

      <main className="flex-1">
        <Hero
          tagline={settings.tagline}
          year={settings.year}
          registrationOpen={settings.registration_open}
        />

        <ConferenceDetails settings={settings} />

        <CommitteesSection committees={committees} />

        <CountryAvailabilityPreview
          committees={committees}
          initialCommitteeCountries={initialCommitteeCountries}
          selectedCommitteeId={firstCommitteeId}
        />

        <AfterPartyTeaser />

        <FaqSection faqs={faqs} />
      </main>

      <Footer
        contactEmail={settings.contact_email}
        contactPhone={settings.contact_phone}
        address={settings.address}
      />
    </div>
  );
}
