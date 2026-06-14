'use client';

import React, { useState } from 'react';
import {
  Plus,
  Users,
  Lock,
  Globe,
  ShieldQuestion,
  Crown,
  UserPlus,
  Loader2,
  Check,
  Clock,
  KeyRound,
  Compass,
} from 'lucide-react';
import { NATURE_ORDER, natureOf } from './communityMeta';

function VisibilityIcon({ node, className }) {
  if (node.visibility === 'private') return <ShieldQuestion className={className} />;
  if (node.joinPolicy === 'locked') return <Lock className={className} />;
  return <Globe className={className} />;
}

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
          <VisibilityIcon node={node} className="h-3 w-3" />
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

function DiscoverRow({ node, busy, onJoin }) {
  const meta = natureOf(node.nature);
  const locked = node.joinPolicy === 'locked';
  return (
    <li className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 px-3 py-2.5">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
          <span className="truncate text-sm font-semibold text-gray-800">{node.name}</span>
          {locked && <Lock className="h-3 w-3 shrink-0 text-amber-500" />}
        </div>
        <span className="ml-3.5 flex items-center gap-1 text-[11px] text-gray-400">
          <Users className="h-3 w-3" /> {node.memberCount} · <span className="capitalize">{node.nature}</span>
        </span>
      </div>
      {node.isPending ? (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] font-semibold text-amber-700">
          <Clock className="h-3 w-3" /> Requested
        </span>
      ) : (
        <button
          onClick={() => onJoin(node)}
          disabled={busy}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-[11px] font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : locked ? (
            <Lock className="h-3 w-3" />
          ) : (
            <UserPlus className="h-3 w-3" />
          )}
          {locked ? 'Request' : 'Join'}
        </button>
      )}
    </li>
  );
}

export default function CommunitySidebar({
  myNodes,
  discoverNodes,
  selectedNodeId,
  onSelect,
  onJoin,
  onJoinByCode,
  onCreateClick,
  busyId,
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
            You haven&apos;t joined any communities yet. Discover or create one below.
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

      {/* Discover */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 flex items-center gap-1.5 px-1 text-xs font-bold uppercase tracking-wide text-gray-400">
          <Compass className="h-3.5 w-3.5" /> Discover public
        </h3>
        {discoverNodes.length === 0 ? (
          <p className="px-1 py-2 text-xs text-gray-400">
            No public communities to join right now.
          </p>
        ) : (
          <ul className="space-y-2">
            {discoverNodes.map((n) => (
              <DiscoverRow key={n.nodeId} node={n} busy={busyId === n.nodeId} onJoin={onJoin} />
            ))}
          </ul>
        )}

        {/* Invite code (private) */}
        <form onSubmit={handleCode} className="mt-4 border-t border-gray-100 pt-4">
          <label className="mb-1.5 flex items-center gap-1.5 px-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">
            <KeyRound className="h-3.5 w-3.5" /> Have an invite code?
          </label>
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
