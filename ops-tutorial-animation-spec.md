# OPS Pre-Tutorial Animation — Sequence Spec v4

## Overview

A full-screen animated primer that plays before the interactive tutorial. Teaches three core concepts through motion: project/task containment, task-level scheduling and assignment, and project status lifecycle. The user watches and absorbs — text reinforces, it doesn't explain.

## Design Principles

- **Apple onboarding alignment.** One idea per moment. Motion is the explanation. Progressive disclosure. No chrome.
- **OPS visual language.** Dark background, white stroke/no fill line art. No filled shapes. Tactical/military minimalism.
- **Pacing gives weight.** Slow = important. Fast = "you get it." Timing teaches.
- **Responsive.** Works portrait (mobile) and landscape (web). Centered composition.
- **No progress indicators.** No step counts, no progress bars. Only "Got it" / "Back" at breakpoints.

---

## Color Definitions

### Status Colors
Reference `opsStyleStatus.[status]` for each:
- RFQ
- Estimated
- Accepted
- In Progress
- Completed
- Closed
- Archived

### Task Colors
- **Task 1:** Bone white / cream
- **Task 2:** Burnt orange
- **Task 3:** Sage green

### Default / Inactive State
- All inactive elements: desaturated white/gray stroke
- Dark background (OPS dark)

---

## SEQUENCE 1 — Projects Contain Tasks

1. Single **project folder** icon (white stroke, no fill) fades in, centered on screen.
2. Hold (~1s).
3. Folder animates open — top flap lifts.
4. Three **task folders** emerge from inside the project folder and stack vertically in a **left-aligned column above** the project folder. Ordered top to bottom: Task 1, Task 2, Task 3. All three appear in **grayscale/desaturated, uniform small size**.
5. Brief hold (~1s) — user sees the containment relationship.
6. *(Text TBD — short caption reinforcing that tasks exist within projects. Refine later.)*

**→ Flows directly into Sequence 1B (no breakpoint)**

---

## SEQUENCE 1B — Task Scheduling & Team Assignment

Context: Three task folders are stacked in a left-aligned column above the open project folder. All grayscale.

### Per-task animation (plays sequentially, top to bottom):

**Step 1 — Select**
- Task folder transitions from grayscale to **its unique task color** (stroke/lines only).
- Task folder **scales up slightly** from resting size.
- Other task folders remain grayscale and small.

**Step 2 — Reveal details**
- To the **right** of the selected task folder, the following animates in — **all rendered in that task's color**:
  - Task label / name
  - Crew member avatar(s) (sample data avatars) + crew icon with count
  - Schedule icon + date range (e.g., "Mar 12 – 13")
- Layout references iOS app project card information hierarchy, positioned as a horizontal adjacent block.

**Step 3 — Hold**
- ~1.5s for user to read.

**Step 4 — Deselect**
- Adjacent text, icons, and avatars **fade away**.
- Task folder **returns to grayscale** and scales back down to resting size.

**Step 5 — Next task**
- Next task folder down repeats Steps 1–4 with its own color and its own sample data.

### Task sequence:

| Task | Color | Sample Data |
|------|-------|-------------|
| Task 1 | Bone white / cream | Own date range, crew count, avatar |
| Task 2 | Burnt orange | Own date range, crew count, avatar |
| Task 3 | Sage green | Own date range, crew count, avatar |

### Collapse

After all 3 tasks have cycled:
1. Brief hold.
2. Task folders animate **back down into the project folder** in sequence — top first, then middle, then bottom (collapsing the stack).
3. Project folder flap closes.

*(Text TBD — short caption about tasks carrying their own schedule and crew. Refine later.)*

### ⏸ BREAKPOINT 1

- **"Got it"** — advances to Sequence 2
- **"Back"** — replays Sequence 1 + 1B from the beginning

Buttons fade in at bottom of screen. Low visual weight.

---

## SEQUENCE 2 — Project Status Lifecycle

On "Got it":

### Setup

1. Previous text clears. Project folder remains centered.

### Status Carousel

2. A **horizontal carousel** appears above the project folder:
   - **Center position:** Active status — full `opsStyleStatus.[status]` color, full opacity
   - **Left position:** Previous status — desaturated white/gray, reduced opacity (~0.3–0.4)
   - **Right position:** Next status — desaturated white/gray, reduced opacity (~0.3–0.4)
   - Only immediate neighbors are visible. Statuses beyond are hidden.

3. Carousel begins with **RFQ** centered. Folder adopts `opsStyleStatus.rfq` color.

### Forward Progression

Each transition: the carousel row slides left. The incoming status enters from the right (desaturated), crosses to center, **saturates into its status color** as it arrives. The project folder **transitions to that status color simultaneously**. All transitions use a **spring modifier** — slight overshoot and settle on landing.

**Haptic feedback** fires on each status arrival (mobile). Visual pulse (brief scale bump on folder) as universal fallback for web.

