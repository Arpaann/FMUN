'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

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
    <footer className="w-full bg-[#050D17] border-t border-[#1F304B] text-[#8B95A5] pt-12 pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#1F304B]">
          {/* Col 1 */}
          <div className="space-y-2">
            <span className="font-serif font-bold text-lg text-[#F6F2E9]">
              FMUN <span className="text-[#C9A96E]">2026</span>
            </span>
            <p className="text-xs text-[#8B95A5] leading-relaxed">
              Fluorescent Secondary School, Banasthali, Kathmandu. An intimate 30-delegate summit organized by and
              for +2 Science & Management students.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-[#F6F2E9] uppercase tracking-wider text-[11px]">
              Quick Links
            </h4>
            <div className="flex flex-col space-y-1.5">
              <Link href="/" className="hover:text-[#C9A96E]">
                Home
              </Link>
              <Link href="/#events" className="hover:text-[#C9A96E]">
                Events & Schedule
              </Link>
              <Link href="/register" className="hover:text-[#C9A96E]">
                Register as Delegate (30 Seats)
              </Link>
              <Link href="/#after-party" className="hover:text-[#C9A96E]">
                After-Party DJ Requests
              </Link>
              <Link href="/contact" className="hover:text-[#C9A96E]">
                Contact Secretariat
              </Link>
            </div>
          </div>

          {/* Col 3 */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-[#F6F2E9] uppercase tracking-wider text-[11px]">
              Campus Venue
            </h4>
            <div className="space-y-1 text-[#8B95A5]">
              <p className="flex items-start space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C9A96E] shrink-0 mt-0.5" />
                <span>{address || 'Fluorescent Secondary School, Banasthali, Kathmandu'}</span>
              </p>
              <p className="flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C9A96E] shrink-0" />
                <span>{contactEmail || 'fmun2026@fluorescent.edu.np'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8B95A5] space-y-2 sm:space-y-0">
          <p>© 2026 Fluorescent Model United Nations. Organized by Fluorescent Secondary School.</p>
          <Link href="/admin" className="text-[#8B95A5] hover:text-[#C9A96E] text-[11px]">
            Secretariat Login →
          </Link>
        </div>
      </div>
    </footer>
  );
}
