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

const UNIFORM_DURATION = 1200 // Same duration for all transitions

export function Sequence2({ onComplete, initialState }: Sequence2Props) {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0)
  const [isReversing, setIsReversing] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)
  const [hasReturnedFromArchive, setHasReturnedFromArchive] = useState(false)
  const [showArchiveLabel, setShowArchiveLabel] = useState(false)
  const [showMainText, setShowMainText] = useState(false)
  const [showArchiveText, setShowArchiveText] = useState(false)

  const currentStatus = STATUS_ORDER[currentStatusIndex]
  const folderColor = isArchiving && !hasReturnedFromArchive ? STATUS_COLORS.archived :
                      hasReturnedFromArchive ? '#FFFFFF' :
                      STATUS_COLORS[currentStatus]

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    let cumulativeTime = 0

    // Show main text
    timers.push(setTimeout(() => setShowMainText(true), 200))
    cumulativeTime = 200

    // Forward progression with uniform timing
    for (let i = 1; i <= 5; i++) {
      cumulativeTime += UNIFORM_DURATION
      const targetIndex = i
      timers.push(
        setTimeout(() => {
          setCurrentStatusIndex(targetIndex)
        }, cumulativeTime)
      )
    }

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

    // Hide main text, show archive text and label
    timers.push(
      setTimeout(() => {
        setShowMainText(false)
        setShowArchiveText(true)
        setShowArchiveLabel(true)
      }, cumulativeTime)
    )

    // Start archiving
    cumulativeTime += 600
    timers.push(
      setTimeout(() => {
        setIsArchiving(true)
      }, cumulativeTime)
    )

    // Hold on archive longer
    cumulativeTime += 2000

    // Return from archive
    timers.push(
      setTimeout(() => {
        setHasReturnedFromArchive(true)
        setShowArchiveLabel(false)
        setShowArchiveText(false)
      }, cumulativeTime)
    )

    // Complete
    cumulativeTime += 1000
    timers.push(
      setTimeout(() => {
        onComplete()
      }, cumulativeTime)
    )

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  // Calculate carousel offset (slides left as index increases)
  // Each status is 250px wide to ensure proper spacing
  const carouselOffset = -currentStatusIndex * 250

  const getTransitionDuration = () => {
    if (isReversing) return 0.15
    return UNIFORM_DURATION / 1000 // Convert to seconds
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Main text */}
      <AnimatePresence>
        {showMainText && (
          <motion.div
            key="main-text"
            className="absolute top-24 left-0 right-0 text-center px-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <p className="font-mohave font-medium text-[20px] md:text-[24px] uppercase tracking-wider text-white">
              PROJECT STATUS FLOWS FROM LEAD TO CLOSE
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Archive text */}
      <AnimatePresence>
        {showArchiveText && (
          <motion.div
            key="archive-text"
            className="absolute top-24 left-0 right-0 text-center px-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <p className="font-mohave font-medium text-[20px] md:text-[24px] uppercase tracking-wider text-white">
              <span style={{ color: STATUS_COLORS.archived }}>ARCHIVE</span> PROJECTS THAT DON&apos;T MOVE FORWARD
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status carousel - horizontal sliding */}
      {!isArchiving && (
        <div
          className="absolute overflow-hidden flex items-center justify-center"
          style={{
            top: '35%',
            left: 0,
            right: 0,
            height: '60px',
          }}
        >
          <motion.div
            className="flex items-center"
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
              const isVisible = isActive || isPrev || isNext

              return (
                <motion.div
                  key={status}
                  className="flex-shrink-0 font-mohave font-medium uppercase tracking-wider text-center"
                  style={{
                    width: 250,
                  }}
                  animate={{
                    fontSize: isActive ? '24px' : '16px',
                    color: isActive ? STATUS_COLORS[status] : '#FFFFFF',
                    opacity: isActive ? 1 : isVisible ? 0.4 : 0,
                  }}
                  transition={{
                    fontSize: { duration: getTransitionDuration() * 0.6 },
                    color: { duration: 0.1 }, // Instant color change
                    opacity: { duration: getTransitionDuration() * 0.8 },
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
