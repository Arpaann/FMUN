'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Building,
  Lightbulb,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  Filter,
} from 'lucide-react';
import { ConferenceSettings, ScheduleItemConfig, SuggestionSubmission } from '@/types/database';

export function SettingsManagementClient({
  initialSettings,
}: {
  initialSettings: ConferenceSettings;
}) {
  const [settings, setSettings] = useState<ConferenceSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<'schedule' | 'pricing' | 'logistics' | 'suggestions'>('schedule');
  const [scheduleDay, setScheduleDay] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Suggestions state
  const [suggestions, setSuggestions] = useState<SuggestionSubmission[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionFilter, setSuggestionFilter] = useState<'all' | 'crisis' | 'agenda' | 'event'>('all');

  // Load suggestions when suggestions tab is opened
  useEffect(() => {
    if (activeTab === 'suggestions') {
      setLoadingSuggestions(true);
      fetch('/api/suggestions')
        .then((res) => res.json())
        .then((data) => {
          if (data.suggestions) {
            setSuggestions(data.suggestions);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingSuggestions(false));
    }
  }, [activeTab]);

  // Schedule management handlers
  const scheduleItems = settings.schedule_items || [];

  const handleAddScheduleItem = () => {
    const newItem: ScheduleItemConfig = {
      id: `sch-${Date.now()}`,
      day: scheduleDay,
      time: '10:00 AM - 11:30 AM',
      title: 'New Session Title',
      desc: 'Brief description of the committee or plenary activity.',
      tag: 'Debate',
      highlight: false,
    };
    setSettings({
      ...settings,
      schedule_items: [...scheduleItems, newItem],
    });
  };

  const handleUpdateScheduleItem = (id: string, updates: Partial<ScheduleItemConfig>) => {
    setSettings({
      ...settings,
      schedule_items: scheduleItems.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    });
  };

  const handleDeleteScheduleItem = (id: string) => {
    setSettings({
      ...settings,
      schedule_items: scheduleItems.filter((item) => item.id !== id),
    });
  };

  // Save Settings to server
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();

      if (data.success) {
        setSettings(data.settings);
        setStatusMessage({ type: 'success', text: 'All conference changes & schedule successfully saved!' });
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Update failed' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network connection error. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSuggestions = suggestions.filter((s) => {
    if (suggestionFilter === 'all') return true;
    return s.category === suggestionFilter;
  });

  return (
    <form onSubmit={handleSave} className="w-full max-w-5xl mx-auto space-y-6">
      {/* macOS Window Card Frame */}
      <div className="rounded-3xl bg-[#0A0D14] border border-[#1C2331] shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* macOS Window Title Bar */}
        <div className="px-5 py-3.5 bg-[#05080E] border-b border-[#1C2331] flex items-center justify-between select-none">
          {/* Traffic light buttons */}
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-block shadow-sm" />
            <span className="ml-3 font-mono text-[11px] text-[#64748B] hidden sm:inline">
              fmun-admin-console ~ /etc/conference.conf
            </span>
          </div>

          <div className="text-xs font-semibold text-[#CBD5E1]">
            Fluorescent MUN 2026 Secretariat Control Center
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-1.5 rounded-full bg-white hover:bg-[#F1F5F9] text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50 flex items-center space-x-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save & Publish'}</span>
          </button>
        </div>

        {/* Status notification */}
        {statusMessage && (
          <div
            className={`m-4 p-3.5 rounded-2xl text-xs flex items-center space-x-2.5 border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 pt-4 border-b border-[#1C2331] flex flex-wrap items-center gap-2">
          {[
            { id: 'schedule', label: 'Schedule & Events', icon: Calendar },
            { id: 'pricing', label: 'Pricing & Registration Gate', icon: CreditCard },
            { id: 'logistics', label: 'Venue & Secretariat Info', icon: Building },
            { id: 'suggestions', label: 'Delegate Ideas & Suggestions', icon: Lightbulb },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center space-x-2 border-b-2 transition-all ${
                  isSelected
                    ? 'border-[#38BDF8] text-[#38BDF8] bg-[#0F172A]'
                    : 'border-transparent text-[#94A3B8] hover:text-white hover:bg-[#111622]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* TAB 1: SCHEDULE & EVENTS */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Dynamic Schedule Editor</h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Changes here immediately update the public three-day timeline on the homepage.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Day switch */}
                  <div className="flex items-center p-1 rounded-full bg-[#03060B] border border-[#1C2331]">
                    <button
                      type="button"
                      onClick={() => setScheduleDay(1)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        scheduleDay === 1 ? 'bg-white text-black' : 'text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      Day 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleDay(2)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        scheduleDay === 2 ? 'bg-white text-black' : 'text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      Day 2
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleDay(3)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        scheduleDay === 3 ? 'bg-white text-black' : 'text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      Day 3
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddScheduleItem}
                    className="px-3.5 py-1.5 rounded-full bg-[#111622] hover:bg-[#1A2234] text-[#38BDF8] border border-[#38BDF8]/40 text-xs font-semibold flex items-center space-x-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>

              {/* Items for current day */}
              <div className="space-y-3">
                {scheduleItems
                  .filter((item) => item.day === scheduleDay)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#03060B] border border-[#1C2331] space-y-3 hover:border-[#272E3B] transition-all"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        {/* Time */}
                        <div className="sm:col-span-3">
                          <label className="text-[10px] uppercase font-bold text-[#64748B] block mb-1">
                            Time Slot
                          </label>
                          <input
                            type="text"
                            value={item.time}
                            onChange={(e) => handleUpdateScheduleItem(item.id, { time: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#0A0D14] border border-[#1C2331] text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                          />
                        </div>

                        {/* Title */}
                        <div className="sm:col-span-5">
                          <label className="text-[10px] uppercase font-bold text-[#64748B] block mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdateScheduleItem(item.id, { title: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#0A0D14] border border-[#1C2331] text-xs text-white font-semibold focus:outline-none focus:border-[#38BDF8]"
                          />
                        </div>

                        {/* Tag */}
                        <div className="sm:col-span-2">
                          <label className="text-[10px] uppercase font-bold text-[#64748B] block mb-1">
                            Category Tag
                          </label>
                          <select
                            value={item.tag}
                            onChange={(e) => handleUpdateScheduleItem(item.id, { tag: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#0A0D14] border border-[#1C2331] text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                          >
                            <option value="Check-in">Check-in</option>
                            <option value="Plenary">Plenary</option>
                            <option value="Debate">Debate</option>
                            <option value="Crisis">Crisis</option>
                            <option value="Meal">Meal</option>
                            <option value="Voting">Voting</option>
                            <option value="Awards">Awards</option>
                            <option value="Social">Social</option>
                          </select>
                        </div>

                        {/* Highlight and Delete */}
                        <div className="sm:col-span-2 flex items-center justify-end space-x-2 pt-4 sm:pt-0">
                          <label className="flex items-center space-x-1.5 text-xs text-[#94A3B8] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.highlight || false}
                              onChange={(e) =>
                                handleUpdateScheduleItem(item.id, { highlight: e.target.checked })
                              }
                              className="rounded border-[#1C2331] text-[#38BDF8] focus:ring-0"
                            />
                            <span className="text-[11px]">Highlight</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => handleDeleteScheduleItem(item.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <input
                          type="text"
                          value={item.desc}
                          onChange={(e) => handleUpdateScheduleItem(item.id, { desc: e.target.value })}
                          placeholder="Description of the event..."
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0A0D14] border border-[#1C2331] text-xs text-[#94A3B8] focus:outline-none focus:border-[#38BDF8]"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & REGISTRATION */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Pricing & Registration Controls</h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Set the authoritative registration fee and control registration access.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Gate Toggle */}
                <div className="p-5 rounded-2xl bg-[#03060B] border border-[#1C2331] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Registration Gate</h4>
                      <p className="text-xs text-[#94A3B8] mt-0.5">
                        Enable or lock delegate registration submissions.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.registration_open}
                        onChange={(e) =>
                          setSettings({ ...settings, registration_open: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#161B26] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#38BDF8]" />
                    </label>
                  </div>
                  <div className="text-[11px] font-mono text-[#64748B]">
                    Status: {settings.registration_open ? '🟢 Open (Accepting 30 delegates)' : '🔴 Locked'}
                  </div>
                </div>

                {/* Pricing in NPR */}
                <div className="p-5 rounded-2xl bg-[#03060B] border border-[#1C2331] space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">Delegate Fee (NPR)</h4>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      Amount charged per delegate (leave blank if unconfirmed).
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#64748B]">NPR</span>
                    <input
                      type="number"
                      placeholder="e.g. 1500"
                      value={settings.registration_fee ?? ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          registration_fee: e.target.value === '' ? null : Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#0A0D14] border border-[#1C2331] text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                    />
                  </div>
                </div>

                {/* Capacity note */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-[#0F172A] border border-[#38BDF8]/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Strict Quota: 30 Delegates Total</span>
                    <span className="text-[#94A3B8]">
                      Tailored specifically for Fluorescent Secondary School +2 Science & Management scholars.
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#03060B] text-[#38BDF8] font-mono font-bold">
                    Cap: 30
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOGISTICS & VENUE */}
          {activeTab === 'logistics' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Campus Venue & Details</h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Update conference location, contacts, and secretariat information.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#CBD5E1]">Venue & Campus</label>
                  <input
                    type="text"
                    value={settings.venue || ''}
                    placeholder="e.g. Fluorescent Secondary School Main Auditorium, Banasthali, Kathmandu"
                    onChange={(e) => setSettings({ ...settings, venue: e.target.value || null })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#03060B] border border-[#1C2331] text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#CBD5E1]">Conference Start Date</label>
                  <input
                    type="datetime-local"
                    value={settings.start_date ? new Date(settings.start_date).toISOString().slice(0, 16) : ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        start_date: e.target.value ? new Date(e.target.value).toISOString() : null,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#03060B] border border-[#1C2331] text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#CBD5E1]">Conference End Date</label>
                  <input
                    type="datetime-local"
                    value={settings.end_date ? new Date(settings.end_date).toISOString().slice(0, 16) : ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        end_date: e.target.value ? new Date(e.target.value).toISOString() : null,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#03060B] border border-[#1C2331] text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#CBD5E1]">Secretariat Email</label>
                  <input
                    type="email"
                    value={settings.contact_email || ''}
                    placeholder="fmun2026@fluorescent.edu.np"
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value || null })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#03060B] border border-[#1C2331] text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#CBD5E1]">Secretariat Phone</label>
                  <input
                    type="text"
                    value={settings.contact_phone || ''}
                    placeholder="+977-1-XXXXXXX"
                    onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value || null })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#03060B] border border-[#1C2331] text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DELEGATE IDEAS & SUGGESTIONS */}
          {activeTab === 'suggestions' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white">Delegate Suggestions Portal</h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Ideas submitted by students from the homepage portal.
                  </p>
                </div>

                <div className="flex items-center space-x-1.5 p-1 rounded-full bg-[#03060B] border border-[#1C2331] text-xs">
                  {['all', 'crisis', 'agenda', 'event'].map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => setSuggestionFilter(f as any)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all ${
                        suggestionFilter === f
                          ? 'bg-white text-black'
                          : 'text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {loadingSuggestions ? (
                <p className="text-xs text-[#94A3B8] py-8 text-center">Loading suggestions...</p>
              ) : filteredSuggestions.length === 0 ? (
                <div className="py-12 text-center rounded-2xl bg-[#03060B] border border-[#1C2331] text-xs text-[#64748B]">
                  No ideas submitted in this category yet. When delegates submit suggestions from the home page, they will appear here.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSuggestions.map((s) => (
                    <div
                      key={s.id}
                      className="p-4 rounded-2xl bg-[#03060B] border border-[#1C2331] space-y-2 hover:border-[#272E3B] transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white">{s.name}</span>
                          <span className="text-[10px] text-[#64748B] font-mono">({s.faculty || '+2'})</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#0F172A] text-[#38BDF8] border border-[#38BDF8]/30">
                          {s.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#E2E8F0]">{s.title}</h4>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">{s.details}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* macOS Window Footer Bar: Arpan Bhattarai Attribution */}
        <div className="px-6 py-3.5 bg-[#05080E] border-t border-[#1C2331] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] space-y-2 sm:space-y-0">
          <span>Fluorescent Model United Nations (FMUN) 2026 Admin Architecture</span>
          <span>
            Designed & Developed by{' '}
            <a
              href="https://arpanbhattarai.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white hover:text-[#38BDF8] underline decoration-[#38BDF8]/40 transition-colors"
            >
              Arpan Bhattarai
            </a>
          </span>
        </div>
      </div>
    </form>
  );
}
