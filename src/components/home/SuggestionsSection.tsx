'use client';

import React, { useState } from 'react';
import { Lightbulb, Send, CheckCircle2, Sparkles, MessageSquare, Flame } from 'lucide-react';

export function SuggestionsSection() {
  const [name, setName] = useState('');
  const [faculty, setFaculty] = useState('+2 Science (Grade 11)');
  const [category, setCategory] = useState<'agenda' | 'crisis' | 'event' | 'general'>('crisis');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, faculty, category, title, details }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit suggestion');
      }

      setSubmitted(true);
      setName('');
      setTitle('');
      setDetails('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="suggestions" className="py-20 bg-[#000000] border-b border-[#1C1F26] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#031525] border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-semibold uppercase tracking-wider mb-3">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Delegate Co-Creation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ideas & Suggestions Portal
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 leading-relaxed">
            Have a crisis scenario, debate topic, or a song recommendation for the closing party? Submit your ideas directly to the Secretariat.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#0A0D14] border border-[#1C2331] shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Suggestion Received!</h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto">
                Thank you! Your idea has been sent directly to the Executive Board and will be reviewed during committee planning.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2 rounded-full bg-[#161B26] hover:bg-[#202736] text-xs text-white border border-[#272E3B] transition-colors"
              >
                Submit Another Suggestion
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Aayush Shrestha"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#03060B] border border-[#1C2331] text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                    Faculty
                  </label>
                  <select
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#03060B] border border-[#1C2331] text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                  >
                    <option value="+2 Science (Grade 11)">+2 Science (Grade 11)</option>
                    <option value="+2 Science (Grade 12)">+2 Science (Grade 12)</option>
                    <option value="+2 Management (Grade 11)">+2 Management (Grade 11)</option>
                    <option value="+2 Management (Grade 12)">+2 Management (Grade 12)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'crisis', label: 'Crisis Scenario', icon: Flame },
                    { id: 'agenda', label: 'Debate Agenda', icon: MessageSquare },
                    { id: 'event', label: 'Party Song Idea', icon: Sparkles },
                    { id: 'general', label: 'General Idea', icon: Lightbulb },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategory(cat.id as any)}
                        className={`p-3 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                          isSelected
                            ? 'bg-[#0F172A] border-[#38BDF8] text-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                            : 'bg-[#03060B] border-[#1C2331] text-[#94A3B8] hover:border-[#272E3B]'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-medium">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                  Idea Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Midnight Cyberattack Crisis Simulation or Neon Party Song"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#03060B] border border-[#1C2331] text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                  Details / Explanation
                </label>
                <textarea
                  required
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe your idea or suggestion and how it would make FMUN 2026 even better for everyone..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#03060B] border border-[#1C2331] text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-full bg-white hover:bg-[#F1F5F9] text-black font-semibold text-xs tracking-wider transition-all disabled:opacity-50 flex items-center space-x-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                >
                  <span>{loading ? 'Submitting...' : 'Send Idea to Secretariat'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
