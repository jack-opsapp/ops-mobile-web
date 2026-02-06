'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { DEMO_PROJECTS, type DemoProject } from '@/lib/constants/demo-data'
import { MockProjectCard } from './MockProjectCard'
import { TouchCursorAnimation } from './TouchCursorAnimation'
import type { TutorialPhase } from '@/lib/tutorial/TutorialPhase'

interface MockJobBoardProps {
  phase: TutorialPhase
  userProject: DemoProject | null
}

type StatusColumn = 'new' | 'accepted' | 'inProgress' | 'completed' | 'closed'

const STATUS_LABELS: Record<StatusColumn, string> = {
  new: 'New',
  accepted: 'Accepted',
  inProgress: 'In Progress',
  completed: 'Completed',
  closed: 'Closed',
}

const STATUS_COLORS: Record<StatusColumn, string> = {
  new: '#59779F',
  accepted: '#A5B368',
  inProgress: '#59779F',
  completed: '#A5B368',
  closed: '#777777',
}

// Phases that show the dashboard (paging columns) view
const DASHBOARD_PHASES: TutorialPhase[] = [
  'jobBoardIntro',
  'fabTap',
  'dragToAccepted',
  'projectListStatusDemo',
]

// Phases that show the list (scrollable cards) view
const LIST_PHASES: TutorialPhase[] = [
  'projectListSwipe',
  'closedProjectsScroll',
]

export function MockJobBoard({ phase, userProject }: MockJobBoardProps) {
  const isDashboardView = DASHBOARD_PHASES.includes(phase)
  const isListView = LIST_PHASES.includes(phase)

  // If neither dashboard nor list phase, default to dashboard
  const viewMode = isListView ? 'list' : 'dashboard'

  return (
    <div className="flex-1 overflow-hidden relative flex flex-col">
      {viewMode === 'dashboard' ? (
        <DashboardView phase={phase} userProject={userProject} />
      ) : (
        <ListView phase={phase} userProject={userProject} />
      )}
    </div>
  )
}

// =============================================================================
// DASHBOARD VIEW - Horizontal paging columns (like iOS TabView)
// =============================================================================

