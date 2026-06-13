'use client'; // Required for Next.js App Router since we use state

import React, { useState } from "react";
import ZeroUiActionCard from "../../components/ZeroUiActionCard";

const MOCK_RESPONSE_DATA = {
  eventName: "CS301 Midterm",
  date: "2026-06-15T09:00:00.000Z",
  location: "Room 402",
  confidenceScore: 0.98,
  systemAction: "Routines paused. Safe-Skip activated."
};
/**
 * Format an ISO date string into a readable, human-friendly label.
 * Falls back to the raw value if it can't be parsed.
 */
function formatIsoDate(isoString) {
  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) {
    return isoString;
  }

  return parsed.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function OverrideWidget() {
  const [isUploading, setIsUploading] = useState(false);
  const [mockResponseData, setMockResponseData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedImage(file);
  };

  const handleSimulateApiCall = () => {
    setIsUploading(true);
    // Clear any previous result while the new "request" is in flight.
    setMockResponseData(null);

    setTimeout(() => {
      setMockResponseData(MOCK_RESPONSE_DATA);
      setIsUploading(false);
    }, 2000);
  };

  const handleVerify = () => {
    console.log("Verified & Echoed:", mockResponseData);
  };

  const handleFlag = () => {
    console.log("Flagged as error:", mockResponseData);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 p-6">
      {/* Upload + simulate controls */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Override Engine</h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload a schedule image and run the detection pipeline.
        </p>

        <div className="mt-5">
          <label
            htmlFor="override-image"
            className="block text-sm font-medium text-gray-700"
          >
            Schedule image
          </label>
          <input
            id="override-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUploading}
            className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-60"
          />
          {selectedImage && (
            <p className="mt-2 truncate text-xs text-gray-500">
              Selected: {selectedImage.name}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSimulateApiCall}
          disabled={isUploading}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isUploading && (
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
          {isUploading ? "Processing..." : "Simulate API Call"}
        </button>
      </div>

      {/* Result */}
      {mockResponseData && (
        <ZeroUiActionCard
          eventName={mockResponseData.eventName}
          date={formatIsoDate(mockResponseData.date)}
          location={mockResponseData.location}
          confidenceScore={mockResponseData.confidenceScore}
          systemAction={mockResponseData.systemAction}
          onVerify={handleVerify}
          onFlag={handleFlag}
        />
      )}
    </div>
  );
}

export default OverrideWidget;