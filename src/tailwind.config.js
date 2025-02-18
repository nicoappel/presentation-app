/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'heavy-green': '#00534C',
        'light-green': '#00B388',
        'warm-yellow': '#F2C75C',
        'light-grey': '#F4F5F5'
      }
    },
  },
  plugins: [],
}