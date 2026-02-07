'use client'

interface MockTabBarProps {
  activeTab: 'home' | 'jobs' | 'schedule' | 'settings'
}

export function MockTabBar({ activeTab }: MockTabBarProps) {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: HomeIcon },
    { id: 'jobs' as const, label: 'Jobs', icon: BriefcaseIcon },
    { id: 'schedule' as const, label: 'Schedule', icon: CalendarIcon },
    { id: 'settings' as const, label: 'Settings', icon: GearIcon },
  ]

  return (
    <div
      className="flex items-end justify-around relative"
      style={{
        height: 100,
        background: 'rgba(13, 13, 13, 0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        paddingBottom: 24, // safe area
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <div key={tab.id} className="flex flex-col items-center flex-1" style={{ gap: 4, paddingTop: 10 }}>
            {/* Active indicator bar — 28px wide, 3px tall, accent color */}
            <div
              style={{
                width: 28,
                height: 3,
                borderRadius: 1.5,
                background: isActive ? '#417394' : 'transparent',
                marginBottom: 4,
                transition: 'background 0.2s ease',
              }}
            />
            <tab.icon active={isActive} />
            <span
              className="font-kosugi"
              style={{
                fontSize: 10,
                color: isActive ? '#417394' : 'rgba(167, 167, 167, 0.8)',
                transition: 'color 0.2s ease',
              }}
            >
              {tab.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ color: active ? '#417394' : 'rgba(167, 167, 167, 0.8)' }}>
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BriefcaseIcon({ active }: { active: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ color: active ? '#417394' : 'rgba(167, 167, 167, 0.8)' }}>
      <path d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ color: active ? '#417394' : 'rgba(167, 167, 167, 0.8)' }}>
      <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GearIcon({ active }: { active: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ color: active ? '#417394' : 'rgba(167, 167, 167, 0.8)' }}>
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