### Timing — Bell Curve with Spring

| Transition | Duration | Feel |
|-----------|----------|------|
| RFQ → Estimated | ~1.8s | **Slow** — first transition, user learns the mechanic |
| Estimated → Accepted | ~1.2s | **Medium** — picking up pace |
| Accepted → In Progress | ~0.6s | **Fast** — spring is most visible, snappy |
| In Progress → Completed | ~1.2s | **Medium** — decelerating |
| Completed → Closed | ~1.8s | **Slow** — settling, signaling conclusion |

### Reverse Roll

7. On Closed — hold (~1s).
8. Carousel **reverses rapidly** back through all statuses: Closed → Completed → In Progress → Accepted → Estimated. Quick, fluid, continuous motion. Colors cycle through in reverse. Settles on **Estimated** with `opsStyleStatus.estimated` color.
9. This communicates: **status is not locked — it can be changed at any point.**

### Archive

10. Hold on Estimated (~1s).
11. **"Archived"** label fades in below, toward the bottom of the screen.
12. Project folder begins **dragging downward** toward the Archived label.
13. During the downward motion:
    - "Estimated" status text in the carousel **desaturates back to white/gray**
    - Folder color transitions from `opsStyleStatus.estimated` → `opsStyleStatus.archived`
14. Folder arrives at the Archived label. Subtle **scale-down** as if being filed away. **Haptic on land.**

*(Text TBD — placeholder: "Projects can be archived at any status." Refine later.)*

### ⏸ BREAKPOINT 2

- **"Begin Tutorial"** — launches the interactive guided tutorial
- **"Skip"** — drops user directly into the app

---

## Technical Notes

- **Haptic:** Use where available (mobile). Degrade silently on web. Substitute subtle visual pulse (scale bump) as universal feedback.
- **"Back" at breakpoints:** Replays the previous sequence group from the top. Not frame-scrub.
- **Spring values:** Tension and damping to be defined at build time. Target feel: tactile, not bouncy. Controlled snap.
- **Text:** Final copy defined - see Text & Sample Data section below.
- **Sample data:** Use DEMO_CREW from demo-data.ts. Three tasks use different crew members and MMM DD date format.

---

## Text & Sample Data (FINAL)

### Text
- **Sequence 1:** "PROJECTS ARE BUILT OF TASKS"
- **Sequence 1B:** "ASSIGN CREW AND DATES TO A TASK"
- **Sequence 2:** "PROJECT STATUS FLOWS FROM LEAD TO CLOSE"
- **Sequence 2 Archive:** "ARCHIVE PROJECTS THAT DON'T MOVE FORWARD"

### Task Sample Data
| Task | Label | Color | Crew | Dates |
|------|-------|-------|------|-------|
| Task 1 | SANDING | #F5F5DC (bone/cream) | Maverick | Mar 12 |
| Task 2 | PRIMING | #E8945A (burnt orange) | Goose | Mar 15 |
| Task 3 | PAINTING | #8B9D83 (sage green) | Iceman | Mar 18 |

**Note:** Folder opening is subtle (not flap lift). Task folders have clean spacing (no overlap). Carousel neighbors are close to screen edges but fully visible.

---

## Sequence Flow Summary

```
SEQUENCE 1: Project folder opens → 3 task folders stack vertically
         ↓
SEQUENCE 1B: Each task selects → shows schedule/crew → deselects → next
         ↓
         Tasks collapse back into project folder
         ↓
    ⏸ BREAKPOINT 1: "Got it" / "Back"
         ↓
SEQUENCE 2: Status carousel plays forward (RFQ → Closed, bell curve timing)
         ↓
         Reverse roll back to Estimated
         ↓
         Project folder drags down to Archived
         ↓
    ⏸ BREAKPOINT 2: "Begin Tutorial" / "Skip"
```

---

## IMPLEMENTATION PLAN

### File Structure
```
app/tutorial-intro/page.tsx                 # Main page component
components/tutorial/intro/
  ├── TutorialIntroShell.tsx               # Container, manages sequence state
  ├── Sequence1.tsx                         # Projects contain tasks
  ├── Sequence1B.tsx                        # Task scheduling animation
  ├── Sequence2.tsx                         # Status carousel
  ├── ProjectFolder.tsx                     # Reusable folder SVG component
  ├── TaskFolder.tsx                        # Reusable task folder SVG component
  └── BreakpointButtons.tsx                 # "Got it" / "Back" / "Begin Tutorial" buttons
```

### Dependencies
- **Framer Motion** (already in project) - spring animations, layout transitions
- **OPSStyle** - status colors from `lib/styles/OPSStyle.ts`
- **Demo Data** - crew avatars from `lib/constants/demo-data.ts`

### Component Architecture

