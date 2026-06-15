import { create } from "zustand";

/**
 * Global routine + budget store for VidyarthiCompanion.
 *
 * State:
 *  - currentBudget:   remaining budget (defaults to 50.00)
 *  - isRoutinePaused: whether the user's routine is currently paused
 *  - activeAlerts:    list of active alert reasons
 */
const useRoutineStore = create((set) => ({
  // --- State ---
  currentBudget: 2000.0, // INR; overwritten by the live wallet summary on load
  isRoutinePaused: false,
  activeAlerts: [],

  // --- Actions ---

  /** Subtract `amount` from the current budget. */
  deductBudget: (amount) =>
    set((state) => ({ currentBudget: state.currentBudget - amount })),

  /** Set the current budget to an absolute value (e.g. from a backend balance). */
  setBudget: (amount) => set({ currentBudget: amount }),

  /** Pause the routine and record the reason as an active alert. */
  triggerSafeSkip: (reason) =>
    set((state) => ({
      isRoutinePaused: true,
      activeAlerts: [...state.activeAlerts, reason],
    })),

  /** Resume the routine and clear all active alerts. */
  resetRoutine: () =>
    set({ isRoutinePaused: false, activeAlerts: [] }),
}));

export default useRoutineStore;