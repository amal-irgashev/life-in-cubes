declare module '@/components/ui/button' {
  import { ButtonHTMLAttributes } from 'react'

  export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    asChild?: boolean
  }

  export const Button: React.FC<ButtonProps>
}

declare module '@/components/ui/card' {
  import { HTMLAttributes } from 'react'

  export const Card: React.FC<HTMLAttributes<HTMLDivElement>>
  export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>>
  export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>>
  export const CardDescription: React.FC<HTMLAttributes<HTMLParagraphElement>>
  export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>>
  export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>>
}

declare module '@/components/ui/dialog' {
  import { HTMLAttributes } from 'react'

  export const Dialog: React.FC<{ open?: boolean; children: React.ReactNode }>
  export const DialogContent: React.FC<HTMLAttributes<HTMLDivElement>>
  export const DialogDescription: React.FC<HTMLAttributes<HTMLParagraphElement>>
  export const DialogHeader: React.FC<HTMLAttributes<HTMLDivElement>>
  export const DialogTitle: React.FC<HTMLAttributes<HTMLHeadingElement>>
}

declare module '@/components/ui/dropdown-menu' {
  import { HTMLAttributes } from 'react'

  export const DropdownMenu: React.FC<{ children: React.ReactNode }>
  export const DropdownMenuTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }>
  export const DropdownMenuContent: React.FC<{ align?: 'start' | 'end'; children: React.ReactNode }>
  export const DropdownMenuItem: React.FC<HTMLAttributes<HTMLDivElement>>
}

declare module '@/components/ui/input' {
  import { InputHTMLAttributes } from 'react'

  export const Input: React.FC<InputHTMLAttributes<HTMLInputElement>>
}

declare module '@/components/ui/label' {
  import { LabelHTMLAttributes } from 'react'

  export const Label: React.FC<LabelHTMLAttributes<HTMLLabelElement>>
}

declare module '@/components/ui/radio-group' {
  import { HTMLAttributes } from 'react'

  export interface RadioGroupProps extends HTMLAttributes<HTMLDivElement> {
    value?: string
    onValueChange?: (value: string) => void
  }

  export const RadioGroup: React.FC<RadioGroupProps>
  export const RadioGroupItem: React.FC<{ value: string; id?: string }>
}

declare module '@/components/ui/separator' {
  import { HTMLAttributes } from 'react'

  export const Separator: React.FC<HTMLAttributes<HTMLDivElement>>
}

declare module '@/components/ui/switch' {
  import { InputHTMLAttributes } from 'react'

  export const Switch: React.FC<InputHTMLAttributes<HTMLInputElement>>
}

declare module '@/components/ui/avatar' {
  import { ImgHTMLAttributes } from 'react'

  export const Avatar: React.FC<{ className?: string; children: React.ReactNode }>
  export const AvatarImage: React.FC<ImgHTMLAttributes<HTMLImageElement>>
  export const AvatarFallback: React.FC<{ children: React.ReactNode; className?: string }>
} 