**TutorialIntroShell**
- State machine: tracks current sequence (1, 1B, 2) and substeps
- Renders active sequence component
- Handles "Got it" / "Back" navigation
- Manages text transitions (fade in/out between sequences)

**Sequence1**
- ProjectFolder component (white stroke) fades in center
- Opens slightly (subtle scale/rotate)
- TaskFolder components emerge from inside, stack vertically above (left-aligned)
- All tasks start grayscale
- Text appears: "PROJECTS ARE BUILT OF TASKS"
- Auto-advances to Sequence1B

**Sequence1B**
- Each TaskFolder (top to bottom):
  - Transitions to color + scales up
  - Task label appears to right
  - Crew avatar + icon appears to right
  - Calendar icon + date appears to right
  - Hold 1.5s
  - Details fade out
  - TaskFolder returns to grayscale + scales down
- After all 3 tasks cycle:
  - TaskFolders animate back down into ProjectFolder (top first)
  - ProjectFolder closes
- Text appears: "ASSIGN CREW AND DATES TO A TASK"
- Breakpoint 1 buttons appear

**Sequence2**
- ProjectFolder remains centered
- Horizontal carousel appears above (3 status labels visible: left/center/right)
- Center status is full color, neighbors are desaturated
- Carousel slides left on each transition (bell curve timing)
- ProjectFolder color transitions to match center status
- Text appears: "PROJECT STATUS FLOWS FROM LEAD TO CLOSE"
- Forward: RFQ → Estimated → Accepted → In Progress → Completed → Closed
- Reverse roll: Closed → Estimated (fast, continuous)
- Archive: "Archived" label appears bottom, folder drags down, transitions to archived color
- Text appears: "ARCHIVE PROJECTS THAT DON'T MOVE FORWARD"
- Breakpoint 2 buttons appear

**ProjectFolder (SVG Component)**
- White stroke, no fill
- Props: color (for status transitions), isOpen (boolean)
- Animates between closed/open states

**TaskFolder (SVG Component)**
- White stroke, no fill (when grayscale)
- Props: color (task type color), isActive (boolean), scale
- Transitions color and scale via Framer Motion

**BreakpointButtons**
- Appears at breakpoints with fade-in
- Props: variant ("gotit" | "begin"), onContinue, onBack
- Low visual weight (white outline buttons)

### Animation Library Usage

**Framer Motion Patterns:**
- `motion.div` for all animated elements
- `animate` prop for state-driven animations
- `transition={{ type: "spring", stiffness: X, damping: Y }}` for spring physics
- `AnimatePresence` for enter/exit animations (text, buttons)
- `useMotionValue` + `useTransform` for carousel slide (if needed)

**Spring Values (to tune):**
- **Slow transitions:** `{ stiffness: 80, damping: 20 }`
- **Medium transitions:** `{ stiffness: 120, damping: 18 }`
- **Fast transitions:** `{ stiffness: 180, damping: 16 }`

### Status Colors (from OPSStyle)
Reference existing status color system:
- Need to read `lib/styles/OPSStyle.ts` to get exact hex values
- Map to: rfq, estimated, accepted, inProgress, completed, closed, archived

### Task Colors (hardcoded)
```typescript
const TASK_COLORS = {
  task1: '#F5F5DC', // bone/cream
  task2: '#E8945A', // burnt orange
  task3: '#8B9D83', // sage green
}
```

### Sample Crew Data
```typescript
const SAMPLE_TASKS = [
  { label: 'SANDING', color: TASK_COLORS.task1, crew: 'Maverick', avatar: '/avatars/pete.png', date: 'Mar 12' },
  { label: 'PRIMING', color: TASK_COLORS.task2, crew: 'Goose', avatar: '/avatars/nick.png', date: 'Mar 15' },
  { label: 'PAINTING', color: TASK_COLORS.task3, crew: 'Iceman', avatar: '/avatars/tom.png', date: 'Mar 18' },
]
```

### Navigation Flow
```
/tutorial-intro → [Watch sequences] → "Begin Tutorial" → /tutorial-interactive
                                   → "Skip" → /signup/credentials (TBD)
```

### Responsive Behavior
- Use viewport units (vh/vw) for sizing
- Centered composition works on all screen sizes
- Text scales with viewport (clamp for min/max)
- Safe area insets for mobile (buttons at bottom respect safe area)

### Build Order
1. ✅ Read OPSStyle.ts to get status colors
2. Create page route: `app/tutorial-intro/page.tsx`
3. Create TutorialIntroShell (state machine, layout)
4. Create ProjectFolder SVG component
5. Create TaskFolder SVG component
6. Build Sequence1 (folder open, tasks emerge)
7. Build Sequence1B (task cycle animation)
8. Create BreakpointButtons component
9. Build Sequence2 (status carousel)
10. Wire up navigation (Begin Tutorial → /tutorial-interactive)
11. Tune spring physics values
12. Test on mobile + web
13. Add haptic feedback (mobile only)
