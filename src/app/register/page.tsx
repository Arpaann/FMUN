import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MultiStepForm } from '@/components/registration/MultiStepForm';

export default async function RegisterPage() {
  const settings = await db.getSettings();
  const committees = await db.getCommittees();

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <Navbar registrationOpen={settings.registration_open} />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-2 mb-8">
          <span className="text-xs uppercase tracking-widest text-[#38BDF8] font-semibold">
            Fluorescent MUN 2026
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Delegate Registration
          </h1>
          <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
            Exclusively for +2 Science & Management scholars (Grade 11 & 12). Select your council and type your country below to secure your seat.
          </p>
        </div>

        <MultiStepForm settings={settings} committees={committees} />
      </main>

      <Footer
        contactEmail={settings.contact_email}
        address={settings.address}
      />
    </div>
  );
}
