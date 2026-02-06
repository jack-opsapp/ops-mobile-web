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
  const showSummary = phase === 'tutorialSummary'
  const showCompleted = phase === 'completed'

  // Active tab for tab bar
  const activeTab = isCalendarPhase(phase) ? 'schedule' as const : 'jobs' as const
  const tabBarDimmed = isJobBoardAnimationPhase(phase) || showProjectForm

  // Handle phase completion
  if (showCompleted) {
    onComplete(elapsedSeconds)
    return null
  }

  // Handle FAB interactions
  const handleFABTap = () => {
    // jobBoardIntro → fabTap
    advance()
  }

  const handleCreateProject = () => {
    // fabTap → projectFormClient
    advance()
  }

  // Handle project form interactions
  const handleSelectClient = (name: string) => {
    setSelectedClient(name)
    // projectFormClient → projectFormName
    setTimeout(() => advance(), 300)
  }

  const handleProjectNameChange = (name: string) => {
    setProjectName(name)
    // Debounce: advance after user types something
    if (name.length >= 3) {
      setTimeout(() => {
        if (phase === 'projectFormName') advance()
      }, 800)
    }
  }

  const handleAddTask = () => {
    // projectFormAddTask → taskFormType
    advance()
  }

  const handleCreate = () => {
    // projectFormComplete → dragToAccepted
    advance()
  }

  // Handle task form interactions
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
    // taskFormDone → projectFormComplete
    advance()
  }

  // Handle calendar interactions
  const handleMonthTap = () => {
    // calendarMonthPrompt → calendarMonth
    advance()
  }

  // Continue button handler
  const handleContinue = () => {
    advance()
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-ops-background flex flex-col"
      style={{ touchAction: 'none' }}
    >
      {/* Layer 6: Tooltip (top, z-60) */}
      <div style={{ zIndex: 60, position: 'relative' }}>
        <CollapsibleTooltip
          title={phaseConfig.tooltipText}
          description={phaseConfig.tooltipDescription}
          phaseKey={phase}
        />
      </div>

      {/* Layer 1: Mock app content */}
      <div className="flex-1 relative overflow-hidden">
        {showJobBoard && (
          <MockJobBoard
            phase={phase}
            userProject={
              // Only show user project on job board after form is complete
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
            onMonthTap={handleMonthTap}
          />
        )}

        {showSummary && (
          <div className="flex-1 flex items-center justify-center px-6">
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

      {/* Layer 2: Blocking overlay (z-20) */}
      {showBlockingOverlay && (
        <div
          className="absolute inset-0 bg-black/60"
          style={{ zIndex: 20 }}
        />
      )}

      {/* Layer 3: FAB (z-30, above blocking overlay) */}
      {showFAB && (
        <MockFAB
          phase={phase}
          onFABTap={handleFABTap}
          onCreateProject={handleCreateProject}
        />
      )}

      {/* Layer 5: Form sheets (z-50+) */}
      {showProjectForm && (
        <MockProjectForm
          phase={phase}
          visible
          selectedClient={selectedClient}
          projectName={projectName}
          hasTask={hasTask}
          onSelectClient={handleSelectClient}
          onProjectNameChange={handleProjectNameChange}
          onAddTask={handleAddTask}
          onCreate={handleCreate}
        />
      )}

      {showTaskForm && (
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
      )}

      {/* Layer 7: Continue/Done button (z-70) */}
      <ContinueButton
        label={phaseConfig.continueLabel || 'CONTINUE'}
        onClick={handleContinue}
        visible={phaseConfig.showContinueButton}
      />

      {/* Tab bar (bottom, visual only) */}
      <MockTabBar activeTab={activeTab} dimmed={tabBarDimmed} />
    </div>
  )
}
