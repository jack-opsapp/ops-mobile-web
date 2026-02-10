# Step 02: fabTap — "TAP \"CREATE PROJECT\""

## 1. Root Entry Point

**File**: `TutorialCreatorFlowWrapper.swift`

For `.fabTap`:
- `contentForCurrentPhase` → `TutorialMainTabView(selectedTab: 1)`
- **Tab 1 = JobBoardView** (same as step 1)

**Active overlays:**
- `shouldShowIntroBlockingOverlay`: **TRUE**
- `shouldShowFAB`: **TRUE** (menu is OPEN, FAB button itself is DISABLED)
- `shouldShowSpotlight`: **FALSE**
- `shouldShowDoneButton`: **FALSE**
- Sheets: all **FALSE**
- `showContinueButton`: **FALSE**

---

## 2. Layer-by-Layer Audit

### Layer 1 — App Content: JobBoardView

Identical to Step 1. No visual change in background content.

### Layer 2 — Tab Bar

Same as Step 1:
- Selected: index 1 (Jobs)
- `shouldGreyOut`: **FALSE**
- All 4 tabs visible, not dimmed

### Layer 3 — Blocking Overlay

- **Active**: YES
- Same as Step 1: `Color.black.opacity(0.6)`, full screen

### Layer 4 — FAB (Floating Action Button) + Menu

**File**: `Views/Components/FloatingActionMenu.swift`

#### FAB Button (Disabled State)
- **Disabled**: YES (`isFABDisabledInTutorial = true`)
- Background: `Color.black.opacity(0.8)` (solid dark, no blur)
- Border: 2pt stroke, `tertiaryText` (#777777)
- Icon: "plus", 30pt, color `tertiaryText` (#777777)
- Rotation: **225 degrees** (menu is open)
- Hit testing: `.allowsHitTesting(false)` — cannot tap

#### Menu State: OPEN
- 4 menu items in a VStack (trailing alignment, spacing 24pt)
- Gradient overlay behind menu: `LinearGradient` from `background.opacity(0.85)` → `.clear`, direction trailing → leading

#### Menu Items (VStack order, top to bottom):

| # | Item | Icon | Enabled | Stagger Delay | Opacity |
|---|------|------|---------|---------------|---------|
| 1 | NEW TASK TYPE | tag.fill | NO | 0.8s | 0.4 |
| 2 | CREATE TASK | checklist | NO | 0.6s | 0.4 |
| 3 | CREATE PROJECT | folder.fill | **YES** | 0.4s | **1.0** |
| 4 | CREATE CLIENT | person.circle.fill | NO | 0.2s | 0.4 |

Visual order from bottom (nearest to FAB): Create Client → Create Project → Create Task → New Task Type

#### Menu Item Styling (FloatingActionItem):
- Label: `OPSStyle.Typography.bodyBold` — Mohave, 16pt, **weight 700**
- Label color: `primaryText` (#FFFFFF)
- Label: `.uppercased()`
- Icon: 20pt, weight medium, color `secondaryText` (#AAAAAA)
- Icon container: 48x48pt circle
- Icon border: 1px stroke, `secondaryText` (#AAAAAA)
- Icon shadow: `shadowColor` (black 0.15), radius 4, offset (0, 2)
- HStack spacing: 12pt (between label and icon)
- Disabled items: `opacity(0.4)`, `.allowsHitTesting(false)`

#### Menu Item Animation:
- Transition: `.move(edge: .trailing).combined(with: .opacity)` — slide from right + fade
- Duration: 0.3s each
- Stagger delays: 0.2s (Client), 0.4s (Project), 0.6s (Task), 0.8s (Task Type)
- Total time: ~1.1s from first to last item visible

### Layer 5 — Sheets

All hidden. No forms during fabTap.

### Layer 6 — Spotlight

**Active**: NO

### Layer 7 — Tooltip

- Text: "TAP \"CREATE PROJECT\""
- Description: "This starts a new job."
- Same styling as Step 1 tooltip (see step-01 audit)

### Layer 8 — Continue/Done Button

Not visible during this phase.

---

## 3. Interaction Contract

**User action**: Tap "Create Project" menu item

**Chain**:
1. User taps "Create Project" FloatingActionItem
2. Action closure: sets `showCreateMenu = false`, checks `if tutorialMode` → posts `Notification.Name("TutorialCreateProjectTapped")`
3. `TutorialCreatorFlowWrapper.onReceive("TutorialCreateProjectTapped")` → checks phase == `.fabTap` → calls `stateManager.advancePhase()`
4. Phase advances to `.projectFormClient`
5. `showProjectForm` = true → ProjectFormSheet appears

**Web replication**: YES — click on "Create Project" menu item. No issues.

---

## 4. Animations

**On enter (from jobBoardIntro)**:
- FAB rotates: 0° → 225°, 0.3s easeInOut
- Menu items slide in from right with stagger: 0.2s, 0.4s, 0.6s, 0.8s
- Gradient overlay fades in from right: 0.3s
- Tooltip text re-animates with new content

**During phase**:
- Tooltip typewriter: title 20ms/char, description 15ms/char after title + 100ms

**On exit (→ projectFormClient)**:
- Menu closes (items disappear)
- ProjectFormSheet slides up from bottom

---

## 5. Delta from Current Web Implementation

### Matches:
- ✅ FAB rotation 225 degrees when menu open
- ✅ Menu has 4 items in correct order
- ✅ Disabled items at 0.4 opacity
- ✅ Only "Create Project" is tappable
- ✅ FAB disabled styling (black bg, #777 border/icon)
- ✅ Gradient overlay behind menu
- ✅ FAB position (36px right, 140px bottom)
- ✅ Menu item spacing (24px gap)
- ✅ Icon container size (48x48px)

### Mismatches:
| Issue | Category | Detail |
|-------|----------|--------|
| Stagger timing too fast | wrong behavior | Web: 150ms between items (450ms total). iOS: 200ms between items with 0.2-0.8s delays (1.1s total). Fix: use delays 200ms, 400ms, 600ms, 800ms |
| Label font weight wrong | wrong style | Web: `font-medium` (500). iOS: `bodyBold` weight 700. Fix: use `font-bold` (700) |
| FAB border in step 1 | wrong style | Web uses `#FFFFFF` border during jobBoardIntro. iOS uses `primaryAccent` (#59779F). Fix: use accent border for step 1 |
| Icon shadow missing | missing | iOS has shadow on icon container (black 0.15, radius 4, y: 2). Web has none |
