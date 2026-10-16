import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MapPin, Mail, Phone, Clock, ShieldCheck } from 'lucide-react';
import { ContactFormClient } from '@/components/contact/ContactFormClient';

export default async function ContactPage() {
  const settings = await db.getSettings();

  return (
    <div className="min-h-screen flex flex-col bg-[#07111F] text-[#F6F2E9]">
      <Navbar registrationOpen={settings.registration_open} />

      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
              Official Inquiries
            </span>
            <h1 className="font-serif-heading text-4xl sm:text-5xl font-bold text-[#F6F2E9]">
              Contact Secretariat
            </h1>
            <p className="text-sm text-[#8B95A5] leading-relaxed">
              Reach out to the FMUN 2026 organizing committee for school delegation packages, sponsorships, or
              procedural clarifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left: Official Credentials */}
            <div className="space-y-6">
              <div className="p-8 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#101E33] border border-[#C9A96E]/30 flex items-center justify-center text-[#C9A96E]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif-heading text-xl font-bold text-[#F6F2E9]">
                      Fluorescent Secondary School
                    </h2>
                    <span className="text-[10px] tracking-widest uppercase text-[#8B95A5]">
                      FMUN 2026 Host Institution
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-[#C9A96E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#F6F2E9]">Campus Address</span>
                      <p className="text-[#8B95A5] mt-0.5">
                        {settings.address || 'Banasthali, Kathmandu, Bagmati Province, Nepal'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="w-4 h-4 text-[#C9A96E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#F6F2E9]">Secretariat Email</span>
                      <p className="text-[#8B95A5] mt-0.5">
                        {settings.contact_email || 'Official email to be published by Secretariat'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-4 h-4 text-[#C9A96E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#F6F2E9]">Official Contact Phone</span>
                      <p className="text-[#8B95A5] mt-0.5">
                        {settings.contact_phone || 'Official phone to be published by Secretariat'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-4 h-4 text-[#C9A96E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#F6F2E9]">Working Desk Hours</span>
                      <p className="text-[#8B95A5] mt-0.5">Sunday - Friday: 9:00 AM - 4:00 PM NPT</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Message Form Client */}
            <ContactFormClient />
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
