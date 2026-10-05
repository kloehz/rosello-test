/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.js'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#031528',
          navyDark: '#020d1d',
          navyLight: '#032267',
          red: '#E50110',
          redHover: '#c9000e',
          forest: '#2E6C29',
          forestHover: '#255820',
          forestLight: '#edf7ef',
          whatsapp: '#25d366',
          whatsappHover: '#1eb857',
          grayLight: '#F2F5FA',
          grayBorder: '#e2e8f0',
          textMain: '#031528',
          textMuted: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif']
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')]
};
