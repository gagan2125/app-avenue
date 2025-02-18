/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      backgroundColor: {
        'primary': '#101010',
        'secondary': 'rgb(16,16,16)',
        'card': '#141414',
      },
      colors: {
        'opacity-half': 'rgba(255,255,255,0.5)',
      }
    },
  },
  plugins: [],
};
