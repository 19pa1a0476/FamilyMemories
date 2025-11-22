/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#1a73e8',
          gray: '#f1f3f4',
          bgDark: '#202124',
          grayDark: '#303134',
          text: '#3c4043',
          textSec: '#5f6368',
        }
      },
      fontFamily: {
        sans: ['"Google Sans"', 'Roboto', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}