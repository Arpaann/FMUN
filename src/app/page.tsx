import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import HeroAscii from '@/components/ui/hero-ascii-one';
import { EventsSection } from '@/components/home/EventsSection';
import { SuggestionsSection } from '@/components/home/SuggestionsSection';
import { ConferenceDetails } from '@/components/home/ConferenceDetails';
import { DjRequestSection } from '@/components/home/DjRequestSection';
import { FaqSection } from '@/components/home/FaqSection';

export default async function HomePage() {
  const settings = await db.getSettings();
  const faqs = await db.getFaqs();
  const approvedSongs = await db.getApprovedSongs();

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <Navbar registrationOpen={settings.registration_open} />

      <main className="flex-1">
        <HeroAscii registrationOpen={settings.registration_open} />

        <EventsSection items={settings.schedule_items} />

        <ConferenceDetails settings={settings} />

        <SuggestionsSection />

        <DjRequestSection initialApprovedSongs={approvedSongs} />

        <FaqSection faqs={faqs} />
      </main>

      <Footer
        contactEmail={settings.contact_email}
        address={settings.address}
      />
    </div>
  );
}
