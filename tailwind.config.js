/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'dark-navy': '#0B0C0E',
        'text-primary': '#14151A',
        'badge-bg': '#E3EAFD',
        'badge-text': '#133A9A',
        'comment-bg': '#FFF58A',
        'cta-bg': '#8AE0FF',
        'text-muted': 'rgba(15, 19, 36, 0.6)',
      },
    },
  },
  plugins: [],
} 