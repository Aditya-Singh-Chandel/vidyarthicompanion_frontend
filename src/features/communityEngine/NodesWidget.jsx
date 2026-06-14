'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Network, Plus, UserPlus, Crown, Users, Loader2 } from 'lucide-react';
import { getMyNodes, getAllNodes, createNode, joinNode } from './communityApi';

const NODE_TYPES = ['Academic', 'Empathy', 'Gym', 'Mess', 'Logistical', 'General'];

const TYPE_CHIP = {
  Academic: 'bg-indigo-100 text-indigo-700',
  Empathy: 'bg-rose-100 text-rose-700',
  Gym: 'bg-emerald-100 text-emerald-700',
  Mess: 'bg-amber-100 text-amber-700',
  Logistical: 'bg-blue-100 text-blue-700',
  General: 'bg-gray-100 text-gray-700',
};

export default function NodesWidget() {
  const [loading, setLoading] = useState(true);
  const [myNodes, setMyNodes] = useState([]);
  const [allNodes, setAllNodes] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [nodeType, setNodeType] = useState('Academic');

  const load = useCallback(async () => {
    const [mine, all] = await Promise.all([getMyNodes(), getAllNodes()]);
    setMyNodes(mine);
    setAllNodes(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const handleJoin = async (nodeId) => {
    setBusyId(nodeId);
    await joinNode(nodeId);
    await load();
    setBusyId(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    await createNode({ name: name.trim(), nodeType });
    setName('');
    setShowCreate(false);
    await load();
    setCreating(false);
  };

  const discoverable = allNodes.filter((n) => !n.isMember);

  return (
    <div className="rounded-xl border border-indigo-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-indigo-600" />
          <h3 className="text-sm font-bold uppercase tracking-wide text-indigo-800">
            Community Graph
          </h3>
        </div>
        <button
          onClick={() => setShowCreate((s) => !s)}
          className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
        >
          <Plus className="h-3 w-3" /> New
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-4 flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-end">
          <label className="flex-1 text-xs font-medium text-gray-500">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. CSE-A Class"
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
            />
          </label>
          <label className="text-xs font-medium text-gray-500">
            Type
            <select
              value={nodeType}
              onChange={(e) => setNodeType(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
            >
              {NODE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={creating}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-6 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading nodes…
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              My nodes
            </p>
            {myNodes.length === 0 ? (
              <p className="text-xs text-gray-400">You haven&apos;t joined any communities yet.</p>
            ) : (
              <ul className="space-y-2">
                {myNodes.map((n) => (
                  <li key={n.nodeId} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-gray-900">{n.name}</span>
                        {n.isCr && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-1.5 py-0.5 text-[10px] font-bold text-yellow-800">
                            <Crown className="h-3 w-3" /> CR
                          </span>
                        )}
                      </div>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_CHIP[n.nodeType] || TYPE_CHIP.General}`}>
                        {n.nodeType}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="h-3 w-3" /> {n.memberCount}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {discoverable.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Discover
              </p>
              <ul className="space-y-2">
                {discoverable.map((n) => (
                  <li key={n.nodeId} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                    <div className="min-w-0">
                      <span className="truncate text-sm font-medium text-gray-900">{n.name}</span>
                      <span className="ml-2 text-xs text-gray-400">{n.memberCount} members</span>
                    </div>
                    <button
                      onClick={() => handleJoin(n.nodeId)}
                      disabled={busyId === n.nodeId}
                      className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
                    >
                      {busyId === n.nodeId ? <Loader2 className="h-3 w-3 animate-spin" /> : <UserPlus className="h-3 w-3" />}
                      Join
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
