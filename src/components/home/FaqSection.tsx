'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
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
      'FMUN 2026 is exclusively tailored for +2 Science and Management students (Grades 11 and 12) at Fluorescent Secondary School.',
  },
  {
    id: 'faq-3',
    question: 'How do I choose my committee and country?',
    answer:
      'You select your committee (e.g. UNGA or UNSC) and type your desired country directly in the registration form. The system will instantly check availability and reserve it for you.',
  },
  {
    id: 'faq-4',
    question: 'What is the dress code for the conference?',
    answer:
      'Formal western business attire (suit, blazer, formal shirt, formal trousers/skirt) or your official school blazer during committee sessions. Smart casual wear is permitted for the closing party celebration.',
  },
  {
    id: 'faq-5',
    question: 'Are meals and delegate kits included?',
    answer:
      'Yes! Your delegate fee covers your conference placard, research handbook, badge, stationery, meals & snacks across all three days, certificates of participation/awards, and closing party admission.',
  },
];

export function FaqSection({ faqs }: { faqs?: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-[#000000] border-b border-[#1C1F26] text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase tracking-widest text-[#38BDF8] font-semibold">
            Common Inquiries
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Everything +2 Science & Management scholars need to know.
          </p>
        </div>

        <div className="space-y-3">
          {STUDENT_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-[#0A0D14] border border-[#1C2331] overflow-hidden transition-all duration-200 hover:border-[#272E3B]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between space-x-3 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-sm sm:text-base text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#38BDF8] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[#94A3B8] leading-relaxed border-t border-[#1C2331]">
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
