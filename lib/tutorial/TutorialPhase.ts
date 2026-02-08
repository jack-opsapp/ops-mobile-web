// Phase enum matching iOS TutorialPhase for Company Creator flow

export type TutorialPhase =
  | 'jobBoardIntro'
  | 'fabTap'
  | 'projectFormClient'
  | 'projectFormName'
  | 'projectFormAddTask'
  | 'taskFormType'
  | 'taskFormCrew'
  | 'taskFormDate'
  | 'taskFormDone'
  | 'projectFormComplete'
  | 'dragToAccepted'
  | 'projectListStatusDemo'
  | 'projectListSwipe'
  | 'closedProjectsScroll'
  | 'calendarWeek'
  | 'calendarMonthPrompt'
  | 'calendarMonth'
  | 'completed'

export interface PhaseConfig {
  tooltipText: string
  tooltipDescription: string
  showContinueButton: boolean
  continueLabel?: string
  autoAdvanceMs?: number // auto-advance after N ms
}

export const PHASE_ORDER: TutorialPhase[] = [
  'jobBoardIntro',
  'fabTap',
  'projectFormClient',
  'projectFormName',
  'projectFormAddTask',
  'taskFormType',
  'taskFormCrew',
  'taskFormDate',
  'taskFormDone',
  'projectFormComplete',
  'dragToAccepted',
  'projectListStatusDemo',
  'projectListSwipe',
  'closedProjectsScroll',
  'calendarWeek',
  'calendarMonthPrompt',
  'calendarMonth',
  'completed',
]

export const PHASE_CONFIGS: Record<TutorialPhase, PhaseConfig> = {
  jobBoardIntro: {
    tooltipText: 'TAP THE + BUTTON',
    tooltipDescription: 'This is where you create projects, tasks, clients, and more.',
    showContinueButton: false,
  },
  fabTap: {
    tooltipText: 'TAP "CREATE PROJECT"',
    tooltipDescription: 'This starts a new job.',
    showContinueButton: false,
  },
  projectFormClient: {
    tooltipText: 'SELECT A CLIENT',
    tooltipDescription: "These are sample clients. Pick any one—this is just for practice.",
    showContinueButton: false,
  },
  projectFormName: {
    tooltipText: 'ENTER A PROJECT NAME',
    tooltipDescription: 'Type anything. Try "Test Project" or make one up.',
    showContinueButton: false,
  },
  projectFormAddTask: {
    tooltipText: 'NOW ADD A TASK',
    tooltipDescription: 'Tasks are the individual pieces of work—like "Install outlets" or "Paint bedroom."',
    showContinueButton: false,
  },
  taskFormType: {
    tooltipText: 'SELECT A TASK TYPE',
    tooltipDescription: 'Pick any one for now. Types help you organize different kinds of work.',
    showContinueButton: false,
  },
  taskFormCrew: {
    tooltipText: 'ASSIGN A CREW MEMBER',
    tooltipDescription: 'These are sample crew members. People you assign will see this on their schedule.',
    showContinueButton: false,
  },
  taskFormDate: {
    tooltipText: 'SET THE DATE',
    tooltipDescription: 'Pick any date. This is when the task should be done.',
    showContinueButton: false,
  },
  taskFormDone: {
    tooltipText: 'TAP "DONE"',
    tooltipDescription: 'This saves the task to your project.',
    showContinueButton: false,
  },
  projectFormComplete: {
    tooltipText: 'TAP "CREATE"',
    tooltipDescription: 'Your project is ready. This saves it to your job board.',
    showContinueButton: false,
  },
  dragToAccepted: {
    tooltipText: 'DRAG RIGHT TO ACCEPTED',
    tooltipDescription: 'Drag it to the "Accepted" column. This is how you move jobs between stages.',
    showContinueButton: false,
    autoAdvanceMs: 3500,
  },
  projectListStatusDemo: {
    tooltipText: 'WATCH THE STATUS UPDATE',
    tooltipDescription: 'As your crew starts work and completes tasks, the status updates automatically...',
    showContinueButton: false,
    autoAdvanceMs: 6000,
  },
  projectListSwipe: {
    tooltipText: 'SWIPE THE CARD RIGHT TO CLOSE',
    tooltipDescription: 'Swipe right to advance status, left to go back...',
    showContinueButton: false,
  },
  closedProjectsScroll: {
    tooltipText: 'COMPLETE. SCROLL DOWN TO FIND IT.',
    tooltipDescription: 'Finished jobs move to the bottom so active work stays on top.',
    showContinueButton: false,
    autoAdvanceMs: 3000,
  },
  calendarWeek: {
    tooltipText: 'THIS IS YOUR WEEK VIEW',
    tooltipDescription: 'Your scheduled tasks appear by day. Swipe left or right to see other weeks.',
    showContinueButton: true,
    continueLabel: 'CONTINUE',
  },
  calendarMonthPrompt: {
    tooltipText: 'TAP "MONTH"',
    tooltipDescription: 'Switch to month view to see the bigger picture.',
    showContinueButton: false,
  },
  calendarMonth: {
    tooltipText: 'PINCH OUTWARD TO EXPAND',
    tooltipDescription: 'This shows more detail for each day. Pinch inward to shrink it back.',
    showContinueButton: true,
    continueLabel: 'DONE',
  },
  completed: {
    tooltipText: '',
    tooltipDescription: '',
    showContinueButton: false,
  },
}

// Helper to get next phase
export function getNextPhase(current: TutorialPhase): TutorialPhase | null {
  const idx = PHASE_ORDER.indexOf(current)
  if (idx === -1 || idx >= PHASE_ORDER.length - 1) return null
  return PHASE_ORDER[idx + 1]
}

// Which phases show the project form
export function isProjectFormPhase(phase: TutorialPhase): boolean {
  return [
    'projectFormClient',
    'projectFormName',
    'projectFormAddTask',
    'taskFormType',
    'taskFormCrew',
    'taskFormDate',
    'taskFormDone',
    'projectFormComplete',
  ].includes(phase)
}

// Which phases show the task form (overlaying project form)
export function isTaskFormPhase(phase: TutorialPhase): boolean {
  return [
    'taskFormType',
    'taskFormCrew',
    'taskFormDate',
    'taskFormDone',
  ].includes(phase)
}

// Which phases show the calendar view instead of job board
export function isCalendarPhase(phase: TutorialPhase): boolean {
  return [
    'calendarWeek',
    'calendarMonthPrompt',
    'calendarMonth',
  ].includes(phase)
}

// Which phases show the blocking overlay (before FAB is tapped)
export function isBlockingOverlayPhase(phase: TutorialPhase): boolean {
  return phase === 'jobBoardIntro'
}

// Which phases show the FAB
export function isFABVisiblePhase(phase: TutorialPhase): boolean {
  return phase === 'jobBoardIntro' || phase === 'fabTap'
}

// Which phases show animation demos on job board
export function isJobBoardAnimationPhase(phase: TutorialPhase): boolean {
  return [
    'dragToAccepted',
    'projectListStatusDemo',
    'projectListSwipe',
    'closedProjectsScroll',
  ].includes(phase)
}
