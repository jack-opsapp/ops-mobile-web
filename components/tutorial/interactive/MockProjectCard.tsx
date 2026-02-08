'use client'

import type { DemoProject } from '@/lib/constants/demo-data'

// Status color mapping matching iOS Status.color (from xcassets)
const STATUS_COLORS: Record<string, string> = {
  rfq: '#BCBCBC',
  estimated: '#B5A381',
  accepted: '#9DB582',
  inProgress: '#8195B5',
  completed: '#B58289',
  closed: '#E9E9E9',
  archived: '#A182B5',
}

// Status display names matching iOS Status.displayName
const STATUS_LABELS: Record<string, string> = {
  rfq: 'RFQ',
  estimated: 'ESTIMATED',
  accepted: 'ACCEPTED',
  inProgress: 'IN PROGRESS',
  completed: 'COMPLETED',
  closed: 'CLOSED',
  archived: 'ARCHIVED',
}

interface MockProjectCardProps {
  project: DemoProject
  variant: 'dashboard' | 'list'
  isHighlighted?: boolean
  showShimmer?: boolean
  statusOverride?: string
  className?: string
  style?: React.CSSProperties
}

export function MockProjectCard({
  project,
  variant,
  isHighlighted = false,
  showShimmer = false,
  statusOverride,
  className = '',
  style,
}: MockProjectCardProps) {
  const effectiveStatus = statusOverride || project.status
  const statusColor = STATUS_COLORS[effectiveStatus] || '#417394'

  if (variant === 'dashboard') {
    return (
      <DashboardCard
        project={project}
        statusColor={statusColor}
        isHighlighted={isHighlighted}
        className={className}
        style={style}
      />
    )
  }

  return (
    <ListCard
      project={project}
      effectiveStatus={effectiveStatus}
      statusColor={statusColor}
      isHighlighted={isHighlighted}
      showShimmer={showShimmer}
      className={className}
      style={style}
    />
  )
}

