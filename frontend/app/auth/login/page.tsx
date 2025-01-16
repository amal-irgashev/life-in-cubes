'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <Card className="p-6 bg-card/50 backdrop-blur-sm">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Input type="email" placeholder="Email" />
                </div>
                <div className="space-y-2">
                  <Input type="password" placeholder="Password" />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Input type="text" placeholder="Full Name" />
                </div>
                <div className="space-y-2">
                  <Input type="email" placeholder="Email" />
                </div>
                <div className="space-y-2">
                  <Input type="password" placeholder="Password" />
                </div>
                <div className="space-y-2">
                  <Input type="date" placeholder="Birth Date" />
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
} 