/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#E67E22',
        surface: '#001F54',
        'on-surface': '#FFFFFF',
      }
    }
  },
  plugins: [],
}
