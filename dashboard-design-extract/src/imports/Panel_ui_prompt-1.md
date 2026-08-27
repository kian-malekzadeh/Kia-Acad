# Student Dashboard Design Prompt – Kia Academy

## 1. Project Context

You are tasked with building a **comprehensive student dashboard** for **Kia Academy** – an online education platform focused on programming courses, bootcamps, competitions, and learning roadmaps. The existing codebase is based on **Next.js (App Router) + React 19**, **NestJS API**, **Prisma + PostgreSQL** and **CSS Variables** (no Tailwind, no CSS-in-JS). Light/dark themes are supported via `data-theme`. Primary fonts are **Inter** (body), **JetBrains Mono** (code/prices) and **Vazirmatn** (Persian RTL text). All colours and spacing are defined in `base.css`.

You must upgrade the `/dashboard` page from simple tiles to a **full-featured, unified panel** containing the **9 mandatory sections** listed below. All sections will reside on a single scrollable page inside a fixed layout (sidebar or header). Use the existing components and Contexts (AuthProvider, AppProvider, ThemeProvider, LanguageProvider) and fetch data from existing (or simulated) APIs.

> **Important:** All user‑facing text inside the dashboard (titles, labels, messages, button texts, placeholders, etc.) must be displayed in **Persian (Farsi)**. Use the existing i18n mechanism to serve Persian translations, or, if that is not fully set up, hardcode Persian strings while ensuring the language context is set to `fa` by default.

## 2. Design System Requirements

**Colours:**
- Primary: `--kia-deep: #0a2f44`, `--kia-accent: #1f6e8c`, `--kia-soft: #2e8a99`
- Gold: `--kia-gold: #c9a959`
- Background: `--bg: #e8f1f6` (light), `#071821` (dark)
- Text: `--text: #0f1e2c`, `--text-dim: #385e77`, `--text-faint: #5d7f95`
- Borders: `--border: rgba(31,110,140,0.22)`
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-glow`

**Typography:**
- Main headings: `clamp(24px, 4vw, 32px)` weight 700/800
- Subheadings: `18px` weight 600
- Body: `1.05rem` weight 400
- Numbers/prices: `JetBrains Mono` weight 500

**Spacing:**
- Card padding: `20–32px`
- Page gutter: `24px` (reduced to `16px` on tablet, `12px` on mobile)

**Breakpoints (max-width):**
- Mobile: `480px`, `640px`
- Tablet: `768px`, `900px`
- Desktop: `1080px` (container max-width)

**Modes:**
- Light (default) and dark (`data-theme="dark"`)
- Loading: brand‑coloured spinner or skeleton placeholders
- Error: messages using `--danger: #c0392b`
- Success: using `--emerald: #1a7a5c`

**Accessibility:**
- Use `aria-label`, `role`, `aria-expanded`, `aria-current`
- Support `prefers-reduced-motion` (disable animations)
- Focus visible with `outline` or `--focus-ring`
- Decorative icons: `aria-hidden="true"`

## 3. Overall Panel Layout

The panel includes a **fixed header** (or sidebar) containing:
- Logo (links to `/dashboard`)
- Theme toggle (light/dark)
- Language selector (fa/en) – default `fa`
- User menu (profile, logout)

**Main content** is placed inside a container with `max-width: 1080px` and `padding: 24px` (reduced on smaller screens). Content is arranged using a **grid or flex** layout, collapsing to a single column on mobile.

## 4. Mandatory Sections (9 Cards)

Each section must be presented as a **card** with `--bg-card` or `--bg-elevated` background, `border-radius: 16px` (`--radius`), and `--shadow-sm`. Every card has a title and, where applicable, a “View All” or “Edit” button.

### 4.1. Financial Card & Transactions
- **Visual**: A simulated bank card with `--gradient-brand` that displays the account balance in large font (e.g. **1,250,000 تومان**). At the bottom show a masked card number (e.g. `**** **** **** 1234`) and expiry date.
- **Data**: Fetch from `/api/payments/my` or `/api/payments/transactions`; fallback to mock data using `demoApi`.
- **Transactions list**: Below the card or in a tab, show the 5 most recent transactions (date, amount, description, status) with upward/downward arrows and green/red colouring.
- **Button**: “View all transactions” (مشاهده همه تراکنش‌ها) that links to a separate page (optional).

