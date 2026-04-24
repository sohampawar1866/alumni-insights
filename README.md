# Alumni Insights — IIIT Nagpur

A full-stack alumni networking platform that connects IIIT Nagpur students with graduates working at top companies. Built with Next.js 16, Supabase, and Tailwind CSS.

## Features

- **🔍 Alumni Search** — Filter by company, role, branch, city, graduation year
- **🤝 Connection Requests** — Structured request system with message templates
- **⭐ Feedback & Ratings** — Students rate sessions; alumni earn gamified tiers
- **🔔 Real-time Notifications** — Instant in-app alerts via Supabase Realtime
- **📢 Announcements** — Community board with likes, pinning, flagging
- **📝 Alumni Applications** — Students apply to be listed; moderators review
- **📊 Analytics Dashboard** — Moderator insights on platform usage
- **📁 Bulk Import** — CSV/JSON import for seeding alumni data
- **🛡️ Role-Based Access** — Student, Alumni, Moderator, Admin roles with middleware guards

## Tech Stack

| Layer     | Technology                       |
|-----------|----------------------------------|
| Frontend  | Next.js 16 (App Router), React 19 |
| Styling   | Tailwind CSS v4                  |
| Backend   | Supabase (Auth, Postgres, Edge Functions, Realtime) |
| Auth      | Google OAuth via Supabase        |
| Hosting   | PWA-ready with `next-pwa`        |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (student)/       # Student routes (dashboard, search, requests, announcements)
│   ├── alumni/          # Alumni routes (dashboard, profile, requests, settings)
│   ├── moderator/       # Moderator routes (management, import, analytics, audit)
│   ├── admin/           # Admin routes (user management)
│   ├── api/auth/        # Auth callback and sign-out
│   └── layout.tsx       # Root layout
├── components/          # Shared components
│   ├── ui/              # Base UI primitives (Button, Input)
│   ├── alumni-badge.tsx  # Gamification tier badge
│   ├── notification-bell.tsx # Real-time notification dropdown
│   ├── feedback-modal.tsx    # Session rating modal
│   └── announcements-board.tsx # Community announcements
├── proxy.ts             # Auth guards & role-based routing
├── utils/supabase/      # Supabase client helpers (server + client)
└── lib/utils.ts         # Utility functions
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `STUDENT_WEEKLY_REQUEST_LIMIT` | Per-student weekly request cap |
| `NEXT_PUBLIC_CURRENT_ACADEMIC_YEAR` | Active academic year used in eligibility checks |
