# Product Requirements Document
# Alumni Insights

**Version:** 2.0
**Status:** Draft
**Last Updated:** April 2026
**Institution:** IIIT Nagpur (MVP Scope)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Roles & Authentication](#3-roles--authentication)
4. [Target Users](#4-target-users)
5. [Core Features](#5-core-features)
6. [User Flows](#6-user-flows)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Privacy & Data Policies](#8-privacy--data-policies)
9. [Constraints & Risks](#9-constraints--risks)
10. [Key Decisions](#10-key-decisions)

---

## 1. Project Overview

**Alumni Insights** is an alumni discovery and networking platform for IIIT Nagpur. It allows current students to search for, view, and connect with IIIT Nagpur alumni for career guidance and mentorship.

**Mentorship is strictly volunteer and free.** No paid sessions.

**Platform:** Web + PWA (installable on mobile, no native app required).

> **Intern-as-Alumni:** A student currently doing an internship may also be granted the alumni role by a moderator. Thanks to the **multi-role system**, a single account can hold both `student` and `alumni` roles simultaneously — the user can access both portals without needing separate accounts or credentials.

---

## 2. Problem Statement

**For Students:**
- No easy way to find IIIT Nagpur alumni at specific companies or roles.
- LinkedIn cold outreach has low response rates and no college context.
- No official channel to reach alumni who are genuinely open to helping.

**For Alumni:**
- No structured, low-friction way to offer mentorship to juniors from their college.
- Existing alumni portals are outdated and rarely used.

**For the Placement Cell (Moderator):**
- Alumni data is scattered across spreadsheets; no central, up-to-date directory.
- No tool to track placement outcomes for NAAC/NBA accreditation.

---

## 3. Roles & Authentication

The platform has four roles. A single account can hold **multiple roles simultaneously** (e.g. a student who is also an alumni). Role boundaries are enforced at the route level — each portal checks whether the user's `roles` array includes the required role.

### 3.1 — The Four Roles

| Role | Who They Are | Account Created By | Login Method |
|---|---|---|---|
| **Student** | Current IIIT Nagpur students using the platform to find alumni | Self-registration | Google OAuth (institutional email only, e.g. @iiitn.ac.in) |
| **Alumni** | IIIT Nagpur graduates (or current interns) whose profiles are on the platform | Institution Moderator | Email + Password |
| **Moderator** | Placement cell staff managing the alumni database for IIIT Nagpur | Admin | Email + Password |
| **Admin** | Single platform-level operator who creates/manages moderator accounts | Pre-seeded in Supabase at initial deployment (one-time setup) | Email + Password |

---

### 3.2 — Student Login & Verification

- Students sign up using **Google OAuth with their IIIT Nagpur institutional email** (@iiitn.ac.in). No personal Gmail or phone number allowed.
- To improve UX, the Google OAuth prompt uses the **`hd` (hosted domain) parameter** to pre-filter the account picker so it surfaces only @iiitn.ac.in accounts. This reduces friction for students who may have multiple Google accounts on their device. **This is a convenience hint only — it is not a security control.**
- The actual verification happens **server-side after sign-in**: the returned email's domain is checked against @iiitn.ac.in. If a student bypasses the pre-filter (e.g. by choosing a different account), they will be denied access at this server-side check.
- Having a verified @iiitn.ac.in email is sufficient for access — no roll number or additional validation required.
- After login, students complete a brief profile (graduation year, branch, current status).

---

### 3.3 — Alumni Login

- Alumni accounts are created by the moderator — individually via the moderator panel or via bulk CSV import.
- Upon account creation, the system generates login credentials (email + password).
- **Credential delivery is manual.** The moderator shares credentials with each alumnus via WhatsApp or email. Two formats are available:
  - **Per-alumni copyable card** — when the moderator creates a single alumni account, the system immediately displays a small card on screen showing that alumnus's login email and temporary password. The moderator can copy this with one click and paste it directly into a WhatsApp message or email to send to that alumnus.
  - **Bulk CSV export** — generated after a bulk import, containing name + login email + temporary password for each alumnus.
- Alumni log in at `/alumni/login` with email + password. No Google OAuth.
- Password changes are self-managed: alumni can update their password at any time from the **Settings** tab once logged in. On first login, a **dismissible suggestion popup** is shown recommending they change their temporary password — it is not mandatory and can be skipped.

#### 3.3.1 — Self-Apply as Alumni (for 4th Year+ Students)

To catch students who may have been accidentally missed by the moderator, a **"Apply as Alumni"** button is shown to eligible students within their student portal.

**Eligibility:** The button is shown only to students who are in their **4th year or beyond**. Year eligibility is computed automatically using the **current academic year, which is read from an environment variable** — so as a student's academic standing advances, the button appears without any manual intervention.

**What happens when clicked:**
- The student fills out a short application form with details such as: current job/internship position, company name, employment type (Full-time / Intern), city, and LinkedIn URL.
- On submission, this data is saved to a **separate alumni applications table** — it does **not** create an alumni account automatically.

**Moderator handling (optional):**
- Moderators can view submitted applications in a dedicated section of the moderator panel.
- This review is entirely optional — there is no notification or obligation to act on applications.
- Applications can be **exported as a CSV in the exact format required for bulk alumni import**, so the moderator can review, clean if needed, and import directly without re-entering data.

---

### 3.4 — Moderator Login

- Moderator accounts are created exclusively by the Admin.
- Each moderator account has a **unique display name** (e.g. "Soham Pawar") assigned by the Admin at account creation time. This name is used for attribution across the platform — on posts, and in the moderator panel's Recent Changes audit log.
- Login at `/moderator/login` with email + password. No Google OAuth.
- Each moderator account is scoped to IIIT Nagpur only.

---

### 3.5 — Admin

- There is exactly **one Admin** account (`admin@iiitn.ac.in`), **pre-seeded in Supabase** during initial deployment. It cannot be created or recovered through any in-app flow.
- The admin account is created once via the Supabase dashboard (Authentication → Users → Create User) and a corresponding `profiles` row with `roles: ['admin']` is inserted. This is a one-time manual setup step.
- The Admin panel has exactly three functions: **Create**, **Edit**, and **Delete** moderator accounts. When creating a moderator account, the Admin sets a unique display name, email, and password.
- The Admin has no access to alumni data, student data, or any other platform content.
- Login at `/admin/login` with email + password.

> ⚠️ **Security:** The admin email is not stored in environment variables or hardcoded in the codebase. The admin account exists solely as a database record. Admin credentials should never appear in version control history or any committed file.

---

### 3.6 — Login Routes

| Portal | URL | Login Method |
|---|---|---|
| Student portal | `/` or `/login` | Google OAuth (institutional email) |
| Alumni portal | `/alumni/login` | Email + Password |
| Moderator panel | `/moderator/login` | Email + Password |
| Admin panel | `/admin/login` | Email + Password |

Each route is completely separate. Session tokens are role-scoped.

---

## 4. Target Users

### Student — Priya, 21, B.Tech Final Year (CSE), IIIT Nagpur
- Wants to break into a product or software role at a startup.
- Doesn't know any alumni at her target companies; LinkedIn cold searches go unanswered.
- Needs: Easy search of IIIT Nagpur alumni by company and role; a structured, low-pressure way to reach out.

### Alumni — Arjun, 27, Software Engineer at a Pune startup, 3 years post-IIIT Nagpur
- Wants to give back to juniors from his college, but has no structured channel to do so.
- Needs: Control over availability and types of help offered; a simple, low-effort way to be discoverable to IIIT Nagpur students.

### Moderator — Dr. Mehta, Placement Cell Head, IIIT Nagpur
- Wants to improve placement outcomes and track alumni data for accreditation.
- Currently manages everything via Excel and WhatsApp.
- Needs: Bulk upload, a dashboard of alumni by company/city/branch, exportable reports.

---

## 5. Core Features

### 5.1 — Alumni Profile

Each alumnus has a profile with the following fields:

**Set by Moderator (cannot be changed by the alumnus):**
- Full name
- Institution: IIIT Nagpur
- Graduation year + degree/branch

**Set/Updated by the Alumnus after login:**
- Current role and employer
- Employment type at current employer: `Full-time` or `Intern` (can be updated anytime as circumstances change)
- City/Country
- LinkedIn URL (optional)
- Short bio / "What I can help with" (max 300 characters)
- Mentorship availability toggle (On/Off)
- Mentorship preferences — free-text input where the alumnus types what they can help with. When the field is focused, a set of common suggestions is shown (e.g. Resume Review, Career Advice, Job Referrals, Mock Interviews, Company Insights) that can be tapped to auto-fill, but the alumnus can also type anything freely. No dropdowns, no fixed options — similar to how WhatsApp lets you type a custom status but also shows defaults to pick from. No history or previously entered values are stored.

**Profile Completeness Score:** A visible % indicator nudging alumni to fill in more details. Profiles with higher completeness rank higher in search results.

---

### 5.2 — Alumni Search & Discovery

The core feature of the platform. Students can search and filter IIIT Nagpur alumni using:

- Company name
- Industry / Domain
- Job role / Title keyword
- City / Country
- Graduation year or range
- Branch / Department
- **Employment type:** `Intern only` / `Full-time only` / `All` (to find, e.g., who from IIIT Nagpur is currently interning at a company)
- Mentorship availability (On/Off)

**Search result card shows:** Name, Role, Company, Employment Type badge (`Intern` / `Full-time`), Graduation Year, Branch, Availability badge.

---

### 5.3 — Connection & Messaging

**How a student connects with an alumnus:**
1. Student views an alumni profile.
2. Selects a request type: Informational chat / Resume review / Referral ask / Company insight.
3. Writes a short note (max 200 characters) explaining their ask.
4. Request is sent to the alumnus's inbox.

**Rules:**
- Students can send a maximum of **10 connection requests per week** (to reduce spam). This limit is set via the `STUDENT_WEEKLY_REQUEST_LIMIT` environment variable so it can be adjusted without a code change.
- The student dashboard prominently displays the number of connection requests remaining for the current week (e.g. "7 of 10 requests remaining this week"), resetting every Monday.
- Alumni can accept or decline requests.
- On acceptance, a 1:1 chat thread opens.
- Chat threads auto-archive after 30 days of inactivity.
- Alumni profiles display a response rate indicator alongside both the number of requests sent to them by students and the number accepted (e.g., "Typically responds within 2 days · 8 of 12 requests accepted"). This gives students full context — a high acceptance rate means little if only 1 request was ever sent, and a lower rate on a high volume is far more informative than a perfect rate on zero activity.
- Pre-written message templates are available to help students write their first message.

---

### 5.4 — Mentorship Tracking & Recognition

- After a chat session, both parties can mark it as "completed".
- Students can leave optional feedback (rating + short text) — the student's name is shown alongside their feedback. Visible only to the platform for ranking, not public.
- Alumni earn "contribution points" per completed session.

**Recognition tiers:**
- Bronze: 1–5 sessions
- Silver: 6–20 sessions
- Gold: 21–50 sessions
- Platinum: 50+ sessions, or nominated by 10+ students

Top-tier mentors get "Featured Alumnus" placement. Badges can be shared as a card (LinkedIn-friendly). An annual "Alumni Impact" certificate is issued via the platform.

---

### 5.5 — Moderator Panel (Institution Dashboard)

**Alumni Management:**
- Bulk import alumni data via CSV (defined schema).
- Individual alumni account creation with a copyable credential card.
- After bulk import, a downloadable credential CSV is generated (name | login email | temp password).
- Edit or deactivate individual alumni accounts.

**Recent Changes (Audit Log):**
- A chronological log of all moderator-initiated actions on the platform (alumni account created, edited, deactivated, post published, post deleted, etc.).
- Each entry shows: **action taken**, **moderator display name** who performed it, and **timestamp**.
- Visible to all moderators (including themselves) — no actions are hidden between moderator accounts.
- Not editable or deletable by anyone, including the Admin. Read-only.

**Analytics:**
- Total alumni profiles — breakdown by branch, company, city, graduation batch.
- Top employers of IIIT Nagpur alumni.
- Active alumni count (responded to at least one student request in last 90 days).
- Total mentorship sessions facilitated.
- Student-to-alumni connection success rate.

**Communication:**
- Segment alumni by batch/branch/location.
- Send bulk messages or announcements to alumni subgroups.

---

### 5.6 — Onboarding Flows

**Student (target: under 3 minutes)**
1. Sign in with Google (IIIT Nagpur institutional email).
2. Google OAuth verifies the @iiitn.ac.in domain — access is granted immediately.
3. Select graduation year, branch, current status.
4. Optionally complete profile.
5. Land on the alumni search page.

**Alumni (target: under 5 minutes)**
1. Moderator creates alumni account → credentials generated.
2. Moderator manually sends credentials via WhatsApp/email.
3. Alumnus logs in at `/alumni/login`, sees optional suggestion to change password.
4. Fills profile: role, company, city, mentorship toggle, help preferences.
5. Profile goes live and is discoverable in student search.

**Moderator (target: under 1 day)**
1. Admin creates moderator account.
2. Moderator logs in.
3. Uploads alumni roster via CSV.
4. Downloads credential CSV, distributes to alumni offline.

---

### 5.7 — Notifications

**Notification types:**
- New connection request received (alumni).
- Connection request accepted (student).
- New message in active chat.
- Quarterly reminder to update profile (alumni).
- Milestone notifications: "You've helped 10 students!"

**Channels:** In-app, email (configurable: immediate / daily / weekly digest), push via PWA.

---

### 5.8 — Announcements Board

A noticeboard where moderators and alumni can post updates visible to the whole IIIT Nagpur community. Students do not receive push notifications — they visit the board when they want to check it.

**Who can post:**

| Role | Can Post? | Label shown to readers |
|---|---|---|
| Moderator | Yes | 🏫 **Official — [Moderator Name] · IIIT Nagpur Placement Cell** |
| Alumni | Yes | 👤 **Alumni — [Name], [Role] at [Company]** |
| Student | No (read-only) | — |

**Post structure:**
- Title (max 100 characters)
- Body (max 1,000 characters)
- Attachment: optional — one PDF/image (max 5 MB) or one external link
- Timestamp: auto-filled
- Optional expiry date — expired posts move to a "Older Announcements" collapsible section

**Feed behaviour:**
- Posts in reverse chronological order (newest first).
- Moderator posts can be **pinned** to the top. Alumni posts cannot.
- Expired posts are archived, not deleted.

**Moderation:**
- Moderator can delete any post (their own or any alumni post).
- Alumni can delete only their own posts.
- Students can flag a post as inappropriate — queued for moderator review.

**Reactions:**
- Students and alumni can 👍 Like any post (one per post).
- No dislike, no comments. The board is a one-way broadcast tool, not a discussion forum.
- Like count is visible to the poster as an acknowledgement signal. Likes have no effect on post ranking.

---

## 6. User Flows

### Flow 1: Student Finds and Connects with an Alumnus

```
Student visits Alumni Insights
  → Signs in with Google → OAuth account picker pre-filtered to show only @iiitn.ac.in accounts (UX convenience; not the security gate)
  → Post-sign-in: @iiitn.ac.in domain verified server-side → access granted
  → Lands on Search Page
  → Filters: Company: "Zomato" | Role: "SDE" | Employment type: Intern | Mentorship: Open
  → Views results → clicks a profile card
  → Reads profile, career journey, "What I can help with"
  → Clicks "Connect"
  → Selects: "Informational chat / Company insight"
  → Writes note: "Hi, I'm a final-year CSE student applying to Zomato. Can we chat for 15 mins about the interview process?"
  → Sends request

Alumni receives notification
  → Views request → accepts
  → Chat thread opens → both exchange messages
  → After session, both mark as complete
  → Student leaves optional feedback
```

### Flow 2: Moderator Creates Alumni Accounts and Sends Credentials

```
Moderator logs in at /moderator/login
  → Goes to Alumni Management → Bulk Import
  → Uploads alumni roster CSV
  → System creates accounts, generates credentials
  → Moderator downloads Credential CSV (name | login email | temp password)
  → Moderator manually sends credentials to alumni via WhatsApp or email

— OR for a single alumnus —

Moderator → Add Alumni → enters details
  → System creates account → displays copyable credential card
  → Moderator manually copies and sends directly to alumnus
```

### Flow 3: Alumnus Logs In for the First Time

```
Alumnus receives credentials from moderator
  → Visits /alumni/login → enters email + temp password
  → Completes profile: role, company, city, LinkedIn (optional)
  → Sets mentorship toggle: ON
  → Types mentorship preferences: e.g. Company Insights, Career Chat, Resume Review (free-text; suggestions shown but not mandatory)
  → Profile goes live and is now discoverable by IIIT Nagpur students
```

### Flow 4: Alumni Posts an Announcement

```
Alumnus logs in → goes to Announcements → New Post
  → Fills in title, body, optional attachment/link, optional expiry
  → Clicks Post
  → Appears on the board labelled: 👤 Alumni — Arjun Sharma, SDE at Razorpay
  → Students visiting Announcements can read it and visit Arjun's profile
```

### Flow 5: Moderator Posts and Pins an Official Announcement

```
Moderator logs in → Announcements → New Post
  → Title: "Infosys Campus Drive — 20th May 2026"
  → Body: details, eligibility, registration link
  → Attachment: registration form PDF
  → Posts → appears labelled 🏫 Official — Soham Pawar · IIIT Nagpur Placement Cell
  → Moderator pins it → moves to top of board and stays there
```

### Flow 6: Student Browses the Announcements Board

```
Student logs in → clicks Announcements
  → Sees pinned official post at the top
  → Scrolls — sees alumni posts in reverse chronological order
  → Each post labelled 🏫 Official (with moderator name) or 👤 Alumni
  → Clicks a post → reads full body + attachment
  → Visits that alumnus's profile → sends connection request
  → Can 👍 Like any post (no commenting)
```

---

## 7. Non-Functional Requirements

**Platform:**
- Web + PWA. All core flows must work on a mobile browser on a 4G connection.
- WCAG 2.1 AA accessibility compliance.

**Performance:**
- Search results load within 1.5 seconds.
- Profile pages load within 1 second on 4G.

**Availability:**
- Uptime target: 99.5% (excluding scheduled maintenance).
- Higher availability needed during placement season (Oct–Dec, Feb–Apr).

**Scalability:**
- MVP is designed for IIIT Nagpur scale (~2,000–5,000 alumni profiles).

**Security:**
- All PII encrypted in storage and in transit.
- Alumni profiles not indexed by search engines. Accessible only to verified IIIT Nagpur students inside the platform.
- Session tokens are role-scoped; cross-role access is not possible.
- India DPDP Act (2023) compliance.

---

## 8. Privacy & Data Policies

- **Scoped visibility:** Alumni profiles are only visible to verified IIIT Nagpur students.
- **Alumni control:** Alumni can update their own profile content and toggle visibility at any time. They cannot delete their own account — deletion goes through the moderator.
- **No public indexing:** Alumni profiles are not accessible outside the authenticated platform.
- **Consent-based mentorship:** Alumni must actively set their mentorship toggle to ON before receiving connection requests.
- **Prior consent:** The institution (IIIT Nagpur) is responsible for ensuring alumni have given permission for their data to be added to the system, in compliance with the DPDP Act.
- Message content is never used for training, advertising, or shared with third parties.
- Moderator access to aggregate analytics only — never to individual message content.

**Anti-abuse:**
- 10 connection requests per week limit for students (controlled by `STUDENT_WEEKLY_REQUEST_LIMIT` env variable).
- Alumni can report/flag spam requests. Repeat offenders are blocked and flagged to moderator.
- No fake alumni profiles are possible by design — only moderator-created accounts get alumni status.

---

## 9. Constraints & Risks

**Constraints:**
- Alumni data depends entirely on the placement cell's existing records.
- Credential delivery to alumni is manual — depends on moderator follow-through.
- Mentorship is volunteer-based — alumni participation cannot be financially incentivised.
- PWA performance on low-end Android devices needs early validation.

**Risks:**

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Low alumni response rates undermine student trust | High | High | Show response rates on profiles; recognition tiers for active mentors |
| Moderator doesn't distribute credentials — alumni never activate | Medium | High | Both credential formats (card + CSV) reduce friction; follow-up reminders |
| Alumni not logging in after receiving credentials | Medium | High | Clear onboarding email from moderator explaining the "why" |
| Student spam to alumni | Medium | High | Weekly throttle, structured request formats, abuse reporting |
| Alumni privacy concerns | Medium | High | Consent flows, visibility toggle, DPDP compliance |
| Admin credentials leaked via repo | Low | Critical | Admin account is pre-seeded in the database, not in code or env files; no hardcoded emails in the codebase |

---

## 10. Key Decisions

**Alumni registration model:** Alumni accounts are created by the moderator — moderator-created accounts are the only way to get an active alumni login. However, students in their 4th year or beyond can submit a self-apply request via their student portal. These requests are stored separately and do not auto-create accounts; they serve as a moderator-optional intake tool to catch students accidentally missed. The trust backbone of the platform — that every active alumni account is moderator-approved — remains intact.

**Credential delivery:** Manual (moderator sends via WhatsApp/email). The platform does not auto-email credentials to avoid phishing concerns. Two formats available: per-alumni copyable card and bulk CSV.

**Mentorship model:** Strictly volunteer and free. No paid sessions. Recognition is via contribution tiers and certificates.

**Platform:** Web + PWA. No native app for MVP.

**Intern-as-Alumni scope:** Students currently doing internships can be granted the alumni role by the moderator. Their intern/full-time status is a searchable field. Thanks to the multi-role system, the student and alumni roles coexist on the same account — the user can seamlessly switch between portals.

**Student-to-student networking:** Out of scope. The platform is alumni-to-student only.

**Alumni account recovery:** Handled through the moderator, not independently by the alumnus.

---

*Alumni Insights — IIIT Nagpur | PRD v2.0 | April 2026*
