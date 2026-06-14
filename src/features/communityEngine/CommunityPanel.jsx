'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Crown,
  Lock,
  Globe,
  ShieldQuestion,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Send,
  MapPin,
  CalendarClock,
  LogOut,
  Copy,
  Check,
  ArrowUpRight,
  Inbox,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { natureOf, statusOf } from './communityMeta';
import {
  getNodeFeed,
  postNodeUpdate,
  voteOnEvent,
  leaveNode,
  getNodeMembers,
  approveRequest,
} from './communityApi';

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

function Composer({ votingEnabled, nature, onPost, posting }) {
  const [title, setTitle] = useState('');
  const [datetime, setDatetime] = useState('');
  const [location, setLocation] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const payload = {
      eventName: title.trim(),
      date: datetime ? new Date(datetime).toISOString() : new Date().toISOString(),
      location: location.trim() || 'TBD',
    };
    const ok = await onPost(payload);
    if (ok) {
      setTitle('');
      setDatetime('');
      setLocation('');
    }
  };

  const placeholder =
    nature === 'wellbeing'
      ? 'Share a check-in or an empathy nudge…'
      : nature === 'individuality'
      ? 'Share something with your safe-space…'
      : 'Post an update — e.g. "OS class moved to 5 PM"';

  return (
    <form onSubmit={submit} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />
      {votingEnabled && (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            When
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Where
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Room / venue"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </label>
        </div>
      )}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-[11px] text-gray-400">
          {votingEnabled
            ? 'Posts start as pending until the community echoes them.'
            : 'Shared privately with members of this community.'}
        </p>
        <button
          type="submit"
          disabled={posting || !title.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Post
        </button>
      </div>
    </form>
  );
}

function RequestsPanel({ nodeId, onApproved }) {
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState([]);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getNodeMembers(nodeId);
      if (cancelled) return;
      setPending(data?.pending || []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [nodeId]);

  const approve = async (userId) => {
    setBusyId(userId);
    const ok = await approveRequest(nodeId, userId);
    if (ok) {
      setPending((prev) => prev.filter((p) => p.userId !== userId));
      onApproved?.();
    }
    setBusyId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading requests…
      </div>
    );
  }
  if (pending.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
        No pending join requests.
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-700">
        <Inbox className="h-3.5 w-3.5" /> Pending requests
      </p>
      <ul className="space-y-2">
        {pending.map((p) => (
          <li key={p.userId} className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
            <span className="text-sm font-medium text-gray-800">{p.name}</span>
            <button
              onClick={() => approve(p.userId)}
              disabled={busyId === p.userId}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {busyId === p.userId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserCheck className="h-3.5 w-3.5" />}
              Approve
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CommunityPanel({ nodeId, onMembershipChange }) {
  const [loading, setLoading] = useState(true);
  const [node, setNode] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [posting, setPosting] = useState(false);
  const [voteBusyId, setVoteBusyId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showRequests, setShowRequests] = useState(false);

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

  const handlePost = async (payload) => {
    setPosting(true);
    const res = await postNodeUpdate(nodeId, payload);
    setPosting(false);
    if (res) {
      await load();
      onMembershipChange?.();
      return true;
    }
    return false;
  };

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
              {node.isCr && (
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

        {/* Owner controls: invite code + requests */}
        {node.isCr && (
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
            {node.joinPolicy === 'locked' && (
              <button
                onClick={() => setShowRequests((s) => !s)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100"
              >
                <Inbox className="h-3.5 w-3.5" /> Requests
                {node.pendingCount > 0 && (
                  <span className="rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
                    {node.pendingCount}
                  </span>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {showRequests && node.isCr && (
        <RequestsPanel nodeId={nodeId} onApproved={() => { load(); onMembershipChange?.(); }} />
      )}

      {/* Verified flow banner for accountability communities */}
      {node.votingEnabled && (
        <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-2.5 text-xs text-indigo-700">
          <ArrowUpRight className="h-4 w-4 shrink-0" />
          <span>
            <span className="font-semibold">{verifiedCount} verified</span> update
            {verifiedCount === 1 ? '' : 's'} flow straight to your Dashboard &amp; Master Calendar. Echo to
            confirm, Flag to correct AI mistakes.
          </span>
        </div>
      )}

      {node.nature === 'individuality' && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-2.5 text-xs text-rose-700">
          <ShieldQuestion className="h-4 w-4 shrink-0" />
          <span>Zero-Telemetry Zone — voting is off and nothing here leaves this circle.</span>
        </div>
      )}

      {node.nature === 'wellbeing' && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-2.5 text-xs text-emerald-700">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>This circle quietly receives anonymous Empathy Nudges when a member&apos;s wellness dips.</span>
        </div>
      )}

      {/* Composer */}
      <Composer votingEnabled={node.votingEnabled} nature={node.nature} onPost={handlePost} posting={posting} />

      {/* Feed */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
          Community updates
        </h3>
        {updates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-14 text-center">
            <p className="text-sm font-medium text-gray-800">No updates yet</p>
            <p className="mt-1 text-xs text-gray-500">Be the first to post something for this community.</p>
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
