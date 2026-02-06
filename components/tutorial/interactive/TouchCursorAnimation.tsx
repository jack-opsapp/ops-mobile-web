'use client'

import { useEffect, useState } from 'react'

interface TouchCursorAnimationProps {
  type: 'drag-right' | 'swipe-right' | 'scroll-down'
  startX: number
  startY: number
  visible: boolean
}

export function TouchCursorAnimation({ type, startX, startY, visible }: TouchCursorAnimationProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    if (!visible) {
      setOffset({ x: 0, y: 0 })
      setOpacity(1)
      return
    }

    let frame: number
    let start: number | null = null
    const duration = type === 'scroll-down' ? 2000 : 1500

    function animate(timestamp: number) {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)

      // Easing: ease-in-out
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      if (type === 'drag-right' || type === 'swipe-right') {
        setOffset({ x: eased * 160, y: 0 })
      } else {
        setOffset({ x: 0, y: eased * 100 })
      }

      // Fade out at end
      if (progress > 0.8) {
        setOpacity(1 - (progress - 0.8) / 0.2)
      } else {
        setOpacity(1)
      }

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      } else {
        // Loop
        start = null
        setOffset({ x: 0, y: 0 })
        setOpacity(1)
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [visible, type])

  if (!visible) return null

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: startX + offset.x,
        top: startY + offset.y,
        opacity,
        zIndex: 55,
        transition: 'opacity 0.1s',
      }}
    >
      {/* Touch indicator circle */}
      <div
        className="w-12 h-12 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 50%, transparent 70%)',
          boxShadow: '0 0 20px rgba(255,255,255,0.3)',
        }}
      />
    </div>
  )
}
