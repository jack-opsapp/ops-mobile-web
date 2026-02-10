'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectFolder } from './ProjectFolder'
import { TaskFolder } from './TaskFolder'
import Image from 'next/image'

interface Sequence1BProps {
  onComplete: () => void
}

const TASK_COLORS = {
  task1: '#F5F5DC', // bone/cream
  task2: '#E8945A', // burnt orange
  task3: '#8B9D83', // sage green
}

const GRAYSCALE = '#888888'

const SAMPLE_TASKS = [
  { label: 'SANDING', color: TASK_COLORS.task1, crew: 'Maverick', avatar: '/avatars/pete.png', date: 'Mar 12' },
  { label: 'PRIMING', color: TASK_COLORS.task2, crew: 'Goose', avatar: '/avatars/nick.png', date: 'Mar 15' },
  { label: 'PAINTING', color: TASK_COLORS.task3, crew: 'Iceman', avatar: '/avatars/tom.png', date: 'Mar 18' },
]

export function Sequence1B({ onComplete }: Sequence1BProps) {
  const [activeTask, setActiveTask] = useState<number | null>(null)
  const [collapsing, setCollapsing] = useState(false)
  const [textVisible, setTextVisible] = useState(false)

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    // Task 1: select
    timers.push(setTimeout(() => setActiveTask(0), 500))
    // Task 1: deselect
    timers.push(setTimeout(() => setActiveTask(null), 2500))

    // Task 2: select
    timers.push(setTimeout(() => setActiveTask(1), 3000))
    // Task 2: deselect
    timers.push(setTimeout(() => setActiveTask(null), 5000))

    // Task 3: select
    timers.push(setTimeout(() => setActiveTask(2), 5500))
    // Task 3: deselect
    timers.push(setTimeout(() => setActiveTask(null), 7500))

    // Brief hold, then text appears
    timers.push(setTimeout(() => setTextVisible(true), 8000))

    // Collapse tasks back into folder
    timers.push(setTimeout(() => setCollapsing(true), 9500))

    // Complete sequence
    timers.push(setTimeout(() => onComplete(), 11000))

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  const getTaskColor = (index: number) => {
    if (collapsing) return GRAYSCALE
    return activeTask === index ? SAMPLE_TASKS[index].color : GRAYSCALE
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Text */}
      <AnimatePresence>
        {textVisible && (
          <motion.div
            className="absolute top-24 left-0 right-0 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="font-mohave font-medium text-[20px] md:text-[24px] uppercase tracking-wider text-white">
              ASSIGN CREW AND DATES TO A TASK
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task folders with details */}
      <div
        className="absolute flex flex-col items-start gap-6"
        style={{ top: '20%', left: '50%', transform: 'translateX(-50%)' }}
      >
        {SAMPLE_TASKS.map((task, index) => (
          <motion.div
            key={index}
            className="relative flex items-center"
            initial={{ opacity: 1, y: 0 }}
            animate={{
              opacity: collapsing ? 0 : 1,
              y: collapsing ? 100 : 0,
            }}
            transition={{
              delay: collapsing ? index * 0.15 : 0,
              type: 'spring',
              stiffness: 120,
              damping: 18,
            }}
          >
            {/* Task folder */}
            <div style={{ width: 60 }}>
              <TaskFolder color={getTaskColor(index)} isActive={activeTask === index} />
            </div>

            {/* Task details (appear when active) - absolutely positioned to avoid layout shift */}
            <AnimatePresence>
              {activeTask === index && (
                <motion.div
                  className="absolute flex items-center gap-4"
                  style={{ left: 80, color: task.color }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Task label */}
                  <span className="font-mohave font-medium text-[18px] uppercase tracking-wide">
                    {task.label}
                  </span>

                  {/* Crew avatar */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full overflow-hidden border-2"
                      style={{ borderColor: task.color }}
                    >
                      <Image
                        src={task.avatar}
                        alt={task.crew}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-kosugi text-[14px]">{task.crew}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
                      <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                      <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                      <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                    </svg>
                    <span className="font-kosugi text-[14px]">{task.date}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Project folder (centered) */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{
          opacity: collapsing ? 1 : 1,
          scale: collapsing ? 0.95 : 1,
        }}
        transition={{ delay: collapsing ? 0.6 : 0 }}
      >
        <ProjectFolder color="#FFFFFF" isOpen={!collapsing} />
      </motion.div>
    </div>
  )
}
