import { usePomodoro } from "../hooks/usePomodoro";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function PomodoroCard() {
  const { phase, active, sessions, progress, formatted, toggle, reset } =
    usePomodoro();

  const strokeOffset = CIRCUMFERENCE * (1 - progress);
  const strokeColor = phase === "focus" ? "#6aa0ff" : "#7adf9e";

  return (
    <div className="card animate-fadeUp" style={{ animationDelay: "0.2s" }}>
      <p className="card-label">
        {phase === "focus"
          ? "Focus Session To Start Things Again"
          : "Break Time"}
      </p>

      {/* Ring timer */}
      <div className="flex justify-center mb-5">
        <div className="relative inline-flex items-center justify-center">
          <svg
            width={130}
            height={130}
            className="-rotate-90"
            aria-label={`Timer: ${formatted}`}
          >
            {/* Track */}
            <circle
              cx={65}
              cy={65}
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={5}
            />
            {/* Progress */}
            <circle
              cx={65}
              cy={65}
              r={RADIUS}
              fill="none"
              stroke={strokeColor}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeOffset}
              style={{
                transition: "stroke-dashoffset 1s linear, stroke 0.5s ease",
              }}
            />
          </svg>

          {/* Center text */}
          <div className="absolute text-center">
            <span className="font-mono text-3xl font-normal text-parchment-100 tracking-widest">
              {formatted}
            </span>
            <p className="font-body text-[9px] tracking-[0.2em] text-white/25 mt-1 uppercase">
              {phase}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={toggle}
          className={active ? "btn-ghost" : "btn-primary"}
        >
          {active ? "⏸ Pause" : "▶ Start"}
        </button>
        <button onClick={reset} className="btn-ghost">
          Reset
        </button>
      </div>

      {/* Session counter */}
      <p className="font-body text-[11px] text-white/20 text-center mt-4 tracking-widest">
        Sessions completed today:{" "}
        <span className="text-azure-500/70">{sessions}</span>
      </p>
    </div>
  );
}
