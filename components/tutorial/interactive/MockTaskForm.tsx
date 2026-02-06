'use client'

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
  const isFieldActive = (field: 'type' | 'crew' | 'date' | 'done') => {
    switch (field) {
      case 'type': return phase === 'taskFormType'
      case 'crew': return phase === 'taskFormCrew'
      case 'date': return phase === 'taskFormDate'
      case 'done': return phase === 'taskFormDone'
    }
  }

  if (!visible) return null

  // Show first 6 task types
  const visibleTypes = DEMO_TASK_TYPES.slice(0, 6)

  return (
    <div
      className="absolute inset-x-0 bottom-0 animate-fade-up"
      style={{ zIndex: 52 }}
    >
      <div
        className="rounded-t-2xl overflow-hidden flex flex-col"
        style={{
          background: '#111111',
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 'none',
          maxHeight: '75vh',
        }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="px-4 pb-3 border-b border-white/10">
          <h3 className="font-mohave font-bold text-[18px] text-white">Add Task</h3>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
          {/* Task Type */}
          <div>
            <label className="font-kosugi text-[11px] text-ops-text-secondary uppercase tracking-wider mb-2 block">
              Task Type
            </label>
            <div
              className={`flex flex-wrap gap-2 p-2 rounded-ops border transition-all duration-200 ${
                isFieldActive('type')
                  ? 'border-ops-accent/40 bg-white/5'
                  : 'border-transparent'
              }`}
              style={isFieldActive('type') ? {
                boxShadow: '0 0 8px rgba(89, 119, 159, 0.15)',
              } : undefined}
            >
              {visibleTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => isFieldActive('type') && onSelectType(type.name)}
                  disabled={!isFieldActive('type')}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-mohave font-medium transition-all duration-200 border ${
                    selectedType === type.name
                      ? 'border-transparent text-black'
                      : isFieldActive('type')
                        ? 'border-white/20 text-white hover:border-white/40'
                        : 'border-white/10 text-white/40'
                  }`}
                  style={
                    selectedType === type.name
                      ? { background: type.color }
                      : undefined
                  }
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* Crew */}
          <div>
            <label className="font-kosugi text-[11px] text-ops-text-secondary uppercase tracking-wider mb-2 block">
              Assign Crew
            </label>
            <div
              className={`flex flex-wrap gap-2 p-2 rounded-ops border transition-all duration-200 ${
                isFieldActive('crew')
                  ? 'border-ops-accent/40 bg-white/5'
                  : 'border-transparent'
              }`}
              style={isFieldActive('crew') ? {
                boxShadow: '0 0 8px rgba(89, 119, 159, 0.15)',
              } : undefined}
            >
              {DEMO_CREW.map(crew => (
                <button
                  key={crew.id}
                  onClick={() => isFieldActive('crew') && onSelectCrew(crew.short)}
                  disabled={!isFieldActive('crew')}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-mohave font-medium transition-all duration-200 border ${
                    selectedCrew === crew.short
                      ? 'bg-ops-accent border-ops-accent text-white'
                      : isFieldActive('crew')
                        ? 'border-white/20 text-white hover:border-white/40'
                        : 'border-white/10 text-white/40'
                  }`}
                >
                  {crew.short}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="font-kosugi text-[11px] text-ops-text-secondary uppercase tracking-wider mb-2 block">
              Date
            </label>
            <div
              className={`flex gap-2 p-2 rounded-ops border transition-all duration-200 ${
                isFieldActive('date')
                  ? 'border-ops-accent/40 bg-white/5'
                  : 'border-transparent'
              }`}
              style={isFieldActive('date') ? {
                boxShadow: '0 0 8px rgba(89, 119, 159, 0.15)',
              } : undefined}
            >
              {DEMO_DATE_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => isFieldActive('date') && onSelectDate(opt.label)}
                  disabled={!isFieldActive('date')}
                  className={`flex-1 px-3 py-2 rounded-ops text-[13px] font-mohave font-medium transition-all duration-200 border ${
                    selectedDate === opt.label
                      ? 'bg-ops-accent border-ops-accent text-white'
                      : isFieldActive('date')
                        ? 'border-white/20 text-white hover:border-white/40'
                        : 'border-white/10 text-white/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Done button */}
        <div className="px-4 pb-6 pt-3 border-t border-white/10">
          <button
            onClick={onDone}
            disabled={!isFieldActive('done')}
            className={`w-full h-12 rounded-ops font-mohave font-semibold text-[15px] tracking-wide transition-all duration-200 ${
              isFieldActive('done')
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-white/20 text-white/40'
            }`}
            style={isFieldActive('done') ? {
              boxShadow: '0 0 12px rgba(255,255,255,0.15)',
            } : undefined}
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  )
}
