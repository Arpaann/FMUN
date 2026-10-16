'use client';

import React, { useState } from 'react';
import { Music, Disc, Send, CheckCircle2, AlertCircle, Heart } from 'lucide-react';
import { SongSubmission } from '@/types/database';

export function DjRequestSection({ initialApprovedSongs = [] }: { initialApprovedSongs?: SongSubmission[] }) {
  const [songs, setSongs] = useState<SongSubmission[]>(initialApprovedSongs);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Default friendly link if user didn't enter one
    const validUrl = sourceUrl.trim() || `https://open.spotify.com/search/${encodeURIComponent(title + ' ' + artist)}`;

    try {
      const res = await fetch('/api/songs/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          artist,
          sourcePlatform: 'spotify',
          sourceUrl: validUrl,
          submitterName: submitterName || 'Fellow Delegate',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: `"${title}" has been sent straight to the DJ booth!` });
        setTitle('');
        setArtist('');
        setSourceUrl('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Could not submit request' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="after-party" className="py-20 bg-[#050D17] border-b border-[#1F304B]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A96E]">
            Social Celebration
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F6F2E9]">
            The FMUN After-Party • DJ Booth
          </h2>
          <p className="text-xs sm:text-sm text-[#8B95A5] max-w-lg mx-auto">
            After committee resolutions, celebrate with +2 friends. Drop your favorite tracks into our resident DJ’s
            live playlist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Quick Request Form */}
          <div className="md:col-span-6 p-6 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#101E33] border border-[#C9A96E]/40 flex items-center justify-center text-[#C9A96E]">
                <Disc className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#F6F2E9]">
                Drop a Track for the DJ
              </h3>
            </div>

            {message && (
              <div
                className={`p-3 rounded text-xs flex items-center space-x-2 border ${
                  message.type === 'success'
                    ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/80 border-red-500/40 text-red-300'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-[#F6F2E9] uppercase tracking-wider block mb-1">
                  Song Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Starboy / A Sky Full of Stars"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#F6F2E9] uppercase tracking-wider block mb-1">
                  Artist *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Weeknd / Coldplay"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#F6F2E9] uppercase tracking-wider block mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aarav (+2 Science)"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending to DJ...' : 'Submit Track'}</span>
              </button>
            </form>
          </div>

          {/* Right: DJ Setlist Preview */}
          <div className="md:col-span-6 p-6 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F304B] pb-3">
              <h3 className="font-serif text-base font-bold text-[#F6F2E9]">
                Live Party Playlist
              </h3>
              <span className="text-[10px] font-mono text-[#C9A96E] bg-[#101E33] px-2 py-0.5 rounded border border-[#C9A96E]/20">
                Curated by Resident DJ
              </span>
            </div>

            <p className="text-xs text-[#8B95A5]">
              Tracks approved by our DJ for the celebration night:
            </p>

            {songs.length === 0 ? (
              <div className="p-8 text-center rounded bg-[#101E33]/40 border border-[#1F304B] text-xs text-[#8B95A5]">
                No tracks requested yet. Be the first to drop one!
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {songs.map((song) => (
                  <div
                    key={song.id}
                    className="p-3 rounded bg-[#101E33] border border-[#1F304B] flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-[#F6F2E9] truncate">{song.title}</div>
                      <div className="text-[11px] text-[#8B95A5] truncate">{song.artist}</div>
                    </div>
                    <span className="text-[10px] font-mono text-[#C9A96E] shrink-0 uppercase">
                      {song.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
