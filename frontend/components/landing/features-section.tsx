import React from 'react'
import { Card } from '@/components/ui/card'
import { Clock, Hourglass, Users } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  Icon: LucideIcon
  title: string
  description: string
}

function FeatureCard({ Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm">
      <Icon className="h-8 w-8 mb-4 text-primary" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  )
}

const features = [
  {
    Icon: Clock,
    title: 'Time Visualization',
    description: 'See your life mapped out in weeks, making time tangible and meaningful.'
  },
  {
    Icon: Hourglass,
    title: 'Memento Mori',
    description: 'A philosophical reminder to live intentionally and make the most of your time.'
  },
  {
    Icon: Users,
    title: 'Life Events',
    description: 'Mark and remember significant moments throughout your journey.'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  )
} 