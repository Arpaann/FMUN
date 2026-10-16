'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { FAQ } from '@/types/database';

export function FaqSection({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-[#07111F] border-b border-[#1F304B]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
            Delegate Inquiries
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#F6F2E9]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#8B95A5]">
            Key clarifications regarding participation, committee allocation, and conference guidelines.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.slice(0, 5).map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className="rounded-lg bg-[#0B1728] border border-[#1F304B] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between space-x-4 hover:bg-[#101E33]/40 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif-heading font-medium text-base text-[#F6F2E9]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C9A96E] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#8B95A5] leading-relaxed border-t border-[#1F304B]/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center space-x-1.5 text-xs text-[#C9A96E] hover:underline font-medium uppercase tracking-wider"
          >
            <span>View All Frequently Asked Questions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
