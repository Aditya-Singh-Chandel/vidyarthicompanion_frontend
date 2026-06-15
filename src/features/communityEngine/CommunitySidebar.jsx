'use client';

import React, { useState } from 'react';
import {
  Plus,
  Users,
  ShieldQuestion,
  Crown,
  Loader2,
  Check,
  KeyRound,
} from 'lucide-react';
import { NATURE_ORDER, natureOf } from './communityMeta';

function MyCommunityRow({ node, active, onSelect }) {
  const meta = natureOf(node.nature);
  const Icon = meta.Icon;
  return (
    <button
      onClick={() => onSelect(node.nodeId)}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
        active
          ? `${meta.softBg} ring-1 ring-inset ${meta.ring}`
          : 'hover:bg-gray-50'
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.chip}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className={`truncate text-sm font-semibold ${active ? meta.text : 'text-gray-800'}`}>
            {node.name}
          </span>
          {node.isCr && <Crown className="h-3 w-3 shrink-0 text-amber-500" />}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <ShieldQuestion className="h-3 w-3" />
          <span className="capitalize">{node.nature}</span>
          <span aria-hidden>·</span>
          <Users className="h-3 w-3" />
          {node.memberCount}
        </span>
      </span>
      {node.isCr && node.pendingCount > 0 && (
        <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
          {node.pendingCount}
        </span>
      )}
    </button>
  );
}

export default function CommunitySidebar({
  myNodes,
  selectedNodeId,
  onSelect,
  onJoinByCode,
  onCreateClick,
}) {
  const [code, setCode] = useState('');
  const [codeBusy, setCodeBusy] = useState(false);
  const [codeError, setCodeError] = useState('');

  const grouped = NATURE_ORDER.map((nature) => ({
    nature,
    nodes: myNodes.filter((n) => n.nature === nature),
  })).filter((g) => g.nodes.length > 0);

  const handleCode = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setCodeBusy(true);
    setCodeError('');
    const res = await onJoinByCode(code.trim());
    setCodeBusy(false);
    if (res?.status === 'joined') {
      setCode('');
    } else {
      setCodeError(res?.message || 'Invalid invite code.');
    }
  };

  return (
    <aside className="flex w-full flex-col gap-6 lg:w-80 lg:shrink-0">
      <button
        onClick={onCreateClick}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700"
      >
        <Plus className="h-4 w-4" /> Create community
      </button>

      {/* Your communities */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 px-1 text-xs font-bold uppercase tracking-wide text-gray-400">
          Your communities
        </h3>
        {myNodes.length === 0 ? (
          <p className="px-1 py-2 text-xs text-gray-400">
            You haven&apos;t joined any communities yet. Enter an invite code below or create one.
          </p>
        ) : (
          <div className="space-y-4">
            {grouped.map((g) => {
              const meta = natureOf(g.nature);
              return (
                <div key={g.nature}>
                  <p className={`mb-1 flex items-center gap-1.5 px-1 text-[11px] font-bold uppercase tracking-wide ${meta.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </p>
                  <div className="space-y-0.5">
                    {g.nodes.map((n) => (
                      <MyCommunityRow
                        key={n.nodeId}
                        node={n}
                        active={n.nodeId === selectedNodeId}
                        onSelect={onSelect}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Join with an invite code — the only way into a (private) community. */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-1 flex items-center gap-1.5 px-1 text-xs font-bold uppercase tracking-wide text-gray-400">
          <KeyRound className="h-3.5 w-3.5" /> Join with an invite code
        </h3>
        <p className="mb-3 px-1 text-[11px] leading-snug text-gray-400">
          Every community is private. Ask an admin for the code (e.g. FLOW-XXXXX).
        </p>
        <form onSubmit={handleCode}>
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setCodeError('');
              }}
              placeholder="FLOW-XXXXX"
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase text-gray-900 placeholder:normal-case focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="submit"
              disabled={codeBusy || !code.trim()}
              className="inline-flex shrink-0 items-center rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {codeBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </button>
          </div>
          {codeError && <p className="mt-1.5 px-1 text-[11px] font-medium text-rose-600">{codeError}</p>}
        </form>
      </div>
    </aside>
  );
}
