'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Crown,
  Lock,
  Globe,
  ShieldQuestion,
  ShieldCheck,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  MapPin,
  CalendarClock,
  LogOut,
  Copy,
  Check,
  ArrowUpRight,
  Inbox,
  UserCheck,
  Sparkles,
  UtensilsCrossed,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { natureOf, statusOf } from './communityMeta';
import {
  getNodeFeed,
  voteOnEvent,
  leaveNode,
  getNodeMembers,
  approveRequest,
  promoteMember,
  getMessVotes,
  castMessVote,
  updateBaseline,
} from './communityApi';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function emptySlot() {
  return { day: 'Monday', subject: '', timeStart: '', timeEnd: '', room: '' };
}

function formatWhen(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** A small echoes-vs-flags consensus bar. */
function ConsensusMeter({ echoes, flags }) {
  const total = echoes + flags;
  const pct = total === 0 ? 50 : Math.round((echoes / total) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-rose-200">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] font-medium text-gray-500">
        {echoes} echo · {flags} flag
      </span>
    </div>
  );
}

function UpdateCard({ update, votingEnabled, onVote, busy }) {
  const status = statusOf(update.status);
  const StatusIcon = status.Icon;
  return (
    <li className={`rounded-xl border p-4 shadow-sm transition-all ${votingEnabled ? status.card : 'border-gray-100 bg-white'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">{update.eventName}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5" /> {formatWhen(update.date)}
            </span>
            {update.location && update.location !== 'TBD' && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {update.location}
              </span>
            )}
          </div>
        </div>
        {votingEnabled && (
          <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.chip}`}>
            <StatusIcon className="h-3.5 w-3.5" />
            {status.label}
          </span>
        )}
      </div>

      {votingEnabled && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <ConsensusMeter echoes={update.echoes} flags={update.flags} />
          <div className="flex gap-2">
            <button
              onClick={() => onVote(update.id, 1)}
              disabled={busy}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                update.myVote === 1
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <ThumbsUp className="h-3.5 w-3.5" /> Echo
            </button>
            <button
              onClick={() => onVote(update.id, -1)}
              disabled={busy}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                update.myVote === -1
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              <ThumbsDown className="h-3.5 w-3.5" /> Flag
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

/** Admin management: approve pending requests + promote members to admin. */
function ManagePanel({ nodeId, onChanged }) {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [pending, setPending] = useState([]);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    const data = await getNodeMembers(nodeId);
    setMembers(data?.members || []);
    setPending(data?.pending || []);
    setLoading(false);
  }, [nodeId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getNodeMembers(nodeId);
      if (cancelled) return;
      setMembers(data?.members || []);
      setPending(data?.pending || []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [nodeId]);

  const approve = async (userId) => {
    setBusyId(`a-${userId}`);
    if (await approveRequest(nodeId, userId)) {
      await load();
      onChanged?.();
    }
    setBusyId(null);
  };

  const promote = async (userId) => {
    setBusyId(`p-${userId}`);
    if (await promoteMember(nodeId, userId)) {
      await load();
      onChanged?.();
    }
    setBusyId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-400 shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading members…
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {pending.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-700">
            <Inbox className="h-3.5 w-3.5" /> Pending requests
          </p>
          <ul className="space-y-2">
            {pending.map((p) => (
              <li key={p.userId} className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2">
                <span className="text-sm font-medium text-gray-800">{p.name}</span>
                <button
                  onClick={() => approve(p.userId)}
                  disabled={busyId === `a-${p.userId}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {busyId === `a-${p.userId}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserCheck className="h-3.5 w-3.5" />}
                  Approve
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-400">
          <Users className="h-3.5 w-3.5" /> Members ({members.length})
        </p>
        <ul className="space-y-2">
          {members.map((m) => (
            <li key={m.userId} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                {m.name}
                {m.isAdmin && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                    <Crown className="h-3 w-3" /> Admin
                  </span>
                )}
              </span>
              {!m.isAdmin && (
                <button
                  onClick={() => promote(m.userId)}
                  disabled={busyId === `p-${m.userId}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
                >
                  {busyId === `p-${m.userId}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                  Make admin
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Mess community per-meal voting (Eatable / Leave), time-gated to the current meal. */
function MessMealVoting({ nodeId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const d = await getMessVotes(nodeId);
      if (cancelled) return;
      setData(d);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [nodeId]);

  const vote = async (verdict) => {
    if (!data) return;
    setBusy(true);
    const res = await castMessVote(nodeId, verdict, data.currentSlot);
    if (res) {
      setData((prev) => ({
        ...prev,
        slots: res.slots,
        myVotes: { ...prev.myVotes, [prev.currentSlot]: res.myVerdict },
      }));
    }
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-amber-100 bg-amber-50/40 p-4 text-sm text-amber-700">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading today&apos;s meal vote…
      </div>
    );
  }
  if (!data) return null;

  const slot = data.currentSlot;
  const tally = data.slots?.[slot] || { eatable: 0, leave: 0, total: 0 };
  const myVote = data.myVotes?.[slot] || null;
  const total = tally.eatable + tally.leave;
  const eatablePct = total === 0 ? 50 : Math.round((tally.eatable / total) * 100);

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-sm font-bold text-amber-900">
          <UtensilsCrossed className="h-4 w-4" /> Today&apos;s {slot} — is it eatable?
        </p>
        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
          {total} {total === 1 ? 'vote' : 'votes'}
        </span>
      </div>
      {data.currentDish && (
        <p className="mt-1 text-xs text-amber-800">
          On the menu: <span className="font-semibold">{data.currentDish}</span>
        </p>
      )}

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => vote('eatable')}
          disabled={busy}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
            myVote === 'eatable' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          <ThumbsUp className="h-4 w-4" /> Eatable
        </button>
        <button
          onClick={() => vote('leave')}
          disabled={busy}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
            myVote === 'leave' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          }`}
        >
          <ThumbsDown className="h-4 w-4" /> Leave
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-rose-200">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${eatablePct}%` }} />
        </div>
        <span className="text-[11px] font-medium text-gray-500">
          {tally.eatable} eatable · {tally.leave} leave
        </span>
      </div>
      <p className="mt-2 text-[11px] text-amber-700/80">
        A &quot;Leave&quot; majority nudges PocketBuddy to suggest a wallet-safe meal outside.
      </p>
    </div>
  );
}

/** Admin-only editor for a Class community's baseline timetable. */
function BaselineEditor({ node, onSaved }) {
  const [slots, setSlots] = useState(() =>
    node.baselineSchedule?.length ? node.baselineSchedule.map((s) => ({ ...s })) : [emptySlot()]
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateSlot = (i, patch) => setSlots((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const removeSlot = (i) => setSlots((prev) => prev.filter((_, idx) => idx !== i));
  const addSlot = () => setSlots((prev) => [...prev, emptySlot()]);

  const handleSave = async () => {
    const clean = slots.filter((s) => s.subject?.trim());
    if (!clean.length) return;
    setSaving(true);
    const res = await updateBaseline(node.nodeId, { schedule: clean });
    setSaving(false);
    if (res) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved?.();
    }
  };

  return (
    <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Community timetable</p>
      <p className="text-[11px] text-gray-500">
        Members who join sync this timetable to their profile &amp; Master Calendar.
      </p>
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
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={addSlot}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
        >
          <Plus className="h-3.5 w-3.5" /> Add slot
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : null}
          {saved ? 'Saved' : 'Save timetable'}
        </button>
      </div>
    </div>
  );
}

export default function CommunityPanel({ nodeId, onMembershipChange }) {
  const [loading, setLoading] = useState(true);
  const [node, setNode] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [voteBusyId, setVoteBusyId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [showBaseline, setShowBaseline] = useState(false);

  const load = useCallback(async () => {
    const data = await getNodeFeed(nodeId);
    setNode(data?.node || null);
    setUpdates(data?.updates || []);
    setLoading(false);
  }, [nodeId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getNodeFeed(nodeId);
      if (cancelled) return;
      setNode(data?.node || null);
      setUpdates(data?.updates || []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [nodeId]);

  const handleVote = async (eventId, voteType) => {
    setVoteBusyId(eventId);
    const result = await voteOnEvent(eventId, voteType);
    if (result) {
      setUpdates((prev) =>
        prev.map((u) =>
          u.id === eventId
            ? {
                ...u,
                status: result.status,
                consensusScore: result.consensusScore,
                echoes: result.echoes ?? u.echoes,
                flags: result.flags ?? u.flags,
                myVote: voteType,
              }
            : u
        )
      );
    }
    setVoteBusyId(null);
  };

  const handleLeave = async () => {
    const ok = await leaveNode(nodeId);
    if (ok) onMembershipChange?.(true);
  };

  const copyInvite = async () => {
    if (!node?.inviteCode) return;
    try {
      await navigator.clipboard.writeText(node.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white py-24 text-sm text-gray-400 shadow-sm">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading community…
      </div>
    );
  }

  if (!node) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white py-24 text-sm text-gray-400 shadow-sm">
        Could not load this community.
      </div>
    );
  }

  const meta = natureOf(node.nature);
  const NatureIcon = meta.Icon;
  const VisIcon = node.visibility === 'private' ? ShieldQuestion : node.joinPolicy === 'locked' ? Lock : Globe;
  const visLabel =
    node.visibility === 'private' ? 'Private' : node.joinPolicy === 'locked' ? 'Public · Locked' : 'Public';
  const verifiedCount = updates.filter((u) => u.status === 'verified').length;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-5">
      {/* Header */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className={`flex items-start gap-4 p-5 ${meta.softBg}`}>
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${meta.chip}`}>
            <NatureIcon className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-gray-900">{node.name}</h2>
              {node.isAdmin && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                  <Crown className="h-3 w-3" /> Admin
                </span>
              )}
            </div>
            {node.description && <p className="mt-1 text-sm text-gray-600">{node.description}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${meta.chip}`}>
                <NatureIcon className="h-3 w-3" /> {meta.label}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 font-semibold text-gray-600 ring-1 ring-inset ring-gray-200">
                <VisIcon className="h-3 w-3" /> {visLabel}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 font-semibold text-gray-600 ring-1 ring-inset ring-gray-200">
                <Users className="h-3 w-3" /> {node.memberCount} members
              </span>
            </div>
          </div>
          <button
            onClick={handleLeave}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-rose-600"
          >
            <LogOut className="h-3.5 w-3.5" /> Leave
          </button>
        </div>

        {/* Admin controls: invite code + manage members/requests */}
        {node.isAdmin && (
          <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 px-5 py-3">
            {node.inviteCode && (
              <button
                onClick={copyInvite}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                Invite: {node.inviteCode}
              </button>
            )}
            <button
              onClick={() => setShowManage((s) => !s)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              <Users className="h-3.5 w-3.5" /> Manage members
              {node.pendingCount > 0 && (
                <span className="rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
                  {node.pendingCount}
                </span>
              )}
            </button>
            {node.nodeType === 'Academic' && (
              <button
                onClick={() => setShowBaseline((s) => !s)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-100"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit timetable
              </button>
            )}
          </div>
        )}
      </div>

      {showManage && node.isAdmin && (
        <ManagePanel
          nodeId={nodeId}
          onChanged={() => {
            load();
            onMembershipChange?.();
          }}
        />
      )}

      {showBaseline && node.isAdmin && node.nodeType === 'Academic' && (
        <BaselineEditor node={node} onSaved={load} />
      )}

      {/* Mess communities: per-meal Eatable / Leave voting for the current meal. */}
      {node.nodeType === 'Mess' && <MessMealVoting nodeId={nodeId} />}

      {/* Verified flow banner for accountability communities */}
      {node.votingEnabled && (
        <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-2.5 text-xs text-indigo-700">
          <ArrowUpRight className="h-4 w-4 shrink-0" />
          <span>
            <span className="font-semibold">{verifiedCount} verified</span> update
            {verifiedCount === 1 ? '' : 's'} flow to your Dashboard &amp; Master Calendar. Echo to confirm,
            Flag to correct AI mistakes — once flags catch up to echoes, an update drops back out.
          </span>
        </div>
      )}

      {node.nature === 'wellbeing' && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-2.5 text-xs text-emerald-700">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>This circle quietly receives anonymous Empathy Nudges when a member&apos;s wellness dips.</span>
        </div>
      )}

      {/* Feed */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">Community updates</h3>
        {updates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-14 text-center">
            <p className="text-sm font-medium text-gray-800">No updates yet</p>
            <p className="mt-1 text-xs text-gray-500">
              Share a schedule to this community from the Dashboard&apos;s Override Engine and it will appear here.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {updates.map((u) => (
              <UpdateCard
                key={u.id}
                update={u}
                votingEnabled={node.votingEnabled}
                onVote={handleVote}
                busy={voteBusyId === u.id}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
