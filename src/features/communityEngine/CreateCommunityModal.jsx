'use client';

import React, { useState } from 'react';
import { X, Loader2, Globe, Lock, ShieldQuestion } from 'lucide-react';
import { NATURE_META, NATURE_ORDER, NODE_TYPES } from './communityMeta';
import { createNode } from './communityApi';

const VISIBILITY = [
  {
    value: 'public',
    label: 'Public',
    Icon: Globe,
    hint: 'Discoverable by everyone on campus.',
  },
  {
    value: 'private',
    label: 'Private',
    Icon: ShieldQuestion,
    hint: 'Hidden. Join only via invite code.',
  },
];

export default function CreateCommunityModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nature, setNature] = useState('accountability');
  const [visibility, setVisibility] = useState('public');
  const [joinPolicy, setJoinPolicy] = useState('open');
  const [nodeType, setNodeType] = useState('Academic');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    const node = await createNode({
      name: name.trim(),
      description: description.trim(),
      nature,
      visibility,
      joinPolicy: visibility === 'public' ? joinPolicy : 'locked',
      nodeType,
    });
    setSubmitting(false);
    if (node) onCreated?.(node);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Create a community</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Name
            </label>
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
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Nature
            </label>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {NATURE_ORDER.map((key) => {
                const meta = NATURE_META[key];
                const Icon = meta.Icon;
                const active = nature === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setNature(key)}
                    className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all ${
                      active
                        ? `border-transparent ring-2 ${meta.ring} ${meta.softBg}`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? meta.text : 'text-gray-400'}`} />
                    <span className={`text-sm font-semibold ${active ? meta.text : 'text-gray-700'}`}>
                      {meta.label}
                    </span>
                    <span className="text-[11px] leading-tight text-gray-500">{meta.tagline}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Visibility
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {VISIBILITY.map((v) => {
                const Icon = v.Icon;
                const active = visibility === v.value;
                return (
                  <button
                    key={v.value}
                    type="button"
                    onClick={() => setVisibility(v.value)}
                    className={`flex items-start gap-2 rounded-xl border p-3 text-left transition-all ${
                      active
                        ? 'border-transparent bg-indigo-50 ring-2 ring-indigo-100'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`mt-0.5 h-4 w-4 ${active ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span>
                      <span className={`block text-sm font-semibold ${active ? 'text-indigo-700' : 'text-gray-700'}`}>
                        {v.label}
                      </span>
                      <span className="text-[11px] leading-tight text-gray-500">{v.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Join policy (public only) */}
          {visibility === 'public' && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Join policy
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setJoinPolicy('open')}
                  className={`flex items-center gap-2 rounded-xl border p-3 text-left transition-all ${
                    joinPolicy === 'open'
                      ? 'border-transparent bg-emerald-50 ring-2 ring-emerald-100'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Globe className={`h-4 w-4 ${joinPolicy === 'open' ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-semibold ${joinPolicy === 'open' ? 'text-emerald-700' : 'text-gray-700'}`}>
                    Unlocked
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setJoinPolicy('locked')}
                  className={`flex items-center gap-2 rounded-xl border p-3 text-left transition-all ${
                    joinPolicy === 'locked'
                      ? 'border-transparent bg-amber-50 ring-2 ring-amber-100'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Lock className={`h-4 w-4 ${joinPolicy === 'locked' ? 'text-amber-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-semibold ${joinPolicy === 'locked' ? 'text-amber-700' : 'text-gray-700'}`}>
                    Locked (approval)
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Type tag */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Category tag
            </label>
            <select
              value={nodeType}
              onChange={(e) => setNodeType(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              {NODE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
          >
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
