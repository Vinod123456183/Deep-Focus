import { useState, useEffect, useRef, useCallback } from 'react'

export type Phase = 'focus' | 'break'

const FOCUS_SECS = 25 * 60
const BREAK_SECS = 5 * 60

export function usePomodoro() {
  const [phase, setPhase] = useState<Phase>('focus')
  const [timeLeft, setTimeLeft] = useState(FOCUS_SECS)
  const [active, setActive] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!)
          setActive(false)
          if (phase === 'focus') {
            setSessions((s) => s + 1)
            setPhase('break')
            setTimeLeft(BREAK_SECS)
          } else {
            setPhase('focus')
            setTimeLeft(FOCUS_SECS)
          }
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current!)
  }, [active, phase])

  const toggle = useCallback(() => setActive((a) => !a), [])

  const reset = useCallback(() => {
    setActive(false)
    setPhase('focus')
    setTimeLeft(FOCUS_SECS)
  }, [])

  const progress =
    phase === 'focus'
      ? 1 - timeLeft / FOCUS_SECS
      : 1 - timeLeft / BREAK_SECS

  const formatted = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(
    timeLeft % 60,
  ).padStart(2, '0')}`

  return { phase, timeLeft, active, sessions, progress, formatted, toggle, reset }
}
