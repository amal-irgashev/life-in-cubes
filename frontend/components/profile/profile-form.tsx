import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from '@/types/api'
import { toast } from "sonner"
import { userService } from "@/lib/services/user-service"

interface ProfileFormProps {
  user: User
  onSuccess?: () => void
}

export function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
      onSuccess?.()
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
  )
} 