'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Globe, Sparkles } from 'lucide-react';

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
    <footer className="w-full bg-[#000000] border-t border-[#1C1F26] text-[#94A3B8] pt-14 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#1C1F26]">
          {/* Col 1: FMUN Identity */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#0D1117] border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8] font-bold text-sm shadow-[0_0_12px_rgba(56,189,248,0.25)]">
                F
              </div>
              <span className="text-lg font-bold tracking-tight text-[#F1F5F9]">
                FMUN <span className="text-[#38BDF8]">2026</span>
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] max-w-sm leading-relaxed">
              Fluorescent Model United Nations (FMUN) 2026 is the inaugural diplomatic conference by
              Fluorescent Secondary School, Banasthali, Kathmandu. An intimate 30-delegate summit crafted
              for +2 Science & Management scholars.
            </p>
            {/* Instagram link */}
            <div className="pt-2">
              <a
                href="https://instagram.com/fmun.2026"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0A0D14] border border-[#272E3B] text-xs text-[#E2E8F0] hover:text-[#38BDF8] hover:border-[#38BDF8]/50 transition-all group"
              >
                <svg className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Follow @fmun.2026 on Instagram</span>
              </a>
            </div>
          </div>

          {/* Col 2: Fast Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-[#F1F5F9] uppercase tracking-wider text-[11px]">
              Conference
            </h4>
            <div className="flex flex-col space-y-2">
              <Link href="/" className="hover:text-[#38BDF8] transition-colors">
                Home
              </Link>
              <Link href="/#events" className="hover:text-[#38BDF8] transition-colors">
                Events & Schedule
              </Link>
              <Link href="/register" className="hover:text-[#38BDF8] transition-colors">
                Delegate Registration (30 Seats)
              </Link>
              <Link href="/#suggestions" className="hover:text-[#38BDF8] transition-colors">
                Suggestions & Ideas
              </Link>
              <Link href="/#after-party" className="hover:text-[#38BDF8] transition-colors">
                DJ After-Party Requests
              </Link>
            </div>
          </div>

          {/* Col 3: Secretariat & Location */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-[#F1F5F9] uppercase tracking-wider text-[11px]">
              Campus Venue
            </h4>
            <div className="space-y-2 text-[#94A3B8]">
              <p className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                <span>{address || 'Fluorescent Secondary School, Banasthali, Kathmandu, Nepal'}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                <span>{contactEmail || 'fmun2026@fluorescent.edu.np'}</span>
              </p>
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="inline-block text-[11px] text-[#64748B] hover:text-[#94A3B8] transition-colors"
                >
                  Secretariat Admin Console →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Arpan Bhattarai Attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] space-y-3 sm:space-y-0">
          <p>© 2026 Fluorescent Model United Nations. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Designed & Developed by{' '}
            <a
              href="https://arpanbhattarai.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#E2E8F0] hover:text-[#38BDF8] underline decoration-[#38BDF8]/40 hover:decoration-[#38BDF8] transition-all"
            >
              Arpan Bhattarai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
