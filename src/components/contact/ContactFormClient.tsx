'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export function ContactFormClient() {
  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-8 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-6">
      <div>
        <h3 className="font-serif-heading text-xl font-bold text-[#F6F2E9]">Send a Message</h3>
        <p className="text-xs text-[#8B95A5] mt-1">
          Our communications team will respond within 24 business hours.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h4 className="font-serif-heading text-base font-bold text-[#F6F2E9]">
            Inquiry Dispatched Successfully
          </h4>
          <p className="text-xs text-[#8B95A5]">
            Thank you, {fullName || 'Delegate'}. The FMUN 2026 secretariat has received your communication and will reply to {email}.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-xs text-[#C9A96E] hover:underline uppercase tracking-wider font-semibold"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
              Your Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sujan Shrestha"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
              Inquiry Subject *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. School Delegation Query"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
              Message *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Detail your question or delegation size..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Transmit Inquiry</span>
          </button>
        </form>
      )}
    </div>
  );
}
