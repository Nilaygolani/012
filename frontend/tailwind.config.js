/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#9C413D',
          primaryDark: '#7A2E2B',
          primaryLight: '#FAF0EE',
          gold: '#C5A880',
          sand: '#EFEAE1',
          bg: '#FAF7F2',
          card: '#FFFFFF',
          dark: '#1C1917',
          muted: '#78716C',
          border: '#E7E2D8'
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

