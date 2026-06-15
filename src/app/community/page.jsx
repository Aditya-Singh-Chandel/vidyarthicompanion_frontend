'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users2, ArrowRight, Loader2 } from 'lucide-react';
import CommunitySidebar from '@/features/communityEngine/CommunitySidebar';
import CommunityPanel from '@/features/communityEngine/CommunityPanel';
import CreateCommunityModal from '@/features/communityEngine/CreateCommunityModal';
import SyncConflictModal from '@/features/communityEngine/SyncConflictModal';
import { getMyNodes, joinByCode } from '@/features/communityEngine/communityApi';
import { getProfile } from '@/features/profileEngine/profileApi';

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
  const [adoptable, setAdoptable] = useState(null);
  // Deep link (e.g. from a dashboard burnout card): ?node=…&member=… opens that
  // member's Meet Up inside the named community.
  const [deepLink, setDeepLink] = useState({ node: null, member: null });
  // Profile-driven pins for the three fixed communities (Mess / Class / Empathy).
  const [primary, setPrimary] = useState({ mess: null, class: null, empathy: null });

  const loadPrimary = useCallback(async () => {
    const profile = await getProfile();
    setPrimary({
      mess: profile?.primaryMessNodeId || null,
      class: profile?.primaryClassNodeId || null,
      empathy: profile?.primaryEmpathyNodeId || null,
    });
  }, []);

  const load = useCallback(async () => {
    const [mine] = await Promise.all([getMyNodes(), loadPrimary()]);
    setMyNodes(mine);
    setLoading(false);
    return mine;
  }, [loadPrimary]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [mine] = await Promise.all([getMyNodes(), loadPrimary()]);
      if (cancelled) return;
      setMyNodes(mine);
      setLoading(false);

      // Deep link (?node=…&member=…) — read client-side here (inside the async
      // callback) to avoid both the useSearchParams prerender bailout and a
      // synchronous setState in the effect body. Drives node selection + the
      // Meet Up auto-open passed down to CommunityPanel.
      let dl = { node: null, member: null };
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        dl = { node: params.get('node'), member: params.get('member') };
        if (dl.node || dl.member) setDeepLink(dl);
      }
      const preferred = dl.node && mine.some((n) => n.nodeId === dl.node) ? dl.node : null;
      setSelectedNodeId((cur) => cur || preferred || mine[0]?.nodeId || null);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadPrimary]);

  const handleJoinByCode = async (code) => {
    const res = await joinByCode(code);
    if (res.status === 'joined') {
      const mine = await load();
      const joined = res.node?.nodeId || mine[mine.length - 1]?.nodeId;
      if (joined) setSelectedNodeId(joined);
      // Class / Mess: the community's timetable/menu differs from the user's.
      // Ask whether to adopt it (only when there's an actual mismatch).
      if (res.adoptable?.changed) setAdoptable(res.adoptable);
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
            primary={primary}
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
              openMeetupFor={selectedNodeId === deepLink.node ? deepLink.member : null}
            />
          ) : (
            <EmptyState onCreate={() => setShowCreate(true)} />
          )}
        </div>
      </div>

      {showCreate && (
        <CreateCommunityModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />
      )}

      {adoptable && (
        <SyncConflictModal
          adoptable={adoptable}
          onResolved={async (outcome) => {
            setAdoptable(null);
            // Adoption changed the user's personal baseline; refresh pins/menus.
            if (outcome === 'adopted') await load();
          }}
        />
      )}
    </div>
  );
}
