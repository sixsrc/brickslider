import { FROM, setCurrentSlide } from "../action/setCurrentSlide";
import { updateDots } from "../action/updateDots";
import { getSliderWidth } from "../dom/methods/getSliderWidth";
import { transform } from "../transition/transform";

export function touch() {
  const slider = document.querySelector(
    "#slide1_container .slide1_images"
  ) as HTMLElement;
  const slides = Array.from(
    document.querySelectorAll("#slide1_container .slide1_images div")
  ) as HTMLElement[];

  let isDragging = false,
    startPos = 0,
    currentTranslateFromTouch = 0,
    prevTranslateFromTouch = 0,
    animationID = 0,
    currentIndex = 0;

  slides.forEach((slide, index) => {
    const slideImage = slide.querySelector("img");
    slideImage!.addEventListener("dragstart", (e) => e.preventDefault());

    slide.addEventListener("touchstart", touchStart(index));
    slide.addEventListener("touchend", touchEnd);
    slide.addEventListener("touchmove", touchMove);
    slide.addEventListener("mousedown", touchStart(index));
    slide.addEventListener("mouseup", touchEnd);
    // slide.addEventListener("mouseleave", touchEnd);
    slide.addEventListener("mousemove", touchMove);
  });

  slider.oncontextmenu = function (event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  function touchStart(index: any) {
    return function (event: any) {
      currentIndex = index;
      startPos = getPositionX(event);
      isDragging = true;
      animationID = requestAnimationFrame(animation);
      slider!.classList.add("grabbing");
    };
  }

  function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslateFromTouch - prevTranslateFromTouch;

    if (movedBy < -100 && currentIndex < slides.length - 1) {
      currentIndex += 1;
    }

    if (movedBy > 100 && currentIndex > 0) {
      currentIndex -= 1;
    }

    setPositionByIndex();

    slider!.classList.remove("grabbing");
  }

  function touchMove(event: any) {
    if (isDragging) {
      const currentPosition = getPositionX(event);
      currentTranslateFromTouch =
        prevTranslateFromTouch + currentPosition - startPos;
      transform("#slide1_container", currentTranslateFromTouch);
    }
  }

  function getPositionX(event: any) {
    return event.type.includes("mouse")
      ? event.pageX
      : event.touches[0].clientX;
  }

  function animation() {
    transform("#slide1_container", currentTranslateFromTouch);
    if (isDragging) requestAnimationFrame(animation);
  }

  function setPositionByIndex() {
    const sliderWidth = getSliderWidth(slider);
    currentTranslateFromTouch = currentIndex * -sliderWidth;
    prevTranslateFromTouch = currentTranslateFromTouch;

    setCurrentSlide({
      from: FROM.TOUCH,
      index: currentIndex,
      rootSelector: "#slide1_container",
    });

    updateDots(currentIndex, "#slide1_container");
  }
}
