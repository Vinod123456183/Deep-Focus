import { useState, useEffect } from 'react'

export type BreathPhase = 'in' | 'hold' | 'out'

interface BreathStep {
  phase: BreathPhase
  label: string
  scale: number
  duration: number
}

const STEPS: BreathStep[] = [
  { phase: 'in',   label: 'Breathe In',  scale: 1,   duration: 4000 },
  { phase: 'hold', label: 'Hold',        scale: 1,   duration: 4000 },
  { phase: 'out',  label: 'Breathe Out', scale: 0.6, duration: 6000 },
]

export function useBreathing() {
  const [stepIdx, setStepIdx] = useState(0)
  const [scale, setScale] = useState(0.6)

  useEffect(() => {
    const step = STEPS[stepIdx]
    setScale(step.scale)

    const t = setTimeout(() => {
      setStepIdx((i) => (i + 1) % STEPS.length)
    }, step.duration)

    return () => clearTimeout(t)
  }, [stepIdx])

  const current = STEPS[stepIdx]

  return {
    phase: current.phase,
    label: current.label,
    scale,
    duration: current.duration,
  }
}
