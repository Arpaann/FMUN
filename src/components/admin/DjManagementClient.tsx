'use client';

import React, { useState } from 'react';
import { Search, Download, Music, Disc, CheckCircle2, XCircle, Play, ExternalLink } from 'lucide-react';
import { SongSubmission } from '@/types/database';

export function DjManagementClient({ initialSongs }: { initialSongs: SongSubmission[] }) {
  const [songs, setSongs] = useState<SongSubmission[]>(initialSongs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleUpdateStatus = async (songId: string, status: SongSubmission['status']) => {
    setProcessingId(songId);
    try {
      const res = await fetch('/api/admin/dj/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId, status }),
      });
      const data = await res.json();
      if (data.success) {
        setSongs((prev) => prev.map((s) => (s.id === songId ? { ...s, status } : s)));
      } else {
        alert(data.message || 'Action failed');
      }
    } catch {
      alert('Network error while updating track status');
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = songs.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      (s.submitter_name && s.submitter_name.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = songs.filter((s) => s.status === 'pending').length;
  const approvedCount = songs.filter((s) => s.status === 'approved' || s.status === 'played').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F304B] pb-5">
        <div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#F6F2E9]">
            DJ Song Recommendation Portal & Setlist
          </h1>
          <p className="text-xs text-[#8B95A5] mt-1">
            {pendingCount} pending review • {approvedCount} approved for after-party setlist
          </p>
        </div>

        <a
          href="/api/admin/export/dj"
          download
          className="inline-flex items-center space-x-2 px-4 py-2 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export Playlist CSV</span>
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-[#0B1728] border border-[#1F304B]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8B95A5] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search title, artist, delegate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          {['all', 'pending', 'approved', 'played', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded uppercase tracking-wider text-[11px] font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-[#C9A96E] text-[#07111F] font-bold'
                  : 'bg-[#101E33] text-[#8B95A5] hover:text-[#F6F2E9]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Songs Table */}
      <div className="rounded-xl bg-[#0B1728] border border-[#1F304B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101E33] text-[#8B95A5] uppercase tracking-wider font-semibold border-b border-[#1F304B]">
              <tr>
                <th className="py-3 px-4">Track Title</th>
                <th className="py-3 px-4">Artist</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Submitter</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">DJ Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F304B]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8B95A5]">
                    No song recommendations found matching current criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((song) => {
                  const isProcessing = processingId === song.id;

                  return (
                    <tr key={song.id} className="hover:bg-[#101E33]/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-[#F6F2E9]">
                        <div className="flex items-center space-x-2">
                          <Disc className="w-4 h-4 text-[#C9A96E] shrink-0" />
                          <span className="font-semibold">{song.title}</span>
                          <a
                            href={song.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8B95A5] hover:text-[#C9A96E]"
                            title="Open URL"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#8B95A5]">{song.artist}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#101E33] text-[#C9A96E] border border-[#C9A96E]/20">
                          {song.source_platform}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#8B95A5]">
                        <div>{song.submitter_name || 'Anonymous'}</div>
                        {song.registration_reference && (
                          <div className="font-mono text-[10px] text-[#C9A96E]">
                            {song.registration_reference}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#8B95A5] max-w-xs truncate">
                        {song.notes || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            song.status === 'approved'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                              : song.status === 'played'
                              ? 'bg-purple-950/80 text-purple-300 border border-purple-500/30'
                              : song.status === 'pending'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                              : 'bg-red-950/80 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {song.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {song.status !== 'approved' && (
                            <button
                              disabled={isProcessing}
                              onClick={() => handleUpdateStatus(song.id, 'approved')}
                              className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-semibold transition-colors"
                            >
                              Approve
                            </button>
                          )}
                          {song.status !== 'played' && (
                            <button
                              disabled={isProcessing}
                              onClick={() => handleUpdateStatus(song.id, 'played')}
                              className="px-2.5 py-1 rounded bg-purple-700 hover:bg-purple-600 text-white text-[11px] font-semibold transition-colors"
                            >
                              Played
                            </button>
                          )}
                          {song.status !== 'rejected' && (
                            <button
                              disabled={isProcessing}
                              onClick={() => handleUpdateStatus(song.id, 'rejected')}
                              className="px-2.5 py-1 rounded bg-[#101E33] hover:bg-red-900 text-red-300 text-[11px] transition-colors"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
