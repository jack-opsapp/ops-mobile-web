# Step 01: jobBoardIntro — "TAP THE + BUTTON"

## 1. Root Entry Point

**File**: `TutorialCreatorFlowWrapper.swift`

For `.jobBoardIntro`:
- `contentForCurrentPhase` → `TutorialMainTabView(selectedTab: 1)`
- **Tab 1 = JobBoardView** (NOT HomeView)
- Note: `selectedTab: 0` = HomeView, `1` = JobBoardView, `2` = ScheduleView, `3` = SettingsView

**Active overlays:**
- `shouldShowIntroBlockingOverlay`: **TRUE**
- `shouldShowFAB`: **TRUE**
- `shouldShowSpotlight`: **FALSE** (blocking overlay replaces it)
- `shouldShowDoneButton`: **FALSE**
- Sheets: all **FALSE**
- `showContinueButton`: **FALSE**

> **DEFERRED**: User wants steps 1-2 on the home screen with map, but iOS code shows JobBoardView. For now, match iOS as-is. Return to this after all other steps are complete to add HomeView with map background.

---

## 2. Layer-by-Layer Audit

### Layer 1 — App Content: JobBoardView

**File**: `Views/JobBoardView.swift`

Structure (top to bottom inside ZStack):
1. `OPSStyle.Colors.background` — full screen near-black (#000000)
2. `AppHeader(headerType: .jobBoard)` — "JOB BOARD" title + search/filter icons
3. `VStack`:
   - `JobBoardSectionSelector` — 4 tabs: DASHBOARD | CLIENTS | PROJECTS | TASKS
   - Content area (dashboard columns or list depending on selected section)

**AppHeader (headerType: .jobBoard)**:
- File: `Views/Components/Common/AppHeader.swift`
- Layout: HStack with 20pt horizontal padding, 12pt vertical padding
- Title: "JOB BOARD" — `OPSStyle.Typography.subtitle` (Kosugi, 22pt)
- Color: `primaryText` (#FFFFFF)
- Right side: search icon + filter icon (system icons, 18pt, secondaryText color #AAAAAA)

**JobBoardSectionSelector**:
- File: `Views/JobBoard/JobBoardSectionSelector.swift`
- HStack, spacing: 8pt
- Container: `cardBackgroundDark` background, cornerRadius 9pt (cornerRadius + 4), padding 4pt
- Padding from top: 70pt (below header)
- Padding horizontal: 16pt
- Each tab button:
  - Font: `OPSStyle.Typography.cardBody` (~16pt Mohave)
  - Selected: white bg (`primaryText`), dark text
  - Unselected: clear bg, `secondaryText` (#AAAAAA)
  - Padding: vertical 8pt, maxWidth infinity

**Dashboard content below selector**: Status columns with project cards (paging horizontal TabView)

### Layer 2 — Tab Bar

**Component**: `TutorialTabBar` (defined inside TutorialCreatorFlowWrapper.swift)
- **Selected**: index 1 (Jobs)
- **Greyed out**: NO (`shouldGreyOut` is false for jobBoardIntro)
- Tabs: Home (house.fill) | Jobs (briefcase.fill) | Schedule (calendar) | Settings (gearshape.fill)
- Icon size: 22pt
- Selected icon color: `primaryAccent` (#59779F)
- Unselected icon color: `tertiaryText` (#777777)
- Padding: vertical 12pt, bottom 24pt
- Background: `cardBackgroundDark` with shadow(black 0.3, radius 8, y: -2)

### Layer 3 — Blocking Overlay

- **Active**: YES
- Color: `Color.black.opacity(0.6)`
- Covers entire screen (`ignoresSafeArea`)
- Blocks touch events (content behind is not tappable)
- Transition: `.opacity`, animation `.easeInOut(duration: 0.3)`
- Z-order: ABOVE content, BELOW FAB

### Layer 4 — FAB (Floating Action Button)

**File**: `Views/Components/FloatingActionMenu.swift`
- **Visible**: YES
- **Menu state**: CLOSED (user hasn't tapped yet)
- **Disabled**: NO (enabled during jobBoardIntro, disabled during fabTap)

**Position & Size**:
- Bottom-right corner
- Padding: 36pt from right edge, 140pt from bottom
- Size: 64x64pt circle

**Styling (normal/jobBoardIntro state)**:
- Icon: SF Symbol "plus", 30pt
- Icon color: `buttonText` (white)
- Background: `.ultraThinMaterial.opacity(0.8)` (frosted glass)
- Border: 2pt stroke, `primaryAccent` (#59779F)
- Shadow: `background.opacity(0.4)`, radius 8, offset (0, 4)
- Rotation: 0 degrees (closed)

**When tapped**: rotates to 225 degrees, menu items appear

### Layer 5 — Sheets

All hidden. No ProjectFormSheet or TaskFormSheet.

### Layer 6 — Spotlight

**Active**: NO — blocking overlay provides the darkening instead.

### Layer 7 — Tooltip

**Component**: `TutorialCollapsibleTooltip`
- Position: top of screen (VStack, first element)
- Default state: **expanded**

**Content**:
- Text: "TAP THE + BUTTON"
- Description: "This is where you create projects, tasks, clients, and more."

**Container styling**:
- Background: `cardBackgroundDark` (#0D0D0D)
- Border: 1pt, accent color (#59779F) at 0.3 opacity
- Corner radius: 12pt
- Padding: 16pt horizontal, 14pt vertical
- Margin: 16pt horizontal, 8pt top
- Shadow 1: black 0.8 opacity, radius 20, offset (0, 0)
- Shadow 2: black 0.6 opacity, radius 40, offset (0, 8)
- Shadow 3: black 0.4 opacity, radius 60, offset (0, 12)

**Icon**: lightbulb.fill, 18pt, `primaryAccent` (#59779F)

**Title text**:
- Font: `bodyBold` — Mohave Medium, 16pt
- Color: `primaryText` (#FFFFFF)
- Typewriter animation: 20ms per character

**Description text**:
- Font: `caption` — Kosugi Regular, 14pt
- Color: `secondaryText` (#AAAAAA)
- Typewriter animation: 15ms per character, starts after title completes + 100ms

**Collapse chevron**: "chevron.up", 12pt semibold, `tertiaryText` (#777777)

### Layer 8 — Continue/Done Button

Not visible during this phase.

---

## 3. Interaction Contract

**User action**: Tap the FAB (+ button)

**Chain**:
1. `FloatingActionMenu` detects tap → posts `Notification.Name("TutorialFABTapped")`
2. `TutorialCreatorFlowWrapper.onReceive("TutorialFABTapped")` → checks phase == `.jobBoardIntro` → calls `stateManager.advancePhase()`
3. Phase advances to `.fabTap`

**Web replication**: YES — simple tap/click event on the FAB button. No issues.

---

## 4. Animations

**On enter**:
- Content view transition: `.asymmetric(insertion: .move(edge: .trailing), removal: .move(edge: .leading))`, duration 0.4s easeInOut
- Blocking overlay fades in: opacity 0 → 0.6, 0.3s easeInOut
- Tooltip appears at top

**During phase**:
- Tooltip title typewriter: 20ms/char
- Tooltip description typewriter: 15ms/char after title + 100ms delay
- Haptic: lightTap on phase start

**On exit (→ fabTap)**:
- Tooltip text re-animates with new content
- FAB menu opens: plus icon rotates 225 degrees
- Menu items slide in with staggered delays (0.2s, 0.4s, 0.6s, 0.8s from bottom)

---

## 5. Delta from Current Web Implementation

### Matches:
- ✅ Shows JobBoard content (not calendar)
- ✅ Blocking overlay at 60% opacity
- ✅ FAB visible at bottom-right
- ✅ Tab bar with 4 tabs, Jobs selected
- ✅ Tooltip with typewriter animation

### Mismatches:
| Issue | Category | Detail |
|-------|----------|--------|
| Content too high | wrong layout | Content pushes up behind tooltip — no proper spacing for header + tooltip area |
| No AppHeader | missing | iOS shows "JOB BOARD" header with search/filter icons above section selector |
| Section selector styling | wrong style | iOS: cardBackgroundDark bg, 9pt radius, 4pt padding, 8pt item spacing. Web: may differ |
| Tooltip corner radius | wrong style | iOS uses 12pt. Web `rounded-ops` = 5px. Should be 12px for tooltip |
| Tooltip shadows | wrong style | iOS has 3-layer shadow system. Web may only have 1 |
| Tab bar height | wrong layout | iOS: 100pt total with 24pt bottom padding. Verify web matches |
| FAB material background | missing | iOS uses `.ultraThinMaterial` (blur). Web uses solid color |
| primaryAccent color | verify | iOS code references both #FF7733 and #59779F — need to confirm which is current |
| Font rendering | verify | Mohave 16pt and Kosugi 14pt — verify web font-size matches iOS points |
