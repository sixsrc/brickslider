// @ts-ignore Tailwind v4 resolve do helper depende da resolução do consumer.
import plugin from "tailwindcss/plugin"

// Plugin estrutural do BrickSlider.
// Ele abstrai as classes repetitivas de layout sem acoplar tema/cores
// para que o usuário aplique só o visual que quiser no HTML.
export default plugin(function ({ addComponents }): void {
  addComponents({
    ".bs-root": {
      position: "relative",
      display: "flex",
      alignItems: "center"
    },
    ".bs-track": {
      width: "100%",
      height: "100%",
      position: "relative",
      overflow: "hidden",
      touchAction: "pan-y",
      boxSizing: "border-box"
    },
    ".bs-auto-height-layout": {
      "--bs-auto-height-controls-space": "40px",
      paddingBottom: "var(--bs-auto-height-controls-space)"
    },
    ".bs-auto-height-layout .bs-track": {
      height: "auto"
    },
    ".bs-auto-height-layout .bs-container": {
      height: "auto",
      alignItems: "flex-start"
    },
    ".bs-auto-height-layout .bs-slide": {
      height: "auto"
    },
    ".bs-container": {
      boxSizing: "border-box",
      display: "inline-flex",
      flexWrap: "nowrap",
      flexDirection: "row",
      willChange: "transform",
      position: "relative",
      whiteSpace: "nowrap",
      width: "100%",
      height: "100%"
    },
    ".bs-container > *": {
      flexShrink: "0"
    },
    ".bs-slide": {
      boxSizing: "border-box",
      width: "100%"
    },
    ".bs-dots": {
      width: "max-content",
      maxWidth: "100%",
      textAlign: "center",
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "10",
      margin: "0"
    },
    ".bs-dot": {
      display: "inline-block",
      boxSizing: "border-box"
    },
    ".bs-progress": {
      height: "4px",
      display: "block",
      overflow: "hidden"
    },
    ".bs-progress-bar": {
      width: "100%",
      height: "100%",
      display: "block",
      transformOrigin: "left center",
      scale: "0 1"
    },
    ".bs-dot--active": {},
    ".bs-arrow": {},
    ".bs-prev": {},
    ".bs-next": {},
    ".bs-active-default": {
      backgroundColor: "#6d28d9",
      border: "1px solid #6d28d9",
      borderRadius: "0.75rem"
    },
    ".bs-dot-active-default": {
      backgroundColor: "#6d28d9",
      border: "1px solid #6d28d9"
    },
    ".bs-hidden": {
      visibility: "hidden !important"
    },
    ".bs-no-select > *": {
      userSelect: "none",
      WebkitUserSelect: "none"
    },
    ".bs-img": {
      width: "auto",
      maxWidth: "100%",
      pointerEvents: "none",
      borderRadius: "20px"
    },
    ".bs-stories": {
      position: "fixed",
      inset: "0",
      zIndex: "10000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      pointerEvents: "none",
      userSelect: "none",
      WebkitUserSelect: "none"
    },
    ".bs-stories .bs-track": {
      position: "relative",
      zIndex: "10001",
      width: "min(92vw, calc(86vh * 9 / 16), 430px)",
      maxWidth: "min(92vw, 430px)",
      height: "min(86vh, 760px)",
      aspectRatio: "9 / 16",
      overflow: "hidden",
      pointerEvents: "auto"
    },
    ".bs-stories .bs-container, .bs-stories .bs-slide": {
      height: "100%"
    },
    ".bs-stories-layer": {
      position: "fixed",
      inset: "0",
      zIndex: "9999",
      pointerEvents: "auto",
      userSelect: "none",
      WebkitUserSelect: "none"
    },
    ".bs-stories-backdrop": {
      position: "fixed",
      inset: "0"
    },
    ".bs-stories-progress": {
      position: "absolute",
      top: "calc(env(safe-area-inset-top) + 12px)",
      right: "16px",
      left: "16px",
      zIndex: "10003",
      display: "flex",
      height: "4px",
      alignItems: "stretch",
      gap: "4px",
      margin: "0",
      padding: "0",
      listStyle: "none",
      pointerEvents: "auto"
    },
    ".bs-stories-progress-item": {
      position: "relative",
      flex: "1 1 0",
      height: "100%",
      overflow: "hidden"
    },
    ".bs-stories-progress-bar": {
      position: "absolute",
      inset: "0",
      display: "block",
      width: "100%",
      height: "100%",
      transformOrigin: "left center",
      scale: "0 1"
    },
    ".bs-stories-close, .bs-stories-mute, .bs-stories-pause-indicator": {
      zIndex: "10004",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    ".bs-stories-mute, .bs-stories-pause-indicator": {
      position: "absolute"
    },
    ".bs-stories-close, .bs-stories-mute": {
      pointerEvents: "auto"
    },
    ".bs-stories-close": {
      position: "fixed",
      top: "32px",
      right: "24px"
    },
    ".bs-stories-mute": {
      right: "20px",
      bottom: "48px"
    },
    ".bs-stories-pause-indicator": {
      inset: "0",
      margin: "auto",
      pointerEvents: "none"
    },
    ".bs-stories-pause-indicator--visible": {
      pointerEvents: "auto"
    },
    ".bs-stories-body-open": {
      overflow: "hidden"
    },
    ".bs-stories.hidden, .bs-stories-layer.hidden, .bs-stories-play.hidden, .bs-stories-pause.hidden, .bs-stories-mute-on.hidden, .bs-stories-mute-off.hidden": {
      display: "none !important"
    }
  })
})

export const brickSliderTailwindClasses = {
  root: "bs-root",
  track: "bs-track",
  container: "bs-container",
  slide: "bs-slide",
  dots: "bs-dots",
  progress: "bs-progress",
  progressBar: "bs-progress-bar",
  prev: "bs-prev",
  next: "bs-next",
  hidden: "bs-hidden",
  autoHeightLayout: "bs-auto-height-layout",
  activeDefault: "bs-active-default",
  dotActiveDefault: "bs-dot-active-default"
} as const
