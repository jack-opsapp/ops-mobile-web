'use client'

import type { DemoProject } from '@/lib/constants/demo-data'

interface MockProjectCardProps {
  project: DemoProject
  compact?: boolean
  highlighted?: boolean
  className?: string
  style?: React.CSSProperties
}

export function MockProjectCard({ project, compact = false, highlighted = false, className = '', style }: MockProjectCardProps) {
  return (
    <div
      className={`rounded-ops overflow-hidden ${className}`}
      style={{
        background: '#0D0D0D',
        border: highlighted
          ? '1px solid rgba(89, 119, 159, 0.6)'
          : '1px solid rgba(255,255,255,0.1)',
        boxShadow: highlighted
          ? '0 0 12px rgba(89, 119, 159, 0.2)'
          : 'none',
        minWidth: compact ? 140 : 160,
        ...style,
      }}
    >
      {/* Top color stripe */}
      <div className="h-1" style={{ background: project.taskTypeColor }} />

      <div className={compact ? 'px-2.5 py-2' : 'px-3 py-2.5'}>
        {/* Project name */}
        <p className={`font-mohave font-semibold text-white leading-tight ${compact ? 'text-[12px]' : 'text-[13px]'}`}>
          {project.name}
        </p>

        {/* Client */}
        <p className={`font-kosugi text-ops-text-secondary mt-0.5 ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
          {project.clientName}
        </p>

        {/* Task type pill */}
        <div className="mt-1.5 flex items-center gap-1.5">
          <span
            className="px-1.5 py-0.5 rounded-full text-[9px] font-kosugi font-medium"
            style={{
              background: `${project.taskTypeColor}20`,
              color: project.taskTypeColor,
            }}
          >
            {project.taskType}
          </span>
          {project.crew && (
            <span className="text-[9px] font-kosugi text-ops-text-tertiary">
              {project.crew}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
