'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/auth-context'
import { EventsProvider } from '@/lib/contexts/events-context'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/ui/navbar'
import { ProtectedRoute } from '@/components/auth/protected-route'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.3
      }}
    >
      {children}
    </motion.div>
  )
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isNavExpanded, setIsNavExpanded] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <PageTransition>
        <div className="container mx-auto p-6 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </PageTransition>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <ProtectedRoute>
      <EventsProvider>
        <Navbar onExpandedChange={setIsNavExpanded} />
        <main 
          data-nav-expanded={isNavExpanded} 
          className="min-h-screen pt-16 pl-14 transition-all duration-500 ease-in-out data-[nav-expanded=true]:pl-56"
        >
          <PageTransition>{children}</PageTransition>
        </main>
      </EventsProvider>
    </ProtectedRoute>
  )
}

export function ProtectedRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>
} 