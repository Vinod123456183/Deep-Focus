/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          950: '#050508',
          900: '#0c0c12',
          800: '#12121a',
          700: '#1a1a26',
          600: '#252535',
        },
        azure: {
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#6aa0ff',
          600: '#3b82f6',
        },
        sage: {
          400: '#86efac',
          500: '#7adf9e',
        },
        parchment: {
          100: '#f0ece0',
          200: '#e8e4d8',
          300: '#c8c4b8',
          400: '#a0a898',
        },
      },
      animation: {
        'twinkle': 'twinkle 4s ease-in-out infinite alternate',
        'fadeUp': 'fadeUp 0.8s ease both',
        'pulseBar': 'pulseBar 1s ease-in-out infinite alternate',
        'glowPulse': 'glowPulse 3s ease-in-out infinite alternate',
      },
      keyframes: {
        twinkle: { '0%': { opacity: '0.1' }, '100%': { opacity: '0.5' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseBar: { '0%': { opacity: '0.5' }, '100%': { opacity: '1' } },
        glowPulse: {
          '0%': { boxShadow: '0 0 20px rgba(100,160,255,0.1)' },
          '100%': { boxShadow: '0 0 50px rgba(100,160,255,0.35)' },
        },
      },
    },
  },
  plugins: [],
}
