'use client'

interface ContinueButtonProps {
  label: string // "CONTINUE" or "DONE"
  onClick: () => void
  variant?: 'inline' | 'fullWidth'
}

export function ContinueButton({ label, onClick, variant = 'inline' }: ContinueButtonProps) {
  if (variant === 'fullWidth') {
    // DONE button: full width, matching iOS tutorialSummary style
    return (
      <div className="absolute bottom-0 left-0 right-0 flex justify-center px-10 pb-[120px]" style={{ zIndex: 60 }}>
        <button
          onClick={onClick}
          className="w-full bg-white text-black font-mohave font-medium text-[16px] tracking-wide rounded-[5px] animate-fade-in
                     hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150"
          style={{
            paddingTop: '18px',
            paddingBottom: '18px',
            boxShadow: '0 0 20px rgba(0,0,0,0.8), 0 8px 40px rgba(0,0,0,0.6), 0 12px 60px rgba(0,0,0,0.4)',
          }}
        >
          {label}
        </button>
      </div>
    )
  }

  // CONTINUE button: inline, centered, above tab bar
  return (
    <div className="absolute bottom-[100px] left-0 right-0 flex justify-center" style={{ zIndex: 60 }}>
      <button
        onClick={onClick}
        className="flex items-center gap-2 bg-white text-black font-mohave font-medium text-[16px] tracking-wide rounded-[8px] animate-fade-in
                   hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150"
        style={{
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingTop: '12px',
          paddingBottom: '12px',
          boxShadow: '0 0 20px rgba(0,0,0,0.8), 0 8px 40px rgba(0,0,0,0.6), 0 12px 60px rgba(0,0,0,0.4)',
        }}
      >
        <span>{label}</span>
        {/* arrow.right icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-black">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
