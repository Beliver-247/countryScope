/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionDuration: {
        '400': '400ms',
      },
      screens: {
        'xs': '480px', // Custom breakpoint for small mobile screens
      },
    },
  },
  plugins: [],
}