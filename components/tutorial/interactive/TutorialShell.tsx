'use client'

import { useMemo } from 'react'
import { useTutorial } from '@/lib/tutorial/TutorialContext'
import {
  isProjectFormPhase,
  isTaskFormPhase,
  isCalendarPhase,
  isBlockingOverlayPhase,
  isFABVisiblePhase,
  isJobBoardAnimationPhase,
} from '@/lib/tutorial/TutorialPhase'
import type { DemoProject } from '@/lib/constants/demo-data'
import { DEMO_TASK_TYPES } from '@/lib/constants/demo-data'

import { MockJobBoard } from './MockJobBoard'
import { MockCalendar } from './MockCalendar'
import { MockFAB } from './MockFAB'
import { MockProjectForm } from './MockProjectForm'
import { MockTaskForm } from './MockTaskForm'
import { MockTabBar } from './MockTabBar'
import { CollapsibleTooltip } from './CollapsibleTooltip'
import { ContinueButton } from './ContinueButton'

interface TutorialShellProps {
  onComplete: (elapsedSeconds: number) => void
}

export function TutorialShell({ onComplete }: TutorialShellProps) {
  const tutorial = useTutorial()
  const {
    phase,
    phaseConfig,
    advance,
    selectedClient,
    projectName,
    selectedTaskType,
    selectedCrew,
    selectedDate,
    setSelectedClient,
    setProjectName,
    setSelectedTaskType,
    setSelectedCrew,
    setSelectedDate,
    elapsedSeconds,
  } = tutorial

  // Build the user's project from selections
  const userProject: DemoProject | null = useMemo(() => {
    if (!selectedClient && !projectName) return null
    return {
      id: 'user-project',
      name: projectName || 'New Project',
      clientName: selectedClient || 'Client',
      status: 'new' as const,
      taskType: selectedTaskType || 'General',
      taskTypeColor: '#59779F',
      crew: selectedCrew || undefined,
    }
  }, [selectedClient, projectName, selectedTaskType, selectedCrew])

  // Determine visibility of each layer
  const showJobBoard = !isCalendarPhase(phase) && phase !== 'tutorialSummary' && phase !== 'completed'
  const showCalendar = isCalendarPhase(phase)
  const showBlockingOverlay = isBlockingOverlayPhase(phase)
  const showFAB = isFABVisiblePhase(phase)
  const showProjectForm = isProjectFormPhase(phase)
  const showTaskForm = isTaskFormPhase(phase)
  const hasTask = !!selectedTaskType && !!selectedCrew && !!selectedDate

  // Build the added task object for project form display
  const addedTask = hasTask ? {
    type: selectedTaskType!,
    typeColor: DEMO_TASK_TYPES.find(t => t.name === selectedTaskType)?.color || '#59779F',
    crew: selectedCrew!,
    date: selectedDate!,
  } : null

  const showSummary = phase === 'tutorialSummary'
  const showCompleted = phase === 'completed'

  // Active tab for tab bar
  const activeTab = isCalendarPhase(phase) ? 'schedule' as const : 'jobs' as const

  // Dim content behind forms
  const contentDimmed = showProjectForm || showTaskForm

  // Handle phase completion
  if (showCompleted) {
    onComplete(elapsedSeconds)
    return null
  }

  // --- Interaction handlers ---

  const handleFABTap = () => {
    // jobBoardIntro -> fabTap
    advance()
  }

  const handleCreateProject = () => {
    // fabTap -> projectFormClient
    advance()
  }

  const handleSelectClient = (name: string) => {
    setSelectedClient(name)
    // projectFormClient -> projectFormName
    setTimeout(() => advance(), 300)
  }

  const handleProjectNameChange = (name: string) => {
    setProjectName(name)
    // Debounce: advance after user types 3+ chars
    if (name.length >= 3) {
      setTimeout(() => {
        if (phase === 'projectFormName') advance()
      }, 800)
    }
  }

  const handleAddTask = () => {
    // projectFormAddTask -> taskFormType
    advance()
  }

  const handleCreate = () => {
    // projectFormComplete -> dragToAccepted
    advance()
  }

  const handleSelectType = (type: string) => {
    setSelectedTaskType(type)
    setTimeout(() => advance(), 300)
  }

  const handleSelectCrew = (crew: string) => {
    setSelectedCrew(crew)
    setTimeout(() => advance(), 300)
  }

  const handleSelectDate = (date: string) => {
    setSelectedDate(date)
    setTimeout(() => advance(), 300)
  }

  const handleTaskDone = () => {
    // taskFormDone -> projectFormComplete
    advance()
  }

  const handleMonthTap = () => {
    // calendarMonthPrompt -> calendarMonth
    advance()
  }

  const handleContinue = () => {
    advance()
  }

  // Determine continue/done button variant
  const continueVariant = phase === 'tutorialSummary' ? 'fullWidth' as const : 'inline' as const

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-ops-background"
      style={{ touchAction: 'none' }}
    >
      {/* Layer 1: Mock app content (z-0) */}
      <div
        className="absolute inset-0 flex flex-col transition-opacity duration-300"
        style={{ zIndex: 0, opacity: contentDimmed ? 0.3 : 1 }}
      >
        {/* Content fills space above tab bar */}
        <div className="flex-1 overflow-hidden">
          {showJobBoard && (
            <MockJobBoard
              phase={phase}
              userProject={
                phase === 'dragToAccepted' ||
                phase === 'projectListStatusDemo' ||
                phase === 'projectListSwipe' ||
                phase === 'closedProjectsScroll'
                  ? userProject
                  : null
              }
            />
          )}

          {showCalendar && (
            <MockCalendar
              phase={phase}
              viewMode={phase === 'calendarMonth' ? 'month' : 'week'}
              onToggleMonth={handleMonthTap}
              userProject={
                userProject
                  ? {
                      name: userProject.name,
                      clientName: userProject.clientName,
                      taskType: userProject.taskType,
                      taskTypeColor: userProject.taskTypeColor,
                      date: selectedDate || 'Today',
                    }
                  : undefined
              }
            />
          )}

          {showSummary && (
            <div className="flex-1 flex items-center justify-center px-6 h-full">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-ops-accent/10 border border-ops-accent/30 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-ops-accent">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Layer 2: Tab bar (z-10) - always visible at bottom */}
      <div className="absolute bottom-0 left-0 right-0" style={{ zIndex: 10 }}>
        <MockTabBar activeTab={activeTab} />
      </div>

      {/* Layer 3: Blocking overlay (z-20) - only during jobBoardIntro */}
      {showBlockingOverlay && (
        <div
          className="absolute inset-0 bg-black/60 transition-opacity duration-300"
          style={{ zIndex: 20 }}
        />
      )}

      {/* Layer 4: FAB (z-30, above blocking overlay) */}
      {showFAB && (
        <div style={{ zIndex: 30 }}>
          <MockFAB
            phase={phase}
            onFABTap={handleFABTap}
            onCreateProject={handleCreateProject}
          />
        </div>
      )}

      {/* Layer 5: Form sheets (z-40) - slide up from bottom */}
      {showProjectForm && (
        <div
          className="absolute inset-0"
          style={{ zIndex: 40 }}
        >
          <MockProjectForm
            phase={phase}
            isVisible
            selectedClient={selectedClient}
            projectName={projectName}
            addedTask={addedTask}
            onSelectClient={handleSelectClient}
            onChangeProjectName={handleProjectNameChange}
            onAddTask={handleAddTask}
            onCreate={handleCreate}
          />
        </div>
      )}

      {showTaskForm && (
        <div
          className="absolute inset-0"
          style={{ zIndex: 45 }}
        >
          <MockTaskForm
            phase={phase}
            visible
            selectedType={selectedTaskType}
            selectedCrew={selectedCrew}
            selectedDate={selectedDate}
            onSelectType={handleSelectType}
            onSelectCrew={handleSelectCrew}
            onSelectDate={handleSelectDate}
            onDone={handleTaskDone}
          />
        </div>
      )}

      {/* Layer 6: Tooltip (z-50, always on top of content) */}
      <div className="absolute top-0 left-0 right-0" style={{ zIndex: 50 }}>
        <CollapsibleTooltip
          text={phaseConfig.tooltipText}
          description={phaseConfig.tooltipDescription}
          phase={phase}
        />
      </div>

      {/* Layer 7: Continue/Done button (z-60) */}
      {phaseConfig.showContinueButton && (
        <ContinueButton
          label={phaseConfig.continueLabel || 'CONTINUE'}
          onClick={handleContinue}
          variant={continueVariant}
        />
      )}
    </div>
  )
}
