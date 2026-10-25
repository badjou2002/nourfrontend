/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        nour: {
          lavender: '#a09ece',
          'lavender-dark': '#7d7bb4',
          'lavender-light': '#d3d2ea',
          'lavender-pale': '#f1f0fa',
          teal: '#3fa0a4',
          'teal-dark': '#33888c',
          'teal-light': '#d9eeef',
          terracotta: '#c85347',
          'terracotta-light': '#f7e2e0',
          blush: '#80a7d9',
          'blush-light': '#e9f1fc',
          sage: '#adc7a6',
          'sage-light': '#eaf1e8',
          cream: '#f7f8fc',
          ink: '#2d3040',
        },
      },
      fontFamily: {
        display: ['CutieDinosaur', 'Grandstander', 'Fredoka', 'sans-serif'],
        body: ['CutieDinosaur', 'Grandstander', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        soft: '12px',
        softer: '16px',
        squishy: '20px',
        blob: '46% 54% 55% 45% / 48% 42% 58% 52%',
      },
      boxShadow: {
        doodle: '0 6px 24px rgba(160, 158, 206, 0.18)',
        'doodle-lg': '0 14px 44px rgba(160, 158, 206, 0.26)',
        'doodle-teal': '0 6px 24px rgba(63, 160, 164, 0.2)',
        soft: '0 4px 16px rgba(45, 48, 64, 0.08)',
      },
      backgroundImage: {
        'doodle-grid':
          "url(\"data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23a09ece' stroke-opacity='0.14' stroke-width='1'%3E%3Ccircle cx='12' cy='12' r='6'/%3E%3Ccircle cx='108' cy='24' r='4'/%3E%3Cpath d='M20 80q5-6 10 0t10 0'/%3E%3Cpath d='M84 84q5-6 10 0t10 0'/%3E%3Cpath d='M50 20q5-6 10 0t10 0'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite',
        'float-slower': 'float 9s ease-in-out infinite',
        wiggle: 'wiggle 1.4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out both',
        marquee: 'marquee 22s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
