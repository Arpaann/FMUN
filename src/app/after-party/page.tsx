import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DjRequestSection } from '@/components/home/DjRequestSection';

export default async function AfterPartyPage() {
  const settings = await db.getSettings();
  const approvedSongs = await db.getApprovedSongs();

  return (
    <div className="min-h-screen flex flex-col bg-[#07111F] text-[#F6F2E9]">
      <Navbar registrationOpen={settings.registration_open} />

      <main className="flex-1 py-10">
        <DjRequestSection initialApprovedSongs={approvedSongs} />
      </main>

      <Footer
        contactEmail={settings.contact_email}
        contactPhone={settings.contact_phone}
        address={settings.address}
      />
    </div>
  );
}
