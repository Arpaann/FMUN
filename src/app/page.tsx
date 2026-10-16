import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { EventsSection } from '@/components/home/EventsSection';
import { ConferenceDetails } from '@/components/home/ConferenceDetails';
import { DjRequestSection } from '@/components/home/DjRequestSection';
import { FaqSection } from '@/components/home/FaqSection';

export default async function HomePage() {
  const settings = await db.getSettings();
  const faqs = await db.getFaqs();
  const approvedSongs = await db.getApprovedSongs();

  return (
    <div className="min-h-screen flex flex-col bg-[#07111F] text-[#F6F2E9]">
      <Navbar registrationOpen={settings.registration_open} />

      <main className="flex-1">
        <Hero
          tagline={settings.tagline}
          year={settings.year}
          registrationOpen={settings.registration_open}
        />

        <EventsSection />

        <ConferenceDetails settings={settings} />

        <DjRequestSection initialApprovedSongs={approvedSongs} />

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
