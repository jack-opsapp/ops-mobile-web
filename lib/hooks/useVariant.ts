'use client'

import { useEffect } from 'react'
import { useOnboardingStore, type Variant } from '@/lib/stores/onboarding-store'

export function useVariant(): Variant {
  const variant = useOnboardingStore((s) => s.variant)
  const setVariant = useOnboardingStore((s) => s.setVariant)

  useEffect(() => {
    // Always read cookie — it's the source of truth (set by middleware from URL params)
    const cookies = document.cookie.split(';')
    const variantCookie = cookies
      .find((c) => c.trim().startsWith('ops_variant='))
      ?.split('=')[1]
      ?.trim()

    if (variantCookie === 'a' || variantCookie === 'b') {
      if (variantCookie !== variant) {
        setVariant(variantCookie)
      }
    } else if (!variant) {
      // No cookie and no stored variant: random assignment
      setVariant(Math.random() < 0.5 ? 'a' : 'b')
    }
  }, [variant, setVariant])

  return variant || 'b'
}
