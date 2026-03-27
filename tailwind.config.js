/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',
        'cream-dark': '#EDE8DF',
        rust: '#B5451B',
        'rust-light': '#D4622A',
        brown: '#6B4226',
        ink: '#3D3530',
        muted: '#9C8E85',
        'muted-light': '#C4BAB3',
      },
    },
  },
  plugins: [],
}
