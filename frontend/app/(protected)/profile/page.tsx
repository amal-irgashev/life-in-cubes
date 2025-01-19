"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"
import { PageTransition } from "@/components/layout"
import { ProfileAvatar } from "@/components/profile/profile-avatar"
import { ProfileForm } from "@/components/profile/profile-form"
import { LifeStatistics } from "@/components/profile/life-statistics"
import { DangerZone } from "@/components/profile/danger-zone"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  const handleDeleteAccount = () => {
    // Implement account deletion logic
    console.log('Delete account clicked')
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
                <ProfileAvatar
                  avatarUrl={user.profile?.avatar}
                  firstName={user.first_name}
                  lastName={user.last_name}
                />
                <div className="space-y-1 text-center">
                  <h2 className="text-2xl font-semibold tracking-tight">Personal Information</h2>
                  <p className="text-sm text-muted-foreground">
                    Update your photo and personal details
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>

          {user.profile?.birth_date && (
            <LifeStatistics birthDate={new Date(user.profile.birth_date)} />
          )}

          <DangerZone onDeleteAccount={handleDeleteAccount} />
        </div>
      </div>
    </PageTransition>
  )
} 