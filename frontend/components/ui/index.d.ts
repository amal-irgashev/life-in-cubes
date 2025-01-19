import { ComponentPropsWithoutRef, ElementRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'

// Re-export component types
export type Dialog = typeof DialogPrimitive.Root
export type DialogTrigger = typeof DialogPrimitive.Trigger
export type DialogContent = typeof DialogPrimitive.Content
export type DialogHeader = ComponentPropsWithoutRef<'div'>
export type DialogFooter = ComponentPropsWithoutRef<'div'>
export type DialogTitle = typeof DialogPrimitive.Title
export type DialogDescription = typeof DialogPrimitive.Description

export type Button = ComponentPropsWithoutRef<'button'> & {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export type Input = ComponentPropsWithoutRef<'input'>
export type Label = ComponentPropsWithoutRef<'label'>
export type Textarea = ComponentPropsWithoutRef<'textarea'>

export type RadioGroup = typeof RadioGroupPrimitive.Root
export type RadioGroupItem = typeof RadioGroupPrimitive.Item 