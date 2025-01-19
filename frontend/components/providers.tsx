'use client'

import React from 'react'
import { AuthProvider } from '@/lib/contexts/auth-context'
import { EventsProvider } from '@/lib/contexts/events-context'
import { ThemeProvider } from '@/components/theme'
import { OnboardingProvider } from '@/lib/contexts/onboarding-context'
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <EventsProvider>
          <OnboardingProvider>
            {children}
          </OnboardingProvider>
        </EventsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
} 