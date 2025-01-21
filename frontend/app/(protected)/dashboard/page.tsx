'use client'

import React from 'react'
import { MementoMori } from '@/components/grid'
import { PageTransition } from '@/components/layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/lib/contexts/auth-context'

export default function DashboardPage() {
  const { user } = useAuth()
  const birthDate = user?.profile?.birth_date ? new Date(user.profile.birth_date) : new Date()

  return (
    <ProtectedRoute>
      <PageTransition>
        <div className="container mx-auto p-6">
          <MementoMori birthDate={birthDate} />
        </div>
      </PageTransition>
    </ProtectedRoute>
  )
} 