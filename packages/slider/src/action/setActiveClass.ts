import { addClass } from "@/dom/methods/addClass"
import { CLASS_VALUES } from "@/util/constants"

// Função para adicionar a classe "active" aos slides com base no índice do slide ativo e na quantidade de slides por página
export function setActiveClass(
  slides: HTMLElement[],
  slideIndex: number,
  slidesPerPage: number,
  numberOfSlides: number
): void {
  for (let i = 0; i < slidesPerPage; i++) {
    const index = slideIndex * slidesPerPage + i

    //console.log("index", index, "numberOfSlides", numberOfSlides)

    addClass([slides[index]], CLASS_VALUES.ACTIVE)

    //console.log("[slides[index]", slides[index])

    if (index < numberOfSlides) {
      // slides[index].classList.add(className)
      // addClass([slides[index]], CLASS_VALUES.ACTIVE)
    }
  }
}

// Exemplo de uso
/*const slides = document.querySelectorAll(".slide") // Suponha que 'slides' seja a lista de seus slides
const slideIndex = 1 // O índice do slide ativo
const slidesPorPagina = 2 // Número de slides por página
const totalSlides = slides.length // Número total de slides
const className = "active" // Nome da classe a ser adicionada*/

//setActiveClass(slideIndex, slidesPorPagina, totalSlides, className)
