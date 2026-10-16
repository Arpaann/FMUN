import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Shield, Target, BookOpen, Award, Users, Compass } from 'lucide-react';

export default async function AboutPage() {
  const settings = await db.getSettings();

  return (
    <div className="min-h-screen flex flex-col bg-[#07111F] text-[#F6F2E9]">
      <Navbar registrationOpen={settings.registration_open} />

      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#101E33] border border-[#C9A96E]/30 text-xs uppercase tracking-widest text-[#C9A96E]">
              <Shield className="w-3.5 h-3.5" />
              <span>Institutional Summit Background</span>
            </div>
            <h1 className="font-serif-heading text-4xl sm:text-5xl font-bold text-[#F6F2E9]">
              About Fluorescent Model United Nations
            </h1>
            <p className="text-base text-[#8B95A5] max-w-2xl mx-auto leading-relaxed">
              The premier inaugural diplomatic simulation organized by Fluorescent Secondary School in
              Kathmandu, Nepal.
            </p>
          </div>

          {/* Core Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#101E33] border border-[#C9A96E]/30 flex items-center justify-center text-[#C9A96E]">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="font-serif-heading text-2xl font-bold text-[#F6F2E9]">
                Our Diplomatic Mission
              </h2>
              <p className="text-sm text-[#8B95A5] leading-relaxed">
                FMUN 2026 was conceived with a clear vision: to empower high school and secondary students across
                Nepal to develop a nuanced understanding of international relations, geopolitical challenges, and
                multilateral compromise. Through rigorous research and structured debate, delegates master the art
                of consensus-building.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#101E33] border border-[#C9A96E]/30 flex items-center justify-center text-[#C9A96E]">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="font-serif-heading text-2xl font-bold text-[#F6F2E9]">
                Academic Rigor & Integrity
              </h2>
              <p className="text-sm text-[#8B95A5] leading-relaxed">
                Our conference is built upon international standards of parliamentary procedure, utilizing UNA-USA
                rules of procedure. Delegates receive comprehensive background guides curated by experienced
                executive board members to ensure debate remains grounded in real-world treaties and international law.
              </p>
            </div>
          </div>

          {/* Pillars of FMUN */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
                Educational Foundations
              </span>
              <h2 className="font-serif-heading text-3xl font-bold text-[#F6F2E9]">
                The Three Pillars of Delegate Growth
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg bg-[#0B1728] border border-[#1F304B] space-y-3">
                <BookOpen className="w-8 h-8 text-[#C9A96E]" />
                <h3 className="font-serif-heading text-lg font-bold text-[#F6F2E9]">Deep Research</h3>
                <p className="text-xs text-[#8B95A5] leading-relaxed">
                  Analyzing complex treaty texts, historical foreign policies, and geopolitical alliances before
                  setting foot in the committee chamber.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-[#0B1728] border border-[#1F304B] space-y-3">
                <Users className="w-8 h-8 text-[#C9A96E]" />
                <h3 className="font-serif-heading text-lg font-bold text-[#F6F2E9]">Unmoderated Caucus</h3>
                <p className="text-xs text-[#8B95A5] leading-relaxed">
                  Forming bilateral coalitions, negotiating clauses with opposing blocs, and mastering interpersonal
                  persuasion without losing sovereign interests.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-[#0B1728] border border-[#1F304B] space-y-3">
                <Award className="w-8 h-8 text-[#C9A96E]" />
                <h3 className="font-serif-heading text-lg font-bold text-[#F6F2E9]">Resolution Drafting</h3>
                <p className="text-xs text-[#8B95A5] leading-relaxed">
                  Synthesizing diverse national positions into operative clauses that address root causes and propose
                  sustainable, binding solutions.
                </p>
              </div>
            </div>
          </div>

          {/* School Host Profile */}
          <div className="p-8 rounded-xl bg-[#101E33] border border-[#C9A96E]/40 space-y-4">
            <h3 className="font-serif-heading text-xl font-bold text-[#F6F2E9]">
              About Fluorescent Secondary School
            </h3>
            <p className="text-xs text-[#8B95A5] leading-relaxed">
              Located in Banasthali, Kathmandu, Fluorescent Secondary School is renowned for academic excellence,
              holistic co-curricular leadership, and fostering civic responsibility. FMUN 2026 marks the
              institution&apos;s milestone initiative to establish an annual international relations benchmark in Nepal.
            </p>
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
