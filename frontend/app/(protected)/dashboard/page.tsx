'use client'

import React from 'react'
import { MementoMori } from '@/components/grid'
import { PageTransition } from '@/components/layout'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <PageTransition>
        <div className="container mx-auto p-6">
          <MementoMori birthDate={new Date(1990, 0, 1)} />
        </div>
      </PageTransition>
    </ProtectedRoute>
  )
} 