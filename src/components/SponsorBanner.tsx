import { useState } from "react";

export default function SponsorBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <a
      href="mailto:win.od1435851@gmail.com"
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div
        className="relative z-10 max-w-lg w-full mx-auto mt-6 animate-fadeUp"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="flex items-center gap-4 border border-dashed border-white/10 rounded-2xl px-5 py-3.5 bg-white/[0.015] hover:bg-white/[0.03] transition-colors duration-200">
          {/* Icon placeholder */}
          <div className="w-9 h-9 rounded-lg bg-azure-500/10 border border-azure-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-azure-500 text-base">🌱</span>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="font-body text-[10px] text-white/20 tracking-[0.2em] uppercase mb-0.5">
              Sponsored · DM For Collab
            </p>
            <p className="font-body text-sm text-parchment-400">
              <strong className="text-parchment-300 font-normal">
                YourBrand
              </strong>{" "}
              — Supercharge your productivity
            </p>
            <p className="font-body text-[10px] text-white/20 mt-0.5">
              Advertise | Query · win.od1435851@gmail.com
            </p>
          </div>

          {/* Dismiss */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setVisible(false);
            }}
            className="text-white/20 hover:text-white/50 transition-colors text-lg leading-none flex-shrink-0 p-1"
            aria-label="Dismiss sponsor banner"
          >
            ×
          </button>
        </div>
      </div>
    </a>
  );
}