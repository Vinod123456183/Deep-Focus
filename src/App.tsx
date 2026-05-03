import StarField from "./components/StarField";
import Header from "./components/Header";
import BreathingCard from "./components/BreathingCard";
import PomodoroCard from "./components/PomodoroCard";
import MusicCard from "./components/MusicCard";
import QuoteDisplay from "./components/QuoteDisplay";
import SponsorBanner from "./components/SponsorBanner";

export default function App() {
  return (
    <div className="min-h-screen bg-ink-950 text-parchment-200 flex flex-col items-center justify-center px-4 py-10 overflow-x-hidden">
      {/* Background */}
      <StarField />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        <Header />

        {/* 3-column card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
          <BreathingCard />
          <PomodoroCard />
          <MusicCard />
        </div>

        {/* Quote */}
        <QuoteDisplay />

        {/* Sponsor */}
        <SponsorBanner />

        {/* Footer tagline */}
        <p
          className="font-body text-[10px] text-white/15 tracking-[0.25em] uppercase mt-10 animate-fadeUp"
          style={{ animationDelay: "0.6s" }}
        >
          Stay Disciplined · Stay Consistent · Stay Focused
        </p>
      </div>
    </div>
  );
}
