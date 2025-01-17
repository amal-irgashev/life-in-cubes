"use client";

import React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useOnboarding } from "@/lib/contexts/onboarding-context";

export function OnboardingDialog() {
  const { showOnboarding, completeOnboarding, setUserPreferences } = useOnboarding();
  const [step, setStep] = useState(1);
  const [birthYear, setBirthYear] = useState("");
  const [lifeGoal, setLifeGoal] = useState("");
  const [trackingPreference, setTrackingPreference] = useState("weekly");

  const totalSteps = 4;

  const handleComplete = () => {
    const birthDate = new Date(parseInt(birthYear, 10), 0, 1);
    
    setUserPreferences({
      birthYear: birthDate.toISOString(),
      trackingPreference: trackingPreference as 'weekly' | 'monthly',
      lifeGoal
    });
    completeOnboarding();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Welcome to Life in Cubes 🎉</DialogTitle>
              <DialogDescription className="pt-4">
                Life in Cubes is a unique life visualization tool that helps you understand and make the most of your time. Each cube represents a week of your life, arranged in a meaningful pattern that shows your life&apos;s journey.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setStep(2)}>Next</Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <DialogHeader>
              <DialogTitle>When were you born?</DialogTitle>
              <DialogDescription className="pt-4">
                This helps us visualize your life journey accurately.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <Input
                type="number"
                placeholder="Enter your birth year"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                max={new Date().getFullYear()}
                min={1900}
              />
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} disabled={!birthYear}>Next</Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <DialogHeader>
              <DialogTitle>How would you like to track your life?</DialogTitle>
              <DialogDescription className="pt-4">
                Choose how you prefer to view and track your life events.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <RadioGroup value={trackingPreference} onValueChange={setTrackingPreference}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Weekly tracking (recommended)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Monthly tracking</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={() => setStep(4)}>Next</Button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <DialogHeader>
              <DialogTitle>What&apos;s your main goal?</DialogTitle>
              <DialogDescription className="pt-4">
                Having a clear goal helps you make the most of your time visualization.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <Input
                placeholder="e.g., Track my achievements, Monitor habits..."
                value={lifeGoal}
                onChange={(e) => setLifeGoal(e.target.value)}
              />
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button onClick={handleComplete}>Get Started</Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (!showOnboarding) {
    return null;
  }

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[425px]">
        {renderStep()}
        <div className="mt-4 flex justify-center gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 w-8 rounded-full ${
                i + 1 === step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 