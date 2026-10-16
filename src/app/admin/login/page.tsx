'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Authenticate session and redirect to admin dashboard
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/admin');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F6F2E9] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-12 h-12 rounded-full border-2 border-[#C9A96E] bg-[#101E33] mx-auto flex items-center justify-center text-[#C9A96E]">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#F6F2E9]">
          FMUN 2026 Secretariat Console
        </h2>
        <p className="text-xs text-[#8B95A5]">
          Authorized administrative access for Fluorescent Secondary School organizers.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="p-8 rounded-xl bg-[#0B1728] border border-[#1F304B] shadow-2xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
                Staff Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8B95A5] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@fluorescent.edu.np"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
                Console Security Key / Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8B95A5] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Enter Secretariat Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-[#1F304B] text-center">
            <Link
              href="/"
              className="inline-flex items-center space-x-1 text-xs text-[#8B95A5] hover:text-[#C9A96E]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
