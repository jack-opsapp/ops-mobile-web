# Step 04: projectFormName — "ENTER A PROJECT NAME"

## 1. Root Entry Point

**File**: `TutorialCreatorFlowWrapper.swift`

For `.projectFormName`:
- `showProjectForm`: **TRUE**
- All other overlays: **FALSE** (no FAB, no blocking overlay, no spotlight)
- Listens for `TutorialProjectNameEntered` notification → advances phase

## 2. Layer-by-Layer Audit

### Layer 5 — ProjectFormSheet (KEY LAYER)

**Enabled fields**: Project Name ONLY
**Disabled fields**: Client (shown as selected card), Status (0.5 opacity), Add Task, all optional pills

#### Project Name Field:
- **Label**: "PROJECT NAME" — captionBold (Kosugi Regular 14pt), #59779F when highlighted, pulsing
- **Input**: Mohave Regular 16pt, white text
- **Placeholder**: "Enter project name"
- **Border (highlighted)**: 2px solid #59779F, opacity pulses 0.3-1.0
- **Corner radius**: 5pt (OPSStyle.Layout.cornerRadius)
- **Padding**: 12pt vertical, 16pt horizontal
- **Auto-focus**: YES
- **Auto-capitalization**: Words
- **Autocorrection**: Disabled

### Layer 7 — Tooltip
- Text: "ENTER A PROJECT NAME"
- Description: "Give it a name you'd recognize on the job board."

## 3. Interaction Contract

**User action**: Type a project name and press Return

**Chain**:
1. User types name + presses Return (or .onSubmit)
2. Calls `advanceToNextField()` → dismisses keyboard
3. Posts `TutorialProjectNameEntered` notification
4. Wrapper advances to `.projectFormAddTask`

## 5. Delta from Current Web Implementation

### Mismatches:
| Issue | Category | Detail |
|-------|----------|--------|
| Input corner radius | wrong style | Web: 12px. iOS: 5px |
| Label font weight | wrong style | Web: bold. iOS: Kosugi Regular (captionBold name is misleading — it's Regular weight) |
| Border pulse | wrong behavior | Web pulses box-shadow only. iOS pulses border opacity 0.3-1.0 |
