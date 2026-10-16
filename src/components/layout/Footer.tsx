'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

export function Footer({
  contactEmail,
  contactPhone,
  address,
}: {
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: string | null;
}) {
  return (
    <footer className="w-full bg-[#050D17] border-t border-[#1F304B] text-[#8B95A5] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Identity & Crest */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full border border-[#C9A96E] bg-[#101E33] flex items-center justify-center text-[#C9A96E]">
                <Globe className="w-5 h-5 text-[#C9A96E]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-heading font-bold text-lg text-[#F6F2E9]">
                  FMUN <span className="text-[#C9A96E]">2026</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#8B95A5]">
                  Fluorescent Secondary School
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[#8B95A5]">
              The inaugural Model United Nations conference hosted by Fluorescent Secondary School in
              Kathmandu, Nepal. Fostering diplomacy, multilateral debate, and next-generation leadership.
            </p>
            <div className="inline-flex items-center space-x-1.5 text-[11px] text-[#C9A96E] bg-[#101E33]/60 px-2.5 py-1 rounded border border-[#C9A96E]/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Institutional Platform</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif-heading text-sm uppercase tracking-wider text-[#F6F2E9]">
              Conference
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-[#C9A96E] transition-colors">
                  About FMUN & Objectives
                </Link>
              </li>
              <li>
                <Link href="/committees" className="hover:text-[#C9A96E] transition-colors">
                  Committees & Agendas
                </Link>
              </li>
              <li>
                <Link href="/country-allocation" className="hover:text-[#C9A96E] transition-colors">
                  Live Country Allocation Matrix
                </Link>
              </li>
              <li>
                <Link href="/conference-information" className="hover:text-[#C9A96E] transition-colors">
                  Schedule, Rules & Handbook
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#C9A96E] transition-colors">
                  Delegate Registration Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: After-Party & Music */}
          <div className="space-y-3">
            <h4 className="font-serif-heading text-sm uppercase tracking-wider text-[#F6F2E9]">
              Social & After-Party
            </h4>
            <p className="text-xs leading-relaxed">
              Curated by the FMUN program management & DJ team. Recommend your favorite tracks for our
              diplomatic social celebration.
            </p>
            <div className="pt-2">
              <Link
                href="/after-party/submit"
                className="inline-flex items-center space-x-2 text-xs px-3 py-1.5 rounded bg-[#101E33] hover:bg-[#15253F] text-[#C9A96E] border border-[#C9A96E]/30 transition-colors"
              >
                <span>Submit Track Recommendation</span>
              </Link>
            </div>
          </div>

          {/* Column 4: Official Contact & Venue */}
          <div className="space-y-3">
            <h4 className="font-serif-heading text-sm uppercase tracking-wider text-[#F6F2E9]">
              Secretariat Contact
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#C9A96E] shrink-0 mt-0.5" />
                <span>
                  {address || 'Fluorescent Secondary School, Banasthali, Kathmandu, Nepal'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#C9A96E] shrink-0" />
                <span>{contactEmail || 'Official email coming soon'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#C9A96E] shrink-0" />
                <span>{contactPhone || 'Official phone coming soon'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-8 border-t border-[#1F304B] flex flex-col sm:flex-row items-center justify-between text-xs space-y-4 sm:space-y-0">
          <p>© 2026 Fluorescent Model United Nations (FMUN). All rights reserved.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <Link href="/faq" className="hover:text-[#C9A96E]">
              FAQs
            </Link>
            <Link href="/conference-information#rules" className="hover:text-[#C9A96E]">
              Code of Conduct
            </Link>
            <Link href="/admin" className="hover:text-[#C9A96E]">
              Secretariat Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