function DashboardView({
  phase,
  userProject,
}: {
  phase: TutorialPhase
  userProject: DemoProject | null
}) {
  const columns: StatusColumn[] = ['new', 'accepted', 'inProgress', 'completed', 'closed']
  const [currentPage, setCurrentPage] = useState(0)
  const [animatingStatus, setAnimatingStatus] = useState<StatusColumn | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartOffset = useRef<number>(0)

  // Group projects by status
  const getProjectsByStatus = useCallback((): Record<StatusColumn, DemoProject[]> => {
    const groups: Record<StatusColumn, DemoProject[]> = {
      new: [],
      accepted: [],
      inProgress: [],
      completed: [],
      closed: [],
    }

    DEMO_PROJECTS.forEach(p => {
      groups[p.status].push(p)
    })

    if (userProject) {
      if (phase === 'dragToAccepted') {
        groups.new.unshift(userProject)
      } else if (phase === 'projectListStatusDemo') {
        const targetStatus = animatingStatus || 'accepted'
        groups[targetStatus].unshift(userProject)
      } else {
        groups.new.unshift(userProject)
      }
    }

    return groups
  }, [phase, userProject, animatingStatus])

  // Status demo animation: accepted -> inProgress -> completed
  useEffect(() => {
    if (phase !== 'projectListStatusDemo' || !userProject) return

    const steps: StatusColumn[] = ['accepted', 'inProgress', 'completed']
    let stepIdx = 0
    setAnimatingStatus(steps[0])

    const interval = setInterval(() => {
      stepIdx++
      if (stepIdx < steps.length) {
        setAnimatingStatus(steps[stepIdx])
        // Auto-scroll to the relevant column
        const colIndex = columns.indexOf(steps[stepIdx])
        if (colIndex >= 0) setCurrentPage(colIndex)
      }
    }, 1200)

    // Start on accepted column
    const acceptedIdx = columns.indexOf('accepted')
    if (acceptedIdx >= 0) setCurrentPage(acceptedIdx)

    return () => clearInterval(interval)
  }, [phase, userProject])

  // Navigate to the "new" column for dragToAccepted
  useEffect(() => {
    if (phase === 'dragToAccepted') {
      const newIdx = columns.indexOf('new')
      if (newIdx >= 0) setCurrentPage(newIdx)
    }
  }, [phase])

  // Simple swipe handling for page navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartOffset.current = currentPage
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = e.changedTouches[0].clientX - touchStartX.current
    const threshold = 50
    if (diff < -threshold && currentPage < columns.length - 1) {
      setCurrentPage(prev => prev + 1)
    } else if (diff > threshold && currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    }
    touchStartX.current = null
  }

  const groups = getProjectsByStatus()

  return (
    <>
      {/* Paging container */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ paddingTop: 12 }}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${currentPage * 100}%)`,
            width: `${columns.length * 100}%`,
          }}
        >
          {columns.map((status, colIndex) => {
            const colProjects = groups[status]
            return (
              <div
                key={status}
                className="relative flex flex-col"
                style={{
                  width: `${100 / columns.length}%`,
                  flexShrink: 0,
                  paddingLeft: 6,
                  paddingRight: 6,
                }}
              >
                {/* Left + right 1px separator borders */}
                <div
                  className="absolute top-0 bottom-0 left-1"
                  style={{ width: 1, background: 'rgba(255,255,255,0.15)' }}
                />
                <div
                  className="absolute top-0 bottom-0 right-1"
                  style={{ width: 1, background: 'rgba(255,255,255,0.15)' }}
                />

                {/* Column header matching iOS StatusColumn header */}
                <div className="flex items-center px-3" style={{ gap: 8, paddingTop: 14, paddingBottom: 14 }}>
                  {/* Colored 2px bar */}
                  <div
                    style={{
                      width: 2,
                      height: 12,
                      background: STATUS_COLORS[status],
                      flexShrink: 0,
                    }}
                  />

                  {/* Status name - captionBold, primaryText */}
                  <span
                    className="font-kosugi text-white uppercase tracking-wider"
                    style={{ fontSize: 12, fontWeight: 700 }}
                  >
                    {STATUS_LABELS[status]}
                  </span>

                  {/* Separator line */}
                  <div className="flex-1" style={{ height: 1, background: 'rgba(255,255,255,0.15)' }} />

                  {/* Count in brackets - caption, secondaryText */}
                  <span className="font-kosugi text-ops-text-secondary" style={{ fontSize: 12 }}>
                    [ {colProjects.length} ]
                  </span>
                </div>

                {/* Project cards list */}
                <div
                  className="flex-1 overflow-y-auto px-3 pb-28"
                  style={{ gap: 10, display: 'flex', flexDirection: 'column' }}
                >
                  {colProjects.map(project => {
                    const isUserCard = userProject && project.id === userProject.id
                    return (
                      <MockProjectCard
                        key={project.id}
                        project={project}
                        variant="dashboard"
                        isHighlighted={!!isUserCard && phase === 'dragToAccepted'}
                        statusOverride={
                          isUserCard && animatingStatus ? animatingStatus : undefined
                        }
                      />
                    )
                  })}

                  {colProjects.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-ops-text-tertiary">
                        <path
                          d="M3 7v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M21 7H3l2-4h14l2 4z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="font-kosugi text-ops-text-tertiary" style={{ fontSize: 12 }}>
                        No Projects
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Page indicator - small rectangles matching iOS (20x2) */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center" style={{ gap: 6, zIndex: 10 }}>
        {columns.map((status, idx) => (
          <div
            key={status}
            style={{
              width: 20,
              height: 2,
              borderRadius: 1,
              background: currentPage === idx ? STATUS_COLORS[status] : 'rgba(255,255,255,0.2)',
              transition: 'background 0.2s ease',
            }}
          />
        ))}
      </div>

      {/* Touch cursor for drag animation hint */}
      {phase === 'dragToAccepted' && userProject && (
        <TouchCursorAnimation
          type="drag-right"
          startX={30}
          startY={100}
          visible
        />
      )}
    </>
  )
}

// =============================================================================
// LIST VIEW - Vertical scrollable cards (like iOS project list with swipeable cards)
// =============================================================================

function ListView({
  phase,
  userProject,
}: {
  phase: TutorialPhase
  userProject: DemoProject | null
}) {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [showSwipeAnimation, setShowSwipeAnimation] = useState(false)

  // Build ordered project list:
  // Active statuses on top, closed/completed at bottom
  const getOrderedProjects = useCallback((): {
    active: DemoProject[]
    closed: DemoProject[]
    userStatus: string
  } => {
    const active: DemoProject[] = []
    const closed: DemoProject[] = []
    let userStatus = 'inProgress'

    // Determine user project status based on phase
    if (phase === 'projectListSwipe') {
      userStatus = 'inProgress'
    } else if (phase === 'closedProjectsScroll') {
      userStatus = 'closed'
    }

    // Sort demo projects into active vs closed
    DEMO_PROJECTS.forEach(p => {
      if (p.status === 'closed' || p.status === 'completed') {
        closed.push(p)
      } else {
        active.push(p)
      }
    })

    // Insert user project
    if (userProject) {
      const userP = { ...userProject, status: userStatus as DemoProject['status'] }
      if (userStatus === 'closed' || userStatus === 'completed') {
        closed.unshift(userP)
      } else {
        active.unshift(userP)
      }
    }

    return { active, closed, userStatus }
  }, [phase, userProject])

  // Swipe animation loop for projectListSwipe phase
  useEffect(() => {
    if (phase !== 'projectListSwipe') {
      setShowSwipeAnimation(false)
      setSwipeOffset(0)
      return
    }

    setShowSwipeAnimation(true)
    let frame: number
    let start: number | null = null
    const duration = 1500

    function animate(timestamp: number) {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2

      setSwipeOffset(eased * 200)

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      } else {
        setTimeout(() => {
          setSwipeOffset(0)
          start = null
          frame = requestAnimationFrame(animate)
        }, 800)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [phase])

  // Scroll animation for closedProjectsScroll phase
  useEffect(() => {
    if (phase !== 'closedProjectsScroll') {
      setScrollOffset(0)
      return
    }

    let frame: number
    let start: number | null = null
    const duration = 2000

    function animate(timestamp: number) {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setScrollOffset(eased * 120)

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(animate)
    }, 500)

    return () => {
      clearTimeout(timeout)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [phase])

  const { active, closed, userStatus } = getOrderedProjects()
  const allProjects = [...active, ...closed]

  return (
    <>
      {/* List header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <h2 className="font-mohave font-bold text-white" style={{ fontSize: 18 }}>
          Job Board
        </h2>
        <span className="font-kosugi text-ops-text-tertiary" style={{ fontSize: 11 }}>
          {allProjects.length} projects
        </span>
      </div>

      {/* Scrollable project list */}
      <div
        className="flex-1 overflow-y-auto px-4"
        style={{
          transform: `translateY(-${scrollOffset}px)`,
          transition: 'transform 0.1s linear',
        }}
      >
        {/* Active section */}
        {active.length > 0 && (
          <div className="mb-3">
            {/* Section label */}
            <div className="flex items-center mb-2" style={{ gap: 8 }}>
              <span
                className="font-kosugi text-ops-text-secondary uppercase tracking-wider"
                style={{ fontSize: 11, fontWeight: 700 }}
              >
                Active
              </span>
              <div className="flex-1" style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />
              <span className="font-kosugi text-ops-text-tertiary" style={{ fontSize: 11 }}>
                {active.length}
              </span>
            </div>

            <div className="flex flex-col" style={{ gap: 8 }}>
              {active.map(project => {
                const isUserCard = userProject && project.id === userProject.id
                const swipeStyle =
                  isUserCard && phase === 'projectListSwipe' && showSwipeAnimation
                    ? {
                        transform: `translateX(${swipeOffset}px)`,
                        opacity: 1 - swipeOffset / 250,
                        transition: 'none',
                      }
                    : undefined

                return (
                  <div key={project.id} style={swipeStyle}>
                    <MockProjectCard
                      project={project}
                      variant="list"
                      isHighlighted={!!isUserCard && phase === 'projectListSwipe'}
                      statusOverride={isUserCard ? userStatus : undefined}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Closed/completed section */}
        {closed.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center mb-2" style={{ gap: 8 }}>
              <span
                className="font-kosugi text-ops-text-secondary uppercase tracking-wider"
                style={{ fontSize: 11, fontWeight: 700 }}
              >
                Closed
              </span>
              <div className="flex-1" style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />
              <span className="font-kosugi text-ops-text-tertiary" style={{ fontSize: 11 }}>
                {closed.length}
              </span>
            </div>

            <div className="flex flex-col" style={{ gap: 8 }}>
              {closed.map(project => {
                const isUserCard = userProject && project.id === userProject.id
                return (
                  <MockProjectCard
                    key={project.id}
                    project={project}
                    variant="list"
                    isHighlighted={!!isUserCard && phase === 'closedProjectsScroll'}
                    statusOverride={isUserCard ? 'closed' : undefined}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Bottom padding for tab bar clearance */}
        <div style={{ height: 120 }} />
      </div>

      {/* Touch cursor for swipe animation hint */}
      {phase === 'projectListSwipe' && userProject && (
        <TouchCursorAnimation
          type="swipe-right"
          startX={30}
          startY={80}
          visible
        />
      )}

      {/* Touch cursor for scroll animation hint */}
      {phase === 'closedProjectsScroll' && (
        <TouchCursorAnimation
          type="scroll-down"
          startX={180}
          startY={120}
          visible
        />
      )}
    </>
  )
}
