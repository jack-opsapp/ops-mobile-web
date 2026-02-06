'use client'

interface ContinueButtonProps {
  label: string
  onClick: () => void
  visible: boolean
}

export function ContinueButton({ label, onClick, visible }: ContinueButtonProps) {
  if (!visible) return null

  return (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center px-6" style={{ zIndex: 70 }}>
      <button
        onClick={onClick}
        className="h-14 px-12 rounded-ops font-mohave font-semibold text-ops-body tracking-wide bg-white text-black hover:bg-gray-200 active:bg-gray-300 transition-all duration-200 animate-fade-in w-full max-w-sm"
      >
        {label}
      </button>
    </div>
  )
}
