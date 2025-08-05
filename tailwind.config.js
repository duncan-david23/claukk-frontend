/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        elegant: ['Great Vibes', 'cursive'], // Custom handwritten font
      },
    },
  },
  plugins: [],
}