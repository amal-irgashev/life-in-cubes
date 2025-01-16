"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, Upload, ArrowLeft } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { calculateWeeks } from "@/lib/utils"
import { useAuth } from "@/lib/contexts/auth-context"
import { userService } from "@/lib/services/user-service"
import { toast } from "sonner"
import { PageTransition } from "@/components/page-transition"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        first_name: formData.get('firstName') as string,
        last_name: formData.get('lastName') as string,
        birth_date: formData.get('birthdate') as string,
      }

      await userService.updateUser(data)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </PageTransition>
    )
  }

  if (!user) {
    return (
      <PageTransition>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </PageTransition>
    )
  }

  const birthDate = user.profile?.birth_date ? new Date(user.profile.birth_date) : new Date()
  const currentDate = new Date()
  
  // Constants for calculations
  const WEEKS_PER_YEAR = 52.1429 // More accurate weeks per year
  const LIFE_EXPECTANCY = 80
  const TOTAL_WEEKS = Math.floor(LIFE_EXPECTANCY * WEEKS_PER_YEAR)
  
  // Calculate weeks lived (floor to get completed weeks)
  const weeksLived = Math.floor((currentDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 7))
  
  // Calculate remaining weeks
  const weeksRemaining = TOTAL_WEEKS - weeksLived
  
  // Calculate life progress percentage
  const lifeProgress = ((weeksLived / TOTAL_WEEKS) * 100).toFixed(1)

  // Calculate years for display
  const yearsLived = (weeksLived / WEEKS_PER_YEAR).toFixed(1)
  const yearsRemaining = (weeksRemaining / WEEKS_PER_YEAR).toFixed(1)

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-background/50">
        <div className="w-full max-w-2xl space-y-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-24 w-24">
                    <AvatarImage alt="User avatar" src={user.profile?.avatar} />
                    <AvatarFallback className="text-lg">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                  </div>
                </div>
                <div className="space-y-1 text-center">
                  <h2 className="text-2xl font-semibold tracking-tight">Personal Information</h2>
                  <p className="text-sm text-muted-foreground">
                    Update your photo and personal details
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input 
                      id="firstName"
                      name="firstName" 
                      placeholder="Enter your first name"
                      defaultValue={user.first_name || ''}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input 
                      id="lastName"
                      name="lastName" 
                      placeholder="Enter your last name"
                      defaultValue={user.last_name || ''}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email"
                      defaultValue={user.email}
                      disabled
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="birthdate">Birth date</Label>
                    <Input 
                      id="birthdate"
                      name="birthdate" 
                      type="date"
                      defaultValue={user.profile?.birth_date || ''}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline">Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <h2 className="text-xl font-semibold tracking-tight">Life Statistics</h2>
              <p className="text-sm text-muted-foreground">Your life journey in numbers</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary/5">
                  <p className="text-3xl font-bold text-primary">{weeksLived.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Weeks lived</p>
                  <p className="text-xs text-muted-foreground">({yearsLived} years)</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary/5">
                  <p className="text-3xl font-bold text-primary">{weeksRemaining.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Weeks remaining</p>
                  <p className="text-xs text-muted-foreground">({yearsRemaining} years)</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary/5">
                  <p className="text-3xl font-bold text-primary">{lifeProgress}%</p>
                  <p className="text-sm text-muted-foreground">Life progress</p>
                  <p className="text-xs text-muted-foreground">of {LIFE_EXPECTANCY} years</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50 shadow-lg">
            <CardHeader>
              <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
              <p className="text-sm text-muted-foreground">
                Irreversible account actions
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive" className="bg-destructive/5 text-destructive border-none">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Deleting your account will permanently remove all your data. This action cannot be undone.
                </AlertDescription>
              </Alert>
              <div className="flex justify-end">
                <Button variant="destructive" size="sm">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
} 