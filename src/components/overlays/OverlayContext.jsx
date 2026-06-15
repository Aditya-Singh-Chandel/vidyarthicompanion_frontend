'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

const OverlayContext = createContext(null);

export function OverlayProvider({ children }) {
  const [activePanel, setActivePanel] = useState(null);

  const openPanel = useCallback((panel) => setActivePanel(panel), []);
  const closePanel = useCallback(() => setActivePanel(null), []);

  return (
    <OverlayContext.Provider value={{ activePanel, openPanel, closePanel }}>
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error('useOverlay must be used within OverlayProvider');
  return ctx;
}