### 4.2. Test & Exam Results
- **Data**: Fetch from `/api/readiness?latest=true` or from `AppProvider` (`readinessScores`). Also include end‑of‑course exam results if available.
- **Display**: Card titled “Latest Results” (آخرین نتایج) containing:
  - A small **radar chart** (using existing `RadarChart` component) for assessed skills,
  - or a simple list of test name, score (e.g. **۸۵٪**), and status (pass/fail) with a check/cross icon.
- **Empty state**: “No test recorded yet” (هنوز آزمونی ثبت نشده) with a button “Take a test” (شرکت در آزمون) that navigates to `/readiness`.

### 4.3. Bootcamps & Challenges
- **Data**: From `/api/bootcamp/registrations` or `AppProvider`; otherwise mock data.
- **Display**: Card listing active bootcamps and registered challenges.
  - Each item: bootcamp title, start/end date, status (ongoing, finished, registration open).
  - For active challenges, show a countdown timer (like `ChallengeCard`) and a “Join Challenge” (ورود به چالش) button.
- **Empty state**: “You have not enrolled in any bootcamp” (در هیچ بوت‌کمپی ثبت‌نام نکرده‌اید) with a link to `/bootcamp`.

### 4.4. Progress Chart
- **Data**: Aggregated from roadmap progress, courses (completion status), and test scores.
- **Display**: Card with a **horizontal progress bar** or **doughnut chart** showing overall completion percentage (e.g. **۶۵٪**).
- Below it, a few quick activity items: “Lesson 3 of 10 completed in React course”, “Step 2 of 5 in Frontend roadmap”, etc. Use the existing `ProgressTrack` component for step visualisation.

### 4.5. Todo List
- **Functionality**: A simple daily task list (e.g. “Watch session 4 video”, “Submit bootcamp project exercise”).
- **Data**: Stored in `localStorage` under the key `Kia Academy-todos` (no API required; future server sync possible). May also use a custom API.
- **Display**: Card with an input field, “Add” (افزودن) button, and a list of items. Each item has a checkbox to mark as done and a delete (X) button.
- **Limit**: Show max 5 items; a “View All” (مشاهده همه) button reveals the rest.

### 4.6. Enrolled Courses & Roadmaps
- **Data**: From `/api/courses/my` and `/api/roadmaps/my` or `AppProvider` (courses, roadmap).
- **Display**: Card using a **2‑ or 3‑column grid** showing enrolled courses and roadmaps with thumbnail (if available), title, progress bar, and a “Continue” (ادامه) button.
- If more than 3 items, use a “View All” button to navigate to `/courses` and `/roadmap`.
- Status badges: `در حال یادگیری` (learning), `تکمیل‌شده` (completed), `آغاز نشده` (not started) with distinct colours.

### 4.7. Support Tickets
- **Data**: Assume an API endpoint `/api/tickets` exists (if not, use a simulated endpoint or a placeholder with a “Coming Soon” message).
- **Display**: Card listing recent tickets (title, status: open/in‑progress/closed, date) and a “New Ticket” (تیکت جدید) button that opens a modal or form for ticket creation.
- **Empty state**: “No tickets submitted” (هیچ تیکتی ثبت نشده است).

### 4.8. Admin Messages
- **Data**: Fetch from `/api/messages` or similar; fallback to static mock data.
- **Display**: Card showing the 3 latest messages (sender, subject, summary, date) with a “View All” or “Go to Messages” (مشاهده همه پیام‌ها) button.
- Optionally, display as notifications with a bell icon in the header.

### 4.9. Edit Profile
- **Data**: Current user info from `AuthProvider` (firstName, lastName, email, city, phone).
- **Display**: Card or section showing name, family name, city, email, phone (non‑editable). An “Edit” (ویرایش) button either makes the form editable inline or links to a dedicated page (e.g. `/education`).
- An **inline summary form** with a “Save Changes” (ذخیره تغییرات) button that calls `/api/auth/profile`.

## 5. Data & APIs

- Use `api.ts` and `demoApi.ts` for requests.
- When no real endpoint exists, use **mock data** with simulated delay (via `setTimeout`) to illustrate loading/error states.
- For write operations (Todo, Profile, Ticket), use `fetch` with appropriate HTTP methods and update local state accordingly.
- Use `useAppActions` and `AppProvider` to update global state (`roadmap`, `courses`, etc.).

