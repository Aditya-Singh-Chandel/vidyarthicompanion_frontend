'use client';

import React from 'react';
import PublicNav from './PublicNav';
import Footer from './Footer';

export default function MarketingLayout({ children }) {
  return (
    <div className="min-h-screen surface-mist">
      <PublicNav />
      <div className="page-enter">{children}</div>
      <Footer />
    </div>
  );
}
