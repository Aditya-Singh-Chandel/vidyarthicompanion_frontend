'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users2, BrainCircuit, UserCog, ArrowRight, Loader2 } from 'lucide-react';
import CommunitySidebar from '@/features/communityEngine/CommunitySidebar';
import CommunityPanel from '@/features/communityEngine/CommunityPanel';
import CreateCommunityModal from '@/features/communityEngine/CreateCommunityModal';
import { getMyNodes, getAllNodes, joinNode, joinByCode } from '@/features/communityEngine/communityApi';

function UspHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-6 text-white shadow-lg sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-purple-400/20 blur-3xl" />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
          <Users2 className="h-3.5 w-3.5" /> The Decentralized Truth-Consensus Graph
        </span>
        <h1 className="mt-3 max-w-2xl text-2xl font-black tracking-tight sm:text-3xl">
          Communities that catch what you&apos;d miss — and correct what AI gets wrong.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-indigo-100">
          A trusted circle posts an update, the group votes, and only consensus-verified entries flow
          into your dashboard and master calendar.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-bold">
              <UserCog className="h-4 w-4" /> Fixes human error
            </div>
            <p className="mt-1 text-xs text-indigo-100">
              Buried in noisy WhatsApp pings? One member&apos;s post reaches everyone — nobody misses
              the rescheduled class.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-bold">
              <BrainCircuit className="h-4 w-4" /> Fixes machine error
            </div>
            <p className="mt-1 text-xs text-indigo-100">
              AI misread &quot;5 PM&quot; as &quot;9 PM&quot;? The batch flags it down and echoes the
              correct entry. Truth wins by vote.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
        <Users2 className="h-7 w-7 text-indigo-500" />
      </div>
      <p className="mt-4 text-base font-semibold text-gray-900">Pick a community to open its feed</p>
      <p className="mt-1 max-w-sm text-sm text-gray-500">
        Each community keeps its own column of updates. Join one from the sidebar, or start your own.
      </p>
      <button
        onClick={onCreate}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
      >
        Create a community <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function CommunityPage() {
  const [loading, setLoading] = useState(true);
  const [myNodes, setMyNodes] = useState([]);
  const [allNodes, setAllNodes] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    const [mine, all] = await Promise.all([getMyNodes(), getAllNodes()]);
    setMyNodes(mine);
    setAllNodes(all);
    setLoading(false);
    return mine;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [mine, all] = await Promise.all([getMyNodes(), getAllNodes()]);
      if (cancelled) return;
      setMyNodes(mine);
      setAllNodes(all);
      setLoading(false);
      setSelectedNodeId((cur) => cur || mine[0]?.nodeId || null);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const discoverNodes = allNodes.filter((n) => !n.isMember);

  const handleJoin = async (node) => {
    setBusyId(node.nodeId);
    const res = await joinNode(node.nodeId);
    await load();
    setBusyId(null);
    if (res.status === 'joined') setSelectedNodeId(node.nodeId);
  };

  const handleJoinByCode = async (code) => {
    const res = await joinByCode(code);
    if (res.status === 'joined') {
      const mine = await load();
      const joined = res.node?.nodeId || mine[mine.length - 1]?.nodeId;
      if (joined) setSelectedNodeId(joined);
    }
    return res;
  };

  const handleCreated = async (node) => {
    setShowCreate(false);
    await load();
    if (node?.nodeId) setSelectedNodeId(node.nodeId);
  };

  // Called after posting/leaving/approving to keep sidebar counts fresh.
  const handleMembershipChange = async (left = false) => {
    const mine = await load();
    if (left) {
      setSelectedNodeId(mine[0]?.nodeId || null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <UspHero />

        <div className="flex flex-col gap-6 lg:flex-row">
          <CommunitySidebar
            myNodes={myNodes}
            discoverNodes={discoverNodes}
            selectedNodeId={selectedNodeId}
            onSelect={setSelectedNodeId}
            onJoin={handleJoin}
            onJoinByCode={handleJoinByCode}
            onCreateClick={() => setShowCreate(true)}
            busyId={busyId}
          />

          {loading ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white py-24 text-sm text-gray-400 shadow-sm">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading your communities…
            </div>
          ) : selectedNodeId ? (
            <CommunityPanel
              key={selectedNodeId}
              nodeId={selectedNodeId}
              onMembershipChange={handleMembershipChange}
            />
          ) : (
            <EmptyState onCreate={() => setShowCreate(true)} />
          )}
        </div>
      </div>

      {showCreate && (
        <CreateCommunityModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />
      )}
    </div>
  );
}
