const attr = (index: number, numberOfSlides: number) => ({
  "aria-label": `slide ${index} of ${numberOfSlides}`,
  "aria-hidden": "true",
  role: "group"
})

export { attr }
