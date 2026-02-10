# Tutorial Step Audit — iOS vs Web

## Procedure
Each step is reviewed by tracing from the root `TutorialCreatorFlowWrapper` down through every visible layer, documenting exact styles, interactions, and animations. Findings are written to individual step files.

## Steps

| # | Phase | Tooltip | Review File | Status |
|---|-------|---------|-------------|--------|
| 1 | jobBoardIntro | TAP THE + BUTTON | docs/audit/step-01-jobBoardIntro.md | **reviewed** |
| 2 | fabTap | TAP "CREATE PROJECT" | docs/audit/step-02-fabTap.md | **reviewed** |
| 3 | projectFormClient | SELECT A CLIENT | docs/audit/step-03-projectFormClient.md | **reviewed** |
| 4 | projectFormName | ENTER A PROJECT NAME | docs/audit/step-04-projectFormName.md | **reviewed** |
| 5 | projectFormAddTask | NOW ADD A TASK | docs/audit/step-05-projectFormAddTask.md | **reviewed** |
| 6 | taskFormType | SELECT A TASK TYPE | docs/audit/step-06-taskFormType.md | **reviewed + fixed** |
| 7 | taskFormCrew | ASSIGN A CREW MEMBER | docs/audit/step-07-taskFormCrew.md | **reviewed + fixed** |
| 8 | taskFormDate | SET THE DATE | docs/audit/step-08-taskFormDate.md | **reviewed + fixed** |
| 9 | taskFormDone | TAP "DONE" | docs/audit/step-09-taskFormDone.md | **reviewed + fixed** |
| 10 | projectFormComplete | TAP "CREATE" | docs/audit/step-10-projectFormComplete.md | **reviewed + fixed** |
| 11 | dragToAccepted | PRESS AND HOLD, THEN DRAG RIGHT | docs/audit/step-11-dragToAccepted.md | **reviewed + fixed** |
| 12 | projectListStatusDemo | WATCH THE STATUS UPDATE | docs/audit/step-12-projectListStatusDemo.md | **reviewed + fixed** |
| 13 | projectListSwipe | SWIPE THE CARD RIGHT TO CLOSE | docs/audit/step-13-projectListSwipe.md | **reviewed + fixed** |
| 14 | closedProjectsScroll | COMPLETE. SCROLL DOWN TO FIND IT. | docs/audit/step-14-closedProjectsScroll.md | **reviewed + fixed** |
| 15 | calendarWeek | THIS IS YOUR WEEK VIEW | docs/audit/step-15-calendarWeek.md | **reviewed + fixed** |
| 16 | calendarMonthPrompt | TAP "MONTH" | docs/audit/step-16-calendarMonthPrompt.md | **reviewed + fixed** |
| 17 | calendarMonth | PINCH OUTWARD TO EXPAND | docs/audit/step-17-calendarMonth.md | **reviewed + fixed** |
| 18 | tutorialSummary | THAT'S THE BASICS. | docs/audit/step-18-tutorialSummary.md | **reviewed** |
| 19 | completed | (none) | docs/audit/step-19-completed.md | **reviewed** |
