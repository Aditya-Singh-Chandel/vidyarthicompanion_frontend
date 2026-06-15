# HackOn with Amazon
## A Universe of Opportunity
*48-Hour Hackathon  |  Solution Document*

---

| | |
|---|---|
| **Team Name** | *[Your Team Name]* |
| **Hackathon Theme** | AI for Campus, Community & Everyday Life |
| **Date** | *[Submission Date]* |

### Team Members

| Name | College / University | Role | Email |
|------|----------------------|------|-------|
| *[Member 1]* | *[College]* | Backend Dev | *[Email]* |
| *[Member 2]* | *[College]* | Frontend Dev | *[Email]* |
| *[Member 3]* | *[College]* | ML / AI Engineer | *[Email]* |
| *[Member 4]* | *[College]* | Designer / DevOps | *[Email]* |

---
---

*HackOn with Amazon | Solution Document*

## 1. Problem Statement & Relevance

> *Jury focus: Innovativeness (novelty, theme alignment) + Degree of Disruption (global relevance)*

### The Problem
Student life runs on chaos. Class schedules, assignment deadlines, club events, attendance, transport, hostel notices, and exam stress are scattered across WhatsApp groups, emails, portals, and spreadsheets — so important updates are constantly missed. In parallel, students silently struggle with budgeting, food costs, irregular sleep, and burnout, while existing apps each solve only one slice (finance *or* fitness *or* productivity) and none understand the reality of campus living.

### Why It Matters
There are **40M+ students in India alone (250M+ globally)** living this fragmented, high-stress routine. A single missed reschedule can mean a failed attendance shortfall; one untracked month can blow a tight student budget; chronic sleep debt drives a documented campus mental-health crisis. The cost of inaction is measured in lost grades, wasted money, and student wellbeing at scale.

### Theme Alignment
VidyarthiCompanion is purpose-built for **"AI for Campus, Community & Everyday Life."** It fuses two of the prompt's flagship ideas — *VidyarthiCompanion* (AI OS for student life) and *PocketBuddy* (AI financial & wellness assistant) — into one community-verified operating system that organizes schedules, money, and wellbeing through a single intelligent layer.

### What Makes This Novel
Existing assistants are *single-user and trust-blind*. Our unique angle is a **community-verified, confidence-scored intelligence layer**: lightweight "sensor" features silently ingest raw life data (notices, payments, sleep, GPS), and heavy "engine" features run **deterministic math + AI intent-matching** on top of it. Every academic update carries an **AI confidence score** and a **crowd consensus score** (trust-weighted Echo/Flag votes), so a rescheduled class auto-corrects for an entire batch with near-zero hallucination — something no calendar, finance, or wellness app does today.

---
---

*HackOn with Amazon | Solution Document*

## 2. Customer & Solution

> *Jury focus: Quality of Presentation (clarity) + Quality of Implementation (working prototype)*

### Target Customer
College and hostel students (17–24) juggling academics, a tight monthly budget, and irregular sleep across noisy, multi-channel information sources. They need *one* trusted place that tells them what to do next, what's safe to spend, and when to rest — without manual data entry.

### How We Solve It
A web app built around two primitives — **Users** and **Communities** — where minor "sensor" features feed major "intelligence engines":

- **Feature 1 — Verified Campus Calendar:** AI parses a screenshot/photo of a timetable or notice (OCR) into structured events with a **confidence score**; the batch verifies them via trust-weighted **Echo/Flag consensus**, so one update syncs to everyone.
- **Feature 2 — PocketBuddy Finance + Wellness Hub:** Passively ingests payment alerts, auto-categorizes vendors via a **crowdsourced merchant graph**, tracks budget runway, and fuses mess-food votes + wallet balance into a "Wallet-vs-Wellness" recommendation (eat-in / treat / conserve).
- **Feature 3 — Routine, Empathy & Departure Engines:** A nightly-recalculated baseline routine prioritizes tasks (exams first), a **Safe-Skip** burnout calculus advises rest when attendance is safe, and a **geo-aware "Leave Now"** alert times departure from the user's exact campus location.

### User Workflow
**Sign up → join your batch/mess/gym communities → snap a timetable or notice photo → AI extracts events (confidence-scored) → batch verifies via Echo/Flag → verified plan flows into Today's Plan, Calendar, PocketBuddy budget & Wellness tracker → proactive nudges (leave now, order out, rest, study for test).**

### Working Prototype
End-to-end working web app (Next.js frontend + Express/MongoDB backend + Gemini AI):
- Auth, communities (join-by-code, mess/class/gym nodes), consensus voting
- AI OCR override engine, prioritized daily plan, master calendar
- PocketBuddy wallet ingest + tagging + recommendations
- Wellness tracker, empathy/safe-skip, presence + transit departure alerts

**Demo:** *[Video / Deployed URL]*

---
---

*HackOn with Amazon | Solution Document*

## 3. Tech Architecture & Scaling

> *Jury focus: Tech Architecture (complexity, algorithms, APIs, code quality) + Scalability (depth, interconnectedness)*

