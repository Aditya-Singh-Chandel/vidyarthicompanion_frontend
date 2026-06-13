"use client";

import React, { useState } from "react";
import useRoutineStore from "@/routineState/useRoutineStore";
import { simulateTransaction } from "./pocketApi";

const CRITICAL_THRESHOLD = 20;

/** Format a number as USD currency. */
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function ExpenseWidget() {
  const currentBudget = useRoutineStore((state) => state.currentBudget);
  const deductBudget = useRoutineStore((state) => state.deductBudget);

  const [isProcessing, setIsProcessing] = useState(false);

  const isCritical = currentBudget < CRITICAL_THRESHOLD;

  const handleSimulateTransaction = async () => {
    setIsProcessing(true);
    try {
      // Fire the (mock) backend webhook. Resolves to response data or null.
      await simulateTransaction("student_123", 5.0);
      // Update local budget regardless of API outcome for now.
      deductBudget(5);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 p-6">
      {/* Budget overview */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
          PocketBuddy Hub
        </p>
        <h2 className="mt-1 text-sm font-medium text-gray-500">
          Current Budget
        </h2>
        <p
          className={`mt-1 text-4xl font-bold tracking-tight ${
            isCritical ? "text-red-600" : "text-gray-900"
          }`}
        >
          {formatCurrency(currentBudget)}
        </p>

        {isCritical && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <svg
              className="mt-0.5 h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m0 3.75h.008M10.34 3.94l-7.5 13a1.5 1.5 0 001.3 2.25h15a1.5 1.5 0 001.3-2.25l-7.5-13a1.5 1.5 0 00-2.6 0z"
              />
            </svg>
            <span className="font-medium">
              Budget Critical: Recommending Mess Food over Outside Dining.
            </span>
          </div>
        )}
      </div>

      {/* Developer Sandbox */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Developer Sandbox
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Trigger mock transactions to test budget behavior.
        </p>

        <button
          type="button"
          onClick={handleSimulateTransaction}
          disabled={isProcessing}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isProcessing && (
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {isProcessing ? "Processing..." : "Simulate $5 Amazon Pay Transaction"}
        </button>
      </div>
    </div>
  );
}

export default ExpenseWidget;