/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        'rivano-off-white': '#f5f0e8',
        'rivano-beige':     '#e8dcc8',
        'rivano-brown':     '#3f3028',
        'rivano-brown-mid': '#6e5542',
        'rivano-gold':      '#c4a882',
        'rivano-muted':     '#a8a29a',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans:  ['"DM Sans"', 'sans-serif'],
      },
      transitionDuration: {
        'fast':   '150ms',
        'normal': '200ms',
        'slow':   '300ms',
      },
    },
  },
  plugins: [],
};
