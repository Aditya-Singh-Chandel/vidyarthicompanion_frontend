import React from 'react';
import ExpenseWidget from '@/features/pocketBuddy/ExpenseWidget';

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            PocketBuddy
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Smart budgeting, campus expenses, and Amazon Pay integration.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Main Wallet View */}
          <section aria-labelledby="wallet-heading">
            <h2 id="wallet-heading" className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Live Balance & Tracking
            </h2>
            <ExpenseWidget />
          </section>

          {/* Placeholder for future financial features (like split history) */}
          <section aria-labelledby="history-heading">
            <h2 id="history-heading" className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Recent Transactions
            </h2>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex items-center justify-center h-[200px] text-sm text-gray-400 border-dashed">
              Transaction history syncs at midnight
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}