import { useState, useEffect } from 'react'

export interface Quote {
  text: string
  author: string
}

export const QUOTES: Quote[] = [
  { text: 'For one who has conquered the mind, it is the best of friends; for one who has failed, it is the worst enemy.', author: 'Shree Krishna — Bhagavad Gita 6.6' },
  { text: 'Discipline is choosing between what you want now and what you want most.', author: 'Abraham Lincoln' },
  { text: 'We are what we repeatedly do. Excellence is not an act, but a habit.', author: 'Aristotle' },
  { text: 'One who is disciplined in mind remains steady in success and failure.', author: 'Shree Krishna — Bhagavad Gita 6.7' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' },
  { text: 'Let a person lift themselves by their own mind, not degrade themselves.', author: 'Shree Krishna — Bhagavad Gita 6.5' },
  { text: 'Fix your mind on me alone, and you shall live in me always.', author: 'Shree Krishna — Bhagavad Gita 12.8' },
  { text: "It's not about having time. It's about making time.", author: 'Unknown' },
  { text: 'Your future is created by what you do today, not tomorrow.', author: 'Robert Kiyosaki' },
  { text: 'Motivation gets you going. Discipline keeps you growing.', author: 'John C. Maxwell' },
  { text: 'The mind is everything. What you think you become.', author: 'Buddha' },
  { text: "Don't watch the clock; do what it does. Keep going.", author: 'Sam Levenson' },
  { text: 'Small disciplines repeated with consistency lead to great achievements.', author: 'John C. Maxwell' },
  { text: 'You dont rise to the level of your goals. You fall to the level of your systems.', author: 'James Clear' },
  { text: 'Pain is temporary. Quitting lasts forever.', author: 'Lance Armstrong' },
]





export function useQuotes(intervalMs = 9000) {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx((i) => (i + 1) % QUOTES.length)
        setVisible(true)
      }, 500)
    }, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return { quote: QUOTES[idx], visible }
}
