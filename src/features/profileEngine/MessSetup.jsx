'use client';

import React, { useState } from 'react';
import { Upload, Loader2, Check, UtensilsCrossed, Sparkles, User, Download, Pencil } from 'lucide-react';
import { parseDocument, savePersonalMenu, fileToDataUrl } from './profileApi';
import { adoptNodeBaseline } from '@/features/communityEngine/communityApi';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['breakfast', 'lunch', 'snacks', 'dinner'];

function emptyMenu(existing) {
  const m = {};
  for (const d of DAYS) {
    const src = existing?.[d] || {};
    m[d] = { breakfast: src.breakfast || '', lunch: src.lunch || '', snacks: src.snacks || '', dinner: src.dinner || '' };
  }
  return m;
}

/**
 * Personal mess menu setup.
 *
 * Community menus are NOT edited here — they are maintained by community admins
 * from the Community page. Members can still pull a community's official menu
 * into their own personal menu via the "Use as my personal menu" action below.
 */
export default function MessSetup({ profile, onSaved }) {
  const messCommunities = profile?.messCommunities ?? [];
  const hasCommunity = messCommunities.length > 0;

  const [nodeId, setNodeId] = useState(profile?.primaryMessNodeId || messCommunities[0]?.nodeId || '');
  const [menu, setMenu] = useState(() => emptyMenu(profile?.personalMenu));

  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState('');
  const [adopting, setAdopting] = useState(false);

  const aiEnabled = profile?.aiEnabled;

  const handleFile = async (file) => {
    if (!file) return;
    setParsing(true);
    setMessage('');
    const dataUrl = await fileToDataUrl(file);
    const result = await parseDocument('menu', dataUrl);
    setParsing(false);
    if (result?.available && result.menu && Object.keys(result.menu).length) {
      setMenu(emptyMenu(result.menu));
      setMessage('Gemini parsed the menu. Review and save it to your personal profile.');
    } else {
      setMessage(result?.message || 'Could not auto-parse. Fill the menu manually below.');
    }
  };

  const updateCell = (day, meal, value) =>
    setMenu((prev) => ({ ...prev, [day]: { ...prev[day], [meal]: value } }));

  // Replace the user's PERSONAL menu with the selected community's official menu.
  const handleAdoptCommunity = async () => {
    if (!nodeId) return;
    setAdopting(true);
    setMessage('');
    const res = await adoptNodeBaseline(nodeId);
    setAdopting(false);
    if (res) {
      setMessage('Adopted the community menu as your personal menu.');
      onSaved?.(res);
    } else {
      setMessage('Could not adopt — this community has no menu set yet.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await savePersonalMenu(menu);
    setSaving(false);
    if (res) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved?.(res);
    }
  };

  return (
    <div className="space-y-4">
      <p className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
        <User className="h-3.5 w-3.5 shrink-0" />
        Your personal mess menu is private to you and powers food nudges even without a Mess community.
      </p>

      {/* Community menus are admin-managed; members can adopt one as their personal menu. */}
      {hasCommunity && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-800">
            <UtensilsCrossed className="h-4 w-4" /> Use a community menu
          </p>
          <p className="mt-1 text-xs text-emerald-700/80">
            Community menus are maintained by their admins on the Community page. Pull one in here to use it as
            your personal menu.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Mess community
              <select
                value={nodeId}
                onChange={(e) => setNodeId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                {messCommunities.map((c) => (
                  <option key={c.nodeId} value={c.nodeId}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={handleAdoptCommunity}
              disabled={adopting || !nodeId}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
            >
              {adopting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
              Use as my personal menu
            </button>
          </div>
          <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-emerald-700/70">
            <Pencil className="h-3 w-3" /> Are you an admin? Edit the community menu from the Community page.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-1.5 text-xs text-gray-500">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          {aiEnabled
            ? 'Upload a mess board photo — Gemini fills the weekly grid.'
            : 'AI parsing is off. Fill the grid manually below.'}
        </p>
        <label className="inline-flex cursor-pointer items-center gap-2 self-start rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
          {parsing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {parsing ? 'Parsing…' : 'Upload menu'}
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            disabled={parsing}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      </div>

      {message && <p className="text-xs font-medium text-indigo-700">{message}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="p-2 font-semibold uppercase tracking-wide">Day</th>
              {MEALS.map((m) => (
                <th key={m} className="p-2 font-semibold capitalize">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <tr key={day} className="border-t border-gray-100">
                <td className="p-2 font-semibold text-gray-700">{day.slice(0, 3)}</td>
                {MEALS.map((meal) => (
                  <td key={meal} className="p-1">
                    <input
                      value={menu[day][meal]}
                      onChange={(e) => updateCell(day, meal, e.target.value)}
                      placeholder="—"
                      className="w-full rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
        {saved ? 'Saved' : 'Save my menu'}
      </button>
    </div>
  );
}
