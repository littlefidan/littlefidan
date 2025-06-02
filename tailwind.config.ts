import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Modern Natural Palette - Sophisticated & Warm
        primary: {
          DEFAULT: '#9B8B7A', // Warm taupe
          50: '#FAF9F7',
          100: '#F5F2EE',
          200: '#E6E0D9',
          300: '#D7CFC5',
          400: '#C3B8AA',
          500: '#9B8B7A',
          600: '#837365',
          700: '#6B5C51',
          800: '#534640',
          900: '#3C3230'
        },
        taupe: {
          DEFAULT: '#A89F91', // Lighter taupe
          50: '#FBFAF9',
          100: '#F7F5F2',
          200: '#EBE7E1',
          300: '#DFD9D0',
          400: '#CFC5B8',
          500: '#A89F91',
          600: '#8F8578',
          700: '#736A5F',
          800: '#5A5249',
          900: '#423B35'
        },
        mint: {
          DEFAULT: '#A8D5BA', // Fresh mint green
          50: '#F3FAF6',
          100: '#E7F5ED',
          200: '#C9E8D7',
          300: '#A8D5BA',
          400: '#8AC7A4',
          500: '#6BB48B',
          600: '#52A074',
          700: '#42825E',
          800: '#35674B',
          900: '#294D39'
        },
        olive: {
          DEFAULT: '#7B8471', // Soft olive green
          50: '#F6F7F5',
          100: '#EDEFEA',
          200: '#D7DDD1',
          300: '#BFC6B6',
          400: '#9EA593',
          500: '#7B8471',
          600: '#646D5B',
          700: '#4F5648',
          800: '#3E4339',
          900: '#2D312B'
        },
        babyblue: {
          DEFAULT: '#B5D4E8', // Soft baby blue
          50: '#F5F9FC',
          100: '#EBF3F9',
          200: '#D2E4F0',
          300: '#B5D4E8',
          400: '#94C1DD',
          500: '#6FA9CF',
          600: '#5190BD',
          700: '#3F759E',
          800: '#315B7C',
          900: '#254358'
        },
        cream: {
          DEFAULT: '#FFF8F0', // Warm cream
          50: '#FFFEFA',
          100: '#FFFDF7',
          200: '#FFFBF2',
          300: '#FFF8F0',
          400: '#FFF2E5',
          500: '#FFEBD5',
          600: '#FFE0BF',
          700: '#FFD2A3',
          800: '#FFC182',
          900: '#FFAB5E'
        },
        accent: {
          gold: '#D4A574', // Warm gold
          coral: '#E8A598', // Soft coral
          sage: '#A3B88C', // Sage green
          sand: '#E5D4B8', // Sandy beige
          terracotta: '#C97D6B' // Terracotta
        },
        neutral: {
          dark: '#3A3733',
          medium: '#6B645C',
          light: '#F9F7F4',
          base: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-crimson-pro)'],
        script: ['var(--font-sacramento)'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'botanical': '0 10px 25px -5px rgb(155 170 139 / 0.1), 0 8px 10px -6px rgb(155 170 139 / 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.7s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.2)' },
        },
        morph: {
          '0%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config