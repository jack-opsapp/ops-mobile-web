# Step 05: projectFormAddTask — "NOW ADD A TASK"

## 1. Root Entry Point

**File**: `TutorialCreatorFlowWrapper.swift`

For `.projectFormAddTask`:
- `showProjectForm`: **TRUE**
- `showTaskForm`: **FALSE** (not yet)
- Listens for `TutorialAddTaskTapped` notification → advances phase AND sets `showTaskForm = true`

## 2. Layer-by-Layer Audit

### Layer 5 — ProjectFormSheet (KEY LAYER)

#### Two UI States:

**STATE A: Tasks section collapsed (pill highlighted)**
- "ADD TASKS" pill is highlighted and pulsing
- User must tap pill to expand tasks section

**Pill styling (OptionalSectionPill.swift):**
- Text: "ADD TASKS", captionBold (Kosugi Regular 14pt)
- Icon: "checklist" 12pt, #59779F
- Color: #59779F when highlighted
- Opacity: pulses 0.3-1.0
- Border: 2px solid #59779F, opacity pulses 0.3-1.0
- Padding: 12pt horizontal, 8pt vertical
- Background: cardBackgroundDark (#1F293D)
- Corner radius: 5pt

**STATE B: Tasks section expanded (Add Task button highlighted)**
- Add Task button inside expanded section is highlighted and pulsing

**Button styling:**
- Icon: plus.circle.fill 20pt
- Text: "Add Task" / "Add Another Task", Mohave Regular 16pt, #59779F
- Border: 2px solid #59779F (pulsing), dashed when not highlighted
- Background: cardBackgroundDark
- Corner radius: 5pt
- Padding: 12pt vertical, 16pt horizontal

**Section auto-expansion**: Tasks section does NOT auto-expand in tutorial. User must tap pill first.
**Auto-scroll**: After expansion, section scrolls to top after 0.1s delay.

### Layer 7 — Tooltip
- Text: "NOW ADD A TASK"
- Description: "Tasks are the individual jobs within a project."

## 3. Interaction Contract

**User action**: Tap Add Task button (or pill then button)
**Chain**: Posts `TutorialAddTaskTapped` → wrapper advances phase + shows TaskFormSheet

## 5. Delta from Current Web Implementation

### Mismatches:
| Issue | Category | Detail |
|-------|----------|--------|
| Pill corner radius | wrong style | Web: 20px. iOS: 5px |
| Pill vertical padding | wrong style | Web: 6px. iOS: 8px |
| Pill font size | wrong style | Web: 11px. iOS: 14px |
| Pill font weight | wrong style | Web: bold. iOS: Regular |
| Pill missing icon | missing | iOS has checklist icon at 12pt. Web has none |
| Pill background highlighted | wrong style | Web: rgba(89,119,159,0.08). iOS: cardBackgroundDark |
| Add Task button corner radius | wrong style | Web: 12px. iOS: 5px |
| Section header casing | wrong style | Web: "Add Tasks". iOS: "ADD TASKS" (uppercase) |
| Auto-scroll missing | missing | iOS scrolls expanded section to top. Web doesn't |
| Border/text pulse | wrong behavior | iOS pulses border+text opacity 0.3-1.0. Web only pulses box-shadow |
| Other pill corner radius | wrong style | All pills use 20px. Should be 5px |
| Other pill font size | wrong style | All pills use 11px. Should be 14px |
