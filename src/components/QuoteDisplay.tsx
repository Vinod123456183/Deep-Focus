import { useQuotes } from '../hooks/useQuotes'

export default function QuoteDisplay() {
  const { quote, visible } = useQuotes(9000)

  return (
    <div
      className="relative z-10 max-w-2xl w-full mx-auto px-4 mt-8 animate-fadeUp"
      style={{ animationDelay: '0.4s' }}
    >
      <div
        className="transition-all duration-500 ease-in-out"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(6px)' }}
      >
        <blockquote className="border-l-2 border-azure-500/25 pl-5">
          <p className="font-display italic text-parchment-300 text-lg md:text-xl leading-relaxed mb-2">
            "{quote.text}"
          </p>
          <cite className="font-body text-[11px] text-white/25 tracking-[0.15em] not-italic">
            — {quote.author}
          </cite>
        </blockquote>
      </div>
    </div>
  )
}
