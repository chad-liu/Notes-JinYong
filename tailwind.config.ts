import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans-tc)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
