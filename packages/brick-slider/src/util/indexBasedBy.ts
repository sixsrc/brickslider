type TypeIndexBasedBy = {
  from: string
  slideIndex: number
  touchIndex?: number
}

export function indexBasedBy(params: TypeIndexBasedBy) {
  const { from, slideIndex, touchIndex } = params

  switch (from) {
    case "next":
      return slideIndex + 1
    case "prev":
      return slideIndex - 1
    case "dots":
    case "touch":
      return touchIndex ?? slideIndex
    default:
      return slideIndex
  }
}
