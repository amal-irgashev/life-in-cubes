import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"

interface ProfileAvatarProps {
  avatarUrl?: string
  firstName?: string
  lastName?: string
}

export function ProfileAvatar({ avatarUrl, firstName, lastName }: ProfileAvatarProps) {
  return (
    <div className="relative group">
      <Avatar className="h-24 w-24">
        <AvatarImage alt="User avatar" src={avatarUrl} />
        <AvatarFallback className="text-lg">
          {firstName?.[0]}{lastName?.[0]}
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
  )
} 