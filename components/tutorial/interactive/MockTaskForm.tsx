'use client'

import { useState } from 'react'
import { DEMO_TASK_TYPES, DEMO_CREW, DEMO_DATE_OPTIONS } from '@/lib/constants/demo-data'
import type { TutorialPhase } from '@/lib/tutorial/TutorialPhase'

interface MockTaskFormProps {
  phase: TutorialPhase
  visible: boolean
  selectedType: string | null
  selectedCrew: string | null
  selectedDate: string | null
  onSelectType: (type: string) => void
  onSelectCrew: (crew: string) => void
  onSelectDate: (date: string) => void
  onDone: () => void
}

export function MockTaskForm({
  phase,
  visible,
  selectedType,
  selectedCrew,
  selectedDate,
  onSelectType,
  onSelectCrew,
  onSelectDate,
  onDone,
}: MockTaskFormProps) {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [showCrewList, setShowCrewList] = useState(false)

  // Derive selected task type object from name
  const selectedTaskTypeObj = selectedType
    ? DEMO_TASK_TYPES.find(t => t.name === selectedType) ?? null
    : null

  // Color for the left bar on task type field and preview
  const typeColor = selectedTaskTypeObj?.color ?? null

  const isFieldActive = (field: 'type' | 'crew' | 'date' | 'done') => {
    switch (field) {
      case 'type': return phase === 'taskFormType'
      case 'crew': return phase === 'taskFormCrew'
      case 'date': return phase === 'taskFormDate'
      case 'done': return phase === 'taskFormDone'
    }
  }

  // Whether the field is in an inactive/dimmed tutorial state
  const isFieldDimmed = (field: 'type' | 'crew' | 'date') => {
    return !isFieldActive(field) && phase !== 'taskFormDone'
  }

  if (!visible) return null

  const handleTypeSelect = (typeName: string) => {
    onSelectType(typeName)
    setShowTypeDropdown(false)
  }

  const handleCrewSelect = (crewShort: string) => {
    onSelectCrew(crewShort)
    setShowCrewList(false)
  }

  return (
    <div
      className="absolute inset-x-0 bottom-0 animate-fade-up"
      style={{ zIndex: 52 }}
    >
      <div
        className="overflow-hidden flex flex-col"
        style={{
          background: '#000000',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: '92vh',
        }}
      >
        {/* Header: CANCEL | CREATE TASK | DONE */}
        <div className="relative flex items-center px-4 py-3" style={{ background: '#000000' }}>
          {/* Cancel - left */}
          <span
            className="font-mohave font-medium text-[16px] uppercase"
            style={{ color: '#777777', opacity: 0.5 }}
          >
            Cancel
          </span>

          {/* CREATE TASK - center */}
          <span className="absolute left-1/2 -translate-x-1/2 font-mohave font-medium text-[16px] text-white uppercase">
            Create Task
          </span>

          {/* DONE - right */}
          <button
            onClick={onDone}
            disabled={!isFieldActive('done')}
            className={`ml-auto font-mohave font-medium text-[16px] uppercase transition-all duration-300 ${
              isFieldActive('done')
                ? 'text-[#59779F]'
                : 'text-[#777777]'
            }`}
            style={{
              padding: '4px 8px',
              borderRadius: 6,
              ...(isFieldActive('done') ? {
                border: '2px solid #59779F',
                animation: 'tutorialPulse 1.2s ease-in-out infinite',
              } : {}),
            }}
          >
            Done
          </button>
        </div>

        {/* Divider below header */}
        <div className="h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />

        {/* taskFormDone: dark overlay over content + radial gradient */}
        <div className="relative flex-1 overflow-y-auto">
          {/* Scrollable form content */}
          <div className="px-4 py-4 space-y-6">
            {/* Step 9: Extra top padding to push header below tooltip */}
            {phase === 'taskFormDone' && <div style={{ height: 90 }} />}

            {/* Preview Card (greyed out at 0.3 opacity) */}
            <div style={{ opacity: 0.3 }} className="pointer-events-none">
              <div
                className="flex overflow-hidden"
                style={{
                  background: '#0D0D0D',
                  borderRadius: '5px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {/* Left color bar */}
                <div
                  className="w-1 flex-shrink-0"
                  style={{ background: typeColor ?? '#AAAAAA' }}
                />

                {/* Content */}
                <div className="flex-1 p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      {/* Task type name */}
                      <div className="font-mohave font-bold text-[14px] text-white uppercase truncate">
                        {selectedType ?? 'SELECT TASK TYPE'}
                      </div>
                      {/* Project subtitle */}
                      <div className="font-kosugi text-[11px] text-[#AAAAAA] mt-0.5 truncate">
                        New Project
                      </div>
                      {/* Metadata row */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-[#777777]">
                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          <span className="font-kosugi text-[10px] text-[#777777]">
                            {selectedDate ?? '—'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-[#777777]">
                            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                            <path d="M2 21v-1a5 5 0 015-5h4a5 5 0 015 5v1" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="17" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                            <path d="M21 21v-1a3 3 0 00-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          <span className="font-kosugi text-[10px] text-[#777777]">
                            {selectedCrew ? '1' : '0'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side: status badge + unscheduled badge */}
                    <div className="flex flex-col items-end gap-1 ml-2 flex-shrink-0">
                      {/* Status badge */}
                      <span
                        className="font-kosugi text-[10px] px-2 py-0.5 rounded"
                        style={{
                          color: '#59779F',
                          background: 'rgba(89,119,159,0.1)',
                          border: '1px solid #59779F',
                        }}
                      >
                        BOOKED
                      </span>
                      {/* Unscheduled badge */}
                      {!selectedDate && (
                        <span
                          className="font-kosugi text-[10px] px-2 py-0.5 rounded"
                          style={{
                            color: '#C4A868',
                            background: 'rgba(196,168,104,0.1)',
                            border: '1px solid #C4A868',
                          }}
                        >
                          UNSCHEDULED
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TASK DETAILS Section Header */}
            <div className="flex items-center gap-[2px]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#AAAAAA]">
                <path d="M9 5h11M9 12h11M9 19h11M5 5h.01M5 12h.01M5 19h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="font-kosugi font-normal text-[14px] text-[#AAAAAA] uppercase tracking-wider">
                TASK DETAILS
              </span>
            </div>

            {/* 1. Task Type Field */}
            <div
              style={{ opacity: isFieldDimmed('type') ? 0.5 : 1 }}
              className="transition-opacity duration-200"
            >
              {/* Label row */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`font-kosugi font-normal text-[14px] uppercase tracking-wider transition-colors duration-300 ${
                    isFieldActive('type') ? 'text-[#59779F]' : 'text-[#AAAAAA]'
                  }`}
                  style={isFieldActive('type') ? {
                    animation: 'tutorialPulse 1.2s ease-in-out infinite',
                  } : undefined}
                >
                  TASK TYPE
                </span>
                <span
                  className="font-kosugi text-[10px] text-[#777777] flex items-center gap-1"
                  style={{ opacity: 0.5 }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-[#777777]">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  NEW TYPE
                </span>
              </div>

              {/* Task type selector with colored left border */}
              <button
                onClick={() => isFieldActive('type') && setShowTypeDropdown(!showTypeDropdown)}
                disabled={!isFieldActive('type')}
                className="w-full transition-all duration-200"
              >
                <div
                  className="flex overflow-hidden"
                  style={{
                    borderRadius: '5px',
                    border: isFieldActive('type')
                      ? '2px solid #59779F'
                      : '1px solid rgba(255,255,255,0.1)',
                    ...(isFieldActive('type') ? {
                      animation: 'tutorialPulse 1.2s ease-in-out infinite',
                    } : {}),
                  }}
                >
                  {/* Colored left bar */}
                  <div
                    className="w-1 flex-shrink-0"
                    style={{ background: typeColor ?? 'rgba(255,255,255,0.1)' }}
                  />

                  <div className="flex items-center justify-between flex-1 px-4 py-3">
                    <span className={`font-mohave text-[16px] ${selectedType ? 'text-white' : 'text-[#777777]'}`}>
                      {selectedType ? selectedType.toUpperCase() : 'Select Task Type'}
                    </span>
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none"
                      className={`text-[#AAAAAA] transition-transform duration-200 ${showTypeDropdown ? 'rotate-180' : ''}`}
                    >
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </button>

              {/* Type dropdown */}
              {showTypeDropdown && isFieldActive('type') && (
                <div
                  className="mt-1 overflow-hidden max-h-[200px] overflow-y-auto"
                  style={{
                    borderRadius: '5px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: '#0D0D0D',
                  }}
                >
                  {DEMO_TASK_TYPES.map((type, idx) => (
                    <button
                      key={type.id}
                      onClick={() => handleTypeSelect(type.name)}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 active:bg-white/10 transition-colors"
                      style={{
                        borderBottom: idx < DEMO_TASK_TYPES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      }}
                    >
                      {/* Colored dot */}
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ background: type.color }}
                      />
                      <span className="font-mohave text-[16px] text-white uppercase">
                        {type.name}
                      </span>
                      {selectedType === type.name && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#59779F] ml-auto">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Status Field (always disabled at 0.5 opacity in tutorial) */}
            <div style={{ opacity: 0.5 }} className="pointer-events-none">
              <span className="font-kosugi font-normal text-[14px] text-[#AAAAAA] uppercase tracking-wider mb-2 block">
                STATUS
              </span>
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{
                  borderRadius: '5px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span className="font-mohave text-[16px] text-white">Booked</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#AAAAAA]">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* 3. Team / Assign Crew Field */}
            <div
              style={{ opacity: isFieldDimmed('crew') ? 0.5 : 1 }}
              className="transition-opacity duration-200"
            >
              <span
                className={`font-kosugi font-normal text-[14px] uppercase tracking-wider mb-2 block transition-colors duration-300 ${
                  isFieldActive('crew') ? 'text-[#59779F]' : 'text-[#AAAAAA]'
                }`}
                style={isFieldActive('crew') ? {
                  animation: 'tutorialPulse 1.2s ease-in-out infinite',
                } : undefined}
              >
                ASSIGN TEAM
              </span>

              <button
                onClick={() => isFieldActive('crew') && setShowCrewList(!showCrewList)}
                disabled={!isFieldActive('crew')}
                className="w-full transition-all duration-200"
              >
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    borderRadius: '5px',
                    border: isFieldActive('crew')
                      ? '2px solid #59779F'
                      : '1px solid rgba(255,255,255,0.1)',
                    ...(isFieldActive('crew') ? {
                      animation: 'tutorialPulse 1.2s ease-in-out infinite',
                    } : {}),
                  }}
                >
                  {selectedCrew ? (
                    <div className="flex items-center gap-2">
                      {/* Simple avatar circle */}
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mohave font-bold text-white"
                        style={{ background: '#59779F' }}
                      >
                        {selectedCrew.charAt(0)}
                      </div>
                      <span className="font-mohave text-[16px] text-white">
                        {selectedCrew}
                      </span>
                    </div>
                  ) : (
                    <span className="font-mohave text-[16px] text-[#777777]">
                      Select team members
                    </span>
                  )}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#AAAAAA]">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>

              {/* Inline crew picker list */}
              {showCrewList && isFieldActive('crew') && (
                <div
                  className="mt-1 overflow-hidden"
                  style={{
                    borderRadius: '5px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: '#0D0D0D',
                  }}
                >
                  {DEMO_CREW.map((crew, idx) => (
                    <button
                      key={crew.id}
                      onClick={() => handleCrewSelect(crew.short)}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/5 active:bg-white/10 transition-colors"
                      style={{
                        borderBottom: idx < DEMO_CREW.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      }}
                    >
                      {/* Checkbox circle */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          selectedCrew === crew.short
                            ? 'border-[#59779F] bg-[#59779F]'
                            : 'border-[#777777]'
                        }`}
                      >
                        {selectedCrew === crew.short && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>

                      {/* Avatar */}
                      <div
                        className="rounded-full flex items-center justify-center text-[13px] font-mohave font-bold text-white flex-shrink-0"
                        style={{ background: '#59779F', width: 40, height: 40 }}
                      >
                        {crew.short.charAt(0)}
                      </div>

                      {/* Name */}
                      <div className="flex flex-col gap-1">
                        <span className="font-mohave font-medium text-[16px] text-white">
                          {crew.name}
                        </span>
                        <span className="font-kosugi text-[14px] text-[#777777]">
                          Field Crew
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Dates Field */}
            <div
              style={{ opacity: isFieldDimmed('date') ? 0.5 : 1 }}
              className="transition-opacity duration-200"
            >
              <span
                className={`font-kosugi font-normal text-[14px] uppercase tracking-wider mb-2 block transition-colors duration-300 ${
                  isFieldActive('date') ? 'text-[#59779F]' : 'text-[#AAAAAA]'
                }`}
                style={isFieldActive('date') ? {
                  animation: 'tutorialPulse 1.2s ease-in-out infinite',
                } : undefined}
              >
                DATES
              </span>

              {/* Date display / tap target */}
              <div
                className="flex items-center justify-between px-4 py-3 mb-2"
                style={{
                  borderRadius: '5px',
                  border: isFieldActive('date')
                    ? '2px solid #59779F'
                    : '1px solid rgba(255,255,255,0.1)',
                  ...(isFieldActive('date') ? {
                    animation: 'tutorialPulse 1.2s ease-in-out infinite',
                  } : {}),
                }}
              >
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span className={`font-mohave text-[16px] ${selectedDate ? 'text-white' : 'text-[#AAAAAA]'}`}>
                    {selectedDate ?? 'Tap to Schedule'}
                  </span>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#AAAAAA]">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Date pill buttons */}
              {isFieldActive('date') && (
                <div className="flex gap-2">
                  {DEMO_DATE_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => onSelectDate(opt.label)}
                      className="flex-1 py-2.5 rounded-full font-mohave font-medium text-[13px] transition-all duration-200"
                      style={{
                        background: selectedDate === opt.label ? '#59779F' : 'transparent',
                        color: selectedDate === opt.label ? '#FFFFFF' : '#AAAAAA',
                        border: selectedDate === opt.label
                          ? '1px solid #59779F'
                          : '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Notes Field (always disabled at 0.5 opacity in tutorial) */}
            <div style={{ opacity: 0.5 }} className="pointer-events-none">
              <span className="font-kosugi font-normal text-[14px] text-[#AAAAAA] uppercase tracking-wider mb-2 block">
                NOTES
              </span>
              <div
                className="px-4 py-3"
                style={{
                  borderRadius: '5px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  minHeight: '100px',
                }}
              >
                <span className="font-mohave text-[16px] text-[#777777]">Add notes...</span>
              </div>
            </div>

            {/* Bottom padding for scroll */}
            <div className="h-4" />
          </div>

          {/* taskFormDone overlay: dark overlay over all form content */}
          {phase === 'taskFormDone' && (
            <div
              className="absolute inset-0 pointer-events-auto"
              style={{
                background: 'rgba(0,0,0,0.6)',
                zIndex: 10,
              }}
            />
          )}
        </div>

        {/* Radial gradient for DONE button visibility during taskFormDone */}
        {phase === 'taskFormDone' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 85% 12%, transparent 60px, rgba(0,0,0,0.6) 350px)',
              zIndex: 11,
            }}
          />
        )}
      </div>

      {/* Inline keyframe animation for tutorial pulse */}
      <style jsx>{`
        @keyframes tutorialPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
