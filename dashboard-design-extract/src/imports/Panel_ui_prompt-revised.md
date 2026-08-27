# Student Dashboard Design Prompt – Kia Academy

## 1. Project Context

Build a **comprehensive student dashboard** for **Kia Academy**, an online education platform offering programming courses, bootcamps, competitions, and learning roadmaps.

**Stack:** Next.js (App Router) + React 19, NestJS API, Prisma + PostgreSQL, CSS Variables (no Tailwind, no CSS-in-JS). Light/dark themes via `data-theme`. Fonts: **Inter** (body), **JetBrains Mono** (numbers/code), **Vazirmatn** (Persian RTL). All design tokens live in `base.css`.

**Scope:** Upgrade `/dashboard` from simple tiles to a single-page panel with **9 sections**, rendered inside a persistent layout (fixed sidebar on desktop, bottom nav on mobile). All UI text must be in **Persian (Farsi)** by default; use the existing i18n system (`fa` locale) or hardcode strings with `lang="fa"` and `dir="rtl"` set on `<html>`.

---

## 2. Design Tokens

```css
/* Brand */
--kia-deep:   #0a2f44;
--kia-accent: #1f6e8c;
--kia-soft:   #2e8a99;
--kia-gold:   #c9a959;

/* Surfaces */
--bg:         #e8f1f6;          /* light */
--bg-dark:    #071821;          /* dark  */
--bg-card:    rgba(255,255,255,0.72);
--bg-elevated:rgba(255,255,255,0.92);

/* Text */
--text:       #0f1e2c;
--text-dim:   #385e77;
--text-faint: #5d7f95;

/* Feedback */
--danger:     #c0392b;
--warning:    #d4870a;
--emerald:    #1a7a5c;
--info:       #1f6e8c;

/* Borders & Shadows */
--border:     rgba(31,110,140,0.22);
--shadow-sm:  0 1px 4px rgba(10,47,68,0.08);
--shadow-md:  0 4px 16px rgba(10,47,68,0.12);
--shadow-glow:0 0 24px rgba(31,110,140,0.18);

/* Shape */
--radius:     16px;
--radius-sm:  8px;
--radius-pill:9999px;

/* Motion */
--duration-fast:  120ms;
--duration-base:  220ms;
--duration-slow:  380ms;
--ease-out:  cubic-bezier(0.22, 1, 0.36, 1);

/* Z-index layers */
--z-base:    0;
--z-sticky:  100;
--z-overlay: 200;
--z-modal:   300;
--z-toast:   400;
```

**Typography scale:**

| Role | Size | Weight | Font |
|---|---|---|---|
| Page heading | `clamp(24px, 4vw, 32px)` | 800 | Vazirmatn |
| Card title | `18px` | 600 | Vazirmatn |
| Body | `1.05rem` | 400 | Inter / Vazirmatn |
| Caption | `0.85rem` | 400 | Inter / Vazirmatn |
| Numbers / prices | `JetBrains Mono` | 500 | JetBrains Mono |

> **Persian numerals:** Render all user-facing numbers (balances, scores, dates) in Eastern Arabic digits (۰–۹) using `toLocaleString('fa-IR')`. Reserve ASCII digits for code, IDs, and API values.

---

## 3. Layout Architecture

### 3.1 Shell

```
┌──────────────┬──────────────────────────────────────────┐
│  Fixed       │  Fixed top bar (height: 56px)            │
│  Sidebar     │  ─────────────────────────────────────── │
│  (240px)     │  Scrollable main content                 │
│              │  max-width: 1080px, padding: 24px        │
└──────────────┴──────────────────────────────────────────┘
```

- **Desktop (≥1080px):** Fixed sidebar (240px) + scrollable content area.
- **Tablet (768–1079px):** Sidebar collapses to icon-only rail (64px); top bar remains.
- **Mobile (<768px):** Sidebar hidden; persistent **bottom navigation bar** (5 icons). Top bar shows hamburger → full-screen drawer.

### 3.2 Fixed Top Bar

