'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, Sparkles } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About FMUN' },
  { href: '/committees', label: 'Committees' },
  { href: '/country-allocation', label: 'Country Allocation' },
  { href: '/conference-information', label: 'Conference Info' },
  { href: '/after-party', label: 'After-Party' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar({ registrationOpen = false }: { registrationOpen?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith('/admin');
  if (isAdminRoute) return null; // Admin has its own dedicated shell

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#07111F]/90 border-b border-[#C9A96E]/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Diplomatic Crest */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-full border-2 border-[#C9A96E] bg-[#101E33] flex items-center justify-center text-[#C9A96E] shadow-sm shadow-[#C9A96E]/20 group-hover:scale-105 transition-transform">
              <Globe className="w-6 h-6 text-[#C9A96E]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-heading font-bold text-xl tracking-wider text-[#F6F2E9] group-hover:text-[#C9A96E] transition-colors">
                FMUN <span className="text-[#C9A96E]">2026</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#8B95A5]">
                Fluorescent Secondary School
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-xs tracking-wider uppercase transition-colors font-medium ${
                    isActive
                      ? 'text-[#C9A96E] bg-[#101E33] border border-[#C9A96E]/30 font-semibold'
                      : 'text-[#8B95A5] hover:text-[#F6F2E9] hover:bg-[#101E33]/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Register Action CTA & Admin Link */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/register"
              className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-sm font-medium text-xs tracking-wider uppercase transition-all duration-200 ${
                registrationOpen
                  ? 'bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-semibold shadow-md shadow-[#C9A96E]/20'
                  : 'bg-[#101E33] hover:bg-[#15253F] text-[#F6F2E9] border border-[#C9A96E]/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span>{registrationOpen ? 'Register Now' : 'Delegate Portal'}</span>
            </Link>
            <Link
              href="/admin"
              className="text-[11px] text-[#8B95A5] hover:text-[#C9A96E] tracking-wider uppercase px-2 py-1 transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              href="/register"
              className="px-3 py-1.5 text-xs font-semibold rounded bg-[#C9A96E] text-[#07111F]"
            >
              Register
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#8B95A5] hover:text-[#F6F2E9] hover:bg-[#101E33] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#07111F] border-b border-[#C9A96E]/20 px-4 pt-2 pb-6 space-y-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-sm font-medium ${
                  isActive
                    ? 'text-[#C9A96E] bg-[#101E33] font-semibold'
                    : 'text-[#8B95A5] hover:text-[#F6F2E9] hover:bg-[#101E33]/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-[#1F304B] flex flex-col space-y-2">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded bg-[#C9A96E] text-[#07111F] font-semibold text-sm"
            >
              {registrationOpen ? 'Register as Delegate' : 'Open Delegate Portal'}
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded text-xs text-[#8B95A5] hover:text-[#C9A96E]"
            >
              Organizer & Secretariat Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
