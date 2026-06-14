'use client'; // Required for Next.js App Router since we use state

import React, { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import ZeroUiActionCard from "../../components/ZeroUiActionCard";
import { verifyScheduleOverride, createManualEvent } from "./overrideApi";
import { getMyNodes } from "../communityEngine/communityApi";

/**
 * Format an ISO date string into a readable, human-friendly label.
 * Falls back to the raw value if it can't be parsed.
 */
function formatIsoDate(isoString) {
  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) return isoString;
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
  const [responseEvents, setResponseEvents] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [myNodes, setMyNodes] = useState([]);
  const [shareNodeId, setShareNodeId] = useState(""); // "" = personal
  const [inputMethod, setInputMethod] = useState("upload"); // 'upload' | 'paste' | 'manual'
  const [pasteError, setPasteError] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);

  // Manual-entry fields.
  const [mName, setMName] = useState("");
  const [mDate, setMDate] = useState("");
  const [mTime, setMTime] = useState("");
  const [mLocation, setMLocation] = useState("");

  const previewUrlRef = useRef(null);

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

  // Revoke any object URL on unmount (no setState in the effect body).
  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, []);

  // Set the selected file + manage an image preview URL (from event handlers,
  // so we never call setState synchronously inside an effect).
  const setImage = (file) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setSelectedImage(file);
    if (file && file.type?.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleImageChange = (event) => {
    setImage(event.target.files?.[0] ?? null);
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
          setImage(new File([blob], `pasted-image.${ext}`, { type: blob.type }));
          event.preventDefault();
          return;
        }
      }
    }
    setPasteError("No image found in the paste. Copy an image first, then paste here.");
  };

  const ingestResult = (resultArray) => {
    if (resultArray && Array.isArray(resultArray)) setResponseEvents(resultArray);
    else if (resultArray && resultArray.events) setResponseEvents(resultArray.events);
    else console.error("Backend did not return a valid array of events.");
  };

  const handleApiCall = async () => {
    if (!selectedImage) return;
    setIsUploading(true);
    setStatusMsg(null);
    setResponseEvents([]);
    const resultArray = await verifyScheduleOverride(selectedImage, shareNodeId || null);
    ingestResult(resultArray);
    setIsUploading(false);
  };

  const handleManualSubmit = async () => {
    if (!mName.trim()) return;
    setIsUploading(true);
    setStatusMsg(null);
    setResponseEvents([]);
    const res = await createManualEvent({
      eventName: mName,
      date: mDate,
      time: mTime,
      location: mLocation,
      nodeId: shareNodeId || null,
    });
    if (res?.success) {
      setStatusMsg(res.message || "Event added.");
      if (res.data) setResponseEvents([res.data]);
    } else {
      setStatusMsg("Could not add the event. Please try again.");
    }
    setIsUploading(false);
  };

  const isManual = inputMethod === "manual";
  const canSubmit = isManual ? !!mName.trim() : !!selectedImage;
  const submitLabel = isUploading
    ? "Processing…"
    : isManual
    ? "Add Event"
    : "Verify Schedule";

  return (
    <div className="mx-auto w-full max-w-md space-y-6 p-6">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Override Engine</h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload, paste, or type a schedule entry and run the detection pipeline.
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
              setStatusMsg(null);
            }}
            disabled={isUploading}
            className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none disabled:opacity-60"
          >
            <option value="upload">Upload a file</option>
            <option value="paste">Copy / paste an image</option>
            <option value="manual">Manual entry</option>
          </select>
        </div>

        {/* UPLOAD */}
        {inputMethod === "upload" && (
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
        )}

        {/* PASTE */}
        {inputMethod === "paste" && (
          <div className="mt-4">
            <span className="block text-sm font-medium text-gray-700">Paste an image</span>
            <div
              role="textbox"
              tabIndex={0}
              onPaste={handlePaste}
              className={`mt-2 flex min-h-[96px] cursor-text flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-3 text-center text-xs focus:outline-none ${
                previewUrl
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-gray-300 bg-gray-50 text-gray-500 focus:border-indigo-400"
              }`}
            >
              {previewUrl ? (
                <>
                  <span className="mb-2 inline-flex items-center gap-1 font-semibold">
                    <Check className="h-3.5 w-3.5" /> Image pasted
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Pasted preview" className="max-h-32 rounded-md border border-emerald-200 shadow-sm" />
                  <span className="mt-1 text-[11px] text-emerald-600">Press Ctrl/Cmd+V again to replace.</span>
                </>
              ) : (
                <span>
                  Click here and press <span className="font-semibold">Ctrl/Cmd + V</span> to paste a copied image.
                </span>
              )}
            </div>
            {pasteError && <p className="mt-1 text-xs text-red-500">{pasteError}</p>}
          </div>
        )}

        {/* MANUAL */}
        {isManual && (
          <div className="mt-4 space-y-3">
            <div>
              <label htmlFor="m-name" className="block text-sm font-medium text-gray-700">
                Event
              </label>
              <input
                id="m-name"
                type="text"
                value={mName}
                onChange={(e) => setMName(e.target.value)}
                placeholder="e.g. Data Structures Lecture"
                disabled={isUploading}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none disabled:opacity-60"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label htmlFor="m-date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  id="m-date"
                  type="date"
                  value={mDate}
                  onChange={(e) => setMDate(e.target.value)}
                  disabled={isUploading}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none disabled:opacity-60"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="m-time" className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  id="m-time"
                  type="time"
                  value={mTime}
                  onChange={(e) => setMTime(e.target.value)}
                  disabled={isUploading}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none disabled:opacity-60"
                />
              </div>
            </div>
            <div>
              <label htmlFor="m-loc" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                id="m-loc"
                type="text"
                value={mLocation}
                onChange={(e) => setMLocation(e.target.value)}
                placeholder="e.g. Room 402"
                disabled={isUploading}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none disabled:opacity-60"
              />
            </div>
            <p className="text-xs text-gray-400">No date? It defaults to today.</p>
          </div>
        )}

        {/* Selected-file label (for non-image files) */}
        {!isManual && selectedImage && !previewUrl && (
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
          onClick={isManual ? handleManualSubmit : handleApiCall}
          disabled={isUploading || !canSubmit}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isUploading && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          )}
          {submitLabel}
        </button>

        {statusMsg && <p className="mt-3 text-center text-xs font-medium text-indigo-700">{statusMsg}</p>}
      </div>

      {/* Render extracted / added events */}
      <div className="space-y-4">
        {responseEvents.map((event, index) => (
          <ZeroUiActionCard
            key={event._id || index}
            eventName={event.eventName || "Unknown Event"}
            date={formatIsoDate(event.date || new Date().toISOString())}
            location={event.location || "TBD"}
            confidenceScore={event.confidenceScore || 0}
            systemAction="AI Verification Complete. Safe-Skip active if needed."
          />
        ))}
      </div>
    </div>
  );
}

export default OverrideWidget;
