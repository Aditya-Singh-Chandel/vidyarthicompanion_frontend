'use client';

import React, { useState } from 'react';
import { MessageSquareWarning, ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';
import { submitConsensusVote } from './communityApi';

export default function CommunityConsensusWidget() {
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hardcoded for MVP. Later, this comes from the database.
  const activeAlert = {
    id: 'event_mess_123',
    message: 'Main Mess is currently overcrowded and food quality is flagged. Recommendation: Outside Dining.',
    nodeType: 'Wellness Community'
  };

  const handleVote = async (voteValue) => {
    setIsSubmitting(true);
    
    // Fire the vote to User 2's backend
    await submitConsensusVote(activeAlert.id, voteValue);
    
    setHasVoted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm transition-all mt-6">
      <div className="flex items-start gap-3">
        <MessageSquareWarning className="h-5 w-5 shrink-0 text-yellow-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-bold uppercase tracking-wide text-yellow-800">
            Live Community Alert
          </h3>
          <p className="mt-1 text-sm font-medium text-yellow-900">
            {activeAlert.message}
          </p>
          
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