import { Megaphone, HeartPulse, CheckCircle2, Clock3, XCircle } from 'lucide-react';

/**
 * Behavioural nature of a community. Drives colour, copy and whether the
 * gamified consensus voting is shown.
 */
export const NATURE_META = {
  accountability: {
    label: 'Accountability',
    Icon: Megaphone,
    tagline: 'Schedules & alerts, verified by the group',
    accent: 'indigo',
    chip: 'bg-indigo-100 text-indigo-700',
    ring: 'ring-indigo-100',
    dot: 'bg-indigo-500',
    text: 'text-indigo-700',
    softBg: 'bg-indigo-50',
  },
  wellbeing: {
    label: 'Wellbeing',
    Icon: HeartPulse,
    tagline: 'Silent listeners for empathy nudges',
    accent: 'emerald',
    chip: 'bg-emerald-100 text-emerald-700',
    ring: 'ring-emerald-100',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    softBg: 'bg-emerald-50',
  },
};

export const NATURE_ORDER = ['accountability', 'wellbeing'];

export function natureOf(nature) {
  return NATURE_META[nature] || NATURE_META.accountability;
}

/** Consensus lifecycle styling for an individual update. */
export const STATUS_META = {
  verified: {
    label: 'Verified by community',
    Icon: CheckCircle2,
    chip: 'bg-emerald-100 text-emerald-800',
    card: 'border-emerald-200 bg-emerald-50/40',
  },
  pending: {
    label: 'Awaiting consensus',
    Icon: Clock3,
    chip: 'bg-amber-100 text-amber-800',
    card: 'border-gray-100 bg-white',
  },
  rejected: {
    label: 'Flagged out · dropped',
    Icon: XCircle,
    chip: 'bg-rose-100 text-rose-800',
    card: 'border-rose-200 bg-rose-50/40',
  },
};

export function statusOf(status) {
  return STATUS_META[status] || STATUS_META.pending;
}

export const NODE_TYPES = ['Academic', 'Mess', 'Gym', 'Logistical', 'Empathy', 'General'];