## 6. Layout & Responsiveness

- Desktop (≥1080px): 3‑column equal‑width grid.
- Tablet (768px–1080px): 2‑column grid.
- Mobile (<768px): Single column, padding reduced to `12px`.
- The financial card should always span full width or be prominently placed first.
- Suggested stacking order (top to bottom):
  1. Financial card + transactions (full width)
  2. Overall progress chart + test results (2 columns)
  3. Enrolled courses & roadmaps (2 or 3 columns)
  4. Bootcamps & tickets (2 columns)
  5. Todo list & admin messages (2 columns)
  6. Edit profile (full width)

## 7. Interactions

- **Initial load**: Show skeleton loaders matching each card until data arrives.
- **Error**: Display error message with a “Retry” (تلاش مجدد) button.
- **Theme toggle**: Clicking the button toggles `data-theme` on `<html>`.
- **Language switch**: Clicking the language selector changes the displayed language; panel strings (titles, descriptions) must be available in both Persian and English (with Persian as default). Use the existing `translate` utility.
- **Modals**: For new ticket or profile editing, use the existing `Modal` component with `role="dialog"` and `aria-modal="true"`.
- **Todo interactions**: Add/remove/complete items with a subtle fade animation and update `localStorage`.

## 8. Files & New Components

- **Page**: `apps/web/src/app/dashboard/page.tsx` (full rewrite)
- **Components** (inside `apps/web/src/components/dashboard/`):
  - `FinancialCard.tsx`
  - `TransactionsList.tsx`
  - `TestResultsCard.tsx`
  - `BootcampCard.tsx`
  - `ProgressChart.tsx`
  - `TodoList.tsx`
  - `EnrolledCourses.tsx`
  - `TicketsCard.tsx`
  - `AdminMessages.tsx`
  - `ProfileEditor.tsx`
- **Styles**: Add to `apps/web/src/styles/dashboard.css` and import in `globals.css`.
- **i18n**: Add new keys to `fa.ts` and `en.ts` for all section headings and descriptions.
- **Context**: If needed, add utility functions to `AppProvider` or `AuthProvider` (e.g. for Todo).

## 9. Special Technical Notes

- **No heavy third‑party libraries** – rely on React Context and pure CSS.
- **Financial card**: Use `--gradient-brand` and JetBrains Mono for numbers.
- **Radar chart**: Reuse the existing `RadarChart` component from `components/readiness/RadarChart.tsx` and pass the appropriate scores.
- **Icons**: Use `lucide-react` as done elsewhere.
- **Demo mode**: If `isDemoMode()` returns true, use `demoApi` and return mock data.
- **Progress calculation**: Derive from `readinessScores` and `courses` in `AppProvider`.
- **Admin messages**: If no API is available, use static data from a constants file so the UI is still presentable.

## 10. Expected Deliverable

Provide the **full page code and all component codes** along with **necessary styles**. The code must:

- Use `'use client'` in the page and any stateful components.
- Use `useEffect` and `useState` for data management.
- Leverage `useAppActions`, `useAuth`, `useTheme`, `useLanguage`.
- Handle **all UI states** (loading, error, empty, populated).
- Be compatible with both light and dark themes.
- Work correctly with RTL (Persian) layout – direction, padding, margin.
- Implement CRUD logic for writeable sections (Todo, Profile, Ticket).

## 11. Clarification Questions (Optional)

- Are there specific endpoints for tickets and admin messages, or should they be fully simulated?
- Do transactions include gateway payments (Zarinpal, ID Pay) or only internal ones?
- Should users be able to customise the dashboard (e.g. rearrange cards)?
- Do we need real‑time notifications (WebSocket)?

*In the absence of answers, assume we use mock data and focus on UI/UX implementation.*

## 12. Acceptance Criteria

- [ ] All 9 sections are rendered on the page.
- [ ] Each section is a card styled with the brand design system.
- [ ] Data is fetched from API or mock sources.
- [ ] Loading and error states are properly managed.
- [ ] Light/dark themes and RTL support are fully functional.
- [ ] The todo list supports add/delete/complete and persists in `localStorage`.
- [ ] Profile editing displays a form and updates information after saving.
- [ ] The page is fully responsive.
- [ ] Code passes linting and formatting checks.
- [ ] No console errors during runtime.