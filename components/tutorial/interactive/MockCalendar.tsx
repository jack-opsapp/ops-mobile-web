'use client'

import { useState } from 'react'
import type { TutorialPhase } from '@/lib/tutorial/TutorialPhase'

interface MockCalendarProps {
  phase: TutorialPhase
  onMonthTap: () => void
}

export function MockCalendar({ phase, onMonthTap }: MockCalendarProps) {
  const isMonthView = phase === 'calendarMonth'
  const showMonthToggle = phase === 'calendarMonthPrompt' || phase === 'calendarMonth'

  // Generate mock week days
  const today = new Date()
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - today.getDay() + i)
    return d
  })

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Mock task dots for week view (some days have tasks)
  const taskDots: Record<number, { color: string; label: string }[]> = {
    1: [{ color: '#5A7BD4', label: 'Flight Deck Coating' }],
    2: [{ color: '#B088D4', label: "O'Club Patio" }, { color: '#D47B9F', label: 'Hangar Siding' }],
    3: [{ color: '#5A7BD4', label: 'Flight Deck Coating' }],
    4: [{ color: '#8EC8E8', label: "Charlie's Driveway" }],
    5: [{ color: '#5AC8D4', label: 'Runway Crack Repair' }],
  }

  // Month grid
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const startDow = firstDay.getDay()

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 flex items-center justify-between">
        <h2 className="font-mohave font-bold text-[18px] text-white">Schedule</h2>
        <div className="flex items-center gap-1 rounded-ops overflow-hidden border border-white/10">
          <button
            className={`px-3 py-1 font-mohave text-[12px] font-medium transition-all ${
              !isMonthView && !showMonthToggle ? 'bg-ops-accent text-white' : !isMonthView ? 'bg-ops-accent text-white' : 'text-ops-text-secondary hover:text-white'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => phase === 'calendarMonthPrompt' && onMonthTap()}
            className={`px-3 py-1 font-mohave text-[12px] font-medium transition-all ${
              isMonthView ? 'bg-ops-accent text-white' : phase === 'calendarMonthPrompt' ? 'text-ops-accent border border-ops-accent/40 rounded' : 'text-ops-text-secondary'
            }`}
            style={phase === 'calendarMonthPrompt' ? {
              boxShadow: '0 0 8px rgba(89, 119, 159, 0.3)',
            } : undefined}
          >
            Month
          </button>
        </div>
      </div>

      {/* Month/Year */}
      <div className="px-3 pb-2">
        <span className="font-mohave text-[14px] text-ops-text-secondary">
          {monthNames[today.getMonth()]} {today.getFullYear()}
        </span>
      </div>

      {isMonthView ? (
        /* Month View */
        <div className="px-3 flex-1">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-px mb-1">
            {dayNames.map(d => (
              <div key={d} className="text-center font-kosugi text-[9px] text-ops-text-tertiary py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-px">
            {/* Empty cells for offset */}
            {Array.from({ length: startDow }, (_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const dayNum = i + 1
              const isToday = dayNum === today.getDate()
              const hasTasks = dayNum % 3 === 0 || dayNum % 5 === 0

              return (
                <div
                  key={dayNum}
                  className={`aspect-square flex flex-col items-center justify-center rounded ${
                    isToday ? 'bg-ops-accent/20 border border-ops-accent/40' : ''
                  }`}
                >
                  <span className={`font-mohave text-[11px] ${isToday ? 'text-ops-accent font-bold' : 'text-white/80'}`}>
                    {dayNum}
                  </span>
                  {hasTasks && (
                    <div className="flex gap-0.5 mt-0.5">
                      <div className="w-1 h-1 rounded-full bg-ops-accent" />
                      {dayNum % 6 === 0 && <div className="w-1 h-1 rounded-full bg-ops-warning" />}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* Week View */
        <div className="px-3 flex-1">
          {/* Day columns */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day, i) => {
              const isToday = day.getDate() === today.getDate()
              const dots = taskDots[i] || []

              return (
                <div key={i} className="flex flex-col items-center">
                  {/* Day name */}
                  <span className={`font-kosugi text-[9px] ${isToday ? 'text-ops-accent' : 'text-ops-text-tertiary'}`}>
                    {dayNames[i]}
                  </span>
                  {/* Day number */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${
                      isToday ? 'bg-ops-accent' : ''
                    }`}
                  >
                    <span className={`font-mohave text-[12px] ${isToday ? 'text-white font-bold' : 'text-white/70'}`}>
                      {day.getDate()}
                    </span>
                  </div>
                  {/* Task dots */}
                  <div className="flex flex-col gap-1 mt-2 w-full">
                    {dots.map((dot, j) => (
                      <div
                        key={j}
                        className="rounded px-1 py-0.5"
                        style={{ background: `${dot.color}30` }}
                      >
                        <span className="font-kosugi text-[7px] leading-tight" style={{ color: dot.color }}>
                          {dot.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
