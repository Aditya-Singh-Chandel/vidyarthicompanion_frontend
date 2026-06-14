'use client';

import React, { useState } from 'react';
import { ScanLine, Loader2, Plus, Bell } from 'lucide-react';

const SAMPLE =
  'Paid Rs.150 to Campus Cafe via Amazon Pay UPI. Note: cold coffee';

/**
 * Stand-in for the Android Notification Listener / SMS parser. Lets the user
 * paste a real payment alert (parsed server-side) or quick-add a payment.
 */
export default function CaptureTransaction({ onCapture }) {
  const [mode, setMode] = useState('paste'); // 'paste' | 'manual'
  const [raw, setRaw] = useState('');
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    let payload;
    if (mode === 'paste') {
      if (!raw.trim()) return setBusy(false);
      payload = { raw: raw.trim(), source: 'notification' };
    } else {
      const amt = Number(amount);
      if (!merchant.trim() || !amt || amt <= 0) return setBusy(false);
      payload = { merchant: merchant.trim(), amount: amt, note: note.trim() || undefined, source: 'manual' };
    }
    const ok = await onCapture(payload);
    setBusy(false);
    if (ok) {
      setRaw('');
      setMerchant('');
      setAmount('');
      setNote('');
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="inline-flex items-center gap-2 text-sm font-bold text-gray-800">
          <Bell className="h-4 w-4 text-indigo-600" /> Capture a payment
        </h3>
        <div className="flex rounded-lg bg-gray-100 p-0.5 text-xs font-semibold">
          <button
            onClick={() => setMode('paste')}
            className={`rounded-md px-2.5 py-1 ${mode === 'paste' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500'}`}
          >
            Paste alert
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`rounded-md px-2.5 py-1 ${mode === 'manual' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500'}`}
          >
            Quick add
          </button>
        </div>
      </div>

      <form onSubmit={submit}>
        {mode === 'paste' ? (
          <>
            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={3}
              placeholder={`Paste a payment SMS / notification, e.g.\n"${SAMPLE}"`}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="button"
              onClick={() => setRaw(SAMPLE)}
              className="mt-1.5 text-[11px] font-medium text-indigo-600 hover:underline"
            >
              Use a sample alert
            </button>
          </>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="Merchant (e.g. Local Dhaba)"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 sm:col-span-2"
            />
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount ₹"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note (optional, helps auto-tag)"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === 'paste' ? <ScanLine className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {busy ? 'Parsing…' : mode === 'paste' ? 'Parse & capture' : 'Add payment'}
        </button>
      </form>
    </div>
  );
}
