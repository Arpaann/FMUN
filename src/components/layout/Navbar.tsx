'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/#events', label: 'Schedule & Events' },
  { href: '/#suggestions', label: 'Ideas & Suggestions' },
  { href: '/register', label: 'Register (30 Seats)' },
  { href: '/#after-party', label: 'DJ Party' },
];

export function Navbar({ registrationOpen = false }: { registrationOpen?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith('/admin');
  if (isAdminRoute) return null;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#000000]/80 border-b border-[#1C1F26]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-full border border-[#38BDF8]/40 bg-[#0A0D14] flex items-center justify-center text-[#38BDF8] font-bold text-sm shadow-[0_0_10px_rgba(56,189,248,0.25)] group-hover:border-[#38BDF8] transition-colors">
              F
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-[#F1F5F9] group-hover:text-[#38BDF8] transition-colors">
                FMUN <span className="text-[#38BDF8]">2026</span>
              </span>
              <span className="text-[10px] text-[#64748B] -mt-0.5 tracking-wider uppercase">
                Fluorescent • +2 Summit
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                    isActive
                      ? 'text-[#38BDF8] bg-[#0F172A] border border-[#38BDF8]/30 shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#11141B]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Button & Admin Link */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/register"
              className="px-4 py-2 rounded-full text-xs font-semibold tracking-wider bg-white hover:bg-[#F1F5F9] text-black transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center space-x-1.5"
            >
              <span>Register Now</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/admin"
              className="text-[11px] text-[#64748B] hover:text-[#94A3B8] px-2 py-1 transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/register"
              className="px-3 py-1 text-xs font-semibold rounded-full bg-white text-black"
            >
              Register
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#94A3B8] hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0D14] border-b border-[#1C1F26] px-4 pt-3 pb-6 space-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-[#94A3B8] hover:text-white hover:bg-[#161B26]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs text-[#64748B] px-3 py-1 hover:text-white"
            >
              Secretariat Admin Portal →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
