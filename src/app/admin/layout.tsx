'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Globe,
  CreditCard,
  Music,
  Settings,
  Shield,
  LogOut,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

const ADMIN_NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/delegates', label: 'Delegates', icon: Users },
  { href: '/admin/countries', label: 'Country Allocations', icon: Globe },
  { href: '/admin/finance', label: 'Finance & Payments', icon: CreditCard },
  { href: '/admin/dj', label: 'DJ Music Portal', icon: Music },
  { href: '/admin/settings', label: 'Conference Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F6F2E9] flex">
      {/* Desktop Admin Sidebar */}
      <aside className="w-64 border-r border-[#1F304B] bg-[#050D17] flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-6 space-y-6">
          {/* Brand */}
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full border border-[#C9A96E] bg-[#101E33] flex items-center justify-center text-[#C9A96E]">
              <Shield className="w-5 h-5 text-[#C9A96E]" />
            </div>
            <div>
              <span className="font-serif-heading font-bold text-lg text-[#F6F2E9]">
                FMUN <span className="text-[#C9A96E]">Admin</span>
              </span>
              <p className="text-[10px] text-[#8B95A5] uppercase tracking-wider">Secretariat Console</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-4">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#101E33] text-[#C9A96E] border-l-2 border-[#C9A96E] font-semibold'
                      : 'text-[#8B95A5] hover:text-[#F6F2E9] hover:bg-[#101E33]/40'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with quick exit */}
        <div className="p-6 border-t border-[#1F304B] space-y-3">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs text-[#8B95A5] hover:text-[#C9A96E] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </Link>
          <div className="text-[11px] text-[#8B95A5]/60">Logged in as Secretariat Admin</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden border-b border-[#1F304B] bg-[#050D17] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-[#C9A96E]" />
            <span className="font-serif-heading font-bold text-sm text-[#F6F2E9]">FMUN Admin</span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <Link href="/" className="text-[#8B95A5] hover:text-[#F6F2E9]">
              Site
            </Link>
            <Link href="/admin/settings" className="text-[#C9A96E]">
              Settings
            </Link>
          </div>
        </header>

        {/* Dynamic page outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
