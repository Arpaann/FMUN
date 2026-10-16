'use client';

import React, { useState } from 'react';
import { Music, Send, CheckCircle2, Headphones } from 'lucide-react';
import { SongSubmission } from '@/types/database';

export function DjRequestSection({ initialApprovedSongs = [] }: { initialApprovedSongs?: SongSubmission[] }) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/songs/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          artist: artist || 'Various Artists',
          sourcePlatform: 'spotify',
          sourceUrl: `https://open.spotify.com/search/${encodeURIComponent(title + ' ' + artist)}`,
          submitterName: submitterName || 'FMUN Delegate',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setTitle('');
        setArtist('');
      } else {
        setError(data.message || 'Could not send song');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="after-party" className="py-20 bg-[#000000] border-b border-[#1C1F26] text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl bg-[#0A0D14] border border-[#1C2331] shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#1C1F26]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">FMUN After-Party DJ Track Request</h3>
                <p className="text-xs text-[#94A3B8]">Request songs for our resident DJ’s live after-party setlist</p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-medium px-3 py-1 rounded-full bg-purple-950/40 text-purple-300 border border-purple-800/40">
              Day 2 • 04:30 PM
            </span>
          </div>

          {submitted ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-sm font-semibold text-white">Song sent to the DJ booth!</p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#38BDF8] hover:underline"
              >
                Request another track
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-200">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Song Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Midnight City"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#03060B] border border-[#1C2331] text-xs text-white placeholder-[#475569] focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Artist Name</label>
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="e.g., M83"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#03060B] border border-[#1C2331] text-xs text-white placeholder-[#475569] focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <input
                  type="text"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  placeholder="Your Name (Optional)"
                  className="w-full sm:w-1/2 px-3.5 py-2 rounded-xl bg-[#03060B] border border-[#1C2331] text-xs text-white placeholder-[#475569] focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white hover:bg-[#F1F5F9] text-black font-semibold text-xs tracking-wider transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Drop Song'}</span>
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
