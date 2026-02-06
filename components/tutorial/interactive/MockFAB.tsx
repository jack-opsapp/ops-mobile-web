'use client'

import { useState, useEffect } from 'react'
import type { TutorialPhase } from '@/lib/tutorial/TutorialPhase'

interface MockFABProps {
  phase: TutorialPhase
  onFABTap: () => void
  onCreateProject: () => void
}

export function MockFAB({ phase, onFABTap, onCreateProject }: MockFABProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [pulsing, setPulsing] = useState(false)

  // Pulsing on jobBoardIntro
  useEffect(() => {
    setPulsing(phase === 'jobBoardIntro')
    setMenuOpen(phase === 'fabTap')
  }, [phase])

  const handleFABClick = () => {
    if (phase === 'jobBoardIntro') {
      onFABTap()
    }
  }

  const handleCreateProject = () => {
    if (phase === 'fabTap') {
      onCreateProject()
    }
  }

  if (phase !== 'jobBoardIntro' && phase !== 'fabTap') return null

  return (
    <div className="absolute bottom-20 right-4" style={{ zIndex: 30 }}>
      {/* Menu items */}
      {menuOpen && (
        <div className="mb-3 space-y-2 animate-fade-in">
          <button
            onClick={handleCreateProject}
            className="flex items-center gap-2 px-4 py-2.5 rounded-ops bg-ops-card border border-ops-accent/40 hover:border-ops-accent transition-colors w-full"
            style={{
              boxShadow: '0 0 12px rgba(89, 119, 159, 0.3)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-ops-accent">
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-mohave font-semibold text-[13px] text-white">Create Project</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-ops bg-ops-card border border-white/10 opacity-40 w-full pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-ops-text-tertiary">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="font-mohave text-[13px] text-ops-text-tertiary">Create Task</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-ops bg-ops-card border border-white/10 opacity-40 w-full pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-ops-text-tertiary">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="font-mohave text-[13px] text-ops-text-tertiary">Add Client</span>
          </button>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={handleFABClick}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ml-auto ${
          menuOpen ? 'bg-ops-text-tertiary rotate-45' : 'bg-ops-accent'
        }`}
        style={{
          boxShadow: pulsing
            ? '0 0 0 0 rgba(89, 119, 159, 0.7)'
            : '0 4px 12px rgba(0,0,0,0.4)',
          animation: pulsing ? 'fab-pulse 1.5s ease-in-out infinite' : 'none',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      <style jsx>{`
        @keyframes fab-pulse {
          0% { box-shadow: 0 0 0 0 rgba(89, 119, 159, 0.7); }
          70% { box-shadow: 0 0 0 16px rgba(89, 119, 159, 0); }
          100% { box-shadow: 0 0 0 0 rgba(89, 119, 159, 0); }
        }
      `}</style>
    </div>
  )
}
