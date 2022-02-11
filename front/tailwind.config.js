module.exports = {
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        '5xl': '20px 20px 50px rgba(0, 0, 0, 0.5)',
        '3xl': '10px 10px 25px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
