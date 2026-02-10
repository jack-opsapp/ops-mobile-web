# Step 03: projectFormClient — "SELECT A CLIENT"

## 1. Root Entry Point

**File**: `TutorialCreatorFlowWrapper.swift`

For `.projectFormClient`:
- `contentForCurrentPhase` → `TutorialMainTabView(selectedTab: 1)` (Job Board tab)
- `showProjectForm`: **TRUE** (set when "TutorialCreateProjectTapped" received)

**Active overlays:**
- `shouldShowIntroBlockingOverlay`: **FALSE**
- `shouldShowFAB`: **FALSE**
- `shouldShowSpotlight`: **FALSE**
- `shouldShowDoneButton`: **FALSE**
- `showProjectForm`: **TRUE**
- `showTaskForm`: **FALSE**
- `showContinueButton`: **FALSE**

---

## 2. Layer-by-Layer Audit

### Layer 1 — App Content: JobBoardView
- Same as steps 1-2 (dimmed behind sheet)
- Dimmed by TutorialInlineSheet's backdrop: black opacity 0.4

### Layer 2 — Tab Bar
- `shouldGreyOut`: **FALSE**
- Full opacity, but blocked by sheet overlay

### Layer 3 — Blocking Overlay
- **Active**: NO

### Layer 4 — FAB
- **Visible**: NO

### Layer 5 — ProjectFormSheet (KEY LAYER)

#### Sheet Presentation (TutorialInlineSheet):
- **Coverage**: 92% of screen height
- **Animation**: Spring (response: 0.35, dampingFraction: 0.85)
- **Background**: `OPSStyle.Colors.background` (#000000)
- **Corner radius**: 20pt top corners (UnevenRoundedRectangle)
- **Drag handle**: Hidden (interactiveDismissDisabled: true)
- **Backdrop**: Black opacity 0.4

#### Form Nav Bar:
- Left: "CANCEL" — #777777, opacity 0.5, disabled
- Center: "CREATE PROJECT" — white, bold, 16pt Mohave
- Right: "CREATE" — #777777, disabled
- Divider: 1px white opacity 0.1 below

#### Form Content (ProjectFormSheet.swift):

**Preview Card**: opacity 0.3, disabled

**Section Header**:
- Icon: "doc.text" 14x14, #AAAAAA
- Text: "PROJECT DETAILS" — captionBold (14pt Kosugi bold), #AAAAAA
- Gap: ~4pt between icon and text

**Card Container**:
- Background: `cardBackgroundDark` opacity 0.8 → rgba(13,13,13,0.8)
- Border: 1px solid rgba(255,255,255,0.1)
- Corner radius: 12pt
- Padding: 14pt vertical, 16pt horizontal
- Internal spacing: 16pt between fields

#### CLIENT FIELD (highlighted for this phase):

**Label**:
- Text: "CLIENT" (uppercase)
- Font: captionBold (14pt Kosugi bold)
- Color: `primaryAccent` (#59779F) — highlighted
- Pulsing: YES (TutorialPulseModifier)

**Search Field**:
- Padding: 12pt vertical, 16pt horizontal
- Border: 2px solid rgba(89,119,159,0.6) — pulsing
- Corner radius: 5pt
- Magnifying glass icon: 16x16, #AAAAAA
- Placeholder: "Search or create client..."
- Font: body (16pt Mohave)
- Auto-focused: YES

**Client Dropdown**:
- Shows ALL demo clients immediately in tutorial mode
- Margin top: 8pt
- Background: cardBackgroundDark opacity 0.8
- Border: 1px solid rgba(255,255,255,0.2) (inputFieldBorder)
- Corner radius: 5pt
- Max items: 5

**Client List Item**:
- Name only (no avatar, no email in dropdown)
- Font: body (16pt Mohave), white
- Padding: 12pt vertical, 16pt horizontal
- Divider: cardBorder (white opacity 0.2) between items

#### PROJECT NAME FIELD:
- Opacity: 0.5 (disabled for this phase)
- Hit testing: disabled

#### JOB STATUS FIELD:
- Opacity: 0.5
- Pre-selected: "ESTIMATED"

### Layer 6 — Spotlight
- **Active**: NO

### Layer 7 — Tooltip
- Text: "SELECT A CLIENT"
- Description: "These are sample clients. Pick any one—this is just for practice."
- Same styling as previous steps

### Layer 8 — Continue Button
- **Visible**: NO

---

## 3. Interaction Contract

**User action**: Tap a client from the dropdown list

**Chain**:
1. User taps client in dropdown
2. `selectedClientId = client.id`, `clientSearchText = client.name`
3. Posts `Notification.Name("TutorialClientSelected")`
4. Wrapper receives → checks phase == `.projectFormClient` → calls `stateManager.advancePhase()`
5. Phase advances to `.projectFormName`
6. Selected client card replaces search field (name + email, no clear button in tutorial)

**Web replication**: YES — click on a client item in the dropdown. No issues.

---

## 4. Animations

**On enter (form slides up from fabTap)**:
- Sheet slides up: spring (response: 0.35, dampingFraction: 0.85)
- Backdrop: black opacity 0 → 0.4
- Tooltip text re-animates

**During phase**:
- Client field border: pulsing blue glow (shadow 0-12pt radius, opacity 0.15-0.35)
- Tooltip typewriter

**On exit (client selected)**:
- Dropdown closes
- Selected client card appears (instant swap)
- Project name field opacity: 0.5 → 1.0
- Tooltip re-animates with "ENTER A PROJECT NAME"

---

## 5. Delta from Current Web Implementation

### Matches:
- ✅ Card container background rgba(13,13,13,0.8)
- ✅ Card border 1px solid rgba(255,255,255,0.1)
- ✅ Card corner radius 12px
- ✅ Card padding 14px/16px
- ✅ Client label color #59779F when highlighted
- ✅ Search field border 2px solid rgba(89,119,159,0.6)
- ✅ Client item font 16px Mohave
- ✅ Client item padding 12px/16px
- ✅ Disabled field opacity 0.5

### Mismatches:
| Issue | Category | Detail |
|-------|----------|--------|
| Section header casing | wrong style | Web: "Project Details". iOS: "PROJECT DETAILS" (all caps) |
| Field label casing | wrong style | Web: "Client". iOS: "CLIENT" (all caps) |
| Project Name label casing | wrong style | Web: "Project Name". iOS: "PROJECT NAME" (all caps) |
| Client dropdown border opacity | wrong style | Web: rgba(255,255,255,0.1). iOS: rgba(255,255,255,0.2) |
| Client list divider opacity | wrong style | Web: rgba(255,255,255,0.05). iOS: rgba(255,255,255,0.2) |
| Selected client card | wrong style | Web: border + no email. iOS: no border + shows email below name |
| Sheet height | wrong layout | Web: 88% max-height. iOS: 92% |
| Sheet corner radius | wrong style | Web: 12px. iOS: 20px (top corners) |
| Section header icon gap | wrong layout | Web: 8px. iOS: ~4px |
| Pulse animation | wrong behavior | Web has CSS pulse but values may differ from iOS TutorialPulseModifier |
