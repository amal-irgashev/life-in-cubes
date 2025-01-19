'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-4">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/">
              Go back home
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  )
} 