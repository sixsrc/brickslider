import { CLASS_VALUES, DOM_ELEMENTS } from "./constants"
import {
  AnimationOptions,
  CurrentSlideMovement,
  MouseEventOrTouchEvent,
  TypeIndexBaseSliderdBy
} from "./types"

export function addClass(
  elements: (HTMLElement | Element)[],
  className: string
): void {
  elements.forEach(el => {
    el.classList.add(className)
  })
}

/*export function animateElement(
  element: HTMLElement | HTMLElement[],
  keyframes: Keyframe[],
  options: Partial<AnimationOptions>
): void {
  if (!element) {
    throw new Error("Element is required for animation.")
  }

  const elements = Array.isArray(element) ? element : [element]

  elements.forEach(el => {
    el.animate(keyframes, options)
  })
}*/

export function animateElement(
  element: HTMLElement | HTMLElement[],
  keyframes: Keyframe[],
  options: Partial<AnimationOptions>
): Animation[] {
  if (!element) {
    throw new Error("Element is required for animation.")
  }

  const elements = Array.isArray(element) ? element : [element]

  return elements.map(el => el.animate(keyframes, options))
}

export function appendChildren(
  container: HTMLElement,
  children: HTMLElement[]
): void {
  children.forEach(element => container.appendChild(element))
}
export function applyCss(
  element: HTMLElement,
  styles: { [style: string]: string }
): void {
  Object.keys(styles).forEach(key =>
    element.style.setProperty(key, styles[key])
  )
}

export function shouldApplyAdjustment(
  totalSlides: number,
  slidesPerPage: number,
  clonedSlides: number
) {
  // Calcula o número total de páginas
  const totalPages = Math.ceil(totalSlides / slidesPerPage)

  // Determina o mínimo necessário de clones para cobrir as páginas corretamente
  const minimumClonesRequired = slidesPerPage * totalPages

  // O ajuste é necessário se o número de clones for menor que o mínimo necessário
  return clonedSlides < minimumClonesRequired
}

export function appendToParent(
  parent: HTMLElement | undefined,
  element: HTMLElement | undefined
): HTMLElement | undefined {
  if (parent && element) {
    parent.appendChild(element)
    return element
  }
}

export function calcWidth(
  sliderWidth: number,
  slidesPerPage: number,
  spacing: number
): number {
  const width = sliderWidth / slidesPerPage - spacing / slidesPerPage
  return width
}

export function calcNumberOfSlides(
  infinite: boolean,
  slidesPerPage: number,
  $children: HTMLElement
) {
  const sliderCount = getChildrenCount($children)

  if (infinite && slidesPerPage <= 1) {
    return sliderCount - 2
  }
  if (infinite && slidesPerPage > 1) {
    return Math.ceil(sliderCount / slidesPerPage) - slidesPerPage
  }
  if (!infinite && slidesPerPage > 1) {
    return Math.ceil(sliderCount / slidesPerPage)
  }
  return sliderCount
}

export function createNewElement(tagName: string): HTMLElement {
  return document.createElement(tagName)
}

export function delayOf<T>(ms: number, value: T) {
  return new Promise<T>(resolve => setTimeout(resolve, ms, value))
}

export function getAllElements<T extends Element>(
  selector: string,
  parent: Document | Element = document
): NodeListOf<T> {
  return parent.querySelectorAll(selector) as NodeListOf<T>
}

export function getDotsContainer(
  rootSelector: string
): HTMLElement | undefined {
  return $(`${rootSelector}  ${DOM_ELEMENTS.DOTS_SELECTOR}`)
}

export function getChildren(rootSelector: string): HTMLElement | undefined {
  return $(`${rootSelector}  ${DOM_ELEMENTS.CHILDREN_SELECTOR}`)
}

export function getChildrenCount(el: HTMLElement | undefined): number {
  return el ? el!.children.length : 0
}

export function getDotsSelector($root: string): HTMLElement | undefined {
  return $(`${$root} ${DOM_ELEMENTS.DOTS_SELECTOR}`)
}

export function getElementAttribute(
  element: Element | HTMLElement,
  attributeName: string
): string | null {
  return element.getAttribute(attributeName)
}

export function getRootSelector($root: string): HTMLElement | undefined {
  return $(`${$root}`)
}

export function getSliderNodeList($root: string, cloned: boolean = true) {
  return Array.from(
    getAllElements<HTMLElement>(
      `${DOM_ELEMENTS.CHILDREN_SELECTOR} > *${cloned ? "" : ":not(.cloned)"}`,
      getChildren($root)
    )
  )
}

export function getSliderWidth(
  el: HTMLElement | undefined
): number | undefined {
  if (el) return el.offsetWidth
}

export function getPosition(element: HTMLElement) {
  var xPos = 0,
    yPos = 0

  while (element) {
    xPos += element.offsetLeft - element.scrollLeft + element.clientLeft
    yPos += element.offsetTop - element.scrollTop + element.clientTop
    element = element.offsetParent as HTMLElement
  }

  return { x: xPos, y: yPos }
}

export function getTrackChildren(
  rootSelector: string
): HTMLElement | undefined {
  return $(`${rootSelector} ${DOM_ELEMENTS.TRACK_SELECTOR}`)
}

export function hasClass(el: HTMLElement, className: string): boolean {
  return el.classList.contains(className)
}

export function prependChild(
  parentEl: HTMLElement | undefined,
  childEl: HTMLElement
): void {
  parentEl?.prepend(childEl)
}

export function removeClass(el: HTMLElement, className: string): void {
  el.classList.remove(className)
}
export function removePart<T extends string | any[]>(
  input: T,
  start?: number,
  end?: number
): T {
  return input.slice(start, end) as T
}

export function setAttribute(
  el: HTMLElement,
  attribute: string,
  value: string
): void {
  el.setAttribute(attribute, value)
}

export function setAttributes(element: HTMLElement, attributes: Object): void {
  for (const [key, value] of Object.entries(attributes)) {
    setAttribute(element, key, value)
  }
}

export function setInnerHTML(el: HTMLElement, html: string): void {
  el.innerHTML = html
}

export function setProperty(element: HTMLElement, prop: string, value: string) {
  element.style.setProperty(prop, value)
}

export function setStyle(el: HTMLElement, styleProp: any, value: string): void {
  el.style[styleProp] = value
}

export function $(element: string): HTMLElement | undefined {
  const selectedElement: HTMLElement | null = document.querySelector(element)
  if (selectedElement) {
    return selectedElement
  }
}

export function adjustIndex(index: number, slidesPerPage: number) {
  if (slidesPerPage > 1) return Math.floor(index / slidesPerPage)
  return index
}

export function assert(condition: boolean, message?: string): void {
  if (!condition) {
    throw new Error(` ${message || ""}`)
  }
}

export function calcIndex(
  infinite: boolean,
  i: number,
  numberOfSlides: number,
  slidesPerPage: number
) {
  let index: number
  let sliderCount: number

  index = i + 1
  sliderCount = numberOfSlides

  if (infinite) {
    ///setIndexBypass(i, numberOfSlides, slidesPerPage) + 1
    sliderCount = numberOfSlides - 2
  }

  // index = i + 1
  return { index, sliderCount }
}

export function calcSliderWidth(spacing: number, sliderWidth: number) {
  return sliderWidth + spacing
}

export function calcTranslate2(
  $root: string,
  movement: "increment" | "decrement",
  slidesPerView: number,
  spacing: number
): number {
  const slides = getSliderNodeList($root)
  let translate = 0
  let val = 0
  val = movement === "increment" ? val++ : val--

  return translate
}

export function calcTranslate(
  $children: HTMLElement,
  slideSpacing: number,
  slidePosition: number
): number {
  const marginDiference = slidePosition * slideSpacing
  const sliderWidth = getSliderWidth($children)
  const translate = -(sliderWidth! * slidePosition + marginDiference)

  return translate
}

/*export function calcTranslate2(
  $children: HTMLElement, // O contêiner pai que contém os slides
  slideSpacing: number,
  slidesPerView: number,
  targetPosition: number
): number {
  let translate = 0

  const slides = Array.from($children.children) as HTMLElement[]

  // Soma a largura real dos slides anteriores ao alvo
  for (let i = 0; i < targetPosition; i++) {
    const slideWidth = slides[i].getBoundingClientRect().width
    translate -= slideWidth + slideSpacing
  }

  // Garante que o translate não ultrapasse o limite baseado no slidesPerView
  let visibleWidth = 0
  for (let i = targetPosition; i < targetPosition + slidesPerView; i++) {
    if (slides[i]) {
      visibleWidth += slides[i].getBoundingClientRect().width + slideSpacing
    }
  }

  // Ajusta o translate para alinhar os slides dentro do espaço visível
  translate += visibleWidth

  return translate
}*/

export function getEventType(
  event: MouseEventOrTouchEvent
): MouseEvent | Touch {
  if (event.type.includes("mouse")) {
    return event as MouseEvent
  } else {
    const touchEvent = event as TouchEvent
    return touchEvent.touches[0]
  }
}

export function getAxisX(event: MouseEvent | TouchEvent): number {
  if (event.type.includes("mouse")) {
    return (event as MouseEvent).pageX
  } else if (
    (event as TouchEvent).touches &&
    (event as TouchEvent).touches.length > 0
  ) {
    return (event as TouchEvent).touches[0].clientX
  } else {
    return NaN
  }
}

export function isAppleDevice(): boolean {
  const ua = navigator.userAgent.toLowerCase()
  return (
    ua.includes("safari") && !ua.includes("chrome") && !ua.includes("android")
  )
}

export function indexBasedBy(params: TypeIndexBaseSliderdBy) {
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

export function isNotMapped(
  infinite: boolean,
  currentIndex: number,
  numberOfSlides: number
): boolean {
  switch (true) {
    case !infinite && currentIndex > numberOfSlides - 1:
      return true
    case !infinite && currentIndex < 0:
      return true
    case currentIndex > currentIndex + 1:
      currentIndex = currentIndex - 1
      break
    case currentIndex < 0:
      currentIndex = currentIndex + 1
      break
  }

  return false
}

export function isValidSelector(string: string): boolean {
  const regex = /^[.#].*/
  return regex.test(string)
}

export function listener(
  events: string[],
  target: EventTarget,
  callback: EventListenerOrEventListenerObject
): void {
  if (Array.isArray(events)) {
    events.forEach(event => {
      target.addEventListener(event, callback)
    })
  }
}

export function removeListener(
  events: string[],
  target: EventTarget,
  callback: EventListenerOrEventListenerObject
): void {
  if (Array.isArray(events)) {
    events.forEach(event => {
      target.removeEventListener(event, callback)
    })
  }
}

export function removeProperty(element: HTMLElement, prop: string) {
  element.style.removeProperty(prop)
}

export function removeAttribute(el: HTMLElement, attribute: string): void {
  el.removeAttribute(attribute)
}

export function reorderIdx(
  displayedIndex: number,
  numberOfSlides: number,
  slidesPerPage: number
) {
  slidesPerPage > 1
    ? (numberOfSlides = numberOfSlides - (slidesPerPage + slidesPerPage))
    : numberOfSlides

  const reorder =
    displayedIndex < 0
      ? numberOfSlides - 1
      : displayedIndex >= numberOfSlides
        ? displayedIndex
        : displayedIndex === numberOfSlides - 1
          ? 0
          : displayedIndex === 0
            ? numberOfSlides - 3
            : displayedIndex - 1

  return reorder
}

export function updateDataIndexes(
  slides: HTMLElement[],
  slidesPerPage: number
) {
  // Inicializa o índice de grupo
  let groupIndex = 0

  // Itera sobre os slides e atualiza o data-index
  slides.forEach((slide, index) => {
    // Calcula o índice de grupo para o slide atual
    const isStartOfGroup = index % slidesPerPage === 0

    // Se for o início de um novo grupo, incrementa o groupIndex
    if (isStartOfGroup && index !== 0) {
      groupIndex++
    }

    // Atualiza o atributo data-index do slide
    slide.setAttribute("data-index", String(groupIndex))
  })
}

/*export function reorderIdx(
  displayedIndex: number,
  numberOfSlides: number,
  slidesPerPage: number
) {
  // Ajusta o número de slides total considerando que cada grupo de slides por página é tratado como 1 unidade
  const effectiveSlidesCount =
    Math.ceil(numberOfSlides / slidesPerPage) * slidesPerPage

  // Calcula o índice do slide após a reordenação
  const reorder =
    displayedIndex < 0
      ? effectiveSlidesCount - 1
      : displayedIndex >= effectiveSlidesCount
        ? displayedIndex
        : displayedIndex === effectiveSlidesCount - 1
          ? 0
          : displayedIndex === 0
            ? effectiveSlidesCount - 1
            : displayedIndex - 1

  return reorder
}*/

/*export function toggleClass2(
  slides: HTMLElement[],
  slideIndex: number,
  slidesPerView: number,
  slidesPerPage: number,
  slideMovement: "increment" | "decrement"
): void {
  // Valida se slidesPerView não é maior que slidesPerPage
  if (slidesPerView > slidesPerPage) {
    slidesPerView = slidesPerPage // Limita ao máximo permitido
  }

  // Determina o número de slides ativos e onde estão os limites
  let activeStartIndex = -1
  let activeEndIndex = -1

  // Encontra os índices de slides atualmente ativos
  slides.forEach((slide, index) => {
    if (slide.classList.contains(CLASS_VALUES.ACTIVE)) {
      if (activeStartIndex === -1) {
        activeStartIndex = index // Primeiro slide ativo
      }
      activeEndIndex = index // Último slide ativo
    }
  })

  // Remove todas as classes ativas
  slides.forEach(slide => removeClass(slide, CLASS_VALUES.ACTIVE))

  // Determina o próximo intervalo de slides ativos
  let targetStartIndex: number
  if (slideMovement === "increment") {
    targetStartIndex = activeStartIndex + slidesPerView // Próximo bloco
  } else {
    targetStartIndex = activeStartIndex - slidesPerView // Bloco anterior
  }

  // Garante que os índices estão dentro dos limites válidos
  targetStartIndex = Math.max(
    0,
    Math.min(slides.length - slidesPerPage, targetStartIndex)
  )

  // Define os novos slides ativos
  for (let i = 0; i < slidesPerPage; i++) {
    const index = targetStartIndex + i
    if (index < slides.length) {
      addClass([slides[index]], CLASS_VALUES.ACTIVE)
    }
  }
}*/

/*export function toggleClass2(
  slides: HTMLElement[],
  slideIndex: number,
  slidesPerView: number,
  slidesPerPage: number,
  slideMovement: "increment" | "decrement"
): Map<number, number[]> {
  // Valida se slidesPerView não é maior que slidesPerPage
  if (slidesPerView > slidesPerPage) {
    slidesPerView = slidesPerPage // Limita ao máximo permitido
  }

  // Determina o número de slides ativos e onde estão os limites
  let activeStartIndex = -1
  let activeEndIndex = -1

  // Encontra os índices de slides atualmente ativos
  slides.forEach((slide, index) => {
    if (slide.classList.contains(CLASS_VALUES.ACTIVE)) {
      if (activeStartIndex === -1) {
        activeStartIndex = index // Primeiro slide ativo
      }
      activeEndIndex = index // Último slide ativo
    }
  })

  // Remove todas as classes ativas
  slides.forEach(slide => removeClass(slide, CLASS_VALUES.ACTIVE))

  // Determina o próximo intervalo de slides ativos
  let targetStartIndex: number
  if (slideMovement === "increment") {
    targetStartIndex = activeStartIndex + slidesPerView // Próximo bloco
  } else {
    targetStartIndex = activeStartIndex - slidesPerView // Bloco anterior
  }

  // Garante que os índices estão dentro dos limites válidos
  targetStartIndex = Math.max(
    0,
    Math.min(slides.length - slidesPerPage, targetStartIndex)
  )

  // Define os novos slides ativos e cria o Map de retorno
  const activeSlidesMap = new Map<number, number[]>() // Map para armazenar os índices
  const activeIndices: number[] = [] // Array temporário para armazenar os índices ativos

  for (let i = 0; i < slidesPerPage; i++) {
    const index = targetStartIndex + i
    if (index < slides.length) {
      addClass([slides[index]], CLASS_VALUES.ACTIVE)
      activeIndices.push(index) // Adiciona o índice ativo
    }
  }

  // Preenche o Map com a página como chave e os índices como valor
  const currentPage = Math.floor(targetStartIndex / slidesPerPage) + 1
  activeSlidesMap.set(currentPage, activeIndices)

  return activeSlidesMap
}
*/

export function shouldChangePage(
  allSlides: Record<number, number[]>,
  activeSlides: Record<number, number[]>
): boolean {
  // Percorre os grupos de slides ativos
  for (const page in activeSlides) {
    const activeGroup = activeSlides[page]

    // Verifica se esse grupo existe em algum dos grupos de `allSlides`
    for (const group in allSlides) {
      const allGroup = allSlides[group]

      // Se o grupo ativo é idêntico ao grupo geral, retorna true
      const isEqual =
        activeGroup.length === allGroup.length &&
        activeGroup.every(value => allGroup.includes(value))

      if (isEqual) {
        return true // Hora de mudar de página
      }
    }
  }

  return false // Não encontrou nenhum grupo igual
}
export function toggleClass2(
  slides: HTMLElement[],
  slidesPerView: number,
  slidesPerPage: number,
  slideMovement: CurrentSlideMovement
): Map<number, number[]> {
  if (slidesPerView > slidesPerPage) {
    slidesPerView = slidesPerPage
  }

  let activeStartIndex = -1
  let activeEndIndex = -1

  slides.forEach((slide, index) => {
    if (slide.classList.contains(CLASS_VALUES.ACTIVE)) {
      if (activeStartIndex === -1) {
        activeStartIndex = index
      }
      activeEndIndex = index
    }
  })

  slides.forEach(slide => removeClass(slide, CLASS_VALUES.ACTIVE))

  let targetStartIndex: number

  if (slideMovement === "increment") {
    targetStartIndex = activeStartIndex + slidesPerView
  } else {
    targetStartIndex = activeStartIndex - slidesPerView
  }

  targetStartIndex = Math.max(
    0,
    Math.min(slides.length - slidesPerPage, targetStartIndex)
  )

  console.log("targetStartIndex", targetStartIndex)

  const activeSlidesMap = new Map<number, number[]>()
  const activeIndices: number[] = []

  for (let i = 0; i < slidesPerPage; i++) {
    const index = targetStartIndex + i
    if (index < slides.length) {
      addClass([slides[index]], CLASS_VALUES.ACTIVE)
      activeIndices.push(index)
    }
  }

  const currentPage = Math.floor(targetStartIndex / slidesPerPage) + 1
  activeSlidesMap.set(currentPage, activeIndices)

  return activeSlidesMap
}

/* const startIndex =
    slideMovement === "increment"
      ? slideIndex * slidesPerPage
      : slideIndex * slidesPerPage - slidesPerView
 
  const endIndex = Math.min(startIndex + slidesPerView, slides.length)
  const validStartIndex = Math.max(0, startIndex)

  for (let i = validStartIndex; i < endIndex; i++) {
    addClass([slides[i]], CLASS_VALUES.ACTIVE)
  }*/
export function toggleClass(
  slides: HTMLElement[],
  slideIndex: number,
  slidesPerPage: number
): void {
  let i = 0

  slides.forEach(slide => {
    removeClass(slide, CLASS_VALUES.ACTIVE)
  })

  for (i; i < slidesPerPage; i++) {
    const index = slideIndex * slidesPerPage + i

    addClass([slides[index]], CLASS_VALUES.ACTIVE)
  }
}

export function translate3d(x: number): string | undefined {
  return `translate3d(${x}px, 0px, 0px)`
}

export function waitFor(time: number, callback: () => void) {
  let start: number

  function wait(timestamp: number) {
    if (!start) start = timestamp
    if (timestamp - start < time) {
      requestAnimationFrame(wait)
    } else {
      callback()
    }
  }
  requestAnimationFrame(wait)
}
