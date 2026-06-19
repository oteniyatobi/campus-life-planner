# campus-life-planner
**Oteniya Oluwatobi Jeremiah**
Software Engineering Student — African Leadership University, Kigali, Rwanda
GitHub: [github.com/oteniyatobi](https://github.com/oteniyatobi)
Email: oluwatobijeremiahoteniya@gmail.com
 
**Live Demo:** [your-github-pages-url-here]
**Theme:** Campus Life Planner
 
---
 
## What is this?
 
Campus Life Planner is a task management web application built specifically for university students. It helps students track assignments, events, and personal tasks — all in one place, with no sign-up or internet connection required after the first load.
 
The app was built as a summative assignment for the Building Responsive UI module at African Leadership University. The entire app is built using only vanilla HTML, CSS, and JavaScript — no frameworks, no libraries, no shortcuts.
 
---
 
## How I built it
 
### Planning (M1)
 
Before writing any code, I planned the full app on paper. I drew rough sketches of each screen by hand — the dashboard, the task table, the add task form, the reminders page, and the analysis page. I also mapped out the user flow: the user opens the app, sees their tasks on the dashboard, can add new ones, gets reminded when something is coming up, and reviews their history on the analysis page.
 
From the sketches I moved to digital wireframes, designing each page with ALU branding using campus photography as hero images. I also defined the data model — every task stores an id, title, dueDate, duration, priority, tag, createdAt, and updatedAt.
 
### HTML and CSS (M2)
 
I built the full semantic HTML structure first — one `index.html` file with all sections inside it. Navigation between sections is handled by JavaScript adding and removing an `active` class. I used proper semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, and `<footer>`.
 
The CSS is split into three files:
- `main.css` — global styles, navbar, stat cards, tables, forms, buttons
- `responsive.css` — all media queries for mobile (360px), tablet (768px), and desktop (1024px)
The design uses ALU brand colours — navy blue (`#003B71`), red (`#C8102E`), and ash (`#F4F2ED`). Fonts are loaded from Google Fonts using Inter for a clean modern look.
 
### Regex Validation (M3)
 
All validation lives in `Scripts/validator.js`. There are 5 regex rules:
 
| Rule | Field | Pattern | What it checks |
|------|-------|---------|----------------|
| 1 | Task title | `value !== value.trim()` | No leading or trailing spaces |
| 2 | Due date | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | Valid YYYY-MM-DD format |
| 3 | Duration | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | Positive number, up to 2 decimals |
| 4 | Tag | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Letters, spaces, hyphens only |
| 5 (advanced) | Title | `/\b(\w+)\s+\1\b/i` | Back-reference catching duplicate words |
 
Rule 5 uses a back-reference (`\1`) which is the advanced regex pattern required by the assignment. It catches accidental duplicate words like "submit submit essay".
 
Errors appear inline below each field in real time and are also announced via `role="status"` for screen readers.
 
### Search, Sort, and Highlight (M4)
 
The search bar on the Tasks page uses a safe regex compiler with try/catch so bad patterns never crash the app. Matching text is highlighted using the `<mark>` tag. Sort pills let the user sort by title, due date, duration, priority, or tag.
 
All search and sort logic lives in `Scripts/search.js`.
 
### Stats and Cap (M5)
 
The dashboard shows 4 stat cards (total tasks, overdue, due today, top tag), a 7-day bar chart showing tasks added per day, and a weekly duration cap bar. The cap bar turns red and announces via `aria-live="assertive"` when the cap is exceeded.
 
### Persistence and Import/Export (M6)
 
All tasks are saved to `localStorage` automatically on every change. The Settings page lets the user export all tasks as a JSON file or import tasks from a JSON file. The import function validates the structure before loading — it checks that the file is an array and that every task has the required fields.
 
### Polish and Accessibility (M7)
 
- All interactive elements have visible focus styles
- Skip-to-content link as first focusable element
- Keyboard-only navigation works throughout
- All animations wrapped in `@media (prefers-reduced-motion: no-preference)`
- Color contrast meets WCAG AA standard
- ARIA live regions announce dynamic updates
- Mobile-first responsive design with 3 breakpoints
---
 
## Features
 
- Add, edit, and delete tasks with full validation
- Search tasks using regex patterns with live highlighting
- Sort by title, due date, duration, priority, or tag
- Dashboard with stat cards, 7-day chart, and weekly cap bar
- Reminders page showing overdue and upcoming tasks
- Analysis page with tag breakdown, priority breakdown, and trend chart
- Import and export tasks as JSON
- Persistent storage using localStorage
- Fully accessible and keyboard navigable
- Responsive across mobile, tablet, and desktop
---
 
## Regex Catalog
 
| Pattern | Purpose | Example match |
|---------|---------|---------------|
| `value !== value.trim()` | No leading/trailing spaces | `" Maths"` fails |
| `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | Valid date | `"2025-10-04"` passes |
| `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | Positive number | `"90"`, `"1.5"` pass |
| `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Tag format | `"group-work"` passes |
| `/\b(\w+)\s+\1\b/i` | Duplicate word | `"submit submit"` fails |
| `new RegExp(input, 'i')` | Safe search compiler | Any regex pattern |
 
---
 
## Keyboard Map
 
| Key | Action |
|-----|--------|
| Tab | Move to next focusable element |
| Shift + Tab | Move to previous focusable element |
| Enter / Space | Activate button or link |
| Escape | Cancel edit or close confirmation |
 
---
 
## Accessibility Notes
 
- Semantic HTML landmarks used throughout (`header`, `nav`, `main`, `section`, `footer`)
- All form inputs have explicit `<label>` elements bound via `for` and `id`
- Skip-to-content link as first focusable element on page
- `role="status"` with `aria-live="polite"` for form validation messages
- `aria-live="assertive"` for cap exceeded warning
- `aria-label` on all icon-only buttons (edit and delete)
- Color is never the only indicator — overdue tasks also show text labels
- All animations respect `prefers-reduced-motion`
---
 
## File Structure
 
```
campus-life-planner/
├── index.html
├── tests.html
├── seed.json
├── README.md
├── .gitignore
├── Images/
│   ├── logo.png
│   ├── ALU campus image.jpg
│   └── ALU campus2.jpg
├── Planning-Designing/
│   ├── Final UI/
│   │   ├── mockup_dashboard.png
│   │   ├── mockup_tasks.png
│   │   ├── mockup_add_task.png
│   │   ├── mockup_reminders.png
│   │   └── mockup_analysis.png
│   └── Rough Sketches/
├── Styles/
│   ├── main.css
│   └── responsive.css
└── Scripts/
    ├── main.js
    ├── state.js
    ├── storage.js
    ├── ui.js
    ├── validator.js
    └── search.js
```
 
---
 
## How to Run
 
1. Clone the repo: `git clone https://github.com/oteniyatobi/campus-life-planner`
2. Open `index.html` in a browser or use Live Server in VS Code
3. To run tests: open `tests.html` in a browser
## How to Run Tests
 
Open `tests.html` in your browser. It runs 23 automated assertions across all 5 regex rules and shows pass/fail results with a summary at the bottom.
 
---
 
## Seed Data
 
The `seed.json` file contains 12 sample tasks covering a range of edge cases — overdue tasks, tasks due today, tasks far in the future, short durations (5 mins), long durations (300 mins), short titles, long titles, and all 5 tags (academics, personal, group work, admin, reading).
 
**Note:** The seed data was generated with AI assistance for documentation and testing purposes only. All application code was written by Oteniya Oluwatobi Jeremiah.
 
---
 
## Academic Integrity
 
All HTML, CSS, and JavaScript code in this project was written by me. AI tools were used only for:
- Generating the `seed.json` sample data
- Documentation and README writing assistance
- And also the think design process
---

**Live Demo:** [https://github.com/oteniyatobi/campus-life-planner]
**Demo Video:** [https://youtu.be/p9zRzOHrGkI](https://youtu.be/p9zRzOHrGkI)
 
## Milestones
 
| Milestone | Weight | Status |
|-----------|--------|--------|
| M1 — Spec and Wireframes | 10% | Done |
| M2 — Semantic HTML and Base CSS | 10% | Done |
| M3 — Forms and Regex Validation | 15% | Done |
| M4 — Render, Sort, and Regex Search | 20% | Done |
| M5 — Stats and Cap/Targets | 15% | Done |
| M6 — Persistence, Import/Export, Settings | 15% | Done |
| M7 — Polish and Accessibility Audit | 15% | Done |