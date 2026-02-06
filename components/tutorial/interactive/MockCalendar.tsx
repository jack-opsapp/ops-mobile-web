'use client'

import { useMemo } from 'react'
import type { TutorialPhase } from '@/lib/tutorial/TutorialPhase'

interface MockCalendarProps {
  phase: TutorialPhase
  viewMode: 'week' | 'month'
  onToggleMonth: () => void
  userProject?: {
    name: string
    clientName: string
    taskType: string
    taskTypeColor: string
    date: string
  }
}

// Task colors used for mock schedule dots
const TASK_COLORS = [
  '#5A7BD4', // Coating (blue)
  '#B088D4', // Paving (purple)
  '#D47B9F', // Installation (pink)
  '#8EC8E8', // Sealing (light blue)
  '#5AC8D4', // Diagnostic (teal)
  '#A5D4A0', // Cleaning (green)
  '#E8945A', // Demolition (orange)
]

export function MockCalendar({ phase, viewMode, onToggleMonth, userProject }: MockCalendarProps) {
  const today = useMemo(() => new Date(), [])
  const isMonthView = viewMode === 'month'
  const isMonthPrompt = phase === 'calendarMonthPrompt'

  // Build the current week (Monday-Sunday)
  const weekDays = useMemo(() => {
    const days: Date[] = []
    const current = new Date(today)
    // Get Monday of current week
    const dayOfWeek = current.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    current.setDate(current.getDate() + mondayOffset)
    for (let i = 0; i < 7; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return days
  }, [today])

  // Day abbreviations (Mon-Sun)
  const dayAbbreviations = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  // Month grid data
  const monthData = useMemo(() => {
    const year = today.getFullYear()
    const month = today.getMonth()
    const firstDay = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    // Get what day of week the 1st falls on (0=Sun, adjust so Mon=0)
    let startDay = firstDay.getDay() - 1
    if (startDay < 0) startDay = 6
    return { year, month, daysInMonth, startDay }
  }, [today])

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  // Pseudo-random task dots for various days (seeded by day number for consistency)
  const getTaskDotsForDay = (dayNum: number): string[] => {
    const dots: string[] = []
    // Use simple deterministic logic based on day number
    if (dayNum % 2 === 0) dots.push(TASK_COLORS[dayNum % TASK_COLORS.length])
    if (dayNum % 3 === 0) dots.push(TASK_COLORS[(dayNum + 2) % TASK_COLORS.length])
    if (dayNum % 7 === 0) dots.push(TASK_COLORS[(dayNum + 4) % TASK_COLORS.length])
    return dots
  }

  // Mock scheduled items for week view (shown below the day selector)
  const weekScheduleItems = useMemo(() => {
    const items: { time: string; name: string; clientName: string; taskType: string; color: string }[] = []

    // Add the user's project on today if available
    if (userProject) {
      items.push({
        time: '8:00 AM',
        name: userProject.name,
        clientName: userProject.clientName,
        taskType: userProject.taskType,
        color: userProject.taskTypeColor,
      })
    }

    // Add some demo tasks for today
    items.push(
      { time: '9:30 AM', name: 'Flight Deck Coating', clientName: 'Miramar Flight Academy', taskType: 'Coating', color: '#5A7BD4' },
      { time: '1:00 PM', name: "O'Club Patio Resurface", clientName: "O'Club Bar & Grill", taskType: 'Paving', color: '#B088D4' },
    )

    return items
  }, [userProject])

  // Get task dots for a specific week day index
  const getWeekDayDots = (dayIndex: number): string[] => {
    const dayDate = weekDays[dayIndex]
    if (!dayDate) return []
    const dayNum = dayDate.getDate()
    const dots = getTaskDotsForDay(dayNum)

    // Add user project dot to today
    if (userProject && dayDate.getDate() === today.getDate() &&
        dayDate.getMonth() === today.getMonth()) {
      dots.unshift(userProject.taskTypeColor)
    }
    return dots
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* App Header - matches iOS ScheduleView header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <h2 className="font-mohave font-bold text-[20px] uppercase tracking-wider text-white">
          Schedule
        </h2>
        <div className="flex items-center gap-3">
          {/* Search icon (non-functional) */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-ops-text-secondary">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {/* Filter icon (non-functional) */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-ops-text-secondary">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* View Toggle (CalendarToggleView) */}
      <div className="px-4 pb-3">
        <div className="flex rounded-lg overflow-hidden" style={{ background: '#0D0D0D' }}>
          {/* WEEK tab */}
          <button
            className={`flex-1 py-2 font-mohave text-[14px] uppercase tracking-wider transition-all ${
              !isMonthView
                ? 'text-white'
                : 'text-ops-text-secondary'
            }`}
            style={!isMonthView ? { background: '#1A1A1A' } : undefined}
          >
            Week
          </button>
          {/* MONTH tab */}
          <button
            onClick={() => isMonthPrompt && onToggleMonth()}
            className={`flex-1 py-2 font-mohave text-[14px] uppercase tracking-wider transition-all relative ${
              isMonthView
                ? 'text-white'
                : isMonthPrompt
                  ? 'text-ops-accent'
                  : 'text-ops-text-secondary'
            }`}
            style={{
              ...(isMonthView ? { background: '#1A1A1A' } : {}),
              ...(isMonthPrompt ? {
                border: '1px solid rgba(89, 119, 159, 0.5)',
                borderRadius: '8px',
              } : {}),
            }}
          >
            Month
            {/* Pulsing highlight for calendarMonthPrompt */}
            {isMonthPrompt && (
              <span
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  border: '1px solid rgba(89, 119, 159, 0.6)',
                  animation: 'calendarPulse 2s ease-in-out infinite',
                }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Month/Year label */}
      <div className="px-4 pb-2">
        <span className="font-mohave text-[14px] text-ops-text-secondary">
          {monthNames[today.getMonth()]} {today.getFullYear()}
        </span>
      </div>

      {isMonthView ? (
        /* ===== MONTH VIEW ===== */
        <div className="px-4 flex-1 overflow-hidden">
          {/* Day of week headers (Mon-Sun) */}
          <div className="grid grid-cols-7 mb-1">
            {dayAbbreviations.map((abbr, i) => (
              <div key={i} className="text-center font-kosugi text-[10px] text-ops-text-tertiary py-1">
                {abbr}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px">
            {/* Empty cells for offset */}
            {Array.from({ length: monthData.startDay }, (_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Day cells */}
            {Array.from({ length: monthData.daysInMonth }, (_, i) => {
              const dayNum = i + 1
              const isToday = dayNum === today.getDate()
              const dots = getTaskDotsForDay(dayNum)

              // Add user project dot on today
              const allDots = [...dots]
              if (userProject && isToday) {
                allDots.unshift(userProject.taskTypeColor)
              }
              // Limit to 3 dots max for space
              const displayDots = allDots.slice(0, 3)

              return (
                <div
                  key={dayNum}
                  className="aspect-square flex flex-col items-center justify-center relative"
                >
                  {/* Today highlight circle */}
                  {isToday && (
                    <div className="absolute w-7 h-7 rounded-full bg-ops-accent opacity-90" />
                  )}
                  <span
                    className={`font-mohave text-[12px] relative z-10 ${
                      isToday
                        ? 'text-white font-bold'
                        : 'text-white/70'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {/* Task dots */}
                  {displayDots.length > 0 && (
                    <div className="flex gap-[2px] mt-[2px] relative z-10">
                      {displayDots.map((color, j) => (
                        <div
                          key={j}
                          className="w-[4px] h-[4px] rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* ===== WEEK VIEW ===== */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Day selector row (CalendarDaySelector) */}
          <div className="px-4 pb-3">
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day, i) => {
                const isToday =
                  day.getDate() === today.getDate() &&
                  day.getMonth() === today.getMonth()
                const dots = getWeekDayDots(i)
                const displayDots = dots.slice(0, 3)

                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    {/* Day abbreviation */}
                    <span className="font-kosugi text-[10px] text-ops-text-secondary">
                      {dayAbbreviations[i]}
                    </span>

                    {/* Date number with optional accent circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isToday ? 'bg-ops-accent' : ''
                      }`}
                    >
                      <span
                        className={`font-mohave text-[14px] ${
                          isToday ? 'text-white font-bold' : 'text-white/70'
                        }`}
                      >
                        {day.getDate()}
                      </span>
                    </div>

                    {/* Colored task dots below */}
                    <div className="flex gap-[2px]">
                      {displayDots.map((color, j) => (
                        <div
                          key={j}
                          className="w-[5px] h-[5px] rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10 mx-4" />

          {/* Schedule list for selected day (today) */}
          <div className="flex-1 overflow-y-auto px-4 pt-3 space-y-2">
            {weekScheduleItems.map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-3 flex items-start gap-3"
                style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {/* Color stripe */}
                <div
                  className="w-1 self-stretch rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mohave text-[13px] font-semibold text-white truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-kosugi text-[10px] text-ops-text-secondary block truncate">
                    {item.clientName}
                  </span>
                  <div className="flex items-center gap-2 mt-1.5">
                    {/* Task type pill */}
                    <span
                      className="font-kosugi text-[9px] px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${item.color}20`,
                        color: item.color,
                      }}
                    >
                      {item.taskType}
                    </span>
                    {/* Time */}
                    <span className="font-kosugi text-[9px] text-ops-text-tertiary">
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty state hint if no items */}
            {weekScheduleItems.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <span className="font-kosugi text-[12px] text-ops-text-tertiary">
                  No tasks scheduled
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pulsing animation keyframes (injected via style tag) */}
      <style jsx>{`
        @keyframes calendarPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
