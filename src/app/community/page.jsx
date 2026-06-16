'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users2, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import CommunitySidebar from '@/features/communityEngine/CommunitySidebar';
import CommunityPanel from '@/features/communityEngine/CommunityPanel';
import CreateCommunityModal from '@/features/communityEngine/CreateCommunityModal';
import SyncConflictModal from '@/features/communityEngine/SyncConflictModal';
import { getMyNodes, joinByCode } from '@/features/communityEngine/communityApi';
import { getProfile } from '@/features/profileEngine/profileApi';

function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-[var(--radius-2xl)] border border-dashed border-[var(--brand)]/20 bg-white/50 py-20 text-center backdrop-blur-md">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)]/15 to-[var(--brand-2)]/15 shadow-[var(--shadow-glow-brand)]">
        <Users2 className="h-8 w-8 text-[var(--brand)]" />
      </div>
      <p className="mt-5 text-base font-bold text-gray-900">Pick a community to open its feed</p>
      <p className="mt-1.5 max-w-sm text-sm text-[var(--text-secondary)]">
        Each community keeps its own column of updates. Join one from the sidebar, or start your own.
      </p>
      <button
        onClick={onCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-dark)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(109,94,252,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-8px_rgba(109,94,252,0.8)]"
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
  const [deepLink, setDeepLink] = useState({ node: null, member: null });
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
      if (res.adoptable?.changed) setAdoptable(res.adoptable);
    }
    return res;
  };

  const handleCreated = async (node) => {
    setShowCreate(false);
    await load();
    if (node?.nodeId) setSelectedNodeId(node.nodeId);
  };

  const handleMembershipChange = async (left = false) => {
    const mine = await load();
    if (left) {
      setSelectedNodeId(mine[0]?.nodeId || null);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="cf-page-enter">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)]/15 to-[var(--brand-2)]/15">
              <Users2 className="h-5 w-5 text-[var(--brand)]" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">Communities</h1>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-[var(--brand)] bg-[var(--brand)]/8 px-2.5 py-1 rounded-full border border-[var(--brand)]/15">
              <Sparkles className="h-3 w-3" /> Trust-Weighted
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Private, invite-only communities. Verified updates flow to your dashboard and master calendar.
          </p>
        </header>

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
            <div className="flex flex-1 items-center justify-center rounded-[var(--radius-2xl)] border border-white/60 bg-white/50 py-24 text-sm text-gray-400 backdrop-blur-md shadow-[var(--shadow-float)]">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-[var(--brand)]" /> Loading your communities…
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
            if (outcome === 'adopted') await load();
          }}
        />
      )}
    </div>
  );
}
