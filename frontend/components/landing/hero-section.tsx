import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <Card className="p-8 sm:p-12 bg-card/50 backdrop-blur-sm">
          <h1 className="text-4xl sm:text-6xl font-serif tracking-widest text-primary mb-6">
            LIFE IN CUBES
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground font-serif max-w-2xl">
            Visualize your life journey, week by week. A powerful reminder to make every moment count.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/login">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#preview">
                View Preview
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
} 