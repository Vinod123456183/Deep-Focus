import { useMemo } from 'react'

interface Star {
  id: number
  top: string
  left: string
  size: string
  opacity: number
  duration: string
  delay: string
}

export default function StarField() {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 1.8 + 0.8}px`,
        opacity: Math.random() * 0.35 + 0.08,
        duration: `${Math.random() * 4 + 3}s`,
        delay: `${Math.random() * 4}s`,
      })),
    [],
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDuration: s.duration,
            animationDelay: s.delay,
          }}
        />
      ))}
      {/* Subtle radial glow in center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(100,160,255,0.04)_0%,transparent_70%)]" />
    </div>
  )
}