Contains (RTL order, right → left):
1. Logo / wordmark → links to `/dashboard`
2. Breadcrumb (current section name)
3. Spacer
4. Global search trigger (icon button)
5. Notification bell + unread badge
6. Theme toggle (sun/moon icon)
7. Language selector (`FA` / `EN`)
8. User avatar → dropdown (profile, settings, logout)

### 3.3 Content Grid

Page gutter: `24px` desktop · `16px` tablet · `12px` mobile.  
Grid gap: `20px` desktop · `16px` mobile.

| Breakpoint | Columns |
|---|---|
| ≥1080px | 3 equal columns |
| 768–1079px | 2 columns |
| <768px | 1 column |

**Stacking order (top → bottom):**
1. Financial card + transactions — **full width**
2. Progress chart + test results — **2 columns**
3. Enrolled courses & roadmaps — **3 columns** (2 on tablet, 1 on mobile)
4. Bootcamps & challenges + support tickets — **2 columns**
5. Todo list + admin messages — **2 columns**
6. Edit profile — **full width**

---

## 4. Card Component Contract

Every section is a **Card** that satisfies this visual contract:

```
┌─────────────────────────────────────────┐
│  [Icon] Card Title          [Action CTA]│  ← header: 16px v-padding
│  ─────────────────────────────────────  │  ← 1px divider, --border
│                                         │
│  Card body (padding: 20–32px)           │
│                                         │
└─────────────────────────────────────────┘
```

- Background: `--bg-card`, `backdrop-filter: blur(12px)` (glassmorphism on dark mode).
- Border: `1px solid var(--border)`.
- Border-radius: `var(--radius)` (16px).
- Shadow: `var(--shadow-sm)`; `var(--shadow-md)` on hover (`transition: box-shadow var(--duration-base) var(--ease-out)`).
- Every card must handle three states: **loading** (skeleton), **error** (inline message + retry), **populated** (data).
- CTA in header: ghost/outline button, `var(--radius-sm)`, right-aligned (RTL: left-aligned).

---

## 5. Sections

### 5.1 Financial Card & Transactions

**Layout:** Bank card visual (full-width, height ~180px) above a transaction list.

**Bank card:**
- Background: `--gradient-brand` (deep-to-accent diagonal).
- Top row: platform logo (left/right per RTL) + card type label.
- Center: balance in large JetBrains Mono (`clamp(28px, 5vw, 40px)`, weight 700) + `تومان`.
- Bottom row: masked number `**** **** **** ۱۲۳۴` + expiry `MM/YY`.
- Subtle holographic shine overlay on hover (`::after` pseudo, `opacity: 0.08`).

**Transaction list:**
- 5 most recent rows: icon (↑ credit / ↓ debit) + description + date + amount.
- Amount: green (`--emerald`) for credit, red (`--danger`) for debit.
- Footer: "مشاهده همه تراکنش‌ها" link.

**Data:** `GET /api/payments/transactions?limit=5` → fallback to `demoApi`.

---

### 5.2 Test & Exam Results

**Layout:** Radar chart (250×250px, reuse `RadarChart` from `components/readiness/`) beside a score list.

**Score list items:** test name + score badge (e.g. `۸۵٪`) + status chip (`قبول` green / `رد` red) + date.

**Empty state:** Centered illustration placeholder + "هنوز آزمونی ثبت نشده" + primary button "شرکت در آزمون" → `/readiness`.

**Data:** `GET /api/readiness?latest=true` → `AppProvider.readinessScores`.

---

### 5.3 Bootcamps & Challenges

**Layout:** Vertical list of cards-within-card (each item: status badge + title + date range + CTA).

**Status badges:**
- `در حال برگزاری` — `--kia-soft` background.
- `ثبت‌نام باز است` — `--kia-gold` background.
- `پایان یافته` — `--text-faint` background.

**Active challenges:** Show a live countdown (`DD:HH:MM:SS`) using `setInterval`; "ورود به چالش" primary button.

