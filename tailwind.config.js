/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        wave: 'wave 1.5s ease-in-out infinite',
      },
      fontFamily: {
        qsand: ['Quicksand', 'sans-serif'],
      },
      screens: {
        'is1000': '1000px'
      }
    },
  },
  plugins: [],
  darkMode: 'class'
}

