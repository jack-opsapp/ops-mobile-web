'use client'

import { useState, useRef, useEffect } from 'react'
import { DEMO_CLIENTS } from '@/lib/constants/demo-data'
import type { TutorialPhase } from '@/lib/tutorial/TutorialPhase'

interface MockProjectFormProps {
  phase: TutorialPhase
  visible: boolean
  selectedClient: string | null
  projectName: string
  hasTask: boolean // whether user has added a task
  onSelectClient: (name: string) => void
  onProjectNameChange: (name: string) => void
  onAddTask: () => void
  onCreate: () => void
}

export function MockProjectForm({
  phase,
  visible,
  selectedClient,
  projectName,
  hasTask,
  onSelectClient,
  onProjectNameChange,
  onAddTask,
  onCreate,
}: MockProjectFormProps) {
  const [showClientDropdown, setShowClientDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const clientRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const addTaskRef = useRef<HTMLDivElement>(null)
  const createRef = useRef<HTMLDivElement>(null)

  // Auto-show client dropdown when phase is projectFormClient
  useEffect(() => {
    if (phase === 'projectFormClient') {
      setShowClientDropdown(true)
    } else {
      setShowClientDropdown(false)
    }
  }, [phase])

  // Auto-focus input on name phase
  useEffect(() => {
    if (phase === 'projectFormName' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [phase])

  const isFieldActive = (field: 'client' | 'name' | 'addTask' | 'create') => {
    switch (field) {
      case 'client': return phase === 'projectFormClient'
      case 'name': return phase === 'projectFormName'
      case 'addTask': return phase === 'projectFormAddTask'
      case 'create': return phase === 'projectFormComplete'
    }
  }

  if (!visible) return null

  return (
    <div
      className="absolute inset-x-0 bottom-0 animate-fade-up"
      style={{
        zIndex: 50,
        maxHeight: '85%',
      }}
    >
      <div
        className="rounded-t-2xl overflow-hidden flex flex-col"
        style={{
          background: '#0D0D0D',
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 'none',
          maxHeight: '85vh',
        }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="px-4 pb-3 border-b border-white/10">
          <h3 className="font-mohave font-bold text-[18px] text-white">New Project</h3>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {/* Client field */}
          <div ref={clientRef}>
            <label className="font-kosugi text-[11px] text-ops-text-secondary uppercase tracking-wider mb-1.5 block">
              Client
            </label>
            <div
              className={`rounded-ops px-3 py-2.5 border transition-all duration-200 ${
                isFieldActive('client')
                  ? 'border-ops-accent/60 bg-ops-card'
                  : selectedClient
                    ? 'border-white/10 bg-ops-card'
                    : 'border-white/10 bg-ops-card opacity-60'
              }`}
              style={isFieldActive('client') ? {
                boxShadow: '0 0 8px rgba(89, 119, 159, 0.2)',
              } : undefined}
            >
              {selectedClient ? (
                <span className="font-mohave text-[14px] text-white">{selectedClient}</span>
              ) : (
                <span className="font-mohave text-[14px] text-ops-text-tertiary">Select a client...</span>
              )}
            </div>

            {/* Dropdown */}
            {showClientDropdown && (
              <div className="mt-1 rounded-ops overflow-hidden border border-white/10 bg-[#111111]">
                {DEMO_CLIENTS.map(client => (
                  <button
                    key={client.id}
                    onClick={() => onSelectClient(client.name)}
                    className="w-full text-left px-3 py-2.5 font-mohave text-[14px] text-white hover:bg-white/5 active:bg-white/10 transition-colors border-b border-white/5 last:border-b-0"
                  >
                    {client.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Name field */}
          <div ref={nameRef}>
            <label className="font-kosugi text-[11px] text-ops-text-secondary uppercase tracking-wider mb-1.5 block">
              Project Name
            </label>
            <div
              className={`rounded-ops overflow-hidden border transition-all duration-200 ${
                isFieldActive('name')
                  ? 'border-ops-accent/60'
                  : projectName
                    ? 'border-white/10'
                    : 'border-white/10 opacity-60'
              }`}
              style={isFieldActive('name') ? {
                boxShadow: '0 0 8px rgba(89, 119, 159, 0.2)',
              } : undefined}
            >
              <input
                ref={inputRef}
                type="text"
                value={projectName}
                onChange={(e) => onProjectNameChange(e.target.value)}
                placeholder="Enter project name..."
                disabled={!isFieldActive('name')}
                className="w-full bg-ops-card px-3 py-2.5 font-mohave text-[14px] text-white placeholder:text-ops-text-tertiary outline-none disabled:opacity-60"
              />
            </div>
          </div>

          {/* Tasks section */}
          <div>
            <label className="font-kosugi text-[11px] text-ops-text-secondary uppercase tracking-wider mb-1.5 block">
              Tasks
            </label>

            {hasTask && (
              <div className="rounded-ops bg-ops-card border border-white/10 px-3 py-2.5 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-ops-success" />
                  <span className="font-mohave text-[13px] text-white">Task added</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-ops-success ml-auto">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            )}

            {/* Add Task button */}
            <div ref={addTaskRef}>
              <button
                onClick={onAddTask}
                disabled={!isFieldActive('addTask')}
                className={`w-full rounded-ops px-3 py-2.5 border border-dashed transition-all duration-200 flex items-center justify-center gap-2 ${
                  isFieldActive('addTask')
                    ? 'border-ops-accent/60 bg-ops-accent/5 hover:bg-ops-accent/10'
                    : 'border-white/20 opacity-50'
                }`}
                style={isFieldActive('addTask') ? {
                  boxShadow: '0 0 8px rgba(89, 119, 159, 0.2)',
                } : undefined}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={isFieldActive('addTask') ? 'text-ops-accent' : 'text-ops-text-tertiary'}>
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className={`font-mohave font-semibold text-[13px] ${isFieldActive('addTask') ? 'text-ops-accent' : 'text-ops-text-tertiary'}`}>
                  ADD TASK
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Create button */}
        <div ref={createRef} className="px-4 pb-6 pt-3 border-t border-white/10">
          <button
            onClick={onCreate}
            disabled={!isFieldActive('create')}
            className={`w-full h-12 rounded-ops font-mohave font-semibold text-[15px] tracking-wide transition-all duration-200 ${
              isFieldActive('create')
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-white/20 text-white/40'
            }`}
            style={isFieldActive('create') ? {
              boxShadow: '0 0 12px rgba(255,255,255,0.15)',
            } : undefined}
          >
            CREATE
          </button>
        </div>
      </div>
    </div>
  )
}
