'use client'

import React from 'react'
import { AuthProvider } from '@/lib/contexts/auth-context'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="w-full">
          {children}
        </div>
      </div>
    </AuthProvider>
  )
} 