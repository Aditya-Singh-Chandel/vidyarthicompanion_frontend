'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Brain, Calendar, Wallet, Zap, Sparkles, Shield, MessageCircle } from 'lucide-react';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import JourneySection from '@/components/marketing/JourneySection';
import ScrollReveal from '@/components/ScrollReveal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

/* ─── Typing Effect Hook ─── */
function useTypingEffect(words, speed = 100, pause = 2000) {
  const [display, setDisplay] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIndex + 1));
        if (charIndex + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIndex(c => c + 1);
        }
      } else {
        setDisplay(current.slice(0, charIndex));
        if (charIndex === 0) {
          setDeleting(false);
          setWordIndex((i) => (i + 1) % words.length);
        } else {
          setCharIndex(c => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed, pause]);

  return display;
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ value, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const numVal = parseFloat(value.replace(/[^0-9.]/g, ''));
    const steps = 60;
    const increment = numVal / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numVal) {
        setCount(numVal);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, value, duration]);

  const formatted = value.includes('.')
    ? count.toFixed(1)
    : Math.floor(count).toLocaleString();

  return (
    <span ref={ref} className="text-mono-data text-3xl font-black">
      {started ? formatted : '0'}
      {started ? suffix : ''}
    </span>
  );
}

/* ─── Mouse Glow Card ─── */
function GlowCard({ children, className = '' }) {
  const cardRef = useRef(null);
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-[var(--radius-2xl)] border border-white/60 bg-white/60 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 ${className}`}
      style={{
        background: `radial-gradient(circle 200px at ${glow.x}% ${glow.y}%, rgba(109, 94, 252, 0.08), transparent 70%), rgba(255,255,255,0.6)`,
      }}
    >
      {children}
    </div>
  );
}

const FLOAT_STATS = [
  { value: '12000', suffix: '+', label: 'Schedules synced', icon: Calendar },
  { value: '98', suffix: '%', label: 'AI accuracy', icon: Brain },
  { value: '2.4', suffix: 'L+', label: 'Saved monthly (₹)', icon: Wallet },
];

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Brain',
    desc: 'Context-aware retrieval engine that understands your campus, schedule, and preferences in real-time',
    gradient: 'from-[var(--brand)] to-[var(--brand-3)]',
  },
  {
    icon: Calendar,
    title: 'Smart Calendar',
    desc: 'AI-orchestrated scheduling with conflict detection, priority ranking, and automated routine optimization',
    gradient: 'from-[var(--brand-2)] to-[var(--brand-4)]',
  },
  {
    icon: Wallet,
    title: 'PocketBuddy',
    desc: 'Intelligent expense tracking with predictive budgeting, community splitting, and spending insights',
    gradient: 'from-[var(--brand-3)] to-[var(--brand)]',
  },
];

const CAPABILITIES = [
  { icon: Shield, label: 'Trust-Weighted Verification', desc: 'Community-powered fact-checking with weighted consensus' },
  { icon: MessageCircle, label: 'Empathy Mesh', desc: 'AI-driven wellness alerts that detect burnout before it hits' },
  { icon: Sparkles, label: 'Zero-UI Actions', desc: 'One-tap confirmations — the system handles everything else' },
];

export default function HomePage() {
  const typedWord = useTypingEffect(
    ['illuminated', 'orchestrated', 'transformed', 'supercharged'],
    80,
    2500
  );

  return (
    <MarketingLayout>
      {/* ════════ HERO ════════ */}
      <section className="relative min-h-screen overflow-hidden px-4 pt-28 pb-20 sm:px-6">
        {/* Aurora background */}
        <div className="absolute inset-0 surface-aurora" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="cf-blob cf-blob-1" />
          <div className="cf-blob cf-blob-2" />
          <div className="cf-blob cf-blob-3" />
          <div className="cf-blob cf-blob-4" />
          <div className="cf-grid" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <ScrollReveal>
            <Badge variant="saffron" className="mb-6 border-[var(--brand)]/30 bg-[var(--brand)]/10 text-[var(--brand-light)]">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 inline-block" />
              VidyarthiCompanion · AI Campus OS
            </Badge>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="text-display max-w-4xl text-[var(--text-on-dark)]">
              Campus life,
              <br />
              <span className="bg-gradient-to-r from-[var(--brand-light)] via-[var(--brand-2)] to-[var(--brand-3)] bg-clip-text text-transparent">
                {typedWord}
              </span>
              <span className="inline-block w-[3px] h-[0.9em] bg-[var(--brand-3)] ml-1 align-middle" style={{ animation: 'typing-cursor 0.8s step-end infinite' }} />
              <br />
              by AI.
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
              VidyarthiCompanion is a fluid campus operating system — schedule intelligence,
              community trust networks, and financial awareness, all orchestrated by AI into
              one living, breathing workspace.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/dashboard">
                <Button variant="primary" size="lg" icon={Zap}>
                  Open Dashboard
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" size="lg" className="border-[var(--brand-3)] text-[var(--brand-3)] hover:bg-[var(--brand-3)] hover:text-white">
                  Explore Features
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          {/* Floating stat cards with animated counters */}
          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {FLOAT_STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <ScrollReveal key={stat.label} delay={400 + i * 100} direction="up">
                  <div className="glass-dark rounded-[var(--radius-2xl)] p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(109,94,252,0.4)] group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                        <Icon className="h-4.5 w-4.5 text-[var(--brand-3)]" />
                      </div>
                      <p className="text-sm text-white/50">{stat.label}</p>
                    </div>
                    <div className="text-[var(--brand-3)]">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ FEATURES GRID ════════ */}
      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="mb-14 flex items-end justify-between gap-4">
              <div>
                <span className="section-label">Core Engines</span>
                <h2 className="text-headline mt-2 text-[var(--text-primary)]">
                  Three engines, one <span className="cf-gradient-text">ecosystem</span>
                </h2>
              </div>
              <Link href="/features" className="hidden sm:block">
                <Button variant="ghost" size="sm" icon={ArrowRight}>See all</Button>
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.title} delay={i * 150}>
                  <GlowCard className="p-6">
                    <div
                      className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${item.gradient} opacity-20 blur-2xl transition-transform duration-700 group-hover:scale-[2]`}
                    />
                    <div className="relative">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)]/10 to-[var(--brand-2)]/10 ring-1 ring-inset ring-[var(--brand)]/10">
                        <Icon className="h-6 w-6 text-[var(--brand)]" />
                      </div>
                      <h3 className="text-title text-[var(--text-primary)]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{item.desc}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand)] transition-all group-hover:gap-3">
                        Learn more <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </GlowCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ CAPABILITIES RIBBON ════════ */}
      <section className="px-4 py-16 sm:px-6 overflow-hidden">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="grid gap-5 md:grid-cols-3">
              {CAPABILITIES.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={cap.label}
                    className="flex items-start gap-4 rounded-2xl border border-[var(--cloud)] bg-white/50 backdrop-blur-md p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-glow-brand)]"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)]/10 to-[var(--brand-2)]/10">
                      <Icon className="h-5 w-5 text-[var(--brand)]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">{cap.label}</h4>
                      <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">{cap.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <JourneySection />

      {/* ════════ CTA ════════ */}
      <section className="px-4 py-20 sm:px-6">
        <ScrollReveal>
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[var(--radius-2xl)] px-8 py-16 text-center surface-aurora">
            {/* Aurora orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <span className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-[var(--brand)] opacity-30 blur-[80px] cf-float" />
              <span className="absolute right-[-3rem] top-1/3 h-48 w-48 rounded-full bg-[var(--brand-3)] opacity-25 blur-[70px] cf-float" style={{ animationDelay: '1.5s' }} />
              <span className="absolute bottom-[-3rem] left-1/3 h-56 w-56 rounded-full bg-[var(--brand-4)] opacity-20 blur-[80px] cf-float" style={{ animationDelay: '3s' }} />
            </div>
            <div className="relative">
              <h2 className="text-headline text-[var(--text-on-dark)]">
                Ready to <span className="cf-gradient-text">flow</span>?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
                Sign in once. Settings and contact slide in as overlays — you never lose your place.
                Your entire campus life, beautifully orchestrated.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link href="/register">
                  <Button variant="primary" size="lg">Create account</Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost" size="lg" className="text-[var(--text-on-dark)] hover:bg-white/10">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </MarketingLayout>
  );
}
