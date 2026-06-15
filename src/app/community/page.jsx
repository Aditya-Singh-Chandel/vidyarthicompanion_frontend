'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users2, ArrowRight, Loader2 } from 'lucide-react';
import CommunitySidebar from '@/features/communityEngine/CommunitySidebar';
import CommunityPanel from '@/features/communityEngine/CommunityPanel';
import CreateCommunityModal from '@/features/communityEngine/CreateCommunityModal';
import SyncConflictModal from '@/features/communityEngine/SyncConflictModal';
import { getMyNodes, joinByCode } from '@/features/communityEngine/communityApi';

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
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [adopted, setAdopted] = useState(null);

  const load = useCallback(async () => {
    const mine = await getMyNodes();
    setMyNodes(mine);
    setLoading(false);
    return mine;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mine = await getMyNodes();
      if (cancelled) return;
      setMyNodes(mine);
      setLoading(false);
      setSelectedNodeId((cur) => cur || mine[0]?.nodeId || null);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleJoinByCode = async (code) => {
    const res = await joinByCode(code);
    if (res.status === 'joined') {
      const mine = await load();
      const joined = res.node?.nodeId || mine[mine.length - 1]?.nodeId;
      if (joined) setSelectedNodeId(joined);
      // Class / Mess: the community baseline was adopted into the user's profile.
      if (res.adopted) setAdopted(res.adopted);
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
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Communities</h1>
          <p className="mt-1 text-sm text-gray-500">
            Every community is private and invite-only. Verified updates flow to your dashboard and master calendar.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <CommunitySidebar
            myNodes={myNodes}
            selectedNodeId={selectedNodeId}
            onSelect={setSelectedNodeId}
            onJoinByCode={handleJoinByCode}
            onCreateClick={() => setShowCreate(true)}
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

      {adopted && (
        <SyncConflictModal adopted={adopted} onResolved={() => setAdopted(null)} />
      )}
    </div>
  );
}
