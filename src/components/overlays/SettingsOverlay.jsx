'use client';

import React, { useState } from 'react';
import OverlayPanel from './OverlayPanel';
import { useOverlay } from './OverlayContext';
import Toggle from '@/components/ui/Toggle';
import Button from '@/components/ui/Button';
import { Bell, Moon, Shield, Zap } from 'lucide-react';

export default function SettingsOverlay() {
  const { activePanel, closePanel } = useOverlay();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [aiAssist, setAiAssist] = useState(true);
  const [privacy, setPrivacy] = useState(true);

  return (
    <OverlayPanel
      open={activePanel === 'settings'}
      onClose={closePanel}
      title="Quick settings"
      subtitle="Adjust preferences without leaving your flow."
      width="max-w-lg"
    >
      <div className="space-y-6">
        <section>
          <h3 className="text-label mb-4 text-[var(--text-secondary)]">Preferences</h3>
          <div className="space-y-4 rounded-[var(--radius-xl)] border border-[var(--cloud)] p-4">
            <Toggle
              checked={notifications}
              onChange={setNotifications}
              label="Push notifications"
              description="Exam alerts, community votes, budget warnings"
            />
            <Toggle
              checked={darkMode}
              onChange={setDarkMode}
              label="Dark mode"
              description="Switch to midnight monsoon theme"
            />
            <Toggle
              checked={aiAssist}
              onChange={setAiAssist}
              label="AI auto-suggestions"
              description="Let VidyarthiCompanion plan your day proactively"
            />
            <Toggle
              checked={privacy}
              onChange={setPrivacy}
              label="Privacy mode"
              description="Hide wellness data from community"
            />
          </div>
        </section>

        <section>
          <h3 className="text-label mb-4 text-[var(--text-secondary)]">Quick links</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Bell, label: 'Alerts' },
              { icon: Moon, label: 'Schedule' },
              { icon: Zap, label: 'AI Engine' },
              { icon: Shield, label: 'Security' },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                className="card-base flex items-center gap-2 p-3 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--teal)]"
              >
                <Icon className="h-4 w-4 text-[var(--teal)]" />
                {label}
              </button>
            ))}
          </div>
        </section>

        <Button variant="primary" size="md" className="w-full" onClick={closePanel}>
          Save & close
        </Button>
      </div>
    </OverlayPanel>
  );
}
