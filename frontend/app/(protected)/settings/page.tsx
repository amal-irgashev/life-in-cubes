'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { PageTransition } from "@/components/layout"

export default function SettingsPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // TODO: Implement settings update
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated delay
      toast.success('Settings updated successfully')
    } catch (error) {
      console.error('Failed to update settings:', error)
      toast.error('Failed to update settings')
    } finally {
      setIsSubmitting(false)
    }
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
            <CardHeader>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">Life Cube Preferences</h2>
                <p className="text-sm text-muted-foreground">
                  Customize how Life in Cubes works for you
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="weekStart">Week starts on</Label>
                      <select 
                        id="weekStart"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="monday">Monday</option>
                        <option value="sunday">Sunday</option>
                        <option value="saturday">Saturday</option>
                      </select>
                      <p className="text-xs text-muted-foreground">
                        Choose which day your week begins
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="theme">Theme</Label>
                      <select 
                        id="theme"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System (follows device)</option>
                      </select>
                      <p className="text-xs text-muted-foreground">
                        Select your preferred color theme
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="lifeExpectancy">Life Expectancy</Label>
                      <select 
                        id="lifeExpectancy"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="75">75 years</option>
                        <option value="80">80 years</option>
                        <option value="85">85 years</option>
                        <option value="90">90 years</option>
                        <option value="95">95 years</option>
                        <option value="100">100 years</option>
                      </select>
                      <p className="text-xs text-muted-foreground">
                        Set your target life expectancy for calculations
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4">
                    <h3 className="text-lg font-medium">Display Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="grid gap-1">
                          <Label>Show Week Numbers</Label>
                          <p className="text-sm text-muted-foreground">
                            Display week numbers in the life grid
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="grid gap-1">
                          <Label>Highlight Current Week</Label>
                          <p className="text-sm text-muted-foreground">
                            Emphasize the current week in the grid
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="grid gap-1">
                          <Label>Show Age Markers</Label>
                          <p className="text-sm text-muted-foreground">
                            Display age milestones in the grid
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4">
                    <h3 className="text-lg font-medium">Notification Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="grid gap-1">
                          <Label>Weekly Reflections</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive weekly prompts for life reflection
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="grid gap-1">
                          <Label>Milestone Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about important life milestones
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="grid gap-1">
                          <Label>Birthday Reminders</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications on your life progress
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="grid gap-1">
                          <Label>Event Suggestions</Label>
                          <p className="text-sm text-muted-foreground">
                            Get personalized event suggestions
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4">
                    <h3 className="text-lg font-medium">Privacy Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="grid gap-1">
                          <Label>Public Profile</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow others to view your life progress
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="grid gap-1">
                          <Label>Share Statistics</Label>
                          <p className="text-sm text-muted-foreground">
                            Include your data in anonymous statistics
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
} 