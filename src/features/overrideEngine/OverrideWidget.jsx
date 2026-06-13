'use client'; // Required for Next.js App Router since we use state

import React, { useState, useEffect } from "react";
import ZeroUiActionCard from "../../components/ZeroUiActionCard";
import { verifyScheduleOverride } from "./overrideApi";

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
  
  // UPDATED: Now expecting an array of events
  const [responseEvents, setResponseEvents] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // 1. Add mounted state to fix hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedImage(file);
  };

  const handleApiCall = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    setResponseEvents([]); // Clear previous results

    // LIVE API CONNECTION
    const resultArray = await verifyScheduleOverride(selectedImage, "student_1");
    console.log("Raw Array from Backend:", resultArray);

    if (resultArray && Array.isArray(resultArray)) {
      setResponseEvents(resultArray);
    } else if (resultArray && resultArray.events) {
      // Fallback just in case User 3 nested it inside an 'events' key
      setResponseEvents(resultArray.events);
    } else {
      console.error("Backend did not return a valid array of events.");
    }
    
    setIsUploading(false);
  };

  const handleVerify = (eventData) => {
    console.log("Verified & Echoed:", eventData);
  };

  const handleFlag = (eventData) => {
    console.log("Flagged as error:", eventData);
  };

  // 2. Prevent rendering until the browser takes over
  if (!isMounted) {
    return <div className="mx-auto w-full max-w-md h-[250px] p-6" />;
  }

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
          onClick={handleApiCall}
          disabled={isUploading || !selectedImage}
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
          {isUploading ? "Processing via Gemini AI..." : "Verify Schedule Upload"}
        </button>
      </div>

      {/* Render Multiple Results if Syllabus Uploaded */}
      <div className="space-y-4">
        {responseEvents.map((event, index) => (
          <ZeroUiActionCard
            key={index}
            eventName={event.eventName || "Unknown Event"}
            date={formatIsoDate(event.date || new Date().toISOString())}
            location={event.location || "TBD"}
            confidenceScore={event.confidenceScore || 0}
            systemAction="AI Verification Complete. Safe-Skip active if needed."
            onVerify={() => handleVerify(event)}
            onFlag={() => handleFlag(event)}
          />
        ))}
      </div>
    </div>
  );
}

export default OverrideWidget;