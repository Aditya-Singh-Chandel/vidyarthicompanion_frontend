import React from "react";

/**
 * ZeroUiActionCard
 *
 * An urgent, minimalist "Action Card" for a student dashboard. It surfaces a
 * single event that needs human attention, shows the system's confidence in
 * its own interpretation, and lets the student either confirm or flag it.
 *
 * Props (per API contract):
 * @param {string}   eventName        - Human-readable name of the event.
 * @param {string}   date             - Display-ready date/time string.
 * @param {string}   location         - Where the event takes place.
 * @param {number}   confidenceScore  - Decimal 0..1 (e.g. 0.98 => "98%").
 * @param {string}   systemAction     - The AI's background behavior/intent.
 */
function ZeroUiActionCard({
  eventName,
  date,
  location,
  confidenceScore = 0,
  systemAction,
}) {
  // Normalize and clamp the confidence score, then convert to a percentage.
  const safeScore = Number.isFinite(confidenceScore) ? confidenceScore : 0;
  const clampedScore = Math.min(Math.max(safeScore, 0), 1);
  const confidencePercent = Math.round(clampedScore * 100);
  const isHighConfidence = confidencePercent > 90;

  // Confidence drives the color treatment of the badge + progress bar.
  const confidenceStyles = isHighConfidence
    ? {
        badge: "bg-green-100 text-green-700 ring-green-600/20",
        dot: "bg-green-500",
        bar: "bg-green-500",
      }
    : {
        badge: "bg-yellow-100 text-yellow-800 ring-yellow-600/20",
        dot: "bg-yellow-500",
        bar: "bg-yellow-500",
      };

  return (
    <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* Header: event title + confidence indicator */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
            Action Required
          </p>
          <h3 className="mt-1 truncate text-lg font-bold text-gray-900">
            {eventName || "Untitled Event"}
          </h3>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${confidenceStyles.badge}`}
          aria-label={`Confidence ${confidencePercent} percent`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${confidenceStyles.dot}`} />
          {confidencePercent}% confident
        </span>
      </div>

      {/* Confidence progress bar */}
      <div className="mt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${confidenceStyles.bar}`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {/* Event metadata */}
      <dl className="mt-5 space-y-2.5 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <svg
            className="h-4 w-4 shrink-0 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M4.5 6.75h15a.75.75 0 01.75.75v11.25a.75.75 0 01-.75.75h-15a.75.75 0 01-.75-.75V7.5a.75.75 0 01.75-.75z"
            />
          </svg>
          <span className="font-medium text-gray-900">{date || "Date TBD"}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <svg
            className="h-4 w-4 shrink-0 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          <span className="font-medium text-gray-900">
            {location || "Location TBD"}
          </span>
        </div>
      </dl>

      {/* System action: prominent callout describing AI's background behavior */}
      <div className="mt-5 rounded-lg border border-indigo-100 bg-indigo-50/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
          System Action
        </p>
        <p className="mt-1 text-sm font-semibold leading-snug text-indigo-900">
          {systemAction || "No action proposed."}
        </p>
      </div>
    </div>
  );
}

export default ZeroUiActionCard;