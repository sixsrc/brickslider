export function calcSliderWidth(
  slidesPerPage: number,
  spacing: number,
  sliderWidth: number
) {
  const sliderWidthPercent = (
    (100 / slidesPerPage) *
    (1 - spacing / sliderWidth)
  ).toFixed(2)

  return parseFloat(sliderWidthPercent)
}
