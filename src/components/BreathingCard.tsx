import { useBreathing } from '../hooks/useBreathing'

export default function BreathingCard() {
  const { label, scale, duration, phase } = useBreathing()

  const transitionDuration =
    phase === 'in' ? duration : phase === 'hold' ? 200 : duration

  return (
    <div className="card animate-fadeUp" style={{ animationDelay: '0.1s' }}>
      <p className="card-label">Breathing Guide</p>

      {/* Animated orb */}
      <div className="flex justify-center items-center my-4">
        <div className="relative flex items-center justify-center">
          {/* Outer ring */}
          <div
            className="w-28 h-28 rounded-full border border-azure-500/30 bg-azure-500/5 animate-glowPulse flex items-center justify-center"
            style={{
              transform: `scale(${scale})`,
              transition: `transform ${transitionDuration}ms ease-in-out`,
            }}
          >
            {/* Inner orb */}
            <div className="w-14 h-14 rounded-full bg-azure-500/20 border border-azure-500/50" />
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="text-center mt-4 space-y-1">
        <p className="font-body text-azure-300 text-sm tracking-widest">{label}</p>
        <p className="font-body text-white/20 text-[10px] tracking-[0.15em]">
          4 · 4 · 6 pattern
        </p>
      </div>

      {/* Phase dots */}
      <div className="flex justify-center gap-2 mt-4">
        {(['in', 'hold', 'out'] as const).map((p) => (
          <div
            key={p}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              phase === p ? 'bg-azure-500 scale-125' : 'bg-white/15'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
