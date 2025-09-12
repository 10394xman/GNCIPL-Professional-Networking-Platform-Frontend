/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#4285F4',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        navy: {
          900: '#0B1530',
        }
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    theme: ["light"], // enables all built-in DaisyUI themes
  },
}