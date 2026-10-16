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
  ExternalLink,
} from 'lucide-react';

const ADMIN_NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/settings', label: 'Settings & Schedule', icon: Settings },
  { href: '/admin/delegates', label: 'Delegates (30 Quota)', icon: Users },
  { href: '/admin/countries', label: 'Allocations Matrix', icon: Globe },
  { href: '/admin/finance', label: 'Finance & Payments', icon: CreditCard },
  { href: '/admin/dj', label: 'DJ Music Portal', icon: Music },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white flex">
      {/* Desktop Admin Sidebar */}
      <aside className="w-64 border-r border-[#1C2331] bg-[#05080E] flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-6 space-y-6">
          {/* Brand */}
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-full border border-[#38BDF8]/40 bg-[#0F172A] flex items-center justify-center text-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.25)]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-base text-white group-hover:text-[#38BDF8] transition-colors">
                FMUN <span className="text-[#38BDF8]">Console</span>
              </span>
              <p className="text-[10px] text-[#64748B] uppercase tracking-wider">Secretariat Portal</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-2">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0F172A] text-[#38BDF8] border border-[#38BDF8]/30 shadow-sm'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#111622]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-[#1C2331] space-y-3">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs text-[#94A3B8] hover:text-[#38BDF8] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </Link>
          <div className="text-[10px] text-[#64748B]">
            Fluorescent Secondary School • 2026
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden border-b border-[#1C2331] bg-[#05080E] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-[#38BDF8]" />
            <span className="font-bold text-sm text-white">FMUN Admin</span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <Link href="/" className="text-[#94A3B8] hover:text-white">
              Public Site
            </Link>
          </div>
        </header>

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#000000]">
          {children}
        </main>
      </div>
    </div>
  );
}
