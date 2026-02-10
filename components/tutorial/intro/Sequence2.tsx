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
  const [showArchiveText, setShowArchiveText] = useState(false)
  const [textPhase, setTextPhase] = useState<'main' | 'archive'>('main')

  const currentStatus = STATUS_ORDER[currentStatusIndex]
  const folderColor = isArchiving ? STATUS_COLORS.archived : STATUS_COLORS[currentStatus]

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
    cumulativeTime += 800
    timers.push(
      setTimeout(() => {
        setCurrentStatusIndex(1) // Estimated
        setIsReversing(false)
      }, cumulativeTime)
    )

    // Hold on Estimated
    cumulativeTime += 1000

    // Show archive text
    timers.push(
      setTimeout(() => {
        setTextPhase('archive')
        setShowArchiveText(true)
      }, cumulativeTime)
    )

    // Start archiving
    cumulativeTime += 500
    timers.push(
      setTimeout(() => {
        setIsArchiving(true)
      }, cumulativeTime)
    )

    // Complete
    cumulativeTime += 1500
    timers.push(
      setTimeout(() => {
        onComplete()
      }, cumulativeTime)
    )

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  // Get visible statuses for carousel (center, left, right)
  const getVisibleStatuses = () => {
    const prev = currentStatusIndex > 0 ? STATUS_ORDER[currentStatusIndex - 1] : null
    const current = STATUS_ORDER[currentStatusIndex]
    const next = currentStatusIndex < STATUS_ORDER.length - 1 ? STATUS_ORDER[currentStatusIndex + 1] : null

    return { prev, current, next }
  }

  const { prev, current, next } = getVisibleStatuses()

  // Get transition duration based on current transition
  const getTransitionDuration = () => {
    const durations = [
      TRANSITION_DURATIONS.rfqToEstimated,
      TRANSITION_DURATIONS.estimatedToAccepted,
      TRANSITION_DURATIONS.acceptedToInProgress,
      TRANSITION_DURATIONS.inProgressToCompleted,
      TRANSITION_DURATIONS.completedToClosed,
    ]
    return (durations[currentStatusIndex - 1] || 1200) / 1000 // Convert to seconds
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Text */}
      <AnimatePresence mode="wait">
        {textPhase === 'main' && (
          <motion.div
            key="main-text"
            className="absolute top-24 left-0 right-0 text-center"
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
            className="absolute top-24 left-0 right-0 text-center"
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

      {/* Status carousel */}
      {!isArchiving && (
        <motion.div
          className="absolute flex items-center justify-center gap-8"
          style={{ top: '35%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Previous status (left) */}
          {prev && (
            <motion.div
              key={`prev-${prev}`}
              className="font-mohave font-medium text-[16px] uppercase tracking-wider opacity-40"
              style={{ color: '#FFFFFF' }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 0.4, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: isReversing ? 0.3 : getTransitionDuration() }}
            >
              {STATUS_LABELS[prev]}
            </motion.div>
          )}

          {/* Current status (center) */}
          <motion.div
            key={`current-${current}`}
            className="font-mohave font-medium text-[20px] md:text-[24px] uppercase tracking-wider"
            style={{ color: STATUS_COLORS[current] }}
            layout
            initial={{ opacity: 0.4, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: isReversing ? 0.3 : getTransitionDuration(),
              type: 'spring',
              stiffness: 180,
              damping: 16,
            }}
          >
            {STATUS_LABELS[current]}
          </motion.div>

          {/* Next status (right) */}
          {next && !isReversing && (
            <motion.div
              key={`next-${next}`}
              className="font-mohave font-medium text-[16px] uppercase tracking-wider opacity-40"
              style={{ color: '#FFFFFF' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.4, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: getTransitionDuration() }}
            >
              {STATUS_LABELS[next]}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Archive label (bottom) */}
      <AnimatePresence>
        {showArchiveText && (
          <motion.div
            className="absolute font-mohave font-medium text-[18px] uppercase tracking-wider"
            style={{ bottom: '25%', color: STATUS_COLORS.archived }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            ARCHIVED
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project folder */}
      <motion.div
        animate={{
          y: isArchiving ? 100 : 0,
          scale: isArchiving ? 0.8 : 1,
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
