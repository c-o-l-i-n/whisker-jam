/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Next Sunday', 'system-ui', 'sans-serif'],
        heading: ['Squealer', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        hit: {
          '0%, 100%': { transform: 'scale(1)' },
          '35%': { transform: 'scale(1.15)' },
        },
      },
      animation: {
        hit: 'hit 150ms ease-in-out',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light'],
  },
};