### Architecture
A decoupled, **event-driven sensor → engine** design. *Minor features* (Notice Parser, Consensus Counter, Sleep/Motion Aggregator, Geo-Poller, Attendance Tracker, Payment Gateway mock, Mess Ticker) only ingest and structure raw data. *Major features* (Routine, Override, Empathy Mesh, PocketBuddy, Community Graph, Retrieval, Departure, Recommendation engines) extract that data, run deterministic logic or AI intent-matching, and output single-tap **Zero-UI Action Cards**.

```
[ Sensors / Ingestors ]            [ Intelligence Engines ]              [ Presentation ]
 Notice OCR  ─┐                     1 Dynamic Baseline Routine ─┐
 Consensus   ─┤                     2 Verified Override         ─┤
 Sleep/Motion─┤ ──► MongoDB  ──►    3 Empathy Mesh / Safe-Skip  ─┤ ──► Zero-UI
 Geo-Poller  ─┤   (shared models)   4 PocketBuddy x Pay Hub     ─┤     Action Cards
 Attendance  ─┤                     5 Community Graph           ─┤    (React/Next.js)
 Pay Webhook ─┤                     6 Ground-Truth Retrieval    ─┤
 Mess Ticker ─┘                     7 Spatial-Temporal Departure─┘
                                     (AI intent-match via Gemini/Bedrock)
```

### Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | Next.js 16 (App Router), React 19, Tailwind v4, Zustand | Modern SSR/CSR, feature-sliced UI, lightweight global state |
| Backend | Node.js + Express 5 (REST `/api/v1`), JWT + bcrypt auth | Fast, decoupled engine routes; stateless token auth |
| Data | MongoDB + Mongoose 9 (sensor models keyed by userId) | Flexible write-schema for high-volume telemetry & votes |
| AI / ML | Google Gemini 2.5 Flash (OCR, intent, RAG) — *Amazon Bedrock / Nova-ready* | Vision OCR + grounded Q&A; pluggable to Bedrock for AWS-native deploy |
| Payments | Wallet model — conceptual balance + txn `source` enum (*Amazon Pay-ready*) | Frictionless budget tracking today; scalable to real Amazon Pay APIs for live ingestion & group splitting |
| Jobs | node-schedule (departure alarms, nightly routine rebuild) | Time-based "Leave Now" + midnight recompute |

### Key Algorithms & Complexity
- **Trust-weighted Consensus** — Echo(+1)/Flag(−1) votes snapshot each voter's trustScore; simple-majority verify/reject promotes only verified events to the calendar (O(votes) per event, idempotent via unique `{eventId,userId}` index).
- **AI Confidence + Hallucination Guardrail** — Gemini OCR returns a 0–1 confidence per extracted event; duplicates merged via consensus; past-year date hallucinations caught and corrected.
- **Safe-Skip Burnout Calculus** — weighted average of last-24h lifestyle logs vs. attendance buffer; fires anonymous "Empathy Nudge" only when exhaustion is high *and* attendance is safe.
- **Crowdsourced Merchant Graph** — one user's vendor tag backfills categorization for all matching transactions campus-wide (network effect).
- **Haversine Departure ETA** — per-mode (walk/cycle/auto) travel time from live GPS to next building; suppresses alert if already on-site.

### Scaling Strategy
Stateless Express engines scale horizontally behind a load balancer; MongoDB shards on `userId`/`nodeId` for batch-local reads. AI calls are pluggable to **Amazon Bedrock**, telemetry ingestion fits **Lambda + DynamoDB** write-heavy patterns, and notice/menu images move to **S3**. The community graph means value compounds with each campus added — designed for **100x–1000x** growth from one batch to nationwide multi-campus federation.

---
---

*HackOn with Amazon | Solution Document*

## 4. Future Vision

> *Jury focus: Futuristic Vision (long-term thinking, multi-segment expansion, value impact)*

### Where This Goes
In 1–3 years VidyarthiCompanion becomes the **default operating system for student life** — every campus runs on community-verified schedules, budget-aware spending, and proactive wellbeing nudges, with the AI quietly handling the chaos so students focus on learning.

### Roadmap

| Horizon | Milestone | Impact |
|---------|-----------|--------|
| 0–3 mo | Polish core engines, real Amazon Pay + UPI ingestion, mobile-friendly PWA | First pilot batch (1 college, ~2k students) |
| 3–6 mo | Native sleep/step sensors, push notifications, multi-campus onboarding | 10+ colleges, ~50k students |
| 6–12 mo | Bedrock-native AI, recommendation/carpool synergies, placement-prep module | Nationwide, 500k+ students |

### Multi-Segment Expansion
**Education → Hostels/PG living → Logistics (carpool/transit) → Campus commerce (mess/cafe/merchant graph) → Corporate onboarding & co-working communities.** The same sensor-engine-consensus core generalizes anywhere groups coordinate schedules, money, and wellbeing.

### Value Impact
Targeting **250M+ students globally**. Per student: fewer missed deadlines, **10–20% monthly savings** via budget guardrails, and measurable burnout reduction. At scale this is a verified-coordination layer worth hundreds of millions in saved time, money, and improved academic outcomes — plus Amazon Pay transaction volume and Bedrock consumption.

---

**Links:** GitHub *[URL]*  |  Demo Video *[URL]*  |  Live App *[URL]*