// --- Dashboard variant (DirectionalDragCard from iOS) ---
// Used inside status columns in the paging dashboard view
function DashboardCard({
  project,
  statusColor,
  isHighlighted,
  className,
  style,
}: {
  project: DemoProject
  statusColor: string
  isHighlighted: boolean
  className: string
  style?: React.CSSProperties
}) {
  // Generate mock metadata for display
  const teamCount = project.crew ? 1 : 0
  const taskCount = 1
  const mockDate = 'Feb 12'

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        background: '#000000',
        borderRadius: 5,
        border: isHighlighted
          ? '2px solid rgba(65, 115, 148, 0.8)'
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isHighlighted
          ? '0 0 16px rgba(65, 115, 148, 0.25)'
          : 'none',
        ...style,
      }}
    >
      <div className="flex h-full">
        {/* Left status bar - 4px wide */}
        <div
          className="flex-shrink-0"
          style={{ width: 4, background: statusColor }}
        />

        {/* Content area */}
        <div className="flex-1 flex" style={{ padding: 12 }}>
          {/* Left content */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            {/* Project title - Mohave Medium, 16pt equivalent, white, uppercased, lineLimit 2 */}
            <p
              className="font-mohave font-medium text-white leading-tight uppercase"
              style={{
                fontSize: 14,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {project.name}
            </p>

            {/* Client name - Kosugi 14pt equivalent, secondaryText, lineLimit 1 */}
            <p
              className="font-kosugi text-ops-text-secondary truncate"
              style={{ fontSize: 11, marginTop: 2 }}
            >
              {project.clientName}
            </p>

            {/* Left metadata: calendar + date */}
            <div className="flex items-center gap-1 mt-1.5">
              <svg
                width="10"
                height="10"
                viewBox="0 0 16 16"
                fill="none"
                className="text-ops-text-tertiary flex-shrink-0"
              >
                <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <line x1="2" y1="6.5" x2="14" y2="6.5" stroke="currentColor" strokeWidth="1.5" />
                <line x1="5.5" y1="1.5" x2="5.5" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="10.5" y1="1.5" x2="10.5" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="font-kosugi text-ops-text-tertiary" style={{ fontSize: 10 }}>
                {mockDate}
              </span>
            </div>
          </div>

          {/* Right metadata column */}
          <div className="flex flex-col items-end justify-between ml-2 flex-shrink-0" style={{ gap: 2 }}>
            {/* Team member count */}
            {teamCount > 0 && (
              <div className="flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-ops-text-tertiary">
                  <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M1.5 13.5c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  <circle cx="11" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M11 9.5c2 0 3.5 1.2 3.5 3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <span className="font-kosugi text-ops-text-tertiary" style={{ fontSize: 10 }}>
                  {teamCount}
                </span>
              </div>
            )}

            {/* Task count */}
            <div className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-ops-text-tertiary">
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
                <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-kosugi text-ops-text-tertiary" style={{ fontSize: 10 }}>
                {taskCount}
              </span>
            </div>

            <div className="flex-1" />

            {/* Duration */}
            <div className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-ops-text-tertiary">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
                <path d="M8 4.5V8l2.5 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span className="font-kosugi text-ops-text-tertiary" style={{ fontSize: 10 }}>
                1d
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- List variant (UniversalJobBoardCard from iOS) ---
// Used in the scrollable project list view
function ListCard({
  project,
  effectiveStatus,
  statusColor,
  isHighlighted,
  showShimmer,
  className,
  style,
}: {
  project: DemoProject
  effectiveStatus: string
  statusColor: string
  isHighlighted: boolean
  showShimmer: boolean
  className: string
  style?: React.CSSProperties
}) {
  const teamCount = project.crew ? 1 : 0
  const taskCount = 1
  const mockAddress = '123 Miramar Rd'
  const mockDate = 'Feb 12'
  const statusLabel = STATUS_LABELS[effectiveStatus] || effectiveStatus.toUpperCase()

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        height: 80,
        background: '#0D0D0D',
        borderRadius: 5,
        border: showShimmer
          ? '2px solid #417394'
          : isHighlighted
            ? '2px solid rgba(65, 115, 148, 0.8)'
            : '1px solid rgba(255,255,255,0.2)',
        boxShadow: isHighlighted
          ? '0 0 16px rgba(65, 115, 148, 0.25)'
          : 'none',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Shimmer overlay - sweeping blue gradient */}
      {showShimmer && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: 80,
              background: 'linear-gradient(to right, transparent, rgba(65,115,148,0.15), rgba(65,115,148,0.25), rgba(65,115,148,0.15), transparent)',
              animation: 'cardShimmer 1.5s linear infinite',
            }}
          />
        </div>
      )}
      <div className="flex h-full" style={{ position: 'relative', zIndex: 2 }}>
        {/* Left status bar - 4px wide with transition for status animation */}
        <div
          className="flex-shrink-0"
          style={{
            width: 4,
            background: statusColor,
            transition: 'background 0.3s ease',
          }}
        />
        {/* Left content area */}
        <div className="flex-1 flex flex-col justify-end min-w-0" style={{ padding: 14 }}>
          {/* Title + subtitle block */}
          <div className="flex flex-col" style={{ gap: 2 }}>
            {/* Title - bodyBold / 16pt Mohave Medium, white, lineLimit 1 */}
            <p
              className="font-mohave font-medium text-white truncate uppercase"
              style={{ fontSize: 14, lineHeight: 1.2 }}
            >
              {project.name}
            </p>

            {/* Subtitle / client - caption / 14pt Kosugi, secondaryText, lineLimit 1 */}
            <p
              className="font-kosugi text-ops-text-secondary truncate"
              style={{ fontSize: 11, lineHeight: 1.3 }}
            >
              {project.clientName}
            </p>
          </div>

          {/* Metadata row - spacing 12 between items */}
          <div className="flex items-center mt-2" style={{ gap: 10, height: 14 }}>
            {/* Location */}
            <div className="flex items-center gap-1 min-w-0" style={{ maxWidth: '35%' }}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" className="text-ops-text-tertiary flex-shrink-0">
                <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              <span className="font-kosugi text-ops-text-tertiary truncate" style={{ fontSize: 10 }}>
                {mockAddress}
              </span>
            </div>

            {/* Calendar + date */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" className="text-ops-text-tertiary">
                <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                <line x1="2" y1="6.5" x2="14" y2="6.5" stroke="currentColor" strokeWidth="1.3" />
                <line x1="5.5" y1="1.5" x2="5.5" y2="4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <line x1="10.5" y1="1.5" x2="10.5" y2="4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span className="font-kosugi text-ops-text-tertiary" style={{ fontSize: 10 }}>
                {mockDate}
              </span>
            </div>

            {/* Person count */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" className="text-ops-text-tertiary">
                <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M1.5 13.5c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="11" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.3" />
                <path d="M11 9.5c2 0 3.5 1.2 3.5 3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span className="font-kosugi text-ops-text-tertiary" style={{ fontSize: 10 }}>
                {teamCount}
              </span>
            </div>
          </div>
        </div>

        {/* Right badges column */}
        <div className="flex flex-col items-end justify-between flex-shrink-0" style={{ padding: '8px 14px 8px 0', minWidth: 80 }}>
          {/* Top: Status badge — with transitions for status animation */}
          <span
            className="font-kosugi uppercase whitespace-nowrap"
            style={{
              fontSize: 12, // smallCaption (12pt Kosugi)
              lineHeight: 1,
              color: statusColor,
              padding: '4px 8px',
              borderRadius: 4,
              background: `${statusColor}1A`,
              border: `1px solid ${statusColor}`,
              transition: 'color 0.3s ease, background 0.3s ease, border-color 0.3s ease',
            }}
          >
            {statusLabel}
          </span>

          {/* Middle: Task count badge */}
          <span
            className="font-kosugi uppercase whitespace-nowrap"
            style={{
              fontSize: 12, // smallCaption (12pt Kosugi)
              lineHeight: 1,
              color: '#AAAAAA',
              padding: '4px 8px',
              borderRadius: 4,
              background: '#0D0D0D',
              border: '1px solid rgba(170,170,170,0.3)',
            }}
          >
            {taskCount} {taskCount === 1 ? 'TASK' : 'TASKS'}
          </span>

          {/* Bottom: Placeholder for unscheduled badge (empty to maintain spacing) */}
          <div style={{ height: 0 }} />
        </div>
      </div>
    </div>
  )
}
