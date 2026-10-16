import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { HelpCircle, ArrowRight } from 'lucide-react';

export default async function FaqPage() {
  const settings = await db.getSettings();
  const faqs = await db.getFaqs();

  // Group by category
  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <div className="min-h-screen flex flex-col bg-[#07111F] text-[#F6F2E9]">
      <Navbar registrationOpen={settings.registration_open} />

      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
              Secretariat Knowledge Base
            </span>
            <h1 className="font-serif-heading text-4xl sm:text-5xl font-bold text-[#F6F2E9]">
              Frequently Asked Questions
            </h1>
            <p className="text-sm text-[#8B95A5] leading-relaxed">
              Find answers regarding delegate eligibility, country allocations, payment methods, and committee
              procedures.
            </p>
          </div>

          {/* Grouped FAQs */}
          <div className="space-y-10">
            {categories.map((cat) => {
              const catFaqs = faqs.filter((f) => f.category === cat);
              return (
                <div key={cat} className="space-y-4">
                  <h2 className="font-serif-heading text-xl font-bold text-[#C9A96E] border-b border-[#1F304B] pb-2">
                    {cat}
                  </h2>
                  <div className="space-y-3">
                    {catFaqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="p-5 rounded-lg bg-[#0B1728] border border-[#1F304B] space-y-2"
                      >
                        <h3 className="font-serif-heading font-medium text-base text-[#F6F2E9]">
                          {faq.question}
                        </h3>
                        <p className="text-xs text-[#8B95A5] leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-8 rounded-xl bg-[#101E33] border border-[#C9A96E]/30 text-center space-y-3">
            <h3 className="font-serif-heading text-lg font-bold text-[#F6F2E9]">Still have inquiries?</h3>
            <p className="text-xs text-[#8B95A5]">
              Contact our organizing secretariat directly for institutional delegation inquiries.
            </p>
            <Link
              href="/contact"
              className="inline-block mt-2 px-5 py-2.5 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-semibold text-xs uppercase tracking-wider"
            >
              Contact Secretariat
            </Link>
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
