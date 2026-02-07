'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { DEMO_PROJECTS, type DemoProject } from '@/lib/constants/demo-data'
import { MockProjectCard } from './MockProjectCard'
import { TouchCursorAnimation } from './TouchCursorAnimation'
import type { TutorialPhase } from '@/lib/tutorial/TutorialPhase'

interface MockJobBoardProps {
  phase: TutorialPhase
  userProject: DemoProject | null
  onSwipeComplete?: () => void
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
]

// Phases that show the list (scrollable cards) view
const LIST_PHASES: TutorialPhase[] = [
  'projectListStatusDemo',
  'projectListSwipe',
  'closedProjectsScroll',
]

// =============================================================================
// SHARED HEADER COMPONENTS
// =============================================================================

type SectionTab = 'DASHBOARD' | 'CLIENTS' | 'PROJECTS' | 'TASKS'

function MockAppHeader() {
  return (
    <div className="px-4 pt-3 pb-1 flex items-center justify-between">
      <h2 className="font-mohave font-bold text-[20px] uppercase tracking-wider text-white">
        Job Board
      </h2>
      <div className="flex items-center gap-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-ops-text-secondary">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-ops-text-secondary">
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

function MockSectionSelector({ selected, animateToProjects }: { selected: SectionTab; animateToProjects?: boolean }) {
  const tabs: SectionTab[] = ['DASHBOARD', 'CLIENTS', 'PROJECTS', 'TASKS']
  const [activeTab, setActiveTab] = useState<SectionTab>(selected)

  useEffect(() => {
    if (animateToProjects) {
      const timer = setTimeout(() => {
        setActiveTab('PROJECTS')
      }, 600)
      return () => clearTimeout(timer)
    } else {
      setActiveTab(selected)
    }
  }, [selected, animateToProjects])

  return (
    <div className="px-4 pb-2">
      <div
        className="flex rounded-xl overflow-hidden"
        style={{ background: '#0D0D0D', padding: 3 }}
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab
          return (
            <div
              key={tab}
              className="flex-1 flex items-center justify-center transition-all duration-300"
              style={{
                padding: '7px 0',
                borderRadius: 10,
                background: isActive ? '#FFFFFF' : 'transparent',
              }}
            >
              <span
                className="font-mohave text-[11px] uppercase tracking-wider font-bold transition-colors duration-300"
                style={{
                  color: isActive ? '#0D0D0D' : '#777777',
                }}
              >
                {tab}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function MockJobBoard({ phase, userProject, onSwipeComplete }: MockJobBoardProps) {
  const isDashboardView = DASHBOARD_PHASES.includes(phase)
  const isListView = LIST_PHASES.includes(phase)

  // If neither dashboard nor list phase, default to dashboard
  const viewMode = isListView ? 'list' : 'dashboard'

  return (
    <div className="flex-1 overflow-hidden relative flex flex-col">
      {viewMode === 'dashboard' ? (
        <DashboardView phase={phase} userProject={userProject} />
      ) : (
        <ListView phase={phase} userProject={userProject} onSwipeComplete={onSwipeComplete} />
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
      {/* App Header */}
      <MockAppHeader />
      {/* Section Selector - DASHBOARD selected */}
      <MockSectionSelector selected="DASHBOARD" />

      {/* Paging container */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ paddingTop: 4 }}
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
  onSwipeComplete,
}: {
  phase: TutorialPhase
  userProject: DemoProject | null
  onSwipeComplete?: () => void
}) {
  const [scrollOffset, setScrollOffset] = useState(0)
  const activeSectionRef = useRef<HTMLDivElement>(null)
  const [measuredScrollTarget, setMeasuredScrollTarget] = useState(0)

  // Status animation for projectListStatusDemo
  const [animatingStatus, setAnimatingStatus] = useState<string | null>(null)
  const [showActiveOverlay, setShowActiveOverlay] = useState(false)

  // --- Interactive swipe state ---
  const swipeTouchStartX = useRef<number | null>(null)
  const [userSwipeOffset, setUserSwipeOffset] = useState(0)
  const [swipeDismissed, setSwipeDismissed] = useState(false)
  const [showClosedFeedback, setShowClosedFeedback] = useState(false)
  const swipeCompleted = useRef(false)

  // Hint animation: plays while user hasn't started swiping yet
  const [showHintAnimation, setShowHintAnimation] = useState(true)
  const [hintOffset, setHintOffset] = useState(0)

  // Swipe threshold for completion
  const SWIPE_THRESHOLD = 120

  // Build ordered project list
  const getOrderedProjects = useCallback((): {
    active: DemoProject[]
    closed: DemoProject[]
    userStatus: string
  } => {
    const active: DemoProject[] = []
    const closed: DemoProject[] = []
    let userStatus = 'inProgress'

    if (phase === 'projectListStatusDemo') {
      userStatus = animatingStatus || 'accepted'
    } else if (phase === 'projectListSwipe') {
      userStatus = 'inProgress'
    } else if (phase === 'closedProjectsScroll') {
      userStatus = 'closed'
    }

    DEMO_PROJECTS.forEach(p => {
      if (p.status === 'closed' || p.status === 'completed') {
        closed.push(p)
      } else {
        active.push(p)
      }
    })

    if (userProject) {
      const userP = { ...userProject, status: userStatus as DemoProject['status'] }
      if (userStatus === 'closed' || userStatus === 'completed') {
        closed.unshift(userP)
      } else {
        active.unshift(userP)
      }
    }

    return { active, closed, userStatus }
  }, [phase, userProject, animatingStatus])

  // Status demo animation: accepted -> inProgress -> completed
  useEffect(() => {
    if (phase !== 'projectListStatusDemo' || !userProject) return

    const steps = ['accepted', 'inProgress', 'completed']
    let stepIdx = 0
    setAnimatingStatus(steps[0])

    const interval = setInterval(() => {
      stepIdx++
      if (stepIdx < steps.length) {
        setAnimatingStatus(steps[stepIdx])
      }
    }, 1200)

    return () => clearInterval(interval)
  }, [phase, userProject])

  // Measure active section height for scroll target
  useEffect(() => {
    if (phase === 'closedProjectsScroll' && activeSectionRef.current) {
      const height = activeSectionRef.current.getBoundingClientRect().height
      setMeasuredScrollTarget(height + 20)
    }
  }, [phase])

  // Dark overlay on active cards during closedProjectsScroll
  useEffect(() => {
    if (phase === 'closedProjectsScroll') {
      // Show overlay 1.1s after phase starts (matches iOS 0.3s delay + 0.8s scroll)
      const timer = setTimeout(() => setShowActiveOverlay(true), 1100)
      return () => clearTimeout(timer)
    } else {
      setShowActiveOverlay(false)
    }
  }, [phase])

  // Hint swipe animation loop — shows a gentle swipe hint until user interacts
  useEffect(() => {
    if (phase !== 'projectListSwipe' || swipeDismissed) {
      setShowHintAnimation(false)
      setHintOffset(0)
      return
    }

    setShowHintAnimation(true)
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

      setHintOffset(eased * 80) // Subtle hint — only 80px

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      } else {
        setTimeout(() => {
          setHintOffset(0)
          start = null
          frame = requestAnimationFrame(animate)
        }, 1000)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [phase, swipeDismissed])

  // --- Touch handlers for the user's swipeable card ---
  const handleCardTouchStart = (e: React.TouchEvent) => {
    if (swipeDismissed || swipeCompleted.current) return
    swipeTouchStartX.current = e.touches[0].clientX
    // Stop the hint animation once user touches
    setShowHintAnimation(false)
    setHintOffset(0)
  }

  const handleCardTouchMove = (e: React.TouchEvent) => {
    if (swipeTouchStartX.current === null || swipeDismissed) return
    const diff = e.touches[0].clientX - swipeTouchStartX.current
    // Only allow right-swipe (positive), with resistance after threshold
    if (diff > 0) {
      const resisted = diff > SWIPE_THRESHOLD
        ? SWIPE_THRESHOLD + (diff - SWIPE_THRESHOLD) * 0.3
        : diff
      setUserSwipeOffset(resisted)
    } else {
      // Small leftward resistance
      setUserSwipeOffset(diff * 0.2)
    }
  }

  const handleCardTouchEnd = () => {
    if (swipeTouchStartX.current === null || swipeDismissed) return
    swipeTouchStartX.current = null

    if (userSwipeOffset >= SWIPE_THRESHOLD) {
      // Swipe succeeded — animate card off screen
      swipeCompleted.current = true
      setSwipeDismissed(true)
      setUserSwipeOffset(400) // Fly off right

      // Show "CLOSED" feedback briefly, then advance
      setTimeout(() => {
        setShowClosedFeedback(true)
      }, 200)
      setTimeout(() => {
        onSwipeComplete?.()
      }, 1200)
    } else {
      // Snap back
      setUserSwipeOffset(0)
    }
  }

  // Scroll animation for closedProjectsScroll phase
  useEffect(() => {
    if (phase !== 'closedProjectsScroll') {
      setScrollOffset(0)
      return
    }

    if (measuredScrollTarget === 0) return

    let frame: number
    let start: number | null = null
    const duration = 800
    const target = measuredScrollTarget

    function animate(timestamp: number) {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setScrollOffset(eased * target)

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(animate)
    }, 300)

    return () => {
      clearTimeout(timeout)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [phase, measuredScrollTarget])

  const { active, closed, userStatus } = getOrderedProjects()

  // Calculate the visual offset for the user card
  const getUserCardOffset = () => {
    if (swipeDismissed) return userSwipeOffset
    if (userSwipeOffset !== 0) return userSwipeOffset
    if (showHintAnimation) return hintOffset
    return 0
  }

  const cardOffset = getUserCardOffset()
  // Swipe progress for visual feedback (0 to 1)
  const swipeProgress = Math.min(Math.max(cardOffset, 0) / SWIPE_THRESHOLD, 1)

  return (
    <>
      {/* App Header */}
      <MockAppHeader />
      <MockSectionSelector
        selected="PROJECTS"
        animateToProjects={phase === 'projectListStatusDemo' || phase === 'projectListSwipe'}
      />

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
          <div className="mb-3 relative" ref={activeSectionRef} style={{
            opacity: showActiveOverlay ? 0.3 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}>
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

                if (isUserCard && phase === 'projectListStatusDemo') {
                  // Status animation card - highlighted with animating status
                  return (
                    <div key={project.id}>
                      <MockProjectCard
                        project={project}
                        variant="list"
                        isHighlighted={true}
                        statusOverride={animatingStatus || userStatus}
                      />
                    </div>
                  )
                }

                if (isUserCard && phase === 'projectListSwipe') {
                  // Swipeable user card with background action revealed
                  return (
                    <div key={project.id} className="relative overflow-hidden" style={{ borderRadius: 5 }}>
                      {/* Background revealed on swipe — green "CLOSED" indicator */}
                      <div
                        className="absolute inset-0 flex items-center rounded-[5px]"
                        style={{
                          background: `rgba(165, 179, 104, ${swipeProgress * 0.3})`,
                          paddingLeft: 16,
                        }}
                      >
                        <div className="flex items-center gap-2" style={{ opacity: swipeProgress }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17l-5-5" stroke="#A5B368" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span
                            className="font-mohave font-bold uppercase tracking-wider"
                            style={{ fontSize: 13, color: '#A5B368' }}
                          >
                            Close
                          </span>
                        </div>
                      </div>

                      {/* Swipeable card */}
                      <div
                        onTouchStart={handleCardTouchStart}
                        onTouchMove={handleCardTouchMove}
                        onTouchEnd={handleCardTouchEnd}
                        style={{
                          transform: `translateX(${cardOffset}px)`,
                          opacity: swipeDismissed ? Math.max(1 - cardOffset / 300, 0) : 1,
                          transition: swipeTouchStartX.current !== null
                            ? 'none'
                            : swipeDismissed
                              ? 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease-out'
                              : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        <MockProjectCard
                          project={project}
                          variant="list"
                          isHighlighted={!swipeDismissed}
                          showShimmer={!swipeDismissed}
                          statusOverride={userStatus}
                        />
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={project.id} style={{
                    opacity: phase === 'projectListStatusDemo' ? 0.3 : 1,
                    transition: 'opacity 0.3s ease',
                  }}>
                    <MockProjectCard
                      project={project}
                      variant="list"
                      isHighlighted={false}
                      statusOverride={undefined}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* "CLOSED" feedback toast after swipe completes */}
        {showClosedFeedback && (
          <div
            className="flex items-center justify-center gap-2 py-3 mb-3 rounded-xl"
            style={{
              background: 'rgba(165, 179, 104, 0.15)',
              border: '1px solid rgba(165, 179, 104, 0.3)',
              animation: 'feedbackFadeIn 0.3s ease-out',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#A5B368" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-mohave font-bold uppercase tracking-wider" style={{ fontSize: 14, color: '#A5B368' }}>
              Project Closed
            </span>
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

        <div style={{ height: 120 }} />
      </div>

      {/* Touch cursor hint — only while hint animation is playing */}
      {phase === 'projectListSwipe' && userProject && showHintAnimation && !swipeDismissed && (
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

      {/* Feedback animation keyframes */}
      <style jsx>{`
        @keyframes feedbackFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  )
}
