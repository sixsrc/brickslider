module.exports = {
  plugins: [
    function ({ addUtilities, theme }) {
      const newUtilities = {
        ".slider__dot--active": {
          backgroundColor: theme("colors.green.500") // Usa bg-green-500
        }
      }

      addUtilities(newUtilities, ["responsive", "hover"]) // Adiciona variantes
    }
  ]
}
