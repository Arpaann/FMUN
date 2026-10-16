import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { Music, Disc, Sparkles, Radio, CheckCircle, ExternalLink } from 'lucide-react';

export default async function AfterPartyPage() {
  const settings = await db.getSettings();
  const approvedSongs = await db.getApprovedSongs();

  return (
    <div className="min-h-screen flex flex-col bg-[#07111F] text-[#F6F2E9]">
      <Navbar registrationOpen={settings.registration_open} />

      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#101E33] border border-[#C9A96E]/30 text-xs uppercase tracking-widest text-[#C9A96E]">
              <Music className="w-3.5 h-3.5" />
              <span>Official Delegate Social Celebration</span>
            </div>
            <h1 className="font-serif-heading text-4xl sm:text-5xl font-bold text-[#F6F2E9]">
              FMUN 2026 Diplomatic After-Party
            </h1>
            <p className="text-sm text-[#8B95A5] leading-relaxed">
              Curated by the FMUN program management & DJ team. Celebrate international camaraderie with global
              sounds, dynamic lighting, and delegate-curated music.
            </p>
            <div className="pt-2">
              <Link
                href="/after-party/submit"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#C9A96E]/20 transition-all"
              >
                <Disc className="w-4 h-4 text-[#07111F]" />
                <span>Submit Your Song Recommendation</span>
              </Link>
            </div>
          </div>

          {/* DJ Showcase Banner */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-[#101E33] via-[#0B1728] to-[#101E33] border border-[#C9A96E]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[10px] uppercase tracking-widest text-[#C9A96E] font-bold">
                From The Resident DJ
              </span>
              <h2 className="font-serif-heading text-2xl font-bold text-[#F6F2E9]">
                Live Crowd-Curated Setlist
              </h2>
              <p className="text-xs text-[#8B95A5] max-w-md">
                Every approved recommendation is incorporated into the live setlist. All recommendations are
                moderated to ensure fair rotation across international genres.
              </p>
            </div>

            {/* Pulsing Audio Waveform */}
            <div className="flex items-center space-x-1.5 h-12 shrink-0">
              {[35, 80, 50, 95, 65, 85, 40, 100, 75, 45, 90, 60, 80, 55, 90, 40].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
                  className="w-1.5 bg-[#C9A96E] rounded-full animate-pulse opacity-90"
                />
              ))}
            </div>
          </div>

          {/* Approved Playlist */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#1F304B] pb-4">
              <div>
                <h3 className="font-serif-heading text-xl font-bold text-[#F6F2E9]">
                  Approved Delegate Playlist
                </h3>
                <p className="text-xs text-[#8B95A5]">Tracks cleared by the DJ for the evening</p>
              </div>
              <span className="text-xs font-mono text-[#C9A96E] bg-[#101E33] px-3 py-1 rounded border border-[#C9A96E]/20">
                {approvedSongs.length} Tracks Cleared
              </span>
            </div>

            {approvedSongs.length === 0 ? (
              <div className="p-12 text-center rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-3">
                <Radio className="w-8 h-8 text-[#8B95A5] mx-auto" />
                <p className="text-xs text-[#8B95A5]">
                  No songs have been cleared yet. Be the first delegate to recommend a track!
                </p>
                <Link
                  href="/after-party/submit"
                  className="inline-block text-xs text-[#C9A96E] hover:underline uppercase tracking-wider font-semibold"
                >
                  Submit a track now →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {approvedSongs.map((song) => (
                  <div
                    key={song.id}
                    className="p-4 rounded-lg bg-[#0B1728] border border-[#1F304B] flex items-center justify-between space-x-4 hover:border-[#C9A96E]/40 transition-colors"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#101E33] border border-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E] shrink-0">
                        <Disc className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-sm text-[#F6F2E9] truncate">{song.title}</h4>
                        <p className="text-xs text-[#8B95A5] truncate">{song.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#101E33] text-[#C9A96E] border border-[#C9A96E]/20">
                        {song.source_platform}
                      </span>
                      <a
                        href={song.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded text-[#8B95A5] hover:text-[#C9A96E] transition-colors"
                        title="Open track link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer
        contactEmail={settings.contact_email}
        contactPhone={settings.contact_phone}
        address={settings.address}
      />
    </div>
  );
}
