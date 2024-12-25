import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES } from "./constants"
import { addClass, hasClass, removeClass } from "./helpers"

export class Mutate extends BaseSlider {
  constructor($root: string) {
    super($root)
  }

  public targetClass(targetSlide: HTMLElement, applyTranslate: Function) {
    hasClass(targetSlide, CLASS_VALUES.ACTIVE)
      ? applyTranslate(targetSlide)
      : this.animate(targetSlide, this.keyFrames(0.1), this.options(0))
  }

  public toggleClass(slides: HTMLElement[]) {
    let {
      slidesPerPage,
      slidesPerView,
      currentSlideMovement: slideMovement
    } = this.store

    // Valida se slidesPerView não é maior que slidesPerPage
    if (slidesPerView > slidesPerPage) {
      //slidesPerView = slidesPerPage // Limita ao máximo permitido
      /*  this.setState({
        slidesPerView: slidesPerPage
      })*/
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

    for (let i = 0; i < slidesPerView; i++) {
      const index = targetStartIndex - i

      if (index < slides.length) {
        addClass([slides[index]], CLASS_VALUES.ACTIVE)
        activeIndices.push(index) // Adiciona o índice ativo
      }
    }

    // Preenche o Map com a página como chave e os índices como valor
    // const currentPage = Math.floor(targetStartIndex / slidesPerPage)
    //activeSlidesMap.set(currentPage, activeIndices)

    // return activeSlidesMap
  }
}
