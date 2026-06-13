'use client';

import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { askCampusFlow } from './retrievalApi';

export default function RetrievalWidget() {
  const [query, setQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [answer, setAnswer] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsAsking(true);
    setAnswer(null);

    // MOCKING THE DELAY AND RESPONSE FOR NOW
    // Once User 3 finishes Bedrock intent-matching, swap this setTimeout 
    // with: const res = await askCampusFlow(query, 'student_123');
    
    setTimeout(() => {
      setAnswer("Based on the community graph and your calendar, your next class is Data Structures & Algorithms in Lecture Hall 4. You have exactly 45 minutes, which is enough time to grab a coffee at the Campus Cafe within your $45.00 budget.");
      setIsAsking(false);
    }, 1500);
  };

  return (
    <div className="w-full mb-10">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <Search className="absolute left-5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask CampusFlow about your schedule, budget, or campus events..."
          className="w-full rounded-full border-0 bg-white py-4 pl-14 pr-36 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
        />
        <button
          type="submit"
          disabled={isAsking || !query.trim()}
          className="absolute right-2 flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-all"
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
        <div className="mt-6 flex items-start gap-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-sm ring-1 ring-inset ring-indigo-100 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 shadow-sm">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm leading-relaxed text-indigo-950 pt-1 font-medium">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}