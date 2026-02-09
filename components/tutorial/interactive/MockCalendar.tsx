'use client'

import { useMemo, useState, useRef, useCallback, useEffect } from 'react'
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

  // Day abbreviations (Mon-Sun) — two-letter matching iOS
  const dayAbbreviations = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

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

  // Build 25 months of data for scrollable month view (iOS shows 25 months)
  const multiMonthData = useMemo(() => {
    const months: { year: number; month: number; daysInMonth: number; startDay: number; label: string }[] = []
    // Start 2 months before current, go 22 months after
    for (let offset = -2; offset <= 22; offset++) {
      const d = new Date(today.getFullYear(), today.getMonth() + offset, 1)
      const yr = d.getFullYear()
      const mo = d.getMonth()
      const dim = new Date(yr, mo + 1, 0).getDate()
      let sd = d.getDay() - 1
      if (sd < 0) sd = 6
      months.push({
        year: yr,
        month: mo,
        daysInMonth: dim,
        startDay: sd,
        label: `${monthNames[mo]} ${yr}`,
      })
    }
    return months
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

  // Month view no longer needs expansion animation — it's a scrollable multi-month grid

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

  // Height reserved at top for the floating tooltip (no safe area on web)
  const TOOLTIP_TOP_INSET = 100

  return (
    <div className={`flex-1 flex flex-col ${isMonthView ? 'overflow-y-auto' : 'overflow-hidden'}`}>
      {/* Spacer: push content below the floating tooltip */}
      <div style={{ height: TOOLTIP_TOP_INSET, flexShrink: 0 }} />

      {/* App Header - matches iOS ScheduleView / CalendarHeaderView */}
      <div className="flex items-center justify-between" style={{ padding: '12px 20px 0' }}>
        <div>
          <h2 className="font-mohave font-semibold text-[28px] uppercase tracking-wider text-white">
            Schedule
          </h2>
          {/* TODAY | Date subtitle — caption font, secondaryText */}
          <div className="flex items-center" style={{ gap: 8 }}>
            <span className="font-kosugi text-[14px] text-ops-text-secondary">
              TODAY
            </span>
            <span className="font-kosugi text-[14px] text-ops-text-secondary">|</span>
            <span className="font-kosugi text-[14px] text-ops-text-secondary">
              {monthNames[today.getMonth()]} {today.getDate()}
            </span>
          </div>
        </div>
        {/* Right: 3 circular action buttons (filter, refresh, search) — 44pt, cardBackground circle */}
        <div className="flex items-center" style={{ gap: 8 }}>
          {/* Filter button */}
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 44, height: 44, background: '#0D0D0D' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {/* Refresh button */}
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 44, height: 44, background: '#0D0D0D' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {/* Search button */}
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 44, height: 44, background: '#0D0D0D' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Toggle row: Week/Month segmented + period button — matching iOS CalendarToggleView */}
      {/* HStack spacing: 16pt, padding vertical: 8pt */}
      <div className="flex items-center" style={{ padding: '8px 20px', gap: 16 }}>
        {/* Week/Month Toggle — bodyBold (16pt Mohave Bold), 12pt vertical padding, 5pt radius */}
        <div className="flex flex-1 overflow-hidden relative" style={{ background: '#0D0D0D', borderRadius: 5 }}>
          <button
            className="flex-1 font-mohave font-bold text-[16px] uppercase tracking-wider transition-all"
            style={{
              padding: '12px 0',
              borderRadius: 5,
              background: !isMonthView ? '#1A1A1A' : 'transparent',
              color: !isMonthView ? '#FFFFFF' : '#AAAAAA',
            }}
          >
            Week
          </button>
          <button
            onClick={() => isMonthPrompt && onToggleMonth()}
            className="flex-1 font-mohave font-bold text-[16px] uppercase tracking-wider transition-all relative"
            style={{
              padding: '12px 0',
              borderRadius: 5,
              background: isMonthView ? '#1A1A1A' : 'transparent',
              color: isMonthView ? '#FFFFFF' : isMonthPrompt ? '#417394' : '#AAAAAA',
            }}
          >
            Month
            {/* Pulsing 3pt border highlight during calendarMonthPrompt */}
            {isMonthPrompt && (
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: 5,
                  border: '3px solid rgba(65, 115, 148, 0.6)',
                  animation: 'calendarPulse 2.4s ease-in-out infinite',
                }}
              />
            )}
          </button>

          {/* Black overlay on Week half during calendarMonthPrompt */}
          {isMonthPrompt && (
            <div
              className="absolute top-0 bottom-0 left-0 pointer-events-none"
              style={{
                width: '50%',
                background: 'rgba(0, 0, 0, 0.7)',
                borderRadius: '5px 0 0 5px',
              }}
            />
          )}

          {/* Black overlay on BOTH toggle + picker during calendarWeek (content is locked) */}
          {phase === 'calendarWeek' && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'rgba(0, 0, 0, 0.7)',
                borderRadius: 5,
              }}
            />
          )}
        </div>

        {/* Period button — 100pt wide, white bg, black text, bodyBold, 5pt radius */}
        {!isMonthView && (
          <div className="relative">
            <div
              className="flex items-center justify-center"
              style={{
                width: 100,
                padding: '12px 0',
                borderRadius: 5,
                background: '#E5E5E5',
              }}
            >
              <span className="font-mohave font-bold text-[16px] text-black whitespace-nowrap">
                {weekRangeLabel}
              </span>
            </div>
            {/* Black overlay during calendarWeek or calendarMonthPrompt */}
            {(phase === 'calendarWeek' || isMonthPrompt) && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: 5,
                }}
              />
            )}
          </div>
        )}

        {/* Period button for month mode */}
        {isMonthView && (
          <div
            className="flex items-center justify-center"
            style={{
              width: 100,
              padding: '12px 0',
              borderRadius: 5,
              background: '#E5E5E5',
            }}
          >
            <span className="font-mohave font-bold text-[16px] text-black whitespace-nowrap">
              {monthNames[today.getMonth()]}
            </span>
          </div>
        )}
      </div>

      {/* Dark overlay on all content below toggle during calendarMonthPrompt */}
      {isMonthPrompt && (
        <div
          className="absolute left-0 right-0 bottom-0 pointer-events-none"
          style={{
            top: TOOLTIP_TOP_INSET + 140, // below header + toggle row
            background: 'rgba(0, 0, 0, 0.6)',
            zIndex: 5,
          }}
        />
      )}

      {isMonthView ? (
        /* ===== MONTH VIEW — Scrollable multi-month grid ===== */
        <div className="flex-1" style={{ padding: '0 20px', paddingBottom: 120 }}>
          {multiMonthData.map((md, mIdx) => {
            const isCurrent = md.year === today.getFullYear() && md.month === today.getMonth()
            return (
              <div key={`${md.year}-${md.month}`} style={{ marginBottom: 24 }}>
                {/* Month label header */}
                <div className="flex items-center justify-between" style={{ padding: '8px 4px', marginBottom: 4 }}>
                  <span className="font-mohave font-bold text-[16px] text-white uppercase tracking-wider">
                    {md.label}
                  </span>
                  {isCurrent && (
                    <span className="font-kosugi text-[12px] text-ops-text-secondary">Today</span>
                  )}
                </div>

                {/* Card container for month grid — matching iOS #0D0D0D card */}
                <div
                  className="p-3"
                  style={{
                    background: '#0D0D0D',
                    borderRadius: 5,
                  }}
                >
                  {/* Day of week headers */}
                  <div className="grid grid-cols-7 mb-1">
                    {dayAbbreviations.map((abbr, i) => (
                      <div key={i} className="text-center font-kosugi text-[12px] text-ops-text-secondary py-1">
                        {abbr}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-px">
                    {/* Empty cells for offset */}
                    {Array.from({ length: md.startDay }, (_, i) => (
                      <div key={`empty-${i}`} style={{ height: 80 }} />
                    ))}

                    {/* Day cells */}
                    {Array.from({ length: md.daysInMonth }, (_, i) => {
                      const dayNum = i + 1
                      const isToday = isCurrent && dayNum === today.getDate()
                      const events = getEventsForDay(dayNum)
                      const allColors = [...events.map(e => e.color)]

                      if (userProject && isToday) {
                        allColors.unshift(userProject.taskTypeColor)
                      }
                      const displayBars = allColors.slice(0, 3)
                      const extraCount = allColors.length - 3

                      const eventNames = [
                        'Coating', 'Paving', 'Cleaning', 'Sealing', 'Demolition', 'Installation', 'Diagnostic'
                      ]

                      return (
                        <div
                          key={dayNum}
                          className="flex flex-col relative px-0.5 justify-start pt-1"
                          style={{ height: 80 }}
                        >
                          {/* Today highlight — white circle behind number */}
                          {isToday && (
                            <div
                              className="absolute"
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                background: 'white',
                                top: 2,
                                left: '50%',
                                transform: 'translateX(-50%)',
                              }}
                            />
                          )}
                          {/* Day number — bodyBold (16pt Mohave Bold) */}
                          <span
                            className="font-mohave font-bold relative z-10 self-center"
                            style={{
                              fontSize: 16,
                              color: isToday ? '#000000' : 'rgba(255,255,255,0.7)',
                              lineHeight: '24px',
                            }}
                          >
                            {dayNum}
                          </span>
                          {/* Event bars — 0.2 opacity bg, full color text */}
                          {displayBars.length > 0 && (
                            <div className="flex flex-col gap-[2px] mt-[2px] relative z-10 w-full px-[2px]">
                              {displayBars.map((color, j) => (
                                <div
                                  key={j}
                                  className="w-full overflow-hidden"
                                  style={{
                                    backgroundColor: `${color}33`,
                                    height: 10,
                                    borderRadius: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 2,
                                  }}
                                >
                                  <span
                                    className="font-kosugi truncate leading-none"
                                    style={{ fontSize: 7, color: color }}
                                  >
                                    {userProject && isToday && j === 0
                                      ? userProject.name.slice(0, 6)
                                      : eventNames[(dayNum + j) % eventNames.length].slice(0, 6)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* +N indicator */}
                          {extraCount > 0 && (
                            <span className="font-kosugi text-[7px] text-ops-text-tertiary relative z-10 mt-[1px] self-center">
                              +{extraCount}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ===== WEEK VIEW ===== */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Day selector row (CalendarDaySelector) — wrapped in card container */}
          <div style={{ padding: '0 20px 12px' }}>
            <div
              className="overflow-hidden"
              style={{ background: '#0D0D0D', borderRadius: 5 }}
              onTouchStart={handleDayRowTouchStart}
              onTouchMove={handleDayRowTouchMove}
              onTouchEnd={handleDayRowTouchEnd}
            >
              <div
                className="grid grid-cols-7"
                style={{
                  height: 60, // iOS: 60pt cell height
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
                        // Today: full cell accent fill at 50% opacity (NOT just a circle)
                        background: isToday ? 'rgba(65, 115, 148, 0.5)' : 'transparent',
                        // Selected: white 1px border outline
                        border: isSelected ? '1px solid rgba(255,255,255,0.8)' : '1px solid transparent',
                        borderRadius: 5, // iOS cornerRadius = 5
                        margin: 2,
                      }}
                    >
                      {/* Day abbreviation — caption font (14pt Kosugi) */}
                      <span
                        className="font-kosugi"
                        style={{
                          fontSize: 14,
                          color: isToday ? '#FFFFFF' : '#AAAAAA',
                        }}
                      >
                        {dayAbbreviations[i]}
                      </span>

                      {/* Date number — bodyBold (16pt Mohave Bold) */}
                      <span
                        className="font-mohave font-bold"
                        style={{
                          fontSize: 16,
                          color: isToday ? '#FFFFFF' : isSelected ? '#E5E5E5' : 'rgba(229, 229, 229, 0.8)',
                        }}
                      >
                        {day.getDate()}
                      </span>

                      {/* New event badge — top-right, white circle at 0.8 opacity, 16x16 */}
                      {newCount > 0 && (
                        <div
                          className="absolute flex items-center justify-center"
                          style={{
                            top: 4,
                            right: 2,
                            width: 16,
                            height: 16,
                            borderRadius: 8,
                            background: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          <span className="font-kosugi text-[12px] text-black font-bold">{newCount}</span>
                        </div>
                      )}
                      {/* Ongoing event badge — bottom-right, gray at 0.3 opacity, 14x14 */}
                      {ongoingCount > 0 && (
                        <div
                          className="absolute flex items-center justify-center"
                          style={{
                            bottom: 4,
                            right: 2,
                            width: 14,
                            height: 14,
                            borderRadius: 7,
                            background: 'rgba(128, 128, 128, 0.3)',
                          }}
                        >
                          <span className="font-kosugi text-ops-text-secondary" style={{ fontSize: 9, fontWeight: 500 }}>{ongoingCount}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Day header below selector — matching iOS ProjectListView sticky header */}
          <div style={{ padding: '0 20px 8px' }} className="flex items-center justify-between">
            <div className="flex items-baseline" style={{ gap: 8 }}>
              <span className="font-mohave text-[16px] uppercase tracking-wider text-white font-bold">
                {dayNames[activeDay.getDay()]}
              </span>
              <span className="font-kosugi text-[14px] text-ops-text-secondary">
                {monthNames[activeDay.getMonth()]} {activeDay.getDate()}
              </span>
            </div>
            {/* Event count card */}
            {dayScheduleItems.length > 0 && (
              <div
                className="px-2 py-1"
                style={{ background: '#0D0D0D', borderRadius: 5, border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span className="font-kosugi text-[12px] text-ops-text-secondary">
                  {dayScheduleItems.length} {dayScheduleItems.length === 1 ? 'event' : 'events'}
                </span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10 mx-5" />

          {/* Schedule list for selected day — matching iOS CalendarEventCard */}
          <div className="flex-1 overflow-y-auto pt-3" style={{ padding: '12px 20px 0' }}>
            <div className="flex flex-col" style={{ gap: 8 }}>
              {dayScheduleItems.map((item, i) => (
                <div
                  key={i}
                  className="overflow-hidden flex"
                  style={{
                    background: '#0D0D0D',
                    borderRadius: 5, // iOS cornerRadius
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {/* Left color bar (4px) */}
                  <div
                    className="flex-shrink-0"
                    style={{ width: 4, backgroundColor: item.color }}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex justify-between items-start" style={{ padding: 12 }}>
                    <div className="flex-1 min-w-0">
                      {/* Title — bodyBold (16pt Mohave Bold) uppercase */}
                      <span className="font-mohave font-bold text-[16px] text-white uppercase tracking-wide block truncate">
                        {item.name}
                      </span>
                      {/* Client name — caption (14pt Kosugi) */}
                      <span className="font-kosugi text-[14px] text-ops-text-secondary block truncate mt-0.5">
                        {item.clientName}
                      </span>
                      {/* Address — tertiary text */}
                      {item.address && (
                        <span className="font-kosugi text-[12px] text-ops-text-tertiary block truncate mt-0.5">
                          {item.address}
                        </span>
                      )}
                      {/* Time */}
                      <span className="font-kosugi text-[12px] text-ops-text-tertiary mt-1 block">
                        {item.time}
                      </span>
                    </div>

                    {/* Task type badge top-right — smallCaption (12pt Kosugi) */}
                    <span
                      className="font-kosugi flex-shrink-0 ml-2"
                      style={{
                        fontSize: 12,
                        padding: '3px 8px',
                        borderRadius: 4,
                        backgroundColor: `${item.color}20`,
                        color: item.color,
                      }}
                    >
                      {item.taskType}
                    </span>
                  </div>
                </div>
              ))}
            </div>

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
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
