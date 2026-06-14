'use client';

import React, { useState } from 'react';
import { Upload, Loader2, Check, UtensilsCrossed, Sparkles } from 'lucide-react';
import { parseDocument, saveMenu, fileToDataUrl } from './profileApi';

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

export default function MessSetup({ profile, onSaved }) {
  const messCommunities = profile?.messCommunities ?? [];
  const [nodeId, setNodeId] = useState(profile?.primaryMessNodeId || messCommunities[0]?.nodeId || '');
  const [menu, setMenu] = useState(() => emptyMenu(profile?.menu?.menu));
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(!profile?.menu);

  const aiEnabled = profile?.aiEnabled;

  if (messCommunities.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
        <UtensilsCrossed className="mx-auto h-6 w-6 text-gray-300" />
        <p className="mt-2 text-sm font-medium text-gray-800">No Mess community yet</p>
        <p className="mt-1 text-xs text-gray-500">
          Join a Mess (Accountability) community first — then one upload shares the menu with everyone in it.
        </p>
      </div>
    );
  }

  const handleFile = async (file) => {
    if (!file) return;
    setParsing(true);
    setMessage('');
    const dataUrl = await fileToDataUrl(file);
    const result = await parseDocument('menu', dataUrl);
    setParsing(false);
    if (result?.available && result.menu && Object.keys(result.menu).length) {
      setMenu(emptyMenu(result.menu));
      setEditing(true);
      setMessage('Gemini parsed the menu. Review and save to share with your community.');
    } else {
      setEditing(true);
      setMessage(result?.message || 'Could not auto-parse. Fill the menu manually below.');
    }
  };

  const updateCell = (day, meal, value) =>
    setMenu((prev) => ({ ...prev, [day]: { ...prev[day], [meal]: value } }));

  const handleSave = async () => {
    if (!nodeId) return;
    setSaving(true);
    const res = await saveMenu(nodeId, menu);
    setSaving(false);
    if (res) {
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved?.(res);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Mess community
          <select
            value={nodeId}
            onChange={(e) => setNodeId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            {messCommunities.map((c) => (
              <option key={c.nodeId} value={c.nodeId}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
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

      <p className="flex items-center gap-1.5 text-xs text-gray-500">
        <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
        {aiEnabled
          ? 'Upload the mess board photo — Gemini fills the weekly grid. One upload updates everyone in the community.'
          : 'AI parsing is off. Fill the grid manually — it still shares with everyone in the community.'}
      </p>
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
        disabled={saving || !nodeId}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
        {saved ? 'Saved & shared' : 'Save menu for community'}
      </button>
    </div>
  );
}
