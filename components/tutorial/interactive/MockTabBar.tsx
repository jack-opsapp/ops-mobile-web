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
      className="flex items-center justify-around"
      style={{
        background: '#0D0D0D',
        paddingTop: '12px',
        paddingBottom: '36px', // 12px + 24px safe area
        boxShadow: '0 -4px 12px rgba(0,0,0,0.5)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <div key={tab.id} className="flex flex-col items-center gap-1 flex-1">
            <tab.icon active={isActive} />
            <span
              className={`font-kosugi text-[12px] ${
                isActive ? 'text-white' : 'text-ops-text-tertiary'
              }`}
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? 'text-white' : 'text-ops-text-tertiary'}>
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BriefcaseIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? 'text-white' : 'text-ops-text-tertiary'}>
      <path d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? 'text-white' : 'text-ops-text-tertiary'}>
      <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GearIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? 'text-white' : 'text-ops-text-tertiary'}>
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
