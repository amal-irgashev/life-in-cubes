'use client'

import React from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import MementoMori from '@/components/memento-mori'
import { PageTransition } from '@/components/page-transition'

export default function DashboardPage() {
  const { user } = useAuth()
  console.log('Dashboard user data:', user);
  
  if (!user?.profile?.birth_date) {
    console.log('No birth date found in profile:', user?.profile);
    return (
      <PageTransition>
        <div className="container mx-auto p-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Life in Cubes</h1>
          <p className="text-muted-foreground">
            Please update your profile to include your birth date to start using the app.
          </p>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <MementoMori birthDate={new Date(user.profile.birth_date)} />
    </PageTransition>
  )
} 