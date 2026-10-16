'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Music, Disc, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, Send } from 'lucide-react';

export default function SongSubmitPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [sourcePlatform, setSourcePlatform] = useState<'spotify' | 'youtube' | 'apple_music' | 'soundcloud' | 'other'>('spotify');
  const [sourceUrl, setSourceUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [registrationReference, setRegistrationReference] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/songs/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          artist,
          sourcePlatform,
          sourceUrl,
          notes: notes || null,
          submitterName: submitterName || null,
          registrationReference: registrationReference || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Submission failed');
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(data.message);
      setTitle('');
      setArtist('');
      setSourceUrl('');
      setNotes('');
    } catch {
      setErrorMessage('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07111F] text-[#F6F2E9]">
      {/* Mini Header */}
      <header className="border-b border-[#1F304B] bg-[#07111F]/90 backdrop-blur px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/after-party"
            className="inline-flex items-center space-x-2 text-xs text-[#8B95A5] hover:text-[#F6F2E9] uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to After-Party</span>
          </Link>
          <span className="font-serif-heading font-bold text-sm text-[#C9A96E]">FMUN 2026 DJ Portal</span>
        </div>
      </header>

      <main className="flex-1 py-12 sm:py-20 flex items-center justify-center">
        <div className="w-full max-w-xl mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1728] border border-[#C9A96E]/30 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#101E33] border border-[#C9A96E]/40 mx-auto flex items-center justify-center text-[#C9A96E]">
                <Music className="w-6 h-6" />
              </div>
              <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#F6F2E9]">
                Recommend a Track
              </h1>
              <p className="text-xs text-[#8B95A5] max-w-sm mx-auto">
                Submit your favorite track for our resident DJ to review and incorporate into the official FMUN 2026
                celebration setlist.
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-md bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Banner */}
            {successMessage && (
              <div className="p-4 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{successMessage}</span>
                </div>
                <div className="pt-2 flex space-x-4">
                  <Link href="/after-party" className="text-[#C9A96E] hover:underline font-medium">
                    View Approved Playlist →
                  </Link>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
                    Song Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Midnight City"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
                    Artist / Producer *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M83"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
                    Music Platform *
                  </label>
                  <select
                    value={sourcePlatform}
                    onChange={(e) => setSourcePlatform(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
                  >
                    <option value="spotify">Spotify</option>
                    <option value="youtube">YouTube / YouTube Music</option>
                    <option value="apple_music">Apple Music</option>
                    <option value="soundcloud">SoundCloud</option>
                    <option value="other">Other Streaming Service</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Delegate of France"
                    value={submitterName}
                    onChange={(e) => setSubmitterName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
                  Streaming Track URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://open.spotify.com/track/... or https://youtube.com/watch?v=..."
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
                  Registration Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. FMUN-2026-X8B9K2"
                  value={registrationReference}
                  onChange={(e) => setRegistrationReference(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
                  Notes for DJ (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Great track for peak caucus energy!"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
                />
              </div>

              <div className="p-3 rounded-md bg-[#101E33] border border-[#1F304B] text-[11px] text-[#8B95A5] leading-relaxed">
                <strong>DJ Notice:</strong> Song submissions are requests and will be reviewed by the DJ for
                content appropriateness and audio quality. Submission does not guarantee that every track will be
                played during the set.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting to DJ...' : 'Submit Track Recommendation'}</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
