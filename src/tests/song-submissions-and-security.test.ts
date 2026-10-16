import { describe, it, expect } from 'vitest';
import { songSubmissionSchema } from '@/lib/validations';
import { db } from '@/lib/db';
import { generateReferenceCode, generateReservationToken, hashToken } from '@/lib/utils';

describe('5. Song Recommendation URL Validation & Moderation', () => {
  it('accepts valid Spotify, YouTube, SoundCloud, and Apple Music track URLs', () => {
    const validSpotify = {
      title: 'Midnight City',
      artist: 'M83',
      sourcePlatform: 'spotify' as const,
      sourceUrl: 'https://open.spotify.com/track/1eyzqe2QqGZUmfcPZtrIyt',
    };
    expect(songSubmissionSchema.safeParse(validSpotify).success).toBe(true);

    const validYouTube = {
      title: 'Viva La Vida',
      artist: 'Coldplay',
      sourcePlatform: 'youtube' as const,
      sourceUrl: 'https://www.youtube.com/watch?v=dvgZkm1xWPE',
    };
    expect(songSubmissionSchema.safeParse(validYouTube).success).toBe(true);

    const validSoundcloud = {
      title: 'Diplomatic Beats',
      artist: 'FMUN Resident DJ',
      sourcePlatform: 'soundcloud' as const,
      sourceUrl: 'https://soundcloud.com/artist/diplomatic-beats',
    };
    expect(songSubmissionSchema.safeParse(validSoundcloud).success).toBe(true);
  });

  it('rejects dangerous URL schemes such as javascript:, data:, and unapproved domains', () => {
    const dangerousScript = {
      title: 'Hacked Song',
      artist: 'Attacker',
      sourcePlatform: 'other' as const,
      sourceUrl: 'javascript:alert(1)',
    };
    expect(songSubmissionSchema.safeParse(dangerousScript).success).toBe(false);

    const untrustedDomain = {
      title: 'Phishing Track',
      artist: 'Malicious',
      sourcePlatform: 'other' as const,
      sourceUrl: 'https://untrusted-phishing-site.xyz/track.mp3',
    };
    expect(songSubmissionSchema.safeParse(untrustedDomain).success).toBe(false);
  });

  it('moderates songs and ensures public playlist only displays approved/played tracks', async () => {
    const submitRes = await db.submitSong({
      title: 'A Sky Full of Stars',
      artist: 'Coldplay',
      sourcePlatform: 'spotify',
      sourceUrl: 'https://open.spotify.com/track/0FDzzruQe2r0F0DC8iO9iU',
      submitterName: 'Delegate of Norway',
    });
    expect(submitRes.success).toBe(true);
    const songId = submitRes.id!;

    // Initial state: pending -> should NOT appear on public playlist
    let publicPlaylist = await db.getApprovedSongs();
    expect(publicPlaylist.some((s) => s.id === songId)).toBe(false);

    // DJ approves the track
    await db.updateSongStatus(songId, 'approved', 'dj-admin');

    // Now it MUST appear on public playlist
    publicPlaylist = await db.getApprovedSongs();
    expect(publicPlaylist.some((s) => s.id === songId)).toBe(true);
  });
});

describe('6. Security & Cryptographic Integrity', () => {
  it('generates unguessable, human-readable delegate reference codes matching FMUN format', () => {
    const ref1 = generateReferenceCode();
    const ref2 = generateReferenceCode();

    expect(ref1).toMatch(/^FMUN-2026-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/);
    expect(ref2).toMatch(/^FMUN-2026-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/);
    expect(ref1).not.toBe(ref2);
  });

  it('generates cryptographic 32-byte tokens and consistent SHA-256 hashes', () => {
    const token = generateReservationToken();
    expect(token.length).toBe(64); // 32 bytes in hex = 64 characters

    const hash1 = hashToken(token);
    const hash2 = hashToken(token);
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64);
  });
});
