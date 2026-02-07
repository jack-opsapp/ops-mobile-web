'use client'

import { useEffect, useState } from 'react'

interface SpotlightRect {
  top: number
  left: number
  width: number
  height: number
  borderRadius?: number
}

interface SpotlightOverlayProps {
  target: SpotlightRect | null
  visible: boolean
}

export function SpotlightOverlay({ target, visible }: SpotlightOverlayProps) {
  const [animatedTarget, setAnimatedTarget] = useState(target)

  // Smooth transition of spotlight position
  useEffect(() => {
    if (target) {
      setAnimatedTarget(target)
    }
  }, [target])

  if (!visible) return null

  // Build SVG mask with cutout
  const r = animatedTarget?.borderRadius ?? 12
  const padding = 4 // extra padding around spotlight

  return (
    <div
      className="absolute inset-0 transition-opacity duration-300"
      style={{
        zIndex: 40,
        pointerEvents: animatedTarget ? 'none' : 'auto',
      }}
    >
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {animatedTarget && (
              <rect
                x={animatedTarget.left - padding}
                y={animatedTarget.top - padding}
                width={animatedTarget.width + padding * 2}
                height={animatedTarget.height + padding * 2}
                rx={r}
                ry={r}
                fill="black"
                className="transition-all duration-300 ease-in-out"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.75)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Accent border around cutout */}
      {animatedTarget && (
        <div
          className="absolute transition-all duration-300 ease-in-out pointer-events-none"
          style={{
            top: animatedTarget.top - padding - 1,
            left: animatedTarget.left - padding - 1,
            width: animatedTarget.width + (padding + 1) * 2,
            height: animatedTarget.height + (padding + 1) * 2,
            borderRadius: r + padding,
            border: '1px solid rgba(65, 115, 148, 0.5)',
            boxShadow: '0 0 12px rgba(65, 115, 148, 0.3)',
          }}
        />
      )}
    </div>
  )
}
