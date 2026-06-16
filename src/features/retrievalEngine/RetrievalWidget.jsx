'use client';

import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, MessageSquare } from 'lucide-react';
import { askVidyarthiCompanion } from './retrievalApi';

export default function RetrievalWidget() {
  const [query, setQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [answer, setAnswer] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsAsking(true);
    setAnswer(null);

    // LIVE AI CONNECTION
    const result = await askVidyarthiCompanion(query);

    setAnswer(result);
    setIsAsking(false);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="aurora-search-bar relative flex items-center">
        <Search className="absolute left-5 h-5 w-5 text-gray-400 transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask VidyarthiCompanion about your schedule, budget, or campus events..."
          className="w-full rounded-full border border-[var(--cloud)] bg-white/70 py-4 pl-14 pr-36 text-gray-900 placeholder:text-gray-400 focus:border-[var(--brand)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[var(--brand)]/10 sm:text-sm sm:leading-6 transition-all backdrop-blur-md"
        />
        <button
          type="submit"
          disabled={isAsking || query.trim() === ''}
          className="absolute right-2 flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--brand-dark)] px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(109,94,252,0.6)] hover:shadow-[0_12px_32px_-6px_rgba(109,94,252,0.8)] disabled:opacity-50 transition-all hover:-translate-y-0.5"
        >
          {isAsking ? (
            <Sparkles className="h-4 w-4 animate-pulse" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          {isAsking ? 'Thinking...' : 'Ask'}
        </button>
      </form>

      {/* The AI Response Box */}
      {answer && (
        <div className="mt-6 animate-slide-up-fade">
          <div className="flex items-start gap-4 rounded-2xl bg-gradient-to-br from-[var(--brand)]/5 via-[var(--brand-2)]/5 to-[var(--brand-3)]/5 p-6 ring-1 ring-inset ring-[var(--brand)]/10 backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--brand-2)] shadow-[0_8px_20px_-6px_rgba(109,94,252,0.6)]">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-[var(--brand)] mb-2 uppercase tracking-wider">AI Response</p>
              <p className="text-sm leading-relaxed text-gray-800 font-medium">
                {answer}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}