export default function Header() {
  return (
    <header className="relative z-10 text-center mb-5 animate-fadeUp">
      <p className="text-[10px] tracking-[0.3em] text-azure-500/80 uppercase font-body mb-2">
        Focus Mode Active
      </p>
      <h1 className="font-display text-4xl md:text-5xl font-normal text-parchment-100 tracking-wide">
        DeepFocus
      </h1>
      <div className="mt-3 mx-auto w-12 h-px bg-gradient-to-r from-transparent via-azure-500/40 to-transparent" />
    </header>
  );
}
