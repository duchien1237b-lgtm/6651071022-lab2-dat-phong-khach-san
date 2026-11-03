/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Breakpoint tùy biến (tính năng bắt buộc F = 2)
    // mobile  : < 640px      -> 1 cột (mặc định, không cần tiền tố)
    // tablet  : 640–1023px   -> 2 cột
    // laptop  : >= 1024px    -> 3 cột
    // desktop : >= 1280px    -> 4 cột
    screens: {
      tablet: '640px',
      laptop: '1024px',
      desktop: '1280px',
    },
    extend: {
      colors: {
        // Màu chủ đạo C = 1: Emerald (#059669)
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgb(15 23 42 / 0.04), 0 8px 24px -12px rgb(15 23 42 / 0.12)',
        'card-hover': '0 2px 4px rgb(15 23 42 / 0.06), 0 24px 48px -16px rgb(4 120 87 / 0.28)',
      },
      keyframes: {
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'toast-progress': {
          '0%': { transform: 'scaleX(1)' },
          '100%': { transform: 'scaleX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Chỉ dịch chuyển (không đổi opacity) để không làm chậm LCP
        'rise': {
          '0%': { transform: 'translateY(18px)' },
          '100%': { transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'ping-slow': {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
      },
      animation: {
        'toast-in': 'toast-in 200ms ease-out',
        'toast-progress': 'toast-progress linear forwards',
        'fade-in': 'fade-in 200ms ease-out',
        rise: 'rise 700ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
        float: 'float 6s ease-in-out infinite',
        'ping-slow': 'ping-slow 2.4s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
}
