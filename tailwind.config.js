/** @type {import('tailwindcss').Config} */
module.exports = {
  // Include paths to all your JS and JSX files
  content: ["./App.{js,jsx}", "./src/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  presets: [require("nativewind/preset")],
  theme: {
        extend: {
      colors: {
        primary: { DEFAULT: '#AF1D5A', dark: '#8E174A', light: '#FBE8F0' },
      },
    },
  },
  plugins: [],
}
