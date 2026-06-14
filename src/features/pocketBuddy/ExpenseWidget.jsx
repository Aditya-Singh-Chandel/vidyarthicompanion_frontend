"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Utensils } from "lucide-react";
import useRoutineStore from "@/routineState/useRoutineStore";
import { simulateTransaction, getWalletSummary } from "./pocketApi";

const SIM_AMOUNT = 150; // INR per sandbox tap

/** Format a number as INR currency (no paise for readability). */
function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
}

function ExpenseWidget() {
  const currentBudget = useRoutineStore((state) => state.currentBudget);
  const deductBudget = useRoutineStore((state) => state.deductBudget);
  const setBudget = useRoutineStore((state) => state.setBudget);

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [spendAlert, setSpendAlert] = useState(null);

  // Load the live wallet on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getWalletSummary();
      if (cancelled) return;
      if (data) {
        setSummary(data);
        setBudget(data.balance);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [setBudget]);

  const balance = summary?.balance ?? currentBudget;
  const isCritical = summary?.isCritical ?? false;
  const affordableOptions = summary?.affordableOptions ?? [];

  const handleSimulateTransaction = async () => {
    setIsProcessing(true);
    setSpendAlert(null);
    try {
      const result = await simulateTransaction(SIM_AMOUNT, { vendor: "Campus Cafe" });

      if (result?.success && result.data?.summary) {
        setSummary(result.data.summary);
        setBudget(result.data.summary.balance);
        if (result.data.alert) setSpendAlert(result.data.alert);
      } else {
        // Backend unreachable - optimistic local deduction.
        deductBudget(SIM_AMOUNT);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 p-6">
      {/* Budget overview */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
          PocketBuddy Hub · Amazon Pay
        </p>
        <h2 className="mt-1 text-sm font-medium text-gray-500">Wallet Balance</h2>

        {loading ? (
          <div className="mt-2 flex items-center gap-2 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Syncing wallet…</span>
          </div>
        ) : (
          <p
            className={`mt-1 text-4xl font-bold tracking-tight ${
              isCritical ? "text-red-600" : "text-gray-900"
            }`}
          >
            {formatINR(balance)}
          </p>
        )}

        {!loading && summary && (
          <p className="mt-2 text-xs text-gray-500">
            ~{formatINR(summary.dailyMealThreshold)} / meal for the next{" "}
            {summary.daysLeftInMonth} days · Monthly budget {formatINR(summary.monthlyBudget)}
          </p>
        )}

        {isCritical && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <p className="font-medium">
              Budget Critical: stick to mess food over outside dining.
            </p>
            {affordableOptions.length > 0 && (
              <ul className="mt-2 space-y-1">
                {affordableOptions.slice(0, 3).map((opt) => (
                  <li key={opt.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-red-800">
                      <Utensils className="h-3 w-3" />
                      {opt.name}
                    </span>
                    <span className="font-semibold">{formatINR(opt.averageCost)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {spendAlert && (
          <div
            role="status"
            className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-800"
          >
            {spendAlert}
          </div>
        )}
      </div>

      {/* Developer Sandbox */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Developer Sandbox
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Trigger a mock Amazon Pay debit to test live budget behavior.
        </p>

        <button
          type="button"
          onClick={handleSimulateTransaction}
          disabled={isProcessing || loading}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
          {isProcessing ? "Processing…" : `Simulate ${formatINR(SIM_AMOUNT)} Amazon Pay Spend`}
        </button>
      </div>
    </div>
  );
}

export default ExpenseWidget;
