'use client'

import { useMemo, useState, useRef, useCallback } from 'react'
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

// Task colors used for mock schedule events
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

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

  // =========================================================================
  // WEEK DATA
  // =========================================================================

  // Week offset for swipe navigation
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDayIndex, setSelectedDayIndex] = useState(-1) // -1 = today

  // Build the current week (Monday-Sunday) based on offset
  const weekDays = useMemo(() => {
    const days: Date[] = []
    const current = new Date(today)
    const dayOfWeek = current.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    current.setDate(current.getDate() + mondayOffset + weekOffset * 7)
    for (let i = 0; i < 7; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return days
  }, [today, weekOffset])

  // Day abbreviations (Mon-Sun)
  const dayAbbreviations = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  // Find today's index in current week
  const todayIndex = useMemo(() => {
    return weekDays.findIndex(d =>
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    )
  }, [weekDays, today])

  // The actually selected day
  const activeDayIndex = selectedDayIndex >= 0 ? selectedDayIndex : (todayIndex >= 0 ? todayIndex : 0)
  const activeDay = weekDays[activeDayIndex] || today

  // Week range label (e.g., "Feb 3-9")
  const weekRangeLabel = useMemo(() => {
    const start = weekDays[0]
    const end = weekDays[6]
    if (!start || !end) return ''
    const startMonth = monthNames[start.getMonth()].slice(0, 3)
    const endMonth = monthNames[end.getMonth()].slice(0, 3)
    if (start.getMonth() === end.getMonth()) {
      return `${startMonth} ${start.getDate()}-${end.getDate()}`
    }
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`
  }, [weekDays])

  // =========================================================================
  // MONTH DATA
  // =========================================================================

  const monthData = useMemo(() => {
    const year = today.getFullYear()
    const month = today.getMonth()
    const firstDay = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    let startDay = firstDay.getDay() - 1
    if (startDay < 0) startDay = 6
    return { year, month, daysInMonth, startDay }
  }, [today])

  // =========================================================================
  // EVENT DATA (deterministic based on day)
  // =========================================================================

  // Get events for a given day number (pseudo-random, seeded)
  const getEventsForDay = useCallback((dayNum: number): { color: string; isNew: boolean }[] => {
    const events: { color: string; isNew: boolean }[] = []
    if (dayNum % 2 === 0) events.push({ color: TASK_COLORS[dayNum % TASK_COLORS.length], isNew: false })
    if (dayNum % 3 === 0) events.push({ color: TASK_COLORS[(dayNum + 2) % TASK_COLORS.length], isNew: true })
    if (dayNum % 7 === 0) events.push({ color: TASK_COLORS[(dayNum + 4) % TASK_COLORS.length], isNew: false })
    return events
  }, [])

  // Get event counts for a week day (for badges)
  const getWeekDayEvents = useCallback((dayIndex: number): { newCount: number; ongoingCount: number; colors: string[] } => {
    const dayDate = weekDays[dayIndex]
    if (!dayDate) return { newCount: 0, ongoingCount: 0, colors: [] }
    const dayNum = dayDate.getDate()
    const events = getEventsForDay(dayNum)
    const colors = events.map(e => e.color)

    // Add user project on today
    const isToday = dayDate.getDate() === today.getDate() && dayDate.getMonth() === today.getMonth()
    if (userProject && isToday) {
      colors.unshift(userProject.taskTypeColor)
      events.unshift({ color: userProject.taskTypeColor, isNew: true })
    }

    const newCount = events.filter(e => e.isNew).length
    const ongoingCount = events.filter(e => !e.isNew).length

    return { newCount, ongoingCount, colors }
  }, [weekDays, today, userProject, getEventsForDay])

  // Mock scheduled items for selected day
  const dayScheduleItems = useMemo(() => {
    const items: { time: string; name: string; clientName: string; taskType: string; color: string; address?: string }[] = []

    const isToday = activeDay.getDate() === today.getDate() && activeDay.getMonth() === today.getMonth()

    if (userProject && isToday) {
      items.push({
        time: '8:00 AM',
        name: userProject.name,
        clientName: userProject.clientName,
        taskType: userProject.taskType,
        color: userProject.taskTypeColor,
        address: '1234 Miramar Way, San Diego',
      })
    }

    if (isToday) {
      items.push(
        { time: '9:30 AM', name: 'Flight Deck Coating', clientName: 'Miramar Flight Academy', taskType: 'Coating', color: '#5A7BD4', address: '800 Fighter Town Rd' },
        { time: '1:00 PM', name: "O'Club Patio Resurface", clientName: "O'Club Bar & Grill", taskType: 'Paving', color: '#B088D4', address: '2115 North Ave' },
      )
    } else {
      // Show some items on other days based on day number
      const dayNum = activeDay.getDate()
      const events = getEventsForDay(dayNum)
      const demoNames = [
        { name: 'Hangar Siding Repair', client: 'Fightertown Hangars LLC', type: 'Installation', addr: '900 Hangar Blvd' },
        { name: 'Runway Crack Repair', client: 'Miramar Flight Academy', type: 'Diagnostic', addr: '800 Fighter Town Rd' },
        { name: 'Briefing Room Install', client: 'Miramar Flight Academy', type: 'Installation', addr: '810 Fighter Town Rd' },
      ]
      events.forEach((ev, i) => {
        const demo = demoNames[i % demoNames.length]
        items.push({
          time: `${9 + i * 2}:00 AM`,
          name: demo.name,
          clientName: demo.client,
          taskType: demo.type,
          color: ev.color,
          address: demo.addr,
        })
      })
    }

    return items
  }, [activeDay, today, userProject, getEventsForDay])

  // =========================================================================
  // SWIPE GESTURE for week day row
  // =========================================================================

  const touchStartX = useRef<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)

  const handleDayRowTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleDayRowTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = e.touches[0].clientX - touchStartX.current
    // Apply resistance (0.5)
    setDragOffset(diff * 0.5)
  }

  const handleDayRowTouchEnd = () => {
    if (touchStartX.current === null) return
    const threshold = 50
    if (dragOffset < -threshold) {
      // Swipe left = next week
      setWeekOffset(prev => prev + 1)
      setSelectedDayIndex(-1)
    } else if (dragOffset > threshold) {
      // Swipe right = previous week
      setWeekOffset(prev => prev - 1)
      setSelectedDayIndex(-1)
    }
    setDragOffset(0)
    touchStartX.current = null
  }

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* App Header - matches iOS ScheduleView */}
      <div className="px-4 pt-3 pb-0 flex items-center justify-between">
        <div>
          <h2 className="font-mohave font-bold text-[20px] uppercase tracking-wider text-white">
            Schedule
          </h2>
          {/* TODAY | Date subtitle */}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mohave text-[11px] uppercase tracking-wider text-ops-accent font-bold">
              Today
            </span>
            <div style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.2)' }} />
            <span className="font-mohave text-[11px] text-ops-text-secondary">
              {monthNames[today.getMonth()]} {today.getDate()}
            </span>
          </div>
        </div>
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

      {/* Toggle row: Week/Month segmented + period button */}
      <div className="px-4 py-3 flex items-center gap-3">
        {/* Week/Month Toggle (CalendarToggleView) */}
        <div className="flex rounded-lg overflow-hidden flex-1" style={{ background: '#0D0D0D' }}>
          <button
            className={`flex-1 py-2 font-mohave text-[14px] uppercase tracking-wider transition-all ${
              !isMonthView ? 'text-white' : 'text-ops-text-secondary'
            }`}
            style={!isMonthView ? { background: '#1A1A1A' } : undefined}
          >
            Week
          </button>
          <button
            onClick={() => isMonthPrompt && onToggleMonth()}
            className={`flex-1 py-2 font-mohave text-[14px] uppercase tracking-wider transition-all relative ${
              isMonthView ? 'text-white' : isMonthPrompt ? 'text-ops-accent' : 'text-ops-text-secondary'
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

        {/* Period button (week range) */}
        {!isMonthView && (
          <div
            className="px-3 py-1.5 rounded-lg flex items-center gap-1.5"
            style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span className="font-mohave text-[12px] text-ops-text-secondary whitespace-nowrap">
              {weekRangeLabel}
            </span>
          </div>
        )}
      </div>

      {isMonthView ? (
        /* ===== MONTH VIEW ===== */
        <div className="px-4 flex-1 overflow-hidden">
          {/* Month/Year label */}
          <div className="pb-2">
            <span className="font-mohave text-[14px] text-ops-text-secondary">
              {monthNames[today.getMonth()]} {today.getFullYear()}
            </span>
          </div>

          {/* Card container for month grid */}
          <div className="rounded-xl p-3" style={{ background: '#0D0D0D' }}>
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
                const events = getEventsForDay(dayNum)
                const allColors = [...events.map(e => e.color)]

                if (userProject && isToday) {
                  allColors.unshift(userProject.taskTypeColor)
                }
                const displayBars = allColors.slice(0, 3)
                const extraCount = allColors.length - 3

                return (
                  <div
                    key={dayNum}
                    className="aspect-square flex flex-col items-center justify-center relative px-0.5"
                  >
                    {/* Today highlight circle */}
                    {isToday && (
                      <div className="absolute w-7 h-7 rounded-full bg-ops-accent opacity-90" />
                    )}
                    <span
                      className={`font-mohave text-[12px] relative z-10 ${
                        isToday ? 'text-white font-bold' : 'text-white/70'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {/* Event bars instead of dots */}
                    {displayBars.length > 0 && (
                      <div className="flex flex-col items-center gap-[2px] mt-[2px] relative z-10 w-full px-[10%]">
                        {displayBars.map((color, j) => (
                          <div
                            key={j}
                            className="rounded-full"
                            style={{
                              backgroundColor: color,
                              height: 3,
                              width: '80%',
                              minWidth: 8,
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {/* +N indicator */}
                    {extraCount > 0 && (
                      <span className="font-kosugi text-[7px] text-ops-text-tertiary relative z-10 mt-[1px]">
                        +{extraCount}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ===== WEEK VIEW ===== */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Day selector row (CalendarDaySelector) - wrapped in card */}
          <div className="px-4 pb-3">
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: '#0D0D0D' }}
              onTouchStart={handleDayRowTouchStart}
              onTouchMove={handleDayRowTouchMove}
              onTouchEnd={handleDayRowTouchEnd}
            >
              <div
                className="grid grid-cols-7"
                style={{
                  height: 80,
                  transform: `translateX(${dragOffset}px)`,
                  transition: dragOffset === 0 ? 'transform 0.3s ease-out' : 'none',
                }}
              >
                {weekDays.map((day, i) => {
                  const isToday =
                    day.getDate() === today.getDate() &&
                    day.getMonth() === today.getMonth() &&
                    day.getFullYear() === today.getFullYear()
                  const isSelected = i === activeDayIndex
                  const { newCount, ongoingCount } = getWeekDayEvents(i)

                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-center relative cursor-pointer"
                      onClick={() => setSelectedDayIndex(i)}
                      style={{
                        // Today: accent bg at 50% opacity
                        background: isToday ? 'rgba(89, 119, 159, 0.5)' : 'transparent',
                        // Selected: white 1px border outline
                        border: isSelected && !isToday ? '1px solid rgba(255,255,255,0.8)' : isSelected && isToday ? '1px solid rgba(255,255,255,0.8)' : '1px solid transparent',
                        borderRadius: 12,
                        margin: 3,
                      }}
                    >
                      {/* Day abbreviation */}
                      <span className="font-kosugi text-[10px] text-ops-text-secondary">
                        {dayAbbreviations[i]}
                      </span>

                      {/* Date number */}
                      <span
                        className={`font-mohave text-[16px] ${
                          isToday ? 'text-white font-bold' : 'text-white/70'
                        }`}
                      >
                        {day.getDate()}
                      </span>

                      {/* Event count badges */}
                      {/* Green circle top-right = new events */}
                      {newCount > 0 && (
                        <div
                          className="absolute flex items-center justify-center"
                          style={{
                            top: 4,
                            right: 4,
                            width: 14,
                            height: 14,
                            borderRadius: 7,
                            background: '#A5B368',
                          }}
                        >
                          <span className="font-kosugi text-[8px] text-white font-bold">{newCount}</span>
                        </div>
                      )}
                      {/* Gray circle bottom-right = ongoing events */}
                      {ongoingCount > 0 && (
                        <div
                          className="absolute flex items-center justify-center"
                          style={{
                            bottom: 4,
                            right: 4,
                            width: 14,
                            height: 14,
                            borderRadius: 7,
                            background: '#555555',
                          }}
                        >
                          <span className="font-kosugi text-[8px] text-white font-bold">{ongoingCount}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Day header below selector (sticky header style) */}
          <div className="px-4 pb-2 flex items-center justify-between">
            <div>
              <span className="font-mohave text-[14px] uppercase tracking-wider text-white font-bold">
                {dayNames[activeDay.getDay()]}
              </span>
              <span className="font-mohave text-[12px] text-ops-text-secondary ml-2">
                {monthNames[activeDay.getMonth()]} {activeDay.getDate()}
              </span>
            </div>
            {/* Event count card */}
            {dayScheduleItems.length > 0 && (
              <div
                className="px-2 py-1 rounded-lg"
                style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <span className="font-kosugi text-[10px] text-ops-text-secondary">
                  {dayScheduleItems.length} {dayScheduleItems.length === 1 ? 'event' : 'events'}
                </span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10 mx-4" />

          {/* Schedule list for selected day - updated card structure */}
          <div className="flex-1 overflow-y-auto px-4 pt-3 space-y-2">
            {dayScheduleItems.map((item, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden flex"
                style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {/* Left color bar (4px) */}
                <div
                  className="flex-shrink-0"
                  style={{ width: 4, backgroundColor: item.color }}
                />

                {/* Content */}
                <div className="flex-1 min-w-0 p-3 flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    {/* Title - bodyBold uppercase */}
                    <span className="font-mohave text-[13px] font-bold text-white uppercase tracking-wide block truncate">
                      {item.name}
                    </span>
                    {/* Client name - caption */}
                    <span className="font-kosugi text-[10px] text-ops-text-secondary block truncate mt-0.5">
                      {item.clientName}
                    </span>
                    {/* Address - tertiary text */}
                    {item.address && (
                      <span className="font-kosugi text-[9px] text-ops-text-tertiary block truncate mt-0.5">
                        {item.address}
                      </span>
                    )}
                    {/* Time */}
                    <span className="font-kosugi text-[9px] text-ops-text-tertiary mt-1 block">
                      {item.time}
                    </span>
                  </div>

                  {/* Task type badge top-right */}
                  <span
                    className="font-kosugi text-[9px] px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                    }}
                  >
                    {item.taskType}
                  </span>
                </div>
              </div>
            ))}

            {dayScheduleItems.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <span className="font-kosugi text-[12px] text-ops-text-tertiary">
                  No tasks scheduled
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pulsing animation keyframes */}
      <style jsx>{`
        @keyframes calendarPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
