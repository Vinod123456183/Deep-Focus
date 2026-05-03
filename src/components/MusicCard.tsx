import { useState, useEffect, useCallback } from "react";
import { audioEngine, type Track, MUSIC_FILES } from "../audio/audioEngine";

// ─── Synthesized tracks ───────────────────────────────────────────────────────
const SYNTH_TRACKS: { id: Track; label: string; icon: string; desc: string }[] =
  [
    {
      id: "lofi",
      label: "Lo-Fi",
      icon: "♪",
      desc: "Chord progressions + hi-hats",
    },
    {
      id: "rain",
      label: "Rain",
      icon: "☁",
      desc: "Rainfall + distant thunder",
    },
    {
      id: "binaural",
      label: "Binaural",
      icon: "∿",
      desc: "40 Hz gamma focus beats",
    },
    { id: "nature", label: "Nature", icon: "♠", desc: "Wind + bird ambience" },
    {
      id: "meditation",
      label: "Meditation",
      icon: "🧘",
      desc: "Soft pads + calming tones",
    },
    // {
    //   id: "piano",
    //   label: "Soft Piano",
    //   icon: "🎹",
    //   desc: "Slow emotional piano melodies",
    // },

    {
      id: "deep_focus",
      label: "Deep Focus",
      icon: "🎧",
      desc: "Minimal ambient for intense work",
    },
    {
      id: "ocean",
      label: "Ocean Waves",
      icon: "🌊",
      desc: "Gentle waves for relaxation",
    },
    {
      id: "space",
      label: "Space Ambient",
      icon: "🌌",
      desc: "Ethereal tones for deep thinking",
    },
    // {
    //   id: "jazz",
    //   label: "Smooth Jazz",
    //   icon: "🎷",
    //   desc: "Light instrumental for creativity",
    // },
    {
      id: "sleep",
      label: "Sleep",
      icon: "🌙",
      desc: "Ultra calm tones for rest",
    },
  ];

// ─── Real music file tracks (built from MUSIC_FILES config) ──────────────────
const MUSIC_TRACKS: { id: Track; label: string; icon: string; desc: string }[] =
  (
    Object.entries(MUSIC_FILES) as [
      Track,
      { file: string; label: string; icon: string; desc: string },
    ][]
  ).map(([id, meta]) => ({
    id,
    label: meta.label,
    icon: meta.icon,
    desc: meta.desc,
  }));

const ALL_TRACKS = [...SYNTH_TRACKS, ...MUSIC_TRACKS];

const BAR_COUNT = 18;

export default function MusicCard() {
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState<Track>("lofi");
  const [volume, setVolume] = useState(0.35);
  const [barHeights, setBarHeights] = useState<number[]>(
    Array(BAR_COUNT).fill(4),
  );
  const [tab, setTab] = useState<"synth" | "music">("synth");

  // Animate bars when playing
  useEffect(() => {
    if (!playing) {
      setBarHeights(Array(BAR_COUNT).fill(4));
      return;
    }
    const id = setInterval(() => {
      setBarHeights(
        Array.from(
          { length: BAR_COUNT },
          (_, i) => 10 + Math.abs(Math.sin(Date.now() / 300 + i * 0.6)) * 28,
        ),
      );
    }, 80);
    return () => clearInterval(id);
  }, [playing]);

  const togglePlay = useCallback(() => {
    if (playing) {
      audioEngine.stop();
      setPlaying(false);
    } else {
      audioEngine.play(track);
      setPlaying(true);
    }
  }, [playing, track]);

  const switchTrack = (t: Track) => {
    setTrack(t);
    if (playing) {
      audioEngine.play(t);
    }
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    audioEngine.setVolume(v);
  };

  useEffect(() => () => audioEngine.destroy(), []);

  const activeTrack = ALL_TRACKS.find((t) => t.id === track)!;
  const visibleTracks = tab === "synth" ? SYNTH_TRACKS : MUSIC_TRACKS;

  return (
    <div className="card animate-fadeUp" style={{ animationDelay: "0.3s" }}>
      <p className="card-label">Ambient Sound</p>

      {/* Tab toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("synth")}
          className={`flex-1 py-1.5 rounded-lg border text-xs font-body tracking-wider transition-all duration-200 ${
            tab === "synth"
              ? "border-azure-500/60 text-azure-500 bg-azure-500/10"
              : "border-white/10 text-white/30 hover:text-white/50"
          }`}
        >
          ⚡ Synthesized
        </button>
        <button
          onClick={() => setTab("music")}
          className={`flex-1 py-1.5 rounded-lg border text-xs font-body tracking-wider transition-all duration-200 ${
            tab === "music"
              ? "border-azure-500/60 text-azure-500 bg-azure-500/10"
              : "border-white/10 text-white/30 hover:text-white/50"
          }`}
        >
          🎵 Bhajans
        </button>
      </div>

      {/* Track selector pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {visibleTracks.map((t) => (
          <button
            key={t.id}
            onClick={() => switchTrack(t.id)}
            className={`track-pill ${track === t.id ? "track-pill-active" : ""}`}
          >
            <span className="mr-1">{t.icon}</span>
            {t.label}
          </button>
        ))}

        {/* Music files placeholder when no files added yet */}
        {tab === "music" && MUSIC_TRACKS.length === 0 && (
          <p className="font-body text-[11px] text-white/20 italic py-1">
            Add MP3 files to{" "}
            <span className="text-azure-500/60 font-mono">/public/music/</span>{" "}
            and update{" "}
            <span className="text-azure-500/60 font-mono">audioEngine.ts</span>
          </p>
        )}
      </div>

      {/* Active track description */}
      <p className="font-body text-[11px] text-white/25 mb-4 tracking-wide">
        {activeTrack?.desc ?? "—"}
      </p>

      {/* Visualizer bars */}
      <div className="flex items-end gap-[3px] h-10 mb-5 justify-center">
        {barHeights.map((h, i) => (
          <div
            key={i}
            className="w-1 rounded-sm transition-all ease-out"
            style={{
              height: `${h}px`,
              background: playing
                ? `rgba(100, 160, 255, ${0.4 + (i / BAR_COUNT) * 0.5})`
                : "rgba(255,255,255,0.08)",
              transitionDuration: playing ? "80ms" : "400ms",
            }}
          />
        ))}
      </div>

      {/* Play / Stop button */}
      <button
        onClick={togglePlay}
        className={`w-full mb-4 py-2.5 rounded-xl border font-body text-sm tracking-widest transition-all duration-200 ${
          playing
            ? "border-white/20 text-white/50 hover:bg-white/5"
            : "border-azure-500/60 text-azure-500 hover:bg-azure-500/10"
        }`}
      >
        {playing ? "■  Stop Music" : "▶  Play Ambient"}
      </button>

      {/* Volume slider */}
      <div className="flex items-center gap-3">
        <span className="font-body text-xs text-white/25 select-none">Vol</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => handleVolume(parseFloat(e.target.value))}
          className="flex-1"
          aria-label="Volume"
        />
        <span className="font-mono text-[11px] text-white/25 min-w-[2rem] text-right">
          {Math.round(volume * 100)}
        </span>
      </div>

      {/* <p className="font-body text-[10px] text-white/15 text-center mt-3 tracking-wider">
        {tab === "synth"
          ? "Generated in-browser · No internet needed"
          : "Streaming from ....."}
      </p> */}
    </div>
  );
}
