'use client'; // Required for Next.js App Router since we use state

import React, { useState, useEffect } from "react";
import ZeroUiActionCard from "../../components/ZeroUiActionCard";
import { verifyScheduleOverride } from "./overrideApi";
import { getMyNodes } from "../communityEngine/communityApi";

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
  const [myNodes, setMyNodes] = useState([]);
  const [shareNodeId, setShareNodeId] = useState(""); // "" = personal
  const [inputMethod, setInputMethod] = useState("upload"); // 'upload' | 'paste'
  const [pasteError, setPasteError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const nodes = await getMyNodes();
      if (!cancelled) setMyNodes(nodes);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedImage(file);
  };

  // Capture a pasted image (Ctrl/Cmd+V) into the paste area.
  const handlePaste = (event) => {
    setPasteError(null);
    const items = event.clipboardData?.items || [];
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const blob = item.getAsFile();
        if (blob) {
          const ext = (blob.type.split("/")[1] || "png").split("+")[0];
          setSelectedImage(new File([blob], `pasted-image.${ext}`, { type: blob.type }));
          event.preventDefault();
          return;
        }
      }
    }
    setPasteError("No image found in the paste. Copy an image first, then paste here.");
  };

  // Read an image directly from the clipboard via the async Clipboard API.
  const handleClipboardRead = async () => {
    setPasteError(null);
    try {
      if (!navigator.clipboard?.read) {
        setPasteError("Clipboard access isn't available in this browser. Use Ctrl/Cmd+V instead.");
        return;
      }
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imgType = item.types.find((t) => t.startsWith("image/"));
        if (imgType) {
          const blob = await item.getType(imgType);
          const ext = (imgType.split("/")[1] || "png").split("+")[0];
          setSelectedImage(new File([blob], `pasted-image.${ext}`, { type: imgType }));
          return;
        }
      }
      setPasteError("No image found in the clipboard.");
    } catch {
      setPasteError("Couldn't read the clipboard. Use Ctrl/Cmd+V instead.");
    }
  };

  const handleApiCall = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    setResponseEvents([]); // Clear previous results

    // LIVE API CONNECTION (shareNodeId "" means personal/private)
    const resultArray = await verifyScheduleOverride(selectedImage, shareNodeId || null);
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

  return (
    <div className="mx-auto w-full max-w-md space-y-6 p-6">
      {/* Upload + simulate controls */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Override Engine</h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload or paste a schedule (image, PDF, CSV, or ICS) and run the detection pipeline.
        </p>

        {/* Input method selector */}
        <div className="mt-5">
          <label htmlFor="input-method" className="block text-sm font-medium text-gray-700">
            Input method
          </label>
          <select
            id="input-method"
            value={inputMethod}
            onChange={(e) => {
              setInputMethod(e.target.value);
              setPasteError(null);
            }}
            disabled={isUploading}
            className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none disabled:opacity-60"
          >
            <option value="upload">Upload a file</option>
            <option value="paste">Copy / paste an image</option>
          </select>
        </div>

        {inputMethod === "upload" ? (
          <div className="mt-4">
            <label htmlFor="override-image" className="block text-sm font-medium text-gray-700">
              Schedule file
            </label>
            <input
              id="override-image"
              type="file"
              accept="image/*,application/pdf,.csv,.ics,text/calendar,text/csv"
              onChange={handleImageChange}
              disabled={isUploading}
              className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-60"
            />
            <p className="mt-1 text-xs text-gray-400">Supported: images, PDF, CSV, ICS.</p>
          </div>
        ) : (
          <div className="mt-4">
            <span className="block text-sm font-medium text-gray-700">Paste an image</span>
            <div
              role="textbox"
              tabIndex={0}
              onPaste={handlePaste}
              className="mt-2 flex min-h-[88px] cursor-text items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-center text-xs text-gray-500 focus:border-indigo-400 focus:outline-none"
            >
              Click here and press <span className="mx-1 font-semibold">Ctrl/Cmd + V</span> to paste a copied image.
            </div>
            <button
              type="button"
              onClick={handleClipboardRead}
              disabled={isUploading}
              className="mt-2 inline-flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-60"
            >
              Paste from clipboard
            </button>
            {pasteError && <p className="mt-1 text-xs text-red-500">{pasteError}</p>}
          </div>
        )}

        {selectedImage && (
          <p className="mt-2 truncate text-xs text-gray-500">Selected: {selectedImage.name}</p>
        )}

        {/* Share-with-node selector */}
        <div className="mt-4">
          <label htmlFor="share-node" className="block text-sm font-medium text-gray-700">
            Share with
          </label>
          <select
            id="share-node"
            value={shareNodeId}
            onChange={(e) => setShareNodeId(e.target.value)}
            disabled={isUploading}
            className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none disabled:opacity-60"
          >
            <option value="">Personal (only me)</option>
            {myNodes.map((n) => (
              <option key={n.nodeId} value={n.nodeId}>
                {n.name} ({n.nodeType})
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-400">
            Sharing posts the events to your community for trust-weighted verification.
          </p>
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