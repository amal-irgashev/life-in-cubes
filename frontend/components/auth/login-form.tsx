'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogIn, Lock, Mail } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Handle session expired message
  useEffect(() => {
    const error = searchParams.get('error')
    if (error === 'session_expired') {
      setError('Your session has expired. Please sign in again.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    try {
      // Get the redirect URL from query params or use default
      const redirectTo = searchParams.get('from') || '/dashboard'
      await signIn(username, password, redirectTo)
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-serif tracking-widest text-primary mb-2">
            LIFE IN CUBES
          </h1>
          <p className="text-muted-foreground">
            Sign in to continue your journey
          </p>
        </div>

        <Card className="p-6 bg-card/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  className="pl-9"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  className="pl-9"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-500 text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Signing in...
                </div>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </Card>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </div>

        <Card className="mt-8 p-6 bg-card/50 backdrop-blur-sm">
          <div className="text-center text-sm text-muted-foreground font-serif italic">
            {"The two most powerful warriors are patience and time."}
            <div className="mt-2 text-xs font-semibold tracking-wider">
              — LEO TOLSTOY
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
} 