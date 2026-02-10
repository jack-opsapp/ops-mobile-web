'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectFolder } from './ProjectFolder'
import { OPSStyle } from '@/lib/styles/OPSStyle'

interface Sequence2Props {
  onComplete: () => void
  initialState: '2-setup' | '2-carousel' | '2-archive'
}

const STATUS_ORDER = ['rfq', 'estimated', 'accepted', 'inProgress', 'completed', 'closed'] as const
const STATUS_LABELS = OPSStyle.StatusLabels
const STATUS_COLORS = OPSStyle.Colors.status

// Bell curve timing (in milliseconds)
const TRANSITION_DURATIONS = {
  rfqToEstimated: 1800,
  estimatedToAccepted: 1200,
  acceptedToInProgress: 600,
  inProgressToCompleted: 1200,
  completedToClosed: 1800,
}

export function Sequence2({ onComplete, initialState }: Sequence2Props) {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0)
  const [isReversing, setIsReversing] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)
  const [hasReturnedFromArchive, setHasReturnedFromArchive] = useState(false)
  const [showArchiveLabel, setShowArchiveLabel] = useState(false)
  const [textPhase, setTextPhase] = useState<'main' | 'archive'>('main')

  const currentStatus = STATUS_ORDER[currentStatusIndex]
  const folderColor = isArchiving && !hasReturnedFromArchive ? STATUS_COLORS.archived :
                      hasReturnedFromArchive ? '#FFFFFF' :
                      STATUS_COLORS[currentStatus]

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    let cumulativeTime = 0

    // Forward progression with bell curve timing
    const transitions = [
      TRANSITION_DURATIONS.rfqToEstimated,
      TRANSITION_DURATIONS.estimatedToAccepted,
      TRANSITION_DURATIONS.acceptedToInProgress,
      TRANSITION_DURATIONS.inProgressToCompleted,
      TRANSITION_DURATIONS.completedToClosed,
    ]

    transitions.forEach((duration, index) => {
      cumulativeTime += duration
      timers.push(
        setTimeout(() => {
          setCurrentStatusIndex(index + 1)
        }, cumulativeTime)
      )
    })

    // Hold on "Closed"
    cumulativeTime += 1000
    timers.push(
      setTimeout(() => {
        setIsReversing(true)
      }, cumulativeTime)
    )

    // Reverse roll back to Estimated (rapid, continuous)
    const reverseSteps = [4, 3, 2, 1] // Closed -> Completed -> In Progress -> Accepted -> Estimated
    reverseSteps.forEach((targetIndex) => {
      cumulativeTime += 150
      timers.push(
        setTimeout(() => {
          setCurrentStatusIndex(targetIndex)
        }, cumulativeTime)
      )
    })

    cumulativeTime += 150
    timers.push(
      setTimeout(() => {
        setIsReversing(false)
      }, cumulativeTime)
    )

    // Hold on Estimated
    cumulativeTime += 1000

    // Show archive text and label
    timers.push(
      setTimeout(() => {
        setTextPhase('archive')
        setShowArchiveLabel(true)
      }, cumulativeTime)
    )

    // Start archiving
    cumulativeTime += 500
    timers.push(
      setTimeout(() => {
        setIsArchiving(true)
      }, cumulativeTime)
    )

    // Return from archive
    cumulativeTime += 1500
    timers.push(
      setTimeout(() => {
        setHasReturnedFromArchive(true)
        setShowArchiveLabel(false)
      }, cumulativeTime)
    )

    // Complete
    cumulativeTime += 800
    timers.push(
      setTimeout(() => {
        onComplete()
      }, cumulativeTime)
    )

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  // Get transition duration based on current transition
  const getTransitionDuration = () => {
    if (isReversing) return 0.15
    const durations = [
      TRANSITION_DURATIONS.rfqToEstimated,
      TRANSITION_DURATIONS.estimatedToAccepted,
      TRANSITION_DURATIONS.acceptedToInProgress,
      TRANSITION_DURATIONS.inProgressToCompleted,
      TRANSITION_DURATIONS.completedToClosed,
    ]
    return (durations[currentStatusIndex - 1] || 1200) / 1000 // Convert to seconds
  }

  // Calculate carousel offset (slides left as index increases)
  const carouselOffset = -currentStatusIndex * 200 // 200px spacing between items

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Text */}
      <AnimatePresence mode="wait">
        {textPhase === 'main' && (
          <motion.div
            key="main-text"
            className="absolute top-24 left-0 right-0 text-center px-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            <p className="font-mohave font-medium text-[20px] md:text-[24px] uppercase tracking-wider text-white">
              PROJECT STATUS FLOWS FROM LEAD TO CLOSE
            </p>
          </motion.div>
        )}

        {textPhase === 'archive' && (
          <motion.div
            key="archive-text"
            className="absolute top-24 left-0 right-0 text-center px-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="font-mohave font-medium text-[20px] md:text-[24px] uppercase tracking-wider text-white">
              ARCHIVE PROJECTS THAT DON&apos;T MOVE FORWARD
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status carousel - horizontal sliding */}
      {!isArchiving && (
        <div
          className="absolute overflow-hidden"
          style={{
            top: '35%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '600px',
          }}
        >
          <motion.div
            className="flex items-center justify-start"
            style={{
              paddingLeft: '50%', // Start centered
            }}
            animate={{
              x: carouselOffset,
            }}
            transition={{
              duration: getTransitionDuration(),
              type: isReversing ? 'tween' : 'spring',
              stiffness: isReversing ? undefined : 180,
              damping: isReversing ? undefined : 16,
              ease: isReversing ? 'linear' : undefined,
            }}
          >
            {STATUS_ORDER.map((status, index) => {
              const isActive = index === currentStatusIndex
              const isPrev = index === currentStatusIndex - 1
              const isNext = index === currentStatusIndex + 1

              return (
                <motion.div
                  key={status}
                  className="flex-shrink-0 font-mohave font-medium uppercase tracking-wider text-center"
                  style={{
                    width: 200,
                    fontSize: isActive ? '24px' : '16px',
                    color: isActive ? STATUS_COLORS[status] : '#FFFFFF',
                    opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                  }}
                  animate={{
                    fontSize: isActive ? '24px' : '16px',
                    color: isActive ? STATUS_COLORS[status] : '#FFFFFF',
                    opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                  }}
                  transition={{
                    duration: getTransitionDuration() * 0.8,
                  }}
                >
                  {STATUS_LABELS[status]}
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      )}

      {/* Archive label (bottom) */}
      <AnimatePresence>
        {showArchiveLabel && (
          <motion.div
            className="absolute font-mohave font-medium text-[18px] uppercase tracking-wider"
            style={{ bottom: '25%', color: STATUS_COLORS.archived }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            ARCHIVED
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project folder */}
      <motion.div
        animate={{
          y: isArchiving && !hasReturnedFromArchive ? 100 : 0,
          scale: isArchiving && !hasReturnedFromArchive ? 0.8 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 120,
          damping: 18,
        }}
      >
        <ProjectFolder color={folderColor} isOpen={false} />
      </motion.div>
    </div>
  )
}
