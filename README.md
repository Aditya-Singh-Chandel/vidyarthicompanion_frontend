<div align="center">

# 🖥 VidyarthiCompanion — Frontend (Production)

### Next.js 16 Web Application — Cloud Deployment Build

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5-000000)](https://zustand-demo.pmnd.rs/)

</div>

---

## 📖 Overview

This is the **production-ready** variant of the VidyarthiCompanion frontend, configured to connect to a **cloud-hosted MongoDB Atlas** backend. The codebase is identical to VidyarthiCompanion-frontend — the only difference is the environment configuration pointing to the deployed backend.

> For comprehensive documentation on the project structure, pages, components, feature modules, and state management, refer to the **VidyarthiCompanion-frontend README**.

---

## 🚀 Getting Started

```bash
# Navigate to this directory
cd github-frontend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env.local
# Edit .env.local to point to your deployed backend URL

# Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**.

---

## 🔐 Environment Variables

Create a `.env.local` file by copying `.env.example`:

```env
# Base URL for the VidyarthiCompanion backend API (production)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | ✅ | Base URL of the production backend API |

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint checks |

---

## 🔗 Related

- **Root README** — Full project overview and architecture
- **VidyarthiCompanion-frontend README** — Detailed frontend documentation (identical codebase)
- **github-backend README** — Production backend API

---

<div align="center">

**Part of the VidyarthiCompanion Campus OS**

*Built by Team QuantYap*

</div>
