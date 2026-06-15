'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import OverlayPanel from './OverlayPanel';
import { useOverlay } from './OverlayContext';
import Input, { Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ContactPanel() {
  const { activePanel, closePanel } = useOverlay();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      closePanel();
    }, 1800);
  };

  return (
    <OverlayPanel
      open={activePanel === 'contact'}
      onClose={closePanel}
      title="Get in touch"
      subtitle="We respond within 24 hours — no page reload needed."
    >
      <div className="mb-6 space-y-3">
        {[
          { icon: Mail, text: 'hello@vidyarthicompanion.in' },
          { icon: Phone, text: '+91 98765 43210' },
          { icon: MapPin, text: 'IIT Bombay, Mumbai' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--mist)]">
              <Icon className="h-4 w-4 text-[var(--teal)]" />
            </span>
            {text}
          </div>
        ))}
      </div>

      {sent ? (
        <div className="rounded-[var(--radius-xl)] border border-emerald-200 bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-700 animate-fade-in">
          Message sent! We&apos;ll be in touch soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" placeholder="Your name" required />
          <Input label="Email" type="email" placeholder="you@university.ac.in" required />
          <Textarea label="Message" placeholder="How can we help?" required />
          <Button type="submit" variant="primary" size="md" className="w-full" icon={Send}>
            Send message
          </Button>
        </form>
      )}
    </OverlayPanel>
  );
}
