'use client';

import React from 'react';
import ContactPanel from './ContactPanel';
import SettingsOverlay from './SettingsOverlay';

export default function OverlayRoot() {
  return (
    <>
      <ContactPanel />
      <SettingsOverlay />
    </>
  );
}
