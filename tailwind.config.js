/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        qsand: ['Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class'
}

