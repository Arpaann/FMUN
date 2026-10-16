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

      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 mb-8">
          <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
            Official Delegate Portal
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#F6F2E9]">
            Delegate Registration & Country Selection
          </h1>
          <p className="text-xs text-[#8B95A5] max-w-lg mx-auto">
            Reserve your sovereign state in real time, configure committee credentials, and confirm your seat at
            FMUN 2026.
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
