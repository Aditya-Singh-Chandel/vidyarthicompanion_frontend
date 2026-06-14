'use client';

import React from 'react';

/**
 * Hand-built SVG semicircle gauge (no chart library).
 *
 * A value of 0 points the needle hard left; 10 points it hard right. The filled
 * arc is colored by severity (higher == worse): green -> amber -> red. Used for
 * the Tiredness, Isolation and Overall Burnout dials.
 */

// Value (0..10) -> angle in degrees, where 180deg = left, 0deg = right.
const angleForValue = (value, max = 10) => 180 * (1 - Math.min(Math.max(value, 0), max) / max);

// Point on the gauge circle for a given angle (y grows downward in SVG).
function polar(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

// Approximate an arc as a polyline so we never fight SVG arc-flag direction.
function arcPath(cx, cy, r, startAngle, endAngle, steps = 60) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const a = startAngle + ((endAngle - startAngle) * i) / steps;
    const { x, y } = polar(cx, cy, r, a);
    pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `M ${pts.join(' L ')}`;
}

// Severity color scale (shared by all three gauges).
function severityColor(value) {
  if (value >= 7) return '#e11d48'; // rose-600
  if (value >= 4) return '#f59e0b'; // amber-500
  return '#10b981'; // emerald-500
}

export default function WellnessGauge({
  value = 0,
  max = 10,
  label,
  size = 200,
  showValue = true,
}) {
  const width = size;
  const height = size * 0.62;
  const cx = width / 2;
  const cy = height - 12;
  const r = width / 2 - 18;
  const stroke = Math.max(12, width * 0.08);

  const valueAngle = angleForValue(value, max);
  const color = severityColor(value);
  const needle = polar(cx, cy, r - stroke * 0.35, valueAngle);
  const safeValue = Math.min(Math.max(value, 0), max);

  return (
    <div className="flex flex-col items-center">
      <svg
        width={width}
        height={height + 4}
        viewBox={`0 0 ${width} ${height + 4}`}
        role="img"
        aria-label={`${label || 'Score'}: ${safeValue} out of ${max}`}
      >
        {/* Grey background track */}
        <path
          d={arcPath(cx, cy, r, 180, 0)}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Colored filled arc (0 -> value) */}
        <path
          d={arcPath(cx, cy, r, 180, valueAngle)}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needle.x}
          y2={needle.y}
          stroke="#111827"
          strokeWidth={Math.max(2.5, width * 0.018)}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={Math.max(4, width * 0.03)} fill="#111827" />
      </svg>

      {showValue && (
        <div className="-mt-1 text-center">
          <span className="text-2xl font-black tracking-tight" style={{ color }}>
            {safeValue.toFixed(1)}
          </span>
          <span className="text-sm font-semibold text-gray-400">/{max}</span>
        </div>
      )}
      {label && (
        <p className="mt-0.5 text-sm font-bold text-gray-800">{label}</p>
      )}
    </div>
  );
}
