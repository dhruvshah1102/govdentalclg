# AI Slop / Content Quality Audit — GDC Dibrugarh Website

Audit date: 2026-09-26

## High Severity

### 1. Default admin credentials hardcoded in source
**File:** `src/lib/db.ts:265-273`
On first run, if the `users` table is empty, the app auto-seeds a Super Admin with username `admin` and password `admin123` (bcrypt-hashed, but the plaintext sits directly in the code). Real risk on a live government site if this ever re-runs against a fresh DB and nobody rotates the password.
**Status:** Being removed as part of the Supabase Auth migration.

### 2. Fabricated content hardcoded directly in page components
- `src/app/research/page.tsx:98,107` — invented "Principal Investigators" ("Dr. Deepjyoti Gogoi", "Dr. Ranjit Konwar") with fabricated funding agencies and precise MOU dates (`src/app/research/page.tsx:135,140`, e.g. "September 2024", "March 2025"). Reads as fully hallucinated filler dressed up as fact.
- `src/app/research/page.tsx:165-177` — Ethical Committee fallback lists "Dr. Ananya Sarma (HOD, OMR)" as Member Secretary. This **contradicts** the real OMR HOD used everywhere else on the site ("Dr. Swarnasmita Pathak" — see `db/fallback_data.json:241`, `src/app/about-us/[page]/page.tsx:227`). Two different people claimed as head of the same department.
- `src/app/academics/[page]/page.tsx:206-240` — fake timetable table with invented PDF file sizes ("1.2 MB", "1.1 MB", "1.4 MB", "1.5 MB") and fake "Last Updated" dates; every link points generically to `/downloads` rather than an actual file.

### 3. Legacy `db/fallback_data.json` (confirmed dead/unused — not imported anywhere in `src/`)
- `dean_message: "hello"` (line 77) — literal unfinished placeholder text in the Principal's welcome quote.
- A downloads entry with `title: "fefwsef"` and `file_url: "C:\\Users\\shahd\\Downloads"` (lines 1127-1131) — keyboard-mash test title plus a literal local Windows dev file path leaked into seed data.
- All 9 department `about` fields use an identical template sentence verbatim (lines 240, 255, 270, 285, etc.): "Welcome to the Department of X. We are dedicated to providing state-of-the-art dental clinical care alongside high-quality training and education for both undergraduate and postgraduate scholars." Only the closing sentence changes.
- All 9 departments' `infrastructure`, `clinical_services`, and `research_activities` fields are word-for-word identical across every department — classic copy-paste boilerplate that should differ per specialty.
- 26 HOD/Dean/Superintendent photo URLs point to Unsplash stock photos of random people, used as fake headshots for named real staff (e.g. "Dr. Swarnasmita Pathak", "Dr. Liza Pathak"). Same pattern in department `banner_image` and `news_events`/`gallery` `image_url` fields. Some Unsplash IDs are reused across unrelated entries (e.g. `photo-1579684389782` used as both the Oral Medicine & Radiology banner and the Prosthodontics banner and a news-event image).
- Tender `document_url` values are just `"#"` (dead links) for both seeded tenders.

### 4. Same stock-photo-fallback pattern in live (non-dead) code
`src/app/page.tsx:30,38,46` — the homepage's hardcoded hero-slide fallback (used when no slides exist in the DB) uses Unsplash stock photo URLs, while real uploaded campus photos already sit unused in `public/images/Infrastructure/` and `public/images/Clinical/` (01–11.jpeg).

## Medium Severity

### 5. Literal Markdown `**bold**` syntax embedded in plain JSX text
Renders as literal asterisks on the live page instead of bold text. Found in:
- `src/app/about-us/[page]/page.tsx:184`
- `src/app/academics/[page]/page.tsx:103,143`
- `src/app/research/page.tsx:78`
- `src/app/alumni/page.tsx:57`
- `src/app/student-portal/[page]/page.tsx:206`

Fix: replace `**text**` with `<strong>text</strong>`.

## Low Severity / Minor

- `src/app/departments/[deptId]/page.tsx:47-48` — duplicated comment `{/* Banner Hero Card */}` appears twice in a row (copy-paste leftover).
- Homepage regulatory "seal" badges (`src/app/page.tsx:340-380`) show text-only circles for "DCI", "DU", "NAAC", "ASSAM" — worth double-checking the NAAC claim, since NAAC typically accredits general/autonomous colleges rather than DCI-regulated dental institutes specifically.
- Fallback admin email `gdcdibrugarh@gmail.com` is repeated as a hardcoded literal in at least 4 separate files (`LayoutClientWrapper.tsx:573`, `contact-us/page.tsx:96`, +2 more) instead of one shared constant. Plausibly the real address (consistent with social handles), but worth centralizing.
- `GDCH-Dibrugarh-Website-Status-Report.docx` is committed at the repo root — an internal status artifact tracked in git rather than excluded.

## Checked and Found Legitimate (not slop)

- `db/fallback_data.json` and `db/govclg.sqlite` — confirmed dead/unused, no references in `src/`.
- `HeroSlider.tsx` and `StatsCounter.tsx` — actively used in `src/app/page.tsx`, not dead code.
- `src/app/disclaimer/page.tsx` and `src/app/website-policy/page.tsx` — legitimate, standard boilerplate matching real Indian government website conventions (GIGW-style).
- No literal "Lorem ipsum", "TODO", "FIXME", "John Doe", or "example.com" in real rendered content.
- `.env.local` is correctly excluded from git.
- Faculty names in `db/fallback_data.json` (e.g. Dr. Swarnasmita Pathak, Dr. Ramen Haloi, Sri Pronob Konwar) look like genuine names, not AI-invented ones. `photo_url: null` for all of them — missing, not faked.
- Address, phone extensions, Dibrugarh University / DCI / Srimanta Sankardeva University references, and Google Maps coordinates (27.4898743, 94.9444949 — genuinely in the Dibrugarh/AMCH area) all look specific and real rather than generic.

## Recommended Priority Fixes

1. Remove/guard the hardcoded `admin123` default password seed (security) — in progress via Supabase Auth migration.
2. Delete or rewrite the fabricated names/dates in `research/page.tsx` and reconcile the OMR HOD name contradiction.
3. Fix the literal `**bold**` markdown-in-JSX bug across the 5 files listed.
4. Replace Unsplash stock-photo fallbacks in `page.tsx` hero slides with the real campus photos already in `public/images/`.
5. Confirm `db/fallback_data.json` is truly unused in any deployment/seed script, then delete it along with `govclg.sqlite`.
