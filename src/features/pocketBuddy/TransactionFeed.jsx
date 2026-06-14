'use client';

import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Loader2, ReceiptText } from 'lucide-react';
import { categoryOf, formatINR, TAGGABLE_CATEGORIES } from './pocketMeta';

function whenLabel(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function TransactionRow({ txn, onTag }) {
  const [busyCat, setBusyCat] = useState(null);
  const meta = categoryOf(txn.category);
  const CatIcon = meta.Icon;
  const credit = txn.type === 'credit';

  const handleTag = async (category) => {
    setBusyCat(category);
    await onTag(txn.id, category);
    setBusyCat(null);
  };

  return (
    <li className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            credit ? 'bg-emerald-100 text-emerald-700' : meta.chip
          }`}
        >
          {credit ? <ArrowDownLeft className="h-4 w-4" /> : <CatIcon className="h-4 w-4" />}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">{txn.merchantName || txn.vendor}</p>
          <p className="flex items-center gap-1.5 text-xs text-gray-400">
            {whenLabel(txn.createdAt)}
            {txn.note && <span className="truncate">· {txn.note}</span>}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className={`text-sm font-bold ${credit ? 'text-emerald-600' : 'text-gray-900'}`}>
            {credit ? '+' : '-'}
            {formatINR(txn.amount)}
          </p>
          {!txn.isUnknown && (
            <span className={`mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.chip}`}>
              <ArrowUpRight className="hidden" />
              {meta.label}
            </span>
          )}
        </div>
      </div>

      {/* Micro-friction tagging prompt for unknown vendors */}
      {txn.isUnknown && (
        <div className="mt-3 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-2.5">
          <p className="mb-2 text-xs font-medium text-gray-500">Where was this? Tap to tag (helps everyone).</p>
          <div className="flex flex-wrap gap-1.5">
            {TAGGABLE_CATEGORIES.map((cat) => {
              const cm = categoryOf(cat);
              const CIcon = cm.Icon;
              return (
                <button
                  key={cat}
                  onClick={() => handleTag(cat)}
                  disabled={busyCat !== null}
                  className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50"
                >
                  {busyCat === cat ? <Loader2 className="h-3 w-3 animate-spin" /> : <CIcon className="h-3 w-3" />}
                  {cm.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </li>
  );
}

export default function TransactionFeed({ transactions = [], onTag }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-gray-800">
        <ReceiptText className="h-4 w-4 text-indigo-600" /> Transaction history
      </h3>

      {transactions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">
          <p className="text-sm font-medium text-gray-800">No transactions yet</p>
          <p className="mt-1 text-xs text-gray-500">Capture a payment notification to start tracking.</p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {transactions.map((txn) => (
            <TransactionRow key={txn.id} txn={txn} onTag={onTag} />
          ))}
        </ul>
      )}
    </div>
  );
}
