'use client';

import React, { useState } from 'react';
import { X, Loader2, ShieldQuestion, Upload, Plus, Trash2, Sparkles } from 'lucide-react';
import { NATURE_META, NATURE_ORDER } from './communityMeta';
import { createNode } from './communityApi';
import { parseDocument, fileToDataUrl } from '@/features/profileEngine/profileApi';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['breakfast', 'lunch', 'snacks', 'dinner'];

// Sub-types offered per nature (label -> stored nodeType).
const SUBTYPES = {
  accountability: [
    { label: 'Class', nodeType: 'Academic' },
    { label: 'Mess', nodeType: 'Mess' },
    { label: 'Gym', nodeType: 'Gym' },
    { label: 'General', nodeType: 'General' },
  ],
  wellbeing: [
    { label: 'Empathy Mesh', nodeType: 'Empathy' },
    { label: 'General', nodeType: 'General' },
  ],
};

function emptySlot() {
  return { day: 'Monday', subject: '', timeStart: '', timeEnd: '', room: '' };
}
function emptyMenu() {
  const m = {};
  for (const d of DAYS) m[d] = { breakfast: '', lunch: '', snacks: '', dinner: '' };
  return m;
}

export default function CreateCommunityModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nature, setNature] = useState('accountability');
  const [nodeType, setNodeType] = useState('Academic');
  const [slots, setSlots] = useState([emptySlot()]);
  const [menu, setMenu] = useState(emptyMenu);
  const [parsing, setParsing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isAccountability = nature === 'accountability';
  const isMess = nodeType === 'Mess';
  // Accountability (non-Mess) requires a timetable; Mess requires a menu.
  const needsTimetable = isAccountability && !isMess;
  const needsMenu = isAccountability && isMess;

  const onNatureChange = (key) => {
    setNature(key);
    setNodeType(SUBTYPES[key][0].nodeType);
    setError('');
  };

  // --- timetable editing ---
  const updateSlot = (i, patch) => setSlots((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const removeSlot = (i) => setSlots((prev) => prev.filter((_, idx) => idx !== i));
  const addSlot = () => setSlots((prev) => [...prev, emptySlot()]);

  // --- menu editing ---
  const updateCell = (day, meal, value) =>
    setMenu((prev) => ({ ...prev, [day]: { ...prev[day], [meal]: value } }));

  const handleUpload = async (file) => {
    if (!file) return;
    setParsing(true);
    setMessage('');
    const dataUrl = await fileToDataUrl(file);
    const type = needsMenu ? 'menu' : 'timetable';
    const result = await parseDocument(type, dataUrl);
    setParsing(false);
    if (needsMenu) {
      if (result?.available && result.menu && Object.keys(result.menu).length) {
        const next = emptyMenu();
        for (const d of DAYS) if (result.menu[d]) next[d] = { ...next[d], ...result.menu[d] };
        setMenu(next);
        setMessage('Gemini parsed the menu — review before creating.');
      } else {
        setMessage(result?.message || 'Could not auto-parse. Fill the menu manually.');
      }
    } else if (result?.available && result.slots?.length) {
      setSlots(result.slots);
      setMessage(`Gemini extracted ${result.slots.length} slots — review before creating.`);
    } else {
      setMessage(result?.message || 'Could not auto-extract. Add slots manually.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Community name is required.');
      return;
    }

    const cleanSlots = slots.filter((s) => s.subject?.trim());
    const menuHasContent = DAYS.some((d) => MEALS.some((m) => (menu[d][m] || '').trim()));

    if (needsTimetable && cleanSlots.length === 0) {
      setError('Accountability communities need a timetable. Add at least one class slot.');
      return;
    }
    if (needsMenu && !menuHasContent) {
      setError('A Mess community needs a menu. Fill in at least one meal.');
      return;
    }

    setSubmitting(true);
    const node = await createNode({
      name: name.trim(),
      description: description.trim(),
      nature,
      nodeType,
      baselineSchedule: needsTimetable ? cleanSlots : undefined,
      menu: needsMenu ? menu : undefined,
    });
    setSubmitting(false);
    if (node) onCreated?.(node);
    else setError('Could not create the community. Please check the timetable/menu and try again.');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Create a community</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. CSE-A 2027 Batch"
              autoFocus
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Description <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this community for?"
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Nature */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Nature</label>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {NATURE_ORDER.map((key) => {
                const meta = NATURE_META[key];
                const Icon = meta.Icon;
                const active = nature === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onNatureChange(key)}
                    className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all ${
                      active ? `border-transparent ring-2 ${meta.ring} ${meta.softBg}` : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? meta.text : 'text-gray-400'}`} />
                    <span className={`text-sm font-semibold ${active ? meta.text : 'text-gray-700'}`}>{meta.label}</span>
                    <span className="text-[11px] leading-tight text-gray-500">{meta.tagline}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-type */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Sub-type</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUBTYPES[nature].map((t) => {
                const active = nodeType === t.nodeType;
                return (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => {
                      setNodeType(t.nodeType);
                      setError('');
                    }}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition-all ${
                      active ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mandatory timetable / menu for accountability communities */}
          {(needsTimetable || needsMenu) && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-indigo-800">
                  <Sparkles className="h-4 w-4" />
                  {needsMenu ? 'Weekly mess menu (required)' : 'Class timetable (required)'}
                </p>
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">
                  {parsing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  {parsing ? 'Parsing…' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    disabled={parsing}
                    onChange={(e) => handleUpload(e.target.files?.[0])}
                  />
                </label>
              </div>
              {message && <p className="mt-2 text-[11px] font-medium text-indigo-700">{message}</p>}

              {/* Timetable editor */}
              {needsTimetable && (
                <div className="mt-3 space-y-2">
                  {slots.map((s, i) => (
                    <div key={i} className="grid grid-cols-12 gap-1.5">
                      <select
                        value={s.day}
                        onChange={(e) => updateSlot(i, { day: e.target.value })}
                        className="col-span-3 rounded-md border border-gray-300 px-1.5 py-1.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none"
                      >
                        {DAYS.map((d) => (
                          <option key={d} value={d}>
                            {d.slice(0, 3)}
                          </option>
                        ))}
                      </select>
                      <input
                        value={s.subject}
                        onChange={(e) => updateSlot(i, { subject: e.target.value })}
                        placeholder="Subject"
                        className="col-span-4 rounded-md border border-gray-300 px-2 py-1.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none"
                      />
                      <input
                        value={s.timeStart || ''}
                        onChange={(e) => updateSlot(i, { timeStart: e.target.value })}
                        placeholder="09:00"
                        className="col-span-2 rounded-md border border-gray-300 px-1.5 py-1.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none"
                      />
                      <input
                        value={s.room || ''}
                        onChange={(e) => updateSlot(i, { room: e.target.value })}
                        placeholder="Room"
                        className="col-span-2 rounded-md border border-gray-300 px-1.5 py-1.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeSlot(i)}
                        className="col-span-1 flex items-center justify-center rounded-md text-gray-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSlot}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add slot
                  </button>
                </div>
              )}

              {/* Menu editor */}
              {needsMenu && (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full border-collapse text-[11px]">
                    <thead>
                      <tr className="text-left text-gray-400">
                        <th className="p-1 font-semibold uppercase">Day</th>
                        {MEALS.map((m) => (
                          <th key={m} className="p-1 font-semibold capitalize">
                            {m}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {DAYS.map((day) => (
                        <tr key={day} className="border-t border-indigo-100/60">
                          <td className="p-1 font-semibold text-gray-700">{day.slice(0, 3)}</td>
                          {MEALS.map((meal) => (
                            <td key={meal} className="p-0.5">
                              <input
                                value={menu[day][meal]}
                                onChange={(e) => updateCell(day, meal, e.target.value)}
                                placeholder="—"
                                className="w-full rounded border border-gray-200 px-1.5 py-1 text-[11px] text-gray-900 focus:border-indigo-500 focus:outline-none"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Privacy notice — every community is invite-only now. */}
          <div className="flex items-start gap-2 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
            <ShieldQuestion className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
            <p className="text-[11px] leading-snug text-indigo-700">
              <span className="font-semibold text-indigo-800">Private &amp; invite-only.</span> Every community is hidden
              from discovery. Share its invite code so others can join.
            </p>
          </div>

          {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !name.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Create community
          </button>
        </div>
      </div>
    </div>
  );
}
