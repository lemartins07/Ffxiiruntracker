import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: ['class'],
  content: ['src/app/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}', 'src/lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        heading: ['var(--font-heading)', ...fontFamily.serif],
        japanese: ['var(--font-jp)', ...fontFamily.sans],
      },
      colors: {
        'bg-app': 'var(--bg-app)',
        'bg-surface': 'var(--bg-surface)',
        'bg-surface-muted': 'var(--bg-surface-muted)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        'border-subtle': 'var(--border-subtle)',
      },
      boxShadow: {
        focus: '0 0 0 2px var(--accent-soft)',
      },
    },
  },
  plugins: [typography],
};

export default config;
