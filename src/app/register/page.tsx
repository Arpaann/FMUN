import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MultiStepForm } from '@/components/registration/MultiStepForm';

export default async function RegisterPage() {
  const settings = await db.getSettings();
  const committees = await db.getCommittees();

  return (
    <div className="min-h-screen flex flex-col bg-[#07111F] text-[#F6F2E9]">
      <Navbar registrationOpen={settings.registration_open} />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-2 mb-6">
          <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
            Fluorescent MUN 2026
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#F6F2E9]">
            Delegate Registration
          </h1>
          <p className="text-xs text-[#8B95A5] max-w-md mx-auto">
            Limited to 30 delegates across +2 Science & Management. Select your council and country below to reserve
            your seat.
          </p>
        </div>

        <MultiStepForm settings={settings} committees={committees} />
      </main>

      <Footer
        contactEmail={settings.contact_email}
        contactPhone={settings.contact_phone}
        address={settings.address}
      />
    </div>
  );
}
