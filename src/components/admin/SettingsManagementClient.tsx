'use client';

import React, { useState } from 'react';
import { Settings, Save, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ConferenceSettings } from '@/types/database';

export function SettingsManagementClient({
  initialSettings,
}: {
  initialSettings: ConferenceSettings;
}) {
  const [settings, setSettings] = useState<ConferenceSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
        setStatusMessage({ type: 'success', text: 'Conference parameters successfully updated!' });
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Update failed' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network communication error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F304B] pb-5">
        <div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#F6F2E9]">
            Conference Configuration & Content Engine
          </h1>
          <p className="text-xs text-[#8B95A5] mt-1">
            Authoritative summit parameters. Unconfigured fields display &quot;Coming soon&quot; on public portals.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] text-xs font-bold uppercase tracking-wider transition-colors shadow-md shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Publish Changes'}</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-md text-xs flex items-center space-x-2.5 border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/80 border-red-500/40 text-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Section 1: Registration Gate & Fee */}
      <div className="p-6 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-4">
        <h2 className="font-serif-heading text-lg font-bold text-[#C9A96E]">
          1. Registration Gate & Fee Architecture
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
              Registration Portal Gate
            </label>
            <div className="flex items-center space-x-3 pt-1">
              <input
                type="checkbox"
                id="regOpen"
                checked={settings.registration_open}
                onChange={(e) => setSettings({ ...settings, registration_open: e.target.checked })}
                className="w-4 h-4 rounded border-[#1F304B] text-[#C9A96E] focus:ring-[#C9A96E]"
              />
              <label htmlFor="regOpen" className="text-xs text-[#F6F2E9] cursor-pointer">
                Unlock Official Paid Delegate Registration
              </label>
            </div>
            <p className="text-[11px] text-[#8B95A5]">
              If disabled, delegates can preview committees and country matrix, but submission is blocked.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
              Delegate Registration Fee (NPR)
            </label>
            <input
              type="number"
              placeholder="Leave empty if unconfirmed"
              value={settings.registration_fee ?? ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  registration_fee: e.target.value === '' ? null : Number(e.target.value),
                })
              }
              className="w-full px-3.5 py-2 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
            />
            <p className="text-[11px] text-[#8B95A5]">
              Server-authoritative fee calculated for eSewa, Khalti, and physical vouchers.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Summit Logistics & Venue */}
      <div className="p-6 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-4">
        <h2 className="font-serif-heading text-lg font-bold text-[#C9A96E]">
          2. Summit Logistics & Venue
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
              Conference Start Date
            </label>
            <input
              type="datetime-local"
              value={settings.start_date ? new Date(settings.start_date).toISOString().slice(0, 16) : ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  start_date: e.target.value ? new Date(e.target.value).toISOString() : null,
                })
              }
              className="w-full px-3.5 py-2 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
              Conference End Date
            </label>
            <input
              type="datetime-local"
              value={settings.end_date ? new Date(settings.end_date).toISOString().slice(0, 16) : ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  end_date: e.target.value ? new Date(e.target.value).toISOString() : null,
                })
              }
              className="w-full px-3.5 py-2 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
              Summit Venue Hall / Campus
            </label>
            <input
              type="text"
              placeholder="e.g. Fluorescent Secondary School Main Auditorium, Banasthali, Kathmandu"
              value={settings.venue || ''}
              onChange={(e) => setSettings({ ...settings, venue: e.target.value || null })}
              className="w-full px-3.5 py-2 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
              Official Theme (Optional)
            </label>
            <input
              type="text"
              placeholder="Leave blank until approved by Secretariat"
              value={settings.theme || ''}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value || null })}
              className="w-full px-3.5 py-2 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Official Secretariat Contacts */}
      <div className="p-6 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-4">
        <h2 className="font-serif-heading text-lg font-bold text-[#C9A96E]">
          3. Secretariat Communications & Payment Instructions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
              Secretariat Email
            </label>
            <input
              type="email"
              placeholder="e.g. fmun2026@fluorescent.edu.np"
              value={settings.contact_email || ''}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value || null })}
              className="w-full px-3.5 py-2 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
              Secretariat Phone
            </label>
            <input
              type="text"
              placeholder="+977-1-XXXXXXX"
              value={settings.contact_phone || ''}
              onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value || null })}
              className="w-full px-3.5 py-2 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
              Physical Payment Instructions
            </label>
            <textarea
              rows={2}
              value={settings.physical_payment_instructions || ''}
              onChange={(e) =>
                setSettings({ ...settings, physical_payment_instructions: e.target.value || null })
              }
              className="w-full px-3.5 py-2 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
