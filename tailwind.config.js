/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [{ pattern: /^(bg|border|text)-(rust|brown|muted|amber|sage|slate|cream|ink)$/ }],
  theme: {
    extend: {
      fontSize: {
        '2xs': ['10px', { lineHeight: '1' }],
        label: ['11px', { lineHeight: '1.4' }],
        body: ['15px', { lineHeight: '1.5' }],
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        cream: 'rgb(var(--color-cream))',
        'cream-dark': 'rgb(var(--color-cream-dark))',
        rust: 'rgb(var(--color-rust))',
        'rust-light': 'rgb(var(--color-rust-light))',
        brown: 'rgb(var(--color-brown))',
        amber: 'rgb(var(--color-amber))',
        sage: 'rgb(var(--color-sage))',
        slate: 'rgb(var(--color-slate))',
        ink: 'rgb(var(--color-ink))',
        muted: 'rgb(var(--color-muted))',
        'muted-light': 'rgb(var(--color-muted-light))',
        surface: 'rgb(var(--color-surface))',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      })
    },
  ],
}
