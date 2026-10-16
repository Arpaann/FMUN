'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, Sparkles } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/#events', label: 'Events & Schedule' },
  { href: '/register', label: 'Register (30 Seats)' },
  { href: '/after-party', label: 'After-Party DJ' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar({ registrationOpen = false }: { registrationOpen?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith('/admin');
  if (isAdminRoute) return null;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#07111F]/95 border-b border-[#1F304B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* School & MUN Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full border border-[#C9A96E]/60 bg-[#101E33] flex items-center justify-center text-[#C9A96E] font-serif font-bold text-base shadow-sm">
              F
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-tight text-[#F6F2E9] group-hover:text-[#C9A96E] transition-colors">
                FMUN <span className="text-[#C9A96E]">2026</span>
              </span>
              <span className="text-[11px] text-[#8B95A5] -mt-0.5">
                Fluorescent Secondary School • +2 Summit
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium tracking-wide transition-colors ${
                    isActive
                      ? 'text-[#C9A96E] bg-[#101E33] font-semibold'
                      : 'text-[#8B95A5] hover:text-[#F6F2E9] hover:bg-[#101E33]/40'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Direct CTA */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/register"
              className="px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] transition-all shadow-sm"
            >
              Join Delegate Roster
            </Link>
            <Link
              href="/admin"
              className="text-[11px] text-[#8B95A5] hover:text-[#C9A96E] px-2 py-1"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/register"
              className="px-3 py-1 text-xs font-semibold rounded bg-[#C9A96E] text-[#07111F]"
            >
              Register
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#8B95A5] hover:text-[#F6F2E9]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#07111F] border-b border-[#1F304B] px-4 pt-2 pb-5 space-y-1.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded text-sm text-[#8B95A5] hover:text-[#F6F2E9] hover:bg-[#101E33]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#1F304B] flex flex-col space-y-2">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded bg-[#C9A96E] text-[#07111F] font-semibold text-xs uppercase tracking-wider"
            >
              Register (30 Seats)
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-1 text-xs text-[#8B95A5]"
            >
              Secretariat Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
