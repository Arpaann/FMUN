'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ } from '@/types/database';

const STUDENT_FAQS = [
  {
    id: 'faq-1',
    question: 'Is this suitable for first-time MUN participants?',
    answer:
      'Yes, absolutely! The Executive Board will conduct an orientation briefing on Day 1 explaining the rules of procedure, how to raise points and motions, and how to draft simple working papers.',
  },
  {
    id: 'faq-2',
    question: 'Who is eligible to participate?',
    answer:
      'FMUN 2026 is exclusively tailored for +2 students across Science and Management streams at Fluorescent Secondary School. The conference is strictly capped at 30 delegates to ensure high individual participation.',
  },
  {
    id: 'faq-3',
    question: 'How do I choose my committee and country?',
    answer:
      'You select your committee (e.g. UNGA or UNSC) and your country directly in the registration form. You can pick an available country or hit "Random Country" for an instant assignment.',
  },
  {
    id: 'faq-4',
    question: 'What is the dress code for the conference?',
    answer:
      'Formal western business attire (suit, blazer, formal shirt, formal trousers/skirt) or your official school blazer during committee sessions. Smart casual wear is permitted for the closing After-Party DJ Night.',
  },
  {
    id: 'faq-5',
    question: 'Are meals and delegate kits included?',
    answer:
      'Yes! Your delegate fee covers your conference placard, research handbook, badge, stationery, meals & snacks on both days, certificates of participation/awards, and after-party admission.',
  },
];

export function FaqSection({ faqs }: { faqs?: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 bg-[#07111F] border-b border-[#1F304B]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
            Got Questions?
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#F6F2E9]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#8B95A5]">
            Everything +2 students need to know before attending.
          </p>
        </div>

        <div className="space-y-3">
          {STUDENT_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className="rounded-lg bg-[#0B1728] border border-[#1F304B] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between space-x-3 hover:bg-[#101E33]/40 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif font-medium text-sm sm:text-base text-[#F6F2E9]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#C9A96E] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[#8B95A5] leading-relaxed border-t border-[#1F304B]/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
