import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function PreviewSection() {
  return (
    <section id="preview" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 bg-card/50 backdrop-blur-sm mb-8">
          <h2 className="text-3xl font-serif tracking-wider text-primary mb-4">Preview</h2>
          <p className="text-muted-foreground mb-6">
            A glimpse into how Life in Cubes helps you visualize your journey.
          </p>
        </Card>
        <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/preview.png"
              alt="Life in Cubes Preview"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="p-6">
            <p className="text-muted-foreground text-sm">
              Each cube represents a week of your life. Track important events, milestones, and memories in this visual journey through time.
            </p>
            <Button className="mt-4" size="lg" asChild>
              <Link href="/login">
                Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
} 