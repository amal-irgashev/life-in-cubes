'use client'

import React from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import MementoMori from '@/components/memento-mori'
import { PageTransition } from '@/components/page-transition'
import { OnboardingDialog } from '@/components/onboarding-dialog'
import { OnboardingProvider } from '@/lib/contexts/onboarding-context'
import { useOnboarding } from '@/lib/contexts/onboarding-context'

export default function DashboardPage() {
  const { user } = useAuth()
  const { userPreferences } = useOnboarding()
  
  // Use birth date from user profile or onboarding preferences
  const birthDate = user?.profile?.birth_date || userPreferences?.birthYear
  
  if (!birthDate) {
    return (
      <PageTransition>
        <OnboardingProvider>
          <OnboardingDialog />
          <div className="container mx-auto p-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to Life in Cubes</h1>
            <p className="text-muted-foreground">
              Complete the onboarding process to start using the app.
            </p>
          </div>
        </OnboardingProvider>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <MementoMori birthDate={new Date(birthDate)} />
    </PageTransition>
  )
} 