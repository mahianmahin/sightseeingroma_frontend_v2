/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'text-2xl', 'sm:text-3xl', 'md:text-3xl', 'lg:text-5xl', 'font-semibold', 'mb-2', 'md:mb-3', 'leading-tight', 'hidden lg:block'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}

