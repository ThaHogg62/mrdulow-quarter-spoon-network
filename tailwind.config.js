/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        qse: {
          base: '#000000',
          dark: '#000000',
          navy: '#0B132B',
          slate: '#0B132B',
          chrome: '#94A3B8',
          aluminum: '#E2E8F0',
          white: '#FFFFFF',
          electric: '#0044FF',
          metallicNavy: '#0033CC',
          neon: {
            blue: '#0044FF',
            emerald: '#10B981',
            magenta: '#D946EF',
            amber: '#F59E0B'
          }
        }
      },
      backgroundImage: {
        'brushed-metal': "linear-gradient(135deg, rgba(148,163,184,0.06) 0%, rgba(0,0,0,0.95) 100%)",
        'grid-pattern': "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMCAwaDQwdjQwSDBWMHptMSAxaDM4djM4SDFWMXoiIGZpbGw9IiMwQjEzMkIiIGZpbGwtb3BhY2l0eT0iMC4yNSIvPjwvc3ZnPg==')"
      },
      animation: {
        'neon-pulse': 'neonPulse 3s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'grid-drift': 'gridDrift 20s linear infinite',
        'subtle-drift': 'subtleDrift 8s ease-in-out infinite alternate',
        'card-reveal': 'cardReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'kinetic': 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      }
    }
  },
  plugins: [],
}
