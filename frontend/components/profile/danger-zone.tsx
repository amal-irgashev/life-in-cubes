import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface DangerZoneProps {
  onDeleteAccount: () => void
}

export function DangerZone({ onDeleteAccount }: DangerZoneProps) {
  return (
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
          <Button 
            variant="destructive" 
            size="sm"
            onClick={onDeleteAccount}
          >
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 