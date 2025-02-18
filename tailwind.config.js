const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'heavy-green': '#00534C',
        'light-green': '#00B388',
        'warm-yellow': '#F2C75C',
        'light-grey': '#F4F5F5',
      },
      fontFamily: {
        'barlow': ['Barlow', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {
      textColor: ['hover', 'disabled'],
      backgroundColor: ['hover', 'disabled'],
    },
  },
  plugins: [],
}