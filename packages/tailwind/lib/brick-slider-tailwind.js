import e from "tailwindcss/plugin";
//#region src/index.ts
var t = e(function({ addComponents: e }) {
	e({
		".bs-root, .brick-slider": {
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
		".bs-track.bs-peek": {
			paddingLeft: "80px",
			paddingRight: "80px"
		},
		".bs-track.bs-peek-sm": {
			paddingLeft: "48px",
			paddingRight: "48px"
		},
		".bs-track.bs-peek-lg": {
			paddingLeft: "120px",
			paddingRight: "120px"
		},
		".bs-auto-height-layout": {
			"--bs-auto-height-controls-space": "40px",
			paddingBottom: "var(--bs-auto-height-controls-space)"
		},
		".bs-auto-height-layout .bs-track": { height: "auto" },
		".bs-auto-height-layout .bs-container": {
			height: "auto",
			alignItems: "flex-start"
		},
		".bs-auto-height-layout .bs-slide": { height: "auto" },
		".bs-auto-height-layout .bs-dots": { bottom: "0" },
		".bs-auto-height-layout .bs-arrow": { top: "calc((100% - var(--bs-auto-height-controls-space)) / 2)" },
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
		".bs-container > *": { flexShrink: "0" },
		".bs-slide": {
			boxSizing: "border-box",
			width: "100%"
		},
		".bs-dots": {
			width: "100%",
			position: "absolute",
			bottom: "0",
			textAlign: "center",
			display: "flex",
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
			width: "min(220px, calc(100% - 96px))",
			height: "4px",
			position: "absolute",
			left: "50%",
			bottom: "0",
			transform: "translateX(-50%)",
			overflow: "hidden",
			zIndex: "10"
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
		".bs-hidden": { visibility: "hidden !important" },
		".bs-destroyed": { display: "block !important" },
		".bs-destroyed .bs-track": {
			overflow: "visible !important",
			height: "auto !important",
			paddingLeft: "0 !important",
			paddingRight: "0 !important"
		},
		".bs-destroyed .bs-container": {
			display: "grid !important",
			whiteSpace: "normal !important",
			transform: "none !important",
			height: "auto !important",
			width: "100% !important",
			gap: "16px !important"
		},
		".bs-destroyed .bs-slide": { width: "100% !important" },
		".bs-destroyed > .bs-arrow, .bs-destroyed > .bs-dots, .bs-destroyed > .bs-progress, .bs-destroyed > .bs-pages": {
			position: "static !important",
			inset: "auto !important",
			transform: "none !important"
		},
		".bs-destroyed > .bs-arrow": {
			display: "inline-flex !important",
			marginRight: "12px"
		},
		".bs-destroyed > .bs-pages": {
			display: "inline-flex !important",
			alignItems: "center",
			marginTop: "16px"
		},
		".bs-destroyed > .bs-dots": {
			display: "flex !important",
			width: "auto !important",
			marginTop: "16px"
		},
		".bs-destroyed > .bs-progress": {
			display: "block !important",
			width: "100% !important",
			marginTop: "16px"
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
		}
	});
}), n = {
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
	destroyed: "bs-destroyed",
	peek: "bs-peek",
	peekSm: "bs-peek-sm",
	peekLg: "bs-peek-lg",
	autoHeightLayout: "bs-auto-height-layout",
	activeDefault: "bs-active-default",
	dotActiveDefault: "bs-dot-active-default"
};
//#endregion
export { n as brickSliderTailwindClasses, t as default };
