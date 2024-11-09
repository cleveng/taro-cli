/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/index.html', './src/**/*.{html,vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  corePlugins: {
    preflight: false
  },
  plugins: []
}
