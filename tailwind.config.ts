import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Inter Tight', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        bg: '#030712',
        surface: '#0f1629',
        elevated: '#1a2342',
        card: {
          DEFAULT: '#0f1629',
          foreground: '#f1f5f9',
        },
        popover: {
          DEFAULT: '#1a2342',
          foreground: '#f1f5f9',
        },
        primary: {
          DEFAULT: '#60a5fa',
          foreground: '#030712',
        },
        secondary: {
          DEFAULT: '#0f1629',
          foreground: '#94a3b8',
        },
        muted: {
          DEFAULT: '#1e3a5f',
          foreground: '#94a3b8',
        },
        accent: {
          DEFAULT: '#c084fc',
          foreground: '#030712',
        },
        destructive: {
          DEFAULT: '#f87171',
          foreground: '#f1f5f9',
        },
        success: '#34d399',
        warning: '#fbbf24',
        danger: '#f87171',
        border: '#1e3a5f',
        'border-subtle': '#0f2040',
        input: '#1e3a5f',
        ring: '#60a5fa',
        chart: {
          '1': '#60a5fa',
          '2': '#c084fc',
          '3': '#34d399',
          '4': '#fbbf24',
          '5': '#f87171',
        },
        sidebar: {
          DEFAULT: '#0f1629',
          foreground: '#94a3b8',
          primary: '#60a5fa',
          'primary-foreground': '#030712',
          accent: '#1a2342',
          'accent-foreground': '#f1f5f9',
          border: '#1e3a5f',
          ring: '#60a5fa',
        },
      },
      borderRadius: {
        xl: '24px',
        lg: '16px',
        md: '10px',
        sm: '6px',
      },
      boxShadow: {
        'glow-blue': '0 0 24px rgba(96,165,250,0.2), 0 0 0 1px rgba(96,165,250,0.15)',
        'glow-purple': '0 0 24px rgba(192,132,252,0.2), 0 0 0 1px rgba(192,132,252,0.15)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;