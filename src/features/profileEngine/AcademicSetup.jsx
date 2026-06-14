'use client';

import React, { useState } from 'react';
import { Upload, Loader2, Plus, Trash2, Check, CalendarRange, Sparkles } from 'lucide-react';
import { parseDocument, saveSchedule, fileToDataUrl } from './profileApi';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function emptySlot() {
  return { day: 'Monday', subject: '', timeStart: '', timeEnd: '', room: '' };
}

export default function AcademicSetup({ profile, onSaved }) {
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState('');
  // Draft slots being confirmed/edited. Seeded from any saved schedule.
  const [slots, setSlots] = useState(() => (profile?.schedule?.length ? profile.schedule : []));
  const [editing, setEditing] = useState(!profile?.schedule?.length);

  const aiEnabled = profile?.aiEnabled;

  const handleFile = async (file) => {
    if (!file) return;
    setParsing(true);
    setMessage('');
    const dataUrl = await fileToDataUrl(file);
    const result = await parseDocument('timetable', dataUrl);
    setParsing(false);
    if (result?.available && result.slots?.length) {
      setSlots(result.slots);
      setEditing(true);
      setMessage(`Gemini extracted ${result.slots.length} class slots. Review and save.`);
    } else {
      setEditing(true);
      setMessage(result?.message || 'Could not auto-extract. Add slots manually below.');
    }
  };

  const updateSlot = (i, patch) => setSlots((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const removeSlot = (i) => setSlots((prev) => prev.filter((_, idx) => idx !== i));
  const addSlot = () => setSlots((prev) => [...prev, emptySlot()]);

  const handleSave = async () => {
    setSaving(true);
    const clean = slots.filter((s) => s.subject?.trim());
    const res = await saveSchedule(clean);
    setSaving(false);
    if (res) {
      setSlots(res.slots);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved?.(res.slots);
    }
  };

  const grouped = DAYS.map((d) => ({ day: d, items: slots.filter((s) => s.day === d) })).filter(
    (g) => g.items.length
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-800">
          <Sparkles className="h-4 w-4" /> Upload your official ERP timetable
        </div>
        <p className="mt-1 text-xs text-indigo-700/80">
          {aiEnabled
            ? 'Image or PDF — Gemini extracts the grid into editable slots you confirm before saving.'
            : 'AI parsing is off (no GEMINI_API_KEY). You can still add slots manually below.'}
        </p>
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
          {parsing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {parsing ? 'Parsing…' : 'Upload timetable'}
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            disabled={parsing}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
        {message && <p className="mt-2 text-xs font-medium text-indigo-700">{message}</p>}
      </div>

      {/* Saved view */}
      {!editing && grouped.length > 0 && (
        <div className="space-y-3">
          {grouped.map((g) => (
            <div key={g.day} className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">{g.day}</p>
              <ul className="space-y-1.5">
                {g.items.map((s, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-800">{s.subject}</span>
                    <span className="text-xs text-gray-500">
                      {s.timeStart || '—'}
                      {s.timeEnd ? `–${s.timeEnd}` : ''} {s.room ? `· ${s.room}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button
            onClick={() => setEditing(true)}
            className="text-sm font-semibold text-indigo-600 hover:underline"
          >
            Edit schedule
          </button>
        </div>
      )}

      {/* Editable confirm table */}
      {editing && (
        <div className="space-y-2">
          {slots.length === 0 && (
            <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-3 text-sm text-gray-500">
              <CalendarRange className="h-4 w-4" /> No slots yet. Upload a timetable or add rows.
            </p>
          )}
          {slots.map((s, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 rounded-lg border border-gray-100 bg-white p-2">
              <select
                value={s.day}
                onChange={(e) => updateSlot(i, { day: e.target.value })}
                className="col-span-3 rounded-md border border-gray-300 px-2 py-1.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none"
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
                className="col-span-2 rounded-md border border-gray-300 px-2 py-1.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
              <input
                value={s.room || ''}
                onChange={(e) => updateSlot(i, { room: e.target.value })}
                placeholder="Room"
                className="col-span-2 rounded-md border border-gray-300 px-2 py-1.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={() => removeSlot(i)}
                className="col-span-1 flex items-center justify-center rounded-md text-gray-400 hover:bg-rose-50 hover:text-rose-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={addSlot}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" /> Add slot
            </button>
            <button
              onClick={handleSave}
              disabled={saving || slots.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
              {saved ? 'Saved' : 'Save schedule'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
