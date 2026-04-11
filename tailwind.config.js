/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream:        'var(--color-cream)',
        'cream-dark': 'var(--color-cream-dark)',
        rust:         'var(--color-rust)',
        'rust-light': 'var(--color-rust-light)',
        brown:        'var(--color-brown)',
        amber:        'var(--color-amber)',
        sage:         'var(--color-sage)',
        slate:        'var(--color-slate)',
        ink:          'var(--color-ink)',
        muted:        'var(--color-muted)',
        'muted-light':'var(--color-muted-light)',
        surface:      'var(--color-surface)',
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
