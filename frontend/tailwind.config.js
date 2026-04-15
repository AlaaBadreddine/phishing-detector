export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        }
      },
      boxShadow: {
        glow: '0 30px 80px rgba(56, 189, 248, 0.16)',
        panel: '0 28px 90px rgba(15, 23, 42, 0.28)'
      },
      backgroundImage: {
        'halo': 'radial-gradient(circle at top, rgba(56, 189, 248, 0.20), transparent 36%)',
        'gradient-ring': 'radial-gradient(circle, rgba(56,189,248,0.3), transparent 38%)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.75s ease-out both'
      }
    }
  },
  plugins: []
}
