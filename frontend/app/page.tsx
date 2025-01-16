'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Clock, Hourglass, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
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

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <Clock className="h-8 w-8 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Time Visualization</h3>
            <p className="text-muted-foreground">See your life mapped out in weeks, making time tangible and meaningful.</p>
          </Card>
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <Hourglass className="h-8 w-8 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Memento Mori</h3>
            <p className="text-muted-foreground">A philosophical reminder to live intentionally and make the most of your time.</p>
          </Card>
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <Users className="h-8 w-8 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Life Events</h3>
            <p className="text-muted-foreground">Mark and remember significant moments throughout your journey.</p>
          </Card>
        </div>
      </section>

      {/* Preview Section */}
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

      {/* Quote Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Card className="p-8 sm:p-12 bg-card/50 backdrop-blur-sm text-center">
            <blockquote className="max-w-3xl mx-auto">
              <p className="text-xl sm:text-2xl font-serif italic text-muted-foreground mb-4">
                "The whole life of a philosopher is the meditation of his death."
              </p>
              <footer className="text-sm font-semibold tracking-wider">
                — CICERO
              </footer>
            </blockquote>
          </Card>
        </div>
      </section>
    </div>
  )
}