**Empty state:** Icon + "در هیچ بوت‌کمپی ثبت‌نام نکرده‌اید" + link "مشاهده بوت‌کمپ‌ها" → `/bootcamp`.

**Data:** `GET /api/bootcamp/registrations` → mock data.

---

### 5.4 Progress Overview

**Layout:** Doughnut chart (center: percentage) + activity feed below.

**Doughnut:** Pure CSS or SVG (no chart library). Stroke color: `--kia-accent`. Animated on mount with `stroke-dashoffset` transition.

**Activity feed:** 3–5 items: icon + short description + relative time (e.g. "۲ روز پیش"). Derive from `AppProvider` (roadmap steps, course completions, readiness scores).

**Data:** Aggregated client-side from `AppProvider` state.

---

### 5.5 Daily Todo List

**Layout:** Input row + task list (max 5 visible) + "مشاهده همه" toggle.

**Input row:** Text field (RTL placeholder "وظیفه جدید...") + "افزودن" icon-button. Pressing Enter submits.

**Task item:** Checkbox (custom styled, check animates with `stroke-dashoffset`) + label (strikethrough when done) + delete button (×). Completed items pushed to bottom.

**Animations:** Fade + slide-in on add; fade-out + collapse on delete. Respect `prefers-reduced-motion`.

**Persistence:** `localStorage` key `kia-academy:todos`. Schema: `{ id, text, done, createdAt }[]`.

**Limit:** Display first 5; "مشاهده همه (N)" expands the list in-place.

---

### 5.6 Enrolled Courses & Roadmaps

**Layout:** 3-column grid (desktop), 2-column (tablet), 1-column (mobile).

**Course card (mini):**
- Thumbnail (16:9 aspect-ratio, `object-fit: cover`; fallback: gradient placeholder with first letter).
- Status badge (top-left overlay): `در حال یادگیری` (blue) · `تکمیل‌شده` (green) · `آغاز نشده` (grey).
- Title (2-line clamp).
- Linear progress bar (`--kia-soft` fill, animated width on mount).
- "ادامه" / "شروع" button.

**Show max 6 items**; "مشاهده همه دوره‌ها" navigates to `/courses`.

**Data:** `GET /api/courses/my` + `GET /api/roadmaps/my` → `AppProvider`.

---

### 5.7 Support Tickets

**Layout:** Table-style list + "تیکت جدید" CTA in card header.

**Ticket row:** Status dot + title + category tag + date + "مشاهده" link.

**Status colors:** `باز` (open) — warning · `در بررسی` (in-progress) — info · `بسته شده` (closed) — muted.

**New Ticket modal:** `role="dialog"`, `aria-modal="true"`. Fields: subject (text), category (select), description (textarea). Submit → `POST /api/tickets` → optimistic UI update + success toast.

**Empty state:** "هیچ تیکتی ثبت نشده است" + "ارسال اولین تیکت" button.

**Data:** `GET /api/tickets?limit=5` → mock data.

---

### 5.8 Admin Messages & Notifications

**Layout:** Message list (3 items) + "مشاهده همه پیام‌ها" footer link.

**Message row:** Sender avatar (initials fallback) + subject (bold if unread) + summary (1-line clamp) + relative date. Unread indicator: colored left border (`--kia-accent`, 3px).

**Unread badge** mirrored in header bell icon.

**Data:** `GET /api/messages?limit=3` → static constants fallback (`src/constants/mockMessages.ts`).

---

### 5.9 Edit Profile

**Layout:** Two-column form (full-width on mobile). Left column: avatar + upload button. Right column: fields.

**Fields:** نام · نام خانوادگی · ایمیل (read-only) · شماره موبایل · شهر · درباره من (textarea).

**Avatar:** Circle, 96×96px. Upload triggers hidden `<input type="file" accept="image/*">`. Preview before save with `URL.createObjectURL`.

**Inline edit:** Form fields are read-only by default; "ویرایش پروفایل" button switches to edit mode (fields become active, Save/Cancel appear). No page navigation required.

**Save:** `PATCH /api/auth/profile` → show success toast "اطلاعات با موفقیت ذخیره شد" or inline error.

**Data:** `AuthProvider` (firstName, lastName, email, city, phone).

---

## 6. Global UX Patterns

### 6.1 Skeleton Loaders

- Match the exact shape of each card's populated state (avatar circle, text line, bar).
- Use `background: linear-gradient(90deg, var(--border) 25%, rgba(255,255,255,0.3) 50%, var(--border) 75%)` shimmer animation.
- Animate with `background-size: 400% 100%` + `animation: shimmer 1.4s ease-in-out infinite`.
- Disable shimmer when `prefers-reduced-motion: reduce`.

### 6.2 Toast Notification System

- Position: bottom-center (mobile) / bottom-right (desktop).
- Types: success (emerald), error (danger), info (info), warning (warning).
- Auto-dismiss after 4s; pause on hover. Stack max 3 toasts.
- Animation: slide-up + fade-in on enter; fade-out + collapse on exit.
- `role="status"`, `aria-live="polite"` (errors: `aria-live="assertive"`).

### 6.3 Error States

Each card shows an inline error:
```
[⚠ icon]  خطا در دریافت اطلاعات
          [تلاش مجدد]
```
- Retry button calls the original fetch function.
- Do not show other cards' errors in unrelated sections.

### 6.4 Empty States

- Centered layout: SVG illustration (simple, brand-colored) + heading + sub-text + optional CTA.
- Illustration must be `aria-hidden="true"`.

### 6.5 Micro-interactions

| Trigger | Effect |
|---|---|
| Button hover | `background` lightens 8%, `transform: translateY(-1px)` |
| Button active | `transform: translateY(0)`, background darkens 4% |
| Card hover | `box-shadow` transitions to `--shadow-md` |
| Checkbox complete | Checkmark draws via `stroke-dashoffset` |
| Progress bar mount | Width animates from 0 to value |
| Modal open | Scale from 0.95 + fade; backdrop fades in |
| Modal close | Reverse |

All transitions use `var(--duration-base)` + `var(--ease-out)` unless noted.

---

## 7. Accessibility Requirements

- All interactive elements reachable by keyboard in logical tab order (RTL-aware).
- `aria-label` on icon-only buttons; `aria-current="page"` on active nav item.
- `aria-expanded` on collapsible elements (todo "view all", sidebar drawer).
- `role="dialog"` + `aria-modal="true"` + focus trap on all modals.
- Color is never the sole indicator of meaning (always pair with icon or text).
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text and UI components (WCAG AA).
- `prefers-reduced-motion`: disable shimmer, collapse transitions, and countdown animations.
- `prefers-color-scheme`: respect system preference as initial value before manual toggle.
- Focus ring: `outline: 2px solid var(--kia-accent); outline-offset: 3px` on `:focus-visible`.
- Decorative icons: `aria-hidden="true"`.

---

## 8. Data & State Management

- **Read operations:** `GET` via `api.ts`; if `isDemoMode()` is true, use `demoApi` instead.
- **Mock data:** Use `setTimeout(resolve, 600–1200)` to simulate network latency. Define mocks in `src/mocks/dashboard.ts`.
- **Write operations:** `POST / PATCH / DELETE` via `fetch`; apply optimistic UI updates and rollback on error.
- **Global state:** Use `useAppActions` + `AppProvider` for `courses`, `roadmap`, `readinessScores`. Do not re-derive in local state what is already in context.
- **Todo:** `localStorage` only; no API. Key: `kia-academy:todos`.
- **Authentication:** All requests include the session token managed by `AuthProvider`.

---

## 9. File Structure

