'use client'

import { useState, useEffect, useRef } from 'react'

interface CollapsibleTooltipProps {
  title: string
  description: string
  phaseKey: string // used to retrigger typewriter on phase change
}

export function CollapsibleTooltip({ title, description, phaseKey }: CollapsibleTooltipProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [displayTitle, setDisplayTitle] = useState('')
  const [displayDesc, setDisplayDesc] = useState('')
  const [titleDone, setTitleDone] = useState(false)
  const [descDone, setDescDone] = useState(false)
  const titleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const descTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Reset and start typewriter on phase change
  useEffect(() => {
    setCollapsed(false)
    setDisplayTitle('')
    setDisplayDesc('')
    setTitleDone(false)
    setDescDone(false)

    if (titleTimerRef.current) clearInterval(titleTimerRef.current)
    if (descTimerRef.current) clearInterval(descTimerRef.current)

    if (!title) return

    // Title typewriter: 20ms per char
    let ti = 0
    titleTimerRef.current = setInterval(() => {
      ti++
      setDisplayTitle(title.slice(0, ti))
      if (ti >= title.length) {
        if (titleTimerRef.current) clearInterval(titleTimerRef.current)
        setTitleDone(true)
      }
    }, 20)

    return () => {
      if (titleTimerRef.current) clearInterval(titleTimerRef.current)
      if (descTimerRef.current) clearInterval(descTimerRef.current)
    }
  }, [phaseKey, title])

  // Start description after title finishes: 15ms per char
  useEffect(() => {
    if (!titleDone || !description) return

    let di = 0
    descTimerRef.current = setInterval(() => {
      di++
      setDisplayDesc(description.slice(0, di))
      if (di >= description.length) {
        if (descTimerRef.current) clearInterval(descTimerRef.current)
        setDescDone(true)
      }
    }, 15)

    return () => {
      if (descTimerRef.current) clearInterval(descTimerRef.current)
    }
  }, [titleDone, description])

  if (!title) return null

  return (
    <div
      className="mx-4 mt-4 rounded-ops overflow-hidden transition-all duration-300 cursor-pointer select-none"
      style={{
        background: '#0D0D0D',
        border: '1px solid rgba(89, 119, 159, 0.4)',
        boxShadow: '0 0 20px rgba(0,0,0,0.8), 0 8px 40px rgba(0,0,0,0.6), 0 12px 60px rgba(0,0,0,0.4)',
      }}
      onClick={() => setCollapsed(!collapsed)}
    >
      <div className="px-4 py-3 flex items-start gap-3">
        {/* Lightbulb icon */}
        <div className="flex-shrink-0 mt-0.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-ops-accent">
            <path d="M9 21h6M12 3a6 6 0 0 0-4 10.5V17h8v-3.5A6 6 0 0 0 12 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className="font-mohave font-bold text-[16px] text-white leading-tight">
            {displayTitle}
            {!titleDone && (
              <span className="animate-cursor-blink text-ops-accent">|</span>
            )}
          </p>

          {/* Description */}
          {!collapsed && titleDone && description && (
            <p className="font-kosugi text-[13px] text-ops-text-secondary leading-snug mt-1.5">
              {displayDesc}
              {!descDone && (
                <span className="animate-cursor-blink text-ops-accent">|</span>
              )}
            </p>
          )}
        </div>

        {/* Collapse indicator */}
        <div className="flex-shrink-0 mt-1">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className={`text-ops-text-tertiary transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}
