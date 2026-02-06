'use client'

import { useEffect, useState, useRef } from 'react'
import { DEMO_PROJECTS, type DemoProject } from '@/lib/constants/demo-data'
import { MockProjectCard } from './MockProjectCard'
import { TouchCursorAnimation } from './TouchCursorAnimation'
import type { TutorialPhase } from '@/lib/tutorial/TutorialPhase'

interface MockJobBoardProps {
  phase: TutorialPhase
  userProject: DemoProject | null // The project created by user during tutorial
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
  accepted: '#C4A868',
  inProgress: '#A5B368',
  completed: '#4A8B6E',
  closed: '#777777',
}

export function MockJobBoard({ phase, userProject }: MockJobBoardProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [animatingProject, setAnimatingProject] = useState<{
    project: DemoProject
    fromStatus: StatusColumn
    toStatus: StatusColumn
  } | null>(null)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [showSwipeAnimation, setShowSwipeAnimation] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const userCardRef = useRef<HTMLDivElement>(null)

  // Group projects by status
  const projectsByStatus = (): Record<StatusColumn, DemoProject[]> => {
    const groups: Record<StatusColumn, DemoProject[]> = {
      new: [],
      accepted: [],
      inProgress: [],
      completed: [],
      closed: [],
    }

    // Add demo projects
    DEMO_PROJECTS.forEach(p => {
      groups[p.status].push(p)
    })

    // Add user project in correct column based on phase
    if (userProject) {
      if (phase === 'dragToAccepted') {
        groups.new.unshift(userProject)
      } else if (phase === 'projectListStatusDemo') {
        // Animate through statuses
        if (animatingProject) {
          groups[animatingProject.toStatus].unshift(animatingProject.project)
        } else {
          groups.accepted.unshift(userProject)
        }
      } else if (phase === 'projectListSwipe') {
        if (!showSwipeAnimation) {
          groups.inProgress.unshift(userProject)
        }
      } else if (phase === 'closedProjectsScroll') {
        groups.closed.unshift(userProject)
      } else {
        // After form complete, show in new
        groups.new.unshift(userProject)
      }
    }

    return groups
  }

  // Status demo animation: accepted → inProgress → completed
  useEffect(() => {
    if (phase !== 'projectListStatusDemo' || !userProject) return

    const steps: StatusColumn[] = ['accepted', 'inProgress', 'completed']
    let stepIdx = 0

    const interval = setInterval(() => {
      stepIdx++
      if (stepIdx < steps.length) {
        setAnimatingProject({
          project: userProject,
          fromStatus: steps[stepIdx - 1],
          toStatus: steps[stepIdx],
        })
      }
    }, 1200)

    // Start with accepted
    setAnimatingProject({
      project: userProject,
      fromStatus: 'new',
      toStatus: 'accepted',
    })

    return () => clearInterval(interval)
  }, [phase, userProject])

  // Swipe animation
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
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      setSwipeOffset(eased * 200)

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      } else {
        // Reset and loop
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

  // Scroll animation for closed projects
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

    // Delay start
    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(animate)
    }, 500)

    return () => {
      clearTimeout(timeout)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [phase])

  const groups = projectsByStatus()
  const columns: StatusColumn[] = ['new', 'accepted', 'inProgress', 'completed', 'closed']

  return (
    <div className="flex-1 overflow-hidden relative">
      {/* Header */}
      <div className="px-3 py-2 flex items-center justify-between">
        <h2 className="font-mohave font-bold text-[18px] text-white">Job Board</h2>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-kosugi text-ops-text-tertiary">
            {DEMO_PROJECTS.length + (userProject ? 1 : 0)} projects
          </span>
        </div>
      </div>

      {/* Horizontal scrolling columns */}
      <div
        ref={scrollRef}
        className="flex gap-3 px-3 pb-3 overflow-x-auto"
        style={{
          transform: `translateY(-${scrollOffset}px)`,
          transition: 'transform 0.1s linear',
          height: 'calc(100% - 44px)',
        }}
      >
        {columns.map(status => (
          <div key={status} className="flex-shrink-0" style={{ width: 170 }}>
            {/* Column header */}
            <div className="flex items-center gap-1.5 mb-2 px-1">
              <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[status] }} />
              <span className="font-mohave font-semibold text-[12px] text-ops-text-secondary uppercase tracking-wider">
                {STATUS_LABELS[status]}
              </span>
              <span className="text-[10px] font-kosugi text-ops-text-tertiary ml-auto">
                {groups[status].length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              {groups[status].map(project => {
                const isUserCard = userProject && project.id === userProject.id
                const swipeStyle = isUserCard && phase === 'projectListSwipe'
                  ? { transform: `translateX(${swipeOffset}px)`, opacity: 1 - swipeOffset / 250 }
                  : undefined

                return (
                  <div
                    key={project.id}
                    ref={isUserCard ? userCardRef : undefined}
                    style={swipeStyle}
                  >
                    <MockProjectCard
                      project={project}
                      compact
                      highlighted={!!isUserCard}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Touch cursor for drag animation */}
      {phase === 'dragToAccepted' && userProject && (
        <TouchCursorAnimation
          type="drag-right"
          startX={30}
          startY={100}
          visible
        />
      )}
    </div>
  )
}
