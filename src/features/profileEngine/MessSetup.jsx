'use client';

import React, { useState } from 'react';
import { Upload, Loader2, Check, UtensilsCrossed, Sparkles, Users, User } from 'lucide-react';
import { parseDocument, saveMenu, savePersonalMenu, fileToDataUrl } from './profileApi';

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
  const hasCommunity = messCommunities.length > 0;

  // 'personal' = the user's own menu; 'community' = shared with a Mess group.
  const [mode, setMode] = useState(hasCommunity ? 'community' : 'personal');
  const [nodeId, setNodeId] = useState(profile?.primaryMessNodeId || messCommunities[0]?.nodeId || '');

  // Seed each mode from its own source.
  const [communityMenu, setCommunityMenu] = useState(() => emptyMenu(profile?.menu?.menu));
  const [personalMenu, setPersonalMenu] = useState(() => emptyMenu(profile?.personalMenu));

  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState('');

  const aiEnabled = profile?.aiEnabled;
  const isPersonal = mode === 'personal';
  const menu = isPersonal ? personalMenu : communityMenu;
  const setMenu = isPersonal ? setPersonalMenu : setCommunityMenu;

  const handleFile = async (file) => {
    if (!file) return;
    setParsing(true);
    setMessage('');
    const dataUrl = await fileToDataUrl(file);
    const result = await parseDocument('menu', dataUrl);
    setParsing(false);
    if (result?.available && result.menu && Object.keys(result.menu).length) {
      setMenu(emptyMenu(result.menu));
      setMessage(
        isPersonal
          ? 'Gemini parsed the menu. Review and save it to your personal profile.'
          : 'Gemini parsed the menu. Review and save to share with your community.'
      );
    } else {
      setMessage(result?.message || 'Could not auto-parse. Fill the menu manually below.');
    }
  };

  const updateCell = (day, meal, value) =>
    setMenu((prev) => ({ ...prev, [day]: { ...prev[day], [meal]: value } }));

  const handleSave = async () => {
    setSaving(true);
    let res;
    if (isPersonal) {
      res = await savePersonalMenu(personalMenu);
    } else {
      if (!nodeId) {
        setSaving(false);
        return;
      }
      res = await saveMenu(nodeId, communityMenu);
    }
    setSaving(false);
    if (res) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved?.(res);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode toggle: personal vs community */}
      <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1">
        <button
          type="button"
          onClick={() => {
            setMode('personal');
            setMessage('');
          }}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            isPersonal ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <User className="h-3.5 w-3.5" /> My personal menu
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('community');
            setMessage('');
          }}
          disabled={!hasCommunity}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
            !isPersonal ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="h-3.5 w-3.5" /> Community menu
        </button>
      </div>

      {isPersonal ? (
        <p className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
          <User className="h-3.5 w-3.5 shrink-0" />
          Your personal mess menu is private to you and powers food nudges even without a Mess community.
        </p>
      ) : !hasCommunity ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <UtensilsCrossed className="mx-auto h-6 w-6 text-gray-300" />
          <p className="mt-2 text-sm font-medium text-gray-800">No Mess community yet</p>
          <p className="mt-1 text-xs text-gray-500">
            Join a Mess community to share a menu — or keep your own under &quot;My personal menu&quot;.
          </p>
        </div>
      ) : (
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
        </div>
      )}

      {/* Upload + grid (hidden only for the empty community state) */}
      {(isPersonal || hasCommunity) && (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              {aiEnabled
                ? 'Upload a mess board photo — Gemini fills the weekly grid.'
                : 'AI parsing is off. Fill the grid manually below.'}
              {!isPersonal && ' One upload updates everyone in the community.'}
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
            disabled={saving || (!isPersonal && !nodeId)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
            {saved ? 'Saved' : isPersonal ? 'Save my menu' : 'Save menu for community'}
          </button>
        </>
      )}
    </div>
  );
}
