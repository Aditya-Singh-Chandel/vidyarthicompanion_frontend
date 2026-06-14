'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquareWarning, ThumbsUp, ThumbsDown, CheckCircle2, Loader2 } from 'lucide-react';
import { submitConsensusVote, getAlerts } from './communityApi';

export default function CommunityConsensusWidget() {
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const alerts = await getAlerts();
      if (cancelled) return;
      setAlert(alerts[0] || null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleVote = async (voteValue) => {
    if (!alert) return;
    setIsSubmitting(true);
    const result = await submitConsensusVote(alert.id, voteValue);
    if (result?.data) {
      setAlert((prev) => ({ ...prev, upvotes: result.data.upvotes, downvotes: result.data.downvotes }));
    }
    setHasVoted(true);
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading community alerts…
        </div>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-800">
          Community Status
        </h3>
        <p className="mt-1 text-sm text-emerald-900">No active alerts right now. All clear.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm transition-all">
      <div className="flex items-start gap-3">
        <MessageSquareWarning className="h-5 w-5 shrink-0 text-yellow-600 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-yellow-800">
              Live Community Alert
            </h3>
            <span className="text-xs font-semibold text-yellow-700">
              +{alert.upvotes ?? 0} / -{alert.downvotes ?? 0}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-yellow-900">{alert.message}</p>

          {!hasVoted ? (
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleVote(1)}
                disabled={isSubmitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-yellow-900 shadow-sm hover:bg-yellow-500 transition-colors disabled:opacity-50"
              >
                <ThumbsUp className="h-4 w-4" />
                Echo (+1)
              </button>
              <button
                onClick={() => handleVote(-1)}
                disabled={isSubmitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-yellow-300 bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-800 shadow-sm hover:bg-yellow-200 transition-colors disabled:opacity-50"
              >
                <ThumbsDown className="h-4 w-4" />
                Flag Error (-1)
              </button>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-100 p-3 text-sm font-medium text-green-800 border border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              Thank you for updating the community baseline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