```
apps/web/src/
├── app/dashboard/
│   └── page.tsx                  # Shell + grid layout, 'use client'
├── components/dashboard/
│   ├── FinancialCard.tsx
│   ├── TransactionsList.tsx
│   ├── TestResultsCard.tsx
│   ├── BootcampCard.tsx
│   ├── ProgressChart.tsx
│   ├── TodoList.tsx
│   ├── EnrolledCourses.tsx
│   ├── TicketsCard.tsx
│   ├── AdminMessages.tsx
│   ├── ProfileEditor.tsx
│   ├── CardShell.tsx             # Shared card wrapper (title, CTA, skeleton, error)
│   └── ToastProvider.tsx         # Toast context + renderer
├── mocks/
│   └── dashboard.ts              # All mock data for dashboard sections
├── styles/
│   └── dashboard.css             # Dashboard-specific CSS, imported in globals.css
└── i18n/
    ├── fa.ts                     # Add all new keys here
    └── en.ts
```

> **`CardShell` is mandatory.** It accepts `title`, `cta`, `isLoading`, `error`, `onRetry` props and renders the header, divider, skeleton/error/children, eliminating duplication across all 9 sections.

---

## 10. i18n Keys (new additions)

All new translation keys follow the namespace `dashboard.*`:

```ts
// fa.ts additions
"dashboard.financial.title": "کیف پول و تراکنش‌ها",
"dashboard.financial.viewAll": "مشاهده همه تراکنش‌ها",
"dashboard.tests.title": "آخرین نتایج آزمون",
"dashboard.tests.empty": "هنوز آزمونی ثبت نشده",
"dashboard.tests.cta": "شرکت در آزمون",
"dashboard.bootcamps.title": "بوت‌کمپ‌ها و چالش‌ها",
"dashboard.bootcamps.empty": "در هیچ بوت‌کمپی ثبت‌نام نکرده‌اید",
"dashboard.progress.title": "پیشرفت کلی",
"dashboard.todo.title": "وظایف روزانه",
"dashboard.todo.placeholder": "وظیفه جدید...",
"dashboard.todo.add": "افزودن",
"dashboard.todo.viewAll": "مشاهده همه",
"dashboard.courses.title": "دوره‌ها و مسیرهای یادگیری",
"dashboard.courses.viewAll": "مشاهده همه دوره‌ها",
"dashboard.tickets.title": "تیکت‌های پشتیبانی",
"dashboard.tickets.new": "تیکت جدید",
"dashboard.tickets.empty": "هیچ تیکتی ثبت نشده است",
"dashboard.messages.title": "پیام‌های مدیریت",
"dashboard.messages.viewAll": "مشاهده همه پیام‌ها",
"dashboard.profile.title": "پروفایل من",
"dashboard.profile.edit": "ویرایش پروفایل",
"dashboard.profile.save": "ذخیره تغییرات",
"dashboard.profile.cancel": "انصراف",
"dashboard.error.retry": "تلاش مجدد",
"dashboard.error.message": "خطا در دریافت اطلاعات",
```

---

## 11. Acceptance Criteria

- [ ] All 9 sections render on `/dashboard` within the correct grid positions.
- [ ] `CardShell` wraps all sections; no duplicated header/skeleton/error markup.
- [ ] Skeleton loaders match populated layout; shimmer disabled with `prefers-reduced-motion`.
- [ ] Every section shows a proper error state with a working "تلاش مجدد" button.
- [ ] Empty states include illustration, copy, and CTA where applicable.
- [ ] Light/dark themes fully functional; system preference respected on first load.
- [ ] RTL layout correct at all breakpoints (padding, margin, text-align, flex direction).
- [ ] Financial card displays Persian-digit balance and masked card number.
- [ ] Progress doughnut animates on mount; respects `prefers-reduced-motion`.
- [ ] Todo list: add/complete/delete work; state persists in `localStorage` across reloads.
- [ ] New Ticket modal: focus trap, form validation, success/error toast on submit.
- [ ] Profile editor: inline edit mode, avatar preview, PATCH on save, toast feedback.
- [ ] Toast system renders correctly, auto-dismisses, and stacks without overlap.
- [ ] All icon-only buttons have `aria-label`; decorative icons have `aria-hidden="true"`.
- [ ] Keyboard navigation reaches every interactive element in logical RTL order.
- [ ] No console errors or warnings at runtime.
- [ ] Code passes project linting and formatting checks (`pnpm lint && pnpm format:check`).
