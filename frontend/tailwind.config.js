/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        pixel: {
          bg: '#e0f8cf', // retro gameboy light green/yellowish
          dark: '#081820', // retro dark
          white: '#ffffff',
          primary: '#346f00',
          red: '#b4202a',
          lightRed: '#d95763',
          yellow: '#fbf236',
          green: '#99e550',
          gray: '#595652',
          lightGray: '#9badb7',
        }
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px #081820',
        'pixel-hover': '2px 2px 0px 0px #081820',
        'pixel-plate': '0px 4px 0px 0px #081820',
        'pixel-white': '4px 4px 0px 0px #ffffff',
      }
    },
  },
  plugins: [],
}
