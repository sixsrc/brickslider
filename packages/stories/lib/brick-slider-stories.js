import { $ as e, ANIMATION_OPTIONS as t, ATTRIBUTES as n, EVENTS as r, FROM as i, Plugin as a, SLIDER_EVENTS as o, TAGS as s, addClass as c, appendToParent as l, closestElement as u, containsElement as d, createNewElement as f, getAllElements as p, getAttribute as m, getElement as h, getSliderNodeList as g, getTrackChildren as _, hasAttribute as v, hasClass as y, listener as b, removeAttribute as x, removeClass as S, removeElement as C, removeListener as w, setAttribute as T } from "@sixsrc/brick-slider/plugin-api";
//#region src/constants.ts
var E = {
	BODY_OPEN: "bs-stories-body-open",
	ROOT: "bs-stories",
	OPEN: "bs-stories--open",
	PAUSED: "bs-stories--paused",
	BACKDROP: "bs-stories-backdrop",
	SHELL: "bs-stories-shell",
	LAYER: "bs-stories-layer",
	CLOSE: "bs-stories-close",
	MUTE: "bs-stories-mute",
	MUTED: "bs-stories-muted",
	MUTE_DISABLED: "bs-stories-mute--disabled",
	MUTE_ON: "bs-stories-mute-on",
	MUTE_OFF: "bs-stories-mute-off",
	HIDDEN: "hidden",
	ROOT_HIDDEN: "hidden",
	LAYER_HIDDEN: "hidden",
	CONTROL_VISIBLE: "bs-stories-pause-indicator--visible",
	PAUSE: "bs-stories-pause",
	PLAY: "bs-stories-play",
	PAUSE_INDICATOR: "bs-stories-pause-indicator",
	PROGRESS: "bs-stories-progress",
	PROGRESS_ITEM: "bs-stories-progress-item",
	PROGRESS_BAR: "bs-stories-progress-bar",
	ACTIVE_PROGRESS: "bs-stories-progress-item--active",
	COMPLETED_PROGRESS: "bs-stories-progress-item--completed"
}, D = {
	CLOSE: "×",
	MUTE_ON: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12zm-2.5-8.7v2.1A7.5 7.5 0 0 1 18.5 12a7.5 7.5 0 0 1-4.5 6.6v2.1A9.5 9.5 0 0 0 20.5 12 9.5 9.5 0 0 0 14 3.3z\"/></svg>",
	MUTE_OFF: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 9v6h4l5 4V5L8 9H4zm10.59 3L12 9.41 13.41 8 16 10.59 18.59 8 20 9.41 17.41 12 20 14.59 18.59 16 16 13.41 13.41 16 12 14.59 14.59 12z\"/></svg>",
	PAUSE: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M8 6h3v12H8zM13 6h3v12h-3z\"/></svg>",
	PLAY: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M8 5v14l11-7z\"/></svg>"
}, O = {
	CLOSE: "Close stories",
	MUTE: "Toggle sound",
	MUTE_ON: "Mute story sound",
	MUTE_OFF: "Unmute story sound",
	PAUSE: "Toggle pause"
}, k = {
	SPACE: " ",
	ESCAPE: "Escape",
	TAB: "Tab"
}, A = {
	OPENED: "storiesOpened",
	MOUNTED: "storiesMounted",
	CLOSED: "storiesClosed"
}, j = {
	DURATION: 5e3,
	MAX_VIDEO_DURATION: 6e4,
	MIN_VIDEO_DURATION: 1e3,
	MAX_STORIES: 10,
	MAX_STORIES_LIMIT: 20,
	CLOSE_ON_END: !0
}, M = { MARKUP: "brickslider.github.io/docs/plugins/stories" }, N = {
	TRACK: ["bs-track"],
	CHILDREN: ["bs-container"],
	SLIDE: ["bs-slide"],
	DOTS: ["bs-dots"],
	DOT: ["bs-dot"],
	DOT_ACTIVE: ["bs-dot--active"],
	PAGES: ["bs-pages"],
	PROGRESS: ["bs-progress"],
	PROGRESS_BAR: ["bs-progress-bar"],
	ARROW: ["bs-arrow"],
	ARROW_PREV: ["bs-prev"],
	ARROW_NEXT: ["bs-next"],
	HIDDEN: ["bs-hidden"],
	DESTROYED: ["bs-destroyed"]
}, P = {
	UL: "ul",
	LI: "li",
	BUTTON: "button",
	DIV: "div",
	SPAN: "span",
	STYLE: "style",
	VIDEO: "video"
}, F = [
	"xs",
	"sm",
	"md",
	"lg",
	"xl",
	"2xl"
], I = {
	TRACK: "track",
	CHILDREN: "children",
	SLIDE: "slide",
	ARROW: "bs-arrow",
	PAGES: "bs-pages"
};
function L(e, t = document) {
	return t.querySelectorAll(e);
}
function R(e, t = document) {
	return t.querySelector(e) ?? void 0;
}
function z(e) {
	return R(e);
}
function B(e) {
	return z(`${e} .${N.CHILDREN[0]}`);
}
function V(e) {
	return z(`${e}`);
}
function H(e) {
	return z(`${e} .${N.TRACK[0]}`);
}
function U(e, t) {
	return e.classList.contains(t);
}
function W(e, t) {
	return !e || !t ? !1 : e.contains(t);
}
function G(e, t, n) {
	return e.slice(t, n);
}
//#endregion
//#region ../slider/src/Validation.ts
var K = class {
	$root;
	ids = /* @__PURE__ */ new Set();
	details = {};
	arrElements;
	fixedOrder;
	constructor(e) {
		this.$root = e, this.arrElements = this.getRoot()?.children, this.fixedOrder = [
			I.TRACK,
			I.CHILDREN,
			I.SLIDE
		];
	}
	getRoot() {
		return V(this.$root);
	}
	getElementClasses(e) {
		return e ? Array.from(e).flatMap((e) => {
			if (this.isTrackElement(e)) return this.getTrackClasses(e);
			let t = this.normalizeElementRole(e);
			return t ? [t] : [];
		}) : [];
	}
	getTrackClasses(e) {
		let t = e.children[0], n = t ? R(`.${N.SLIDE[0]}`, t) : void 0;
		return n ? [
			this.normalizeElementRole(e),
			this.normalizeElementRole(t),
			this.normalizeElementRole(n)
		] : [];
	}
	normalizeElementRole(e) {
		return e ? this.hasAliasClass(e, N.TRACK) ? I.TRACK : this.hasAliasClass(e, N.CHILDREN) ? I.CHILDREN : this.hasAliasClass(e, N.SLIDE) ? I.SLIDE : this.hasAliasClass(e, N.ARROW) ? I.ARROW : this.hasAliasClass(e, N.PAGES) ? I.PAGES : e.classList[0] ?? null : null;
	}
	hasAliasClass(e, t) {
		return t.some((t) => U(e, t));
	}
	isTrackElement(e) {
		return this.hasAliasClass(e, N.TRACK);
	}
	getButtonElements() {
		return Array.from(this.arrElements || []).slice(0, this.getBeforeTrack().length);
	}
	getBeforeTrack() {
		let e = this.getElementClasses(this.arrElements).indexOf(I.TRACK);
		return G(this.getElementClasses(this.arrElements), 0, e);
	}
	areArraysEqual(e, t) {
		return e.length === t.length && e.every((e, n) => e === t[n]);
	}
	isValid() {
		return this.hasAllElements() && this.hasAllElementsInOrder() && !this.hasDuplicateClasses();
	}
	sanitizeOptions(e) {
		return e && (this.runValidations(e), this.sanitizeDragFreeOptions(this.sanitizeResponsiveOptions(this.sanitizeSlideSizesOptions(e))));
	}
	hasAllElements() {
		return [
			this.hasRootContainer(),
			this.hasTrackContainer(),
			this.hasChildrenContainer(),
			this.hasSlide()
		].every((e) => e !== void 0);
	}
	isInvalidBeforeTrack() {
		let e = this.getBeforeTrack(), t = this.getButtonElements(), n = Array.from(this.arrElements || []).slice(0, e.length).filter((e) => U(e, N.PAGES[0])), r = t.filter((e) => U(e, N.ARROW[0]));
		return e.length > 3 || !e.every((e) => [I.ARROW, I.PAGES].includes(e)) || n.length > 1 || !r.every((e) => e.tagName.toLowerCase() === P.BUTTON);
	}
	hasAllElementsInOrder() {
		let e = this.getElementClasses(this.arrElements), t = e.indexOf(I.TRACK), n = t >= 0 ? G(e, t, t + 3) : [];
		return this.isInvalidBeforeTrack() ? !1 : this.areArraysEqual(n, this.fixedOrder);
	}
	hasDuplicateClasses() {
		return this.getDuplicateClassNames().length > 0;
	}
	runValidations(e) {
		let t = [
			{
				c: () => !this.hasRootContainer(),
				id: "NO_ROOT"
			},
			{
				c: () => !this.hasTrackContainer(),
				id: "NO_TRACK"
			},
			{
				c: () => !this.hasChildrenContainer(),
				id: "NO_CHILDREN"
			},
			{
				c: () => !this.hasSlide(),
				id: "NO_SLIDES"
			},
			{
				c: () => this.hasDuplicateClasses(),
				id: "DUPLICATE_ELEMENTS"
			},
			{
				c: () => !this.hasAllElementsInOrder(),
				id: "INVALID_ORDER"
			},
			{
				c: () => this.hasUnsupportedSingleViewSlideSizes(e),
				id: "UNSUPPORTED_SLIDE_SIZES_SINGLE_VIEW"
			},
			{
				c: () => this.hasInvalidSlideSizesValues(e),
				id: "INVALID_SLIDE_SIZES_VALUES"
			},
			{
				c: () => this.hasResponsiveWithoutScreens(e),
				id: "RESPONSIVE_WITHOUT_SCREENS"
			},
			{
				c: () => this.hasInvalidScreenBreakpointKeys(e),
				id: "INVALID_SCREENS_BREAKPOINT_KEYS"
			},
			{
				c: () => this.hasInvalidResponsiveBreakpointKeys(e),
				id: "INVALID_RESPONSIVE_BREAKPOINT_KEYS"
			},
			{
				c: () => this.hasResponsiveBreakpointsMissingInScreens(e),
				id: "RESPONSIVE_BREAKPOINTS_MISSING_IN_SCREENS"
			},
			{
				c: () => this.hasDotsWithDragFree(e),
				id: "DRAG_FREE_WITH_DOTS"
			}
		];
		this.ids.clear(), this.details = {}, t.forEach(({ c: e, id: t }) => {
			e() && this.ids.add(t);
		}), this.ids.has("DUPLICATE_ELEMENTS") && (this.details.DUPLICATE_ELEMENTS = this.getDuplicateClassNames()), this.ids.has("INVALID_ORDER") && (this.details.INVALID_ORDER = this.getInvalidOrderDetails());
		let n = this.getResponsiveBreakpointsMissingInScreens(e);
		n.length > 0 && (this.details.RESPONSIVE_BREAKPOINTS_MISSING_IN_SCREENS = n);
	}
	getIds() {
		return Array.from(this.ids);
	}
	getDetails(e) {
		return this.details[e] ?? [];
	}
	getDuplicateClassNames() {
		let e = {}, t = [...N.TRACK, ...N.CHILDREN];
		return L(this.$root).forEach((n) => {
			t.forEach((t) => {
				U(n, t) && (e[t] = (e[t] ?? 0) + 1);
			});
		}), Object.entries(e).filter(([, e]) => e > 1).map(([e]) => e);
	}
	getInvalidOrderDetails() {
		let e = H(this.$root), t = B(this.$root);
		this.getBeforeTrack();
		let n = [], r = !!(t && R(`.${N.SLIDE[0]}`, t));
		return this.isInvalidBeforeTrack() && n.push(`Optional arrows must be <button> elements, and optional .${N.PAGES[0]} must stay before .${N.TRACK[0]}.`), t && e && !W(e, t) && n.push(`Found .${N.CHILDREN[0]} outside .${N.TRACK[0]}.`), e && t && e.firstElementChild !== t && n.push(`.${N.CHILDREN[0]} must be the first child inside .${N.TRACK[0]}.`), t && !r && n.push(`Could not find any .${N.SLIDE[0]} inside .${N.CHILDREN[0]}.`), n.length === 0 && n.push(`Expected structure: .${N.TRACK[0]} > .${N.CHILDREN[0]} > .${N.SLIDE[0]}.`), n;
	}
	isSlideSizesValid(e) {
		return e ? !Object.entries(e).some(([e, t]) => {
			let n = Number(e);
			return !this.isValidSlideSizeEntry(n, t);
		}) : !0;
	}
	hasUnsupportedSingleViewSlideSizes(e) {
		return e ? e.slideSizes && !this.isSlideSizesAllowed(e.slidesPerView) ? !0 : Object.values(e.responsive ?? {}).some((t) => {
			if (t?.useSlideSizes === !1 || !t?.slideSizes) return !1;
			let n = t.slidesPerView ?? e.slidesPerView ?? 1;
			return !this.isSlideSizesAllowed(n);
		}) : !1;
	}
	hasInvalidSlideSizesValues(e) {
		return e ? e.slideSizes && this.isSlideSizesAllowed(e.slidesPerView) && !this.isSlideSizesValid(e.slideSizes) ? !0 : Object.values(e.responsive ?? {}).some((t) => {
			if (t?.useSlideSizes === !1 || !t?.slideSizes) return !1;
			let n = t.slidesPerView ?? e.slidesPerView ?? 1;
			return this.isSlideSizesAllowed(n) ? !this.isSlideSizesValid(t.slideSizes) : !1;
		}) : !1;
	}
	sanitizeSlideSizesOptions(e) {
		let t = { ...e };
		return (!this.isSlideSizesAllowed(e.slidesPerView) || !this.isSlideSizesValid(e.slideSizes)) && (t.slideSizes = void 0), e.responsive && (t.responsive = Object.entries(e.responsive).reduce((t, [n, r]) => {
			if (!r) return t[n] = r, t;
			if (r.useSlideSizes === !1) return t[n] = {
				...r,
				slideSizes: void 0
			}, t;
			let i = r.slidesPerView ?? e.slidesPerView ?? 1;
			return t[n] = !this.isSlideSizesAllowed(i) || !this.isSlideSizesValid(r.slideSizes) ? {
				...r,
				slideSizes: void 0
			} : r, t;
		}, {})), t;
	}
	sanitizeResponsiveOptions(e) {
		let t = { ...e };
		return this.hasResponsiveWithoutScreens(e) ? (t.responsive = void 0, t) : (e.screens && (t.screens = Object.entries(e.screens).reduce((e, [t, n]) => (this.isSupportedBreakpoint(t) && (e[t] = n), e), {})), e.responsive && (t.responsive = Object.entries(e.responsive).reduce((t, [n, r]) => (this.isSupportedBreakpoint(n) && this.hasScreenBreakpointValue(e.screens, n) && (t[n] = r), t), {})), t);
	}
	sanitizeDragFreeOptions(e) {
		return e.useDragFree ? {
			...e,
			useLoop: !1
		} : e;
	}
	hasDotsWithDragFree(e) {
		return e?.useDragFree ? !!this.getDotsMarkup() : !1;
	}
	getDotsMarkup() {
		return z(`${this.$root} .${N.DOTS[0]}`);
	}
	hasResponsiveWithoutScreens(e) {
		return !e?.responsive || Object.keys(e.responsive).length === 0 ? !1 : !e.screens || Object.keys(e.screens).length === 0;
	}
	hasInvalidScreenBreakpointKeys(e) {
		return e?.screens ? Object.keys(e.screens).some((e) => !this.isSupportedBreakpoint(e)) : !1;
	}
	hasInvalidResponsiveBreakpointKeys(e) {
		return e?.responsive ? Object.keys(e.responsive).some((e) => !this.isSupportedBreakpoint(e)) : !1;
	}
	hasResponsiveBreakpointsMissingInScreens(e) {
		return this.getResponsiveBreakpointsMissingInScreens(e).length > 0;
	}
	getResponsiveBreakpointsMissingInScreens(e) {
		return !e?.responsive || !e.screens ? [] : Object.keys(e.responsive).filter((t) => this.isSupportedBreakpoint(t) && !this.hasScreenBreakpointValue(e.screens, t));
	}
	hasScreenBreakpointValue(e, t) {
		if (!e) return !1;
		let n = e[t];
		return typeof n == "number" && Number.isFinite(n) && n >= 0;
	}
	isSupportedBreakpoint(e) {
		return F.includes(e);
	}
	isSlideSizesAllowed(e) {
		return (e ?? 1) >= 2;
	}
	isValidSlideSizeEntry(e, t) {
		return Number.isInteger(e) && e >= 0 && typeof t == "number" && Number.isFinite(t) && t >= 0;
	}
	hasRootContainer() {
		return this.getRoot();
	}
	hasTrackContainer() {
		return H(this.$root);
	}
	hasChildrenContainer() {
		return B(this.$root);
	}
	hasSlide() {
		return z(`${this.$root} .${N.CHILDREN[0]} > .${N.SLIDE[0]}`);
	}
}, q = class {
	$root;
	sliderValidation;
	ids = /* @__PURE__ */ new Set();
	details = {};
	constructor(e) {
		this.$root = e, this.sliderValidation = new K(e);
	}
	isValid() {
		return this.runValidations(), !this.getIds().some((e) => this.getLevel(e) === "error");
	}
	runValidations() {
		let e = [
			{
				id: "DUPLICATE_STORIES_ELEMENTS",
				condition: () => this.hasDuplicateStoriesElements()
			},
			{
				id: "INVALID_TRACK_CHILD_ORDER",
				condition: () => this.hasInvalidTrackChildOrder()
			},
			{
				id: "INVALID_PROGRESS_POSITION",
				condition: () => this.hasInvalidProgressPosition()
			},
			{
				id: "INVALID_PROGRESS_STRUCTURE",
				condition: () => this.hasInvalidProgressStructure()
			},
			{
				id: "INVALID_PAUSE_POSITION",
				condition: () => this.hasInvalidPausePosition()
			},
			{
				id: "INVALID_LAYER_POSITION",
				condition: () => this.hasInvalidLayerPosition()
			},
			{
				id: "INVALID_BACKDROP_POSITION",
				condition: () => this.hasInvalidBackdropPosition()
			},
			{
				id: "INVALID_CLOSE_POSITION",
				condition: () => this.hasInvalidClosePosition()
			},
			{
				id: "INVALID_MUTE_POSITION",
				condition: () => this.hasInvalidMutePosition()
			},
			{
				id: "MULTIPLE_VIDEOS_IN_STORY",
				condition: () => this.hasMultipleVideosInSingleStory()
			}
		];
		this.sliderValidation.runValidations(), this.ids = new Set(this.sliderValidation.getIds()), this.details = {}, e.forEach(({ id: e, condition: t }) => {
			t() && this.ids.add(e);
		});
	}
	getIds() {
		return Array.from(this.ids);
	}
	getDetails(e) {
		return e === "MULTIPLE_VIDEOS_IN_STORY" ? this.getStoriesWithMultipleVideos() : this.details[e] ?? this.sliderValidation.getDetails(e);
	}
	getLevel(e) {
		return e === "MULTIPLE_VIDEOS_IN_STORY" ? "warn" : "error";
	}
	getRoot() {
		return V(this.$root);
	}
	getTrack() {
		return R(`.${N.TRACK[0]}`, this.getRoot());
	}
	getChildren() {
		return B(this.$root);
	}
	getLayer() {
		return this.getStoriesLayers()[0];
	}
	getProgress() {
		return this.getScopedStoryElements(E.PROGRESS)[0];
	}
	getPauseIndicator() {
		return this.getScopedStoryElements(E.PAUSE_INDICATOR)[0];
	}
	getBackdrop() {
		return this.getOwnedStoryElements(E.BACKDROP)[0];
	}
	getClose() {
		return this.getOwnedStoryElements(E.CLOSE)[0];
	}
	getMute() {
		return this.getOwnedStoryElements(E.MUTE)[0];
	}
	getScopedStoryElements(e) {
		let t = this.getRoot();
		return t ? Array.from(L(`.${e}`, t)) : [];
	}
	getOwnedStoryElements(e) {
		let t = this.getScopedStoryElements(e), n = this.getStoriesLayers().flatMap((t) => Array.from(L(`.${e}`, t)));
		return [...new Set([...t, ...n])];
	}
	getExternalLayer() {
		let e = this.getRoot()?.nextElementSibling;
		if (e && e instanceof HTMLElement && U(e, E.LAYER)) return e;
	}
	getStoriesLayers() {
		let e = this.getScopedStoryElements(E.LAYER), t = this.getExternalLayer();
		return !t || e.includes(t) ? e : [...e, t];
	}
	hasDuplicateStoriesElements() {
		let e = this.getDuplicateStoriesClassNames();
		return e.length === 0 ? !1 : (this.details.DUPLICATE_STORIES_ELEMENTS = e, !0);
	}
	getDuplicateStoriesClassNames() {
		return [
			E.LAYER,
			E.PROGRESS,
			E.PAUSE_INDICATOR,
			E.BACKDROP,
			E.CLOSE,
			E.MUTE
		].filter((e) => e === E.LAYER ? this.getStoriesLayers().length > 1 : this.getOwnedStoryElements(e).length > 1);
	}
	hasInvalidTrackChildOrder() {
		let e = this.getTrack(), t = this.getChildren();
		return !e || !t ? !1 : e.firstElementChild !== t;
	}
	hasInvalidProgressPosition() {
		let e = this.getProgress(), t = this.getTrack();
		return e ? t ? !W(t, e) : !0 : !1;
	}
	hasInvalidProgressStructure() {
		let e = this.getProgress();
		if (!e) return !1;
		let t = R(`.${E.PROGRESS_ITEM}`, e), n = R(`.${E.PROGRESS_BAR}`, e);
		return !t || !n;
	}
	hasInvalidPausePosition() {
		let e = this.getPauseIndicator(), t = this.getTrack();
		return e ? t ? e.parentElement !== t : !0 : !1;
	}
	hasInvalidLayerPosition() {
		let e = this.getLayer(), t = this.getRoot(), n = this.getTrack();
		if (!e) return !1;
		if (!t) return !0;
		let r = W(t, e), i = W(n, e);
		return r || i;
	}
	hasInvalidBackdropPosition() {
		let e = this.getBackdrop(), t = this.getLayer();
		return e ? t ? !W(t, e) : !0 : !1;
	}
	hasInvalidClosePosition() {
		let e = this.getClose(), t = this.getLayer(), n = this.getTrack();
		if (!e) return !1;
		if (!t && !n) return !0;
		let r = W(t, e), i = W(n, e);
		return !r && !i || e.tagName.toLowerCase() !== P.BUTTON;
	}
	hasInvalidMutePosition() {
		let e = this.getMute(), t = this.getLayer(), n = this.getTrack();
		if (!e) return !1;
		if (!t && !n) return !0;
		let r = W(t, e), i = W(n, e);
		return !r && !i || e.tagName.toLowerCase() !== P.BUTTON;
	}
	hasMultipleVideosInSingleStory() {
		return this.getStoriesWithMultipleVideos().length > 0;
	}
	getStoriesWithMultipleVideos() {
		let e = this.getChildren();
		return e ? Array.from(L(`:scope > .${N.SLIDE[0]}`, e)).reduce((e, t, n) => (L(P.VIDEO, t).length > 1 && e.push(String(n + 1)), e), []) : [];
	}
}, J = class e extends q {
	messageMap;
	levelMap;
	rootSelector;
	constructor(t) {
		super(t), this.rootSelector = t, this.messageMap = e.textMessages(t), this.levelMap = e.textLevels();
	}
	static textMessages(e) {
		return {
			NO_ROOT: `Could not find root selector ${e}.\nSee: ${M.MARKUP}`,
			NO_TRACK: `Could not find .bs-track inside ${e}.\nSee: ${M.MARKUP}`,
			NO_CHILDREN: `Could not find .bs-container inside .bs-track for ${e}.\nSee: ${M.MARKUP}`,
			NO_SLIDES: `Could not find any .bs-slide inside .bs-container for ${e}.\nSee: ${M.MARKUP}`,
			DUPLICATE_ELEMENTS: `Found duplicated core slider elements in ${e}.\nSee: ${M.MARKUP}`,
			INVALID_ORDER: `Found invalid core slider markup order in ${e}.\nSee: ${M.MARKUP}`,
			DUPLICATE_STORIES_ELEMENTS: `Found duplicated unique stories elements in ${e}.\nSee: ${M.MARKUP}`,
			INVALID_TRACK_CHILD_ORDER: `Found invalid stories track content order in ${e}. .bs-container must come before stories-only elements inside .bs-track.\nSee: ${M.MARKUP}`,
			INVALID_PROGRESS_POSITION: `Found .bs-stories-progress in the wrong place for ${e}. Place it inside .bs-track.\nSee: ${M.MARKUP}`,
			INVALID_PROGRESS_STRUCTURE: `Found incomplete .bs-stories-progress markup for ${e}. Include both .bs-stories-progress-item and .bs-stories-progress-bar.\nSee: ${M.MARKUP}`,
			INVALID_PAUSE_POSITION: `Found .bs-stories-pause-indicator in the wrong place for ${e}. Place it inside .bs-track.\nSee: ${M.MARKUP}`,
			INVALID_LAYER_POSITION: `Found .bs-stories-layer in the wrong place for ${e}. Place it outside the slider root and outside .bs-track.\nSee: ${M.MARKUP}`,
			INVALID_BACKDROP_POSITION: `Found .bs-stories-backdrop in the wrong place for ${e}. Place it inside .bs-stories-layer.\nSee: ${M.MARKUP}`,
			INVALID_CLOSE_POSITION: `Found invalid .bs-stories-close markup for ${e}. Use a <button> inside .bs-stories-layer or inside .bs-track.\nSee: ${M.MARKUP}`,
			INVALID_MUTE_POSITION: `Found invalid .bs-stories-mute markup for ${e}. Use a <button> inside .bs-stories-layer or inside .bs-track.\nSee: ${M.MARKUP}`,
			MULTIPLE_VIDEOS_IN_STORY: `Found more than one video in the same story for ${e}. Only one video per story is supported.\nSee: ${M.MARKUP}`
		};
	}
	static textLevels() {
		return {
			NO_ROOT: "error",
			NO_TRACK: "error",
			NO_CHILDREN: "error",
			NO_SLIDES: "error",
			DUPLICATE_ELEMENTS: "error",
			INVALID_ORDER: "error",
			DUPLICATE_STORIES_ELEMENTS: "error",
			INVALID_TRACK_CHILD_ORDER: "error",
			INVALID_PROGRESS_POSITION: "error",
			INVALID_PROGRESS_STRUCTURE: "error",
			INVALID_PAUSE_POSITION: "error",
			INVALID_LAYER_POSITION: "error",
			INVALID_BACKDROP_POSITION: "error",
			INVALID_CLOSE_POSITION: "error",
			INVALID_MUTE_POSITION: "error",
			MULTIPLE_VIDEOS_IN_STORY: "warn"
		};
	}
	displayMessage() {
		this.runValidations(), this.getIds().forEach((e) => {
			let t = this.getMessageById(e), n = this.levelMap[e] ?? "error";
			console[n](t);
		});
	}
	getMessageById(e) {
		if (e === "DUPLICATE_STORIES_ELEMENTS") {
			let t = this.getDetails(e);
			if (t.length > 0) return `Found duplicated unique stories elements in ${this.rootSelector}: ${t.map((e) => `.${e}`).join(", ")}.\nSee: ${M.MARKUP}`;
		}
		if (e === "MULTIPLE_VIDEOS_IN_STORY") {
			let t = this.getDetails(e);
			if (t.length > 0) return `Found more than one video in the following stories for ${this.rootSelector}: ${t.map((e) => `#${e}`).join(", ")}. Only one video per story is supported.\nSee: ${M.MARKUP}`;
		}
		return this.messageMap[e];
	}
}, Y = class extends a {
	activeAnimation = null;
	activeStoryIndex = 0;
	closeButton = null;
	controlCleanupCallbacks = [];
	isOpen = !1;
	isPaused = !1;
	isStoryHovered = !1;
	isTouchHoldingStory = !1;
	lastControlPointerTime = 0;
	muteButton = null;
	pauseIndicator = null;
	storiesLayer = null;
	createdElements = /* @__PURE__ */ new Set();
	progressBars = [];
	progressCleanupCallbacks = [];
	progressContainer = null;
	pluginOptions;
	hostMethods = null;
	isDraggingStory = !1;
	storyPointerStartX = null;
	storyTouchStartX = null;
	storyTimer = null;
	timerState = null;
	triggerCleanupCallbacks = [];
	warnedMultipleVideoStories = /* @__PURE__ */ new Set();
	lastTriggerElement = null;
	mediaCleanupCallbacks = [];
	mobileControlsTimer = null;
	hiddenBackgroundElements = /* @__PURE__ */ new Map();
	shouldResumeAfterTouchHold = !1;
	isTouchControlsVisible = !1;
	handleSlideChange = (e) => {
		let t = e, n = this.getStoryIndexFromPayload(t), r = this.getSafeStoryIndex(n), i = r === this.activeStoryIndex, a = this.isDraggingStory || this.isPaused;
		this.isOpen && (i && !a || this.syncStory(r));
	};
	handleCloseClick = (e) => {
		e.preventDefault(), e.stopImmediatePropagation(), e.stopPropagation(), this.close();
	};
	handleMuteClick = (e) => {
		e?.preventDefault(), e?.stopImmediatePropagation(), e?.stopPropagation(), this.toggleMuted();
	};
	handlePauseClick = (e) => {
		e?.preventDefault(), e?.stopImmediatePropagation(), e?.stopPropagation(), this.togglePause();
	};
	handleWindowControl = (e) => {
		let t = this.getControlFromEvent(e);
		t && (e.preventDefault(), e.stopPropagation(), t === E.CLOSE && this.close());
	};
	handleWindowMouseMove = (e) => {
		let t = this.isPointerInsideStoryRect(e);
		if (this.isOpen) {
			if (this.isStoryHoverBlockedByControl(e)) {
				this.isStoryHovered = !1, this.syncPausedState();
				return;
			}
			if (t) {
				this.showPauseControl();
				return;
			}
			this.isStoryHovered = !1, this.syncPausedState();
		}
	};
	handleKeydown = (e) => {
		let t = e.key === k.SPACE, n = e.key === k.ESCAPE, r = e.key === k.TAB;
		if (this.isOpen) {
			if (n) {
				e.preventDefault(), this.close();
				return;
			}
			if (r) {
				this.trapFocus(e);
				return;
			}
			t && (e.preventDefault(), this.togglePause());
		}
	};
	handleMouseEnter = (e) => {
		if (this.isStoryHoverBlockedByControl(e)) {
			this.isStoryHovered = !1, this.syncPausedState();
			return;
		}
		this.showPauseControl();
	};
	handleMouseMove = (e) => {
		if (this.isStoryHoverBlockedByControl(e)) {
			this.isStoryHovered = !1, this.syncPausedState();
			return;
		}
		this.syncPauseHoverFromPointer();
	};
	handleStoryPointerDown = (e) => {
		e.pointerType === i.TOUCH && this.isOpen && (this.isInteractiveStoryControlTarget(e.target) || (this.isTouchHoldingStory = !0, this.isStoryHovered = !1, this.shouldResumeAfterTouchHold = !this.isPaused, this.shouldResumeAfterTouchHold ? this.pause() : this.syncPausedState()));
	};
	handleStoryPointerUp = (e) => {
		e && e.pointerType !== i.TOUCH || this.isTouchHoldingStory && (this.isTouchHoldingStory = !1, this.shouldResumeAfterTouchHold ? this.resume() : this.syncPausedState(), this.shouldResumeAfterTouchHold = !1);
	};
	showPauseControl() {
		let { pauseOnHover: e } = this.pluginOptions;
		e && (this.isStoryHovered = !0, this.syncPausedState());
	}
	handleMouseLeave = () => {
		let { pauseOnHover: e } = this.pluginOptions;
		e && (this.isStoryHovered = !1, this.syncPausedState());
	};
	syncPauseHoverFromPointer() {
		if (this.isPointerInsideStoryControlArea()) {
			this.showPauseControl();
			return;
		}
		this.isStoryHovered = !1, this.syncPausedState();
	}
	constructor(e = {}, t = {}) {
		let n = typeof e == "string", r = n ? e : void 0, i = n ? t : e;
		super(r), this.pluginOptions = this.resolveOptions(i);
	}
	init() {
		let e = this.host, t = this.validateMarkup(), n = this.getRootSelector;
		t && e && n && (this.setupStoriesRoot(n), this.setupStoriesLayer(n), this.setupProgress(n), this.setupControls(n), this.setupEdgeSwipeLock(n), this.setupTriggers(), this.wrapHostNavigation(e), this.syncMutedState(), b([
			r.POINTERDOWN,
			r.MOUSEDOWN,
			r.TOUCHSTART,
			r.CLICK
		], window, this.handleWindowControl, !0), b([r.MOUSEMOVE], window, this.handleWindowMouseMove), b([r.KEYDOWN], document, this.handleKeydown), e.on(o.SLIDE_CHANGE, this.handleSlideChange));
	}
	validateMarkup() {
		let e = new J(this.$root);
		return e.displayMessage(), e.isValid();
	}
	destroy() {
		let e = this.host;
		this.restoreHostNavigation(), this.close(), this.clearTriggers(), this.clearTimer(), this.destroyControls(), this.destroyProgress(), this.destroyEdgeSwipeLock(), w([
			r.POINTERDOWN,
			r.MOUSEDOWN,
			r.TOUCHSTART,
			r.CLICK
		], window, this.handleWindowControl, !0), w([r.MOUSEMOVE], window, this.handleWindowMouseMove), w([r.KEYDOWN], document, this.handleKeydown), e && e.off(o.SLIDE_CHANGE, this.handleSlideChange);
	}
	open() {
		let e = this.host, t = this.getRootSelector;
		e && t && (this.isOpen = !0, this.isPaused = !1, c([t], E.OPEN), c([document.body], E.BODY_OPEN), S(t, E.ROOT_HIDDEN), this.hideBackgroundFromAssistiveTech(t), this.showStoriesLayer(), window.requestAnimationFrame(() => {
			this.focusInitialControl();
		}), this.goToStory(0), this.emitStoriesLifecycle(A.OPENED), this.emitStoriesMountedWhenReady());
	}
	close() {
		let e = this.host, t = this.getRootSelector;
		t && (this.isOpen = !1, this.isPaused = !1, this.isDraggingStory = !1, this.isTouchHoldingStory = !1, this.shouldResumeAfterTouchHold = !1, this.isStoryHovered = !1, this.storyPointerStartX = null, this.storyTouchStartX = null, this.pauseCurrentVideo(), this.clearTimer(), this.timerState = null, this.resetProgress(), S(t, E.OPEN), S(t, E.PAUSED), S(document.body, E.BODY_OPEN), c([t], E.ROOT_HIDDEN), this.hideStoriesLayer(), this.activeStoryIndex = 0, e?.goTo(0), this.restoreBackgroundForAssistiveTech(), this.restoreTriggerFocus(), this.emitStoriesLifecycle(A.CLOSED));
	}
	pause() {
		let e = this.getRemainingTime();
		this.isPaused || (this.isPaused = !0, this.timerState = this.getPausedTimerState(e), this.syncPausedState(), this.clearStoryTimeout(), this.activeAnimation?.pause(), this.pauseCurrentVideo());
	}
	resume() {
		let e = this.timerState;
		this.isOpen && this.isPaused && e && (this.isPaused = !1, this.syncPausedState(), this.activeAnimation?.play(), this.playCurrentVideo(), this.startTimer(e.remaining, e.duration));
	}
	emitStoriesMountedWhenReady() {
		let e = this.getRootSelector;
		if (!e) return;
		let t = 0, n = 0, r = () => {
			let t = this.getStoriesTrack(), n = this.storiesLayer, r = g(this.$root, !1)[this.activeStoryIndex], i = t?.getBoundingClientRect().width ?? 0, a = r?.getBoundingClientRect().width ?? 0, o = y(e, E.ROOT_HIDDEN), s = n ? y(n, E.LAYER_HIDDEN) : !1;
			return !this.isOpen || !t || !n || this.progressBars.length === 0 || o || s ? !1 : i > 0 && a > 0;
		}, i = () => {
			t ||= requestAnimationFrame(() => {
				if (t = 0, n += 1, r()) {
					requestAnimationFrame(() => {
						this.focusInitialControl(), this.emitStoriesLifecycle(A.MOUNTED);
					});
					return;
				}
				n < 24 && i();
			});
		};
		i();
	}
	emitStoriesLifecycle(e) {
		this.emit(e, this.$root);
	}
	focusInitialControl() {
		let e = this.closeButton, t = this.getRootSelector;
		if (e) {
			window.requestAnimationFrame(() => {
				e.focus({ preventScroll: !0 });
			});
			return;
		}
		t?.focus({ preventScroll: !0 });
	}
	restoreTriggerFocus() {
		this.lastTriggerElement?.focus();
	}
	trapFocus(e) {
		let t = this.getFocusableElements(), n = document.activeElement, r = t[0], i = t[t.length - 1];
		if (t.length === 0) {
			e.preventDefault(), this.getRootSelector?.focus();
			return;
		}
		if (!n || !d(this.getRootSelector, n)) {
			e.preventDefault(), r?.focus();
			return;
		}
		if (!e.shiftKey && n === i) {
			e.preventDefault(), r?.focus();
			return;
		}
		e.shiftKey && n === r && (e.preventDefault(), i?.focus());
	}
	getFocusableElements() {
		let e = this.getRootSelector;
		if (!e) return [];
		let t = [
			"button:not([disabled])",
			"[href]",
			"input:not([disabled])",
			"select:not([disabled])",
			"textarea:not([disabled])",
			"[tabindex]:not([tabindex=\"-1\"])"
		].join(",");
		return Array.from(p(t, e)).filter((e) => !v(e, n.ARIA_HIDDEN));
	}
	hideBackgroundFromAssistiveTech(e) {
		this.hiddenBackgroundElements.clear(), this.getBackgroundSiblings(e).forEach((e) => {
			this.hiddenBackgroundElements.set(e, {
				ariaHidden: m(e, n.ARIA_HIDDEN),
				inert: e.inert
			}), T(e, n.ARIA_HIDDEN, "true"), e.inert = !0;
		});
	}
	restoreBackgroundForAssistiveTech() {
		this.hiddenBackgroundElements.forEach((e, t) => {
			e.ariaHidden === null ? x(t, n.ARIA_HIDDEN) : T(t, n.ARIA_HIDDEN, e.ariaHidden), t.inert = e.inert;
		}), this.hiddenBackgroundElements.clear();
	}
	getBackgroundSiblings(e) {
		let t = [], n = this.storiesLayer, r = e;
		for (; r?.parentElement;) {
			let e = r.parentElement;
			if (Array.from(e.children).forEach((e) => {
				e instanceof HTMLElement && e !== r && (n && e === n || d(n, e) || t.push(e));
			}), r = e, e === document.body) break;
		}
		return t;
	}
	setupStoriesRoot(e) {
		c([e], E.ROOT), c([e], E.ROOT_HIDDEN), T(e, n.ROLE, "dialog"), T(e, n.ARIA_MODAL, "true"), T(e, n.TABINDEX, "-1"), v(e, n.ARIA_LABEL) || T(e, n.ARIA_LABEL, "Stories dialog");
	}
	setupStoriesLayer(e) {
		let t = this.getStoriesElement(E.LAYER), n = t ?? this.createStoriesLayer(), r = !t;
		this.storiesLayer = n, r && l(e, n);
	}
	createStoriesLayer() {
		let e = f(s.DIV);
		return c([e], E.LAYER), this.createdElements.add(e), e;
	}
	showStoriesLayer() {
		let e = this.storiesLayer;
		e && S(e, E.LAYER_HIDDEN);
	}
	hideStoriesLayer() {
		let e = this.storiesLayer;
		e && c([e], E.LAYER_HIDDEN);
	}
	setupProgress(e) {
		let t = this.storiesLayer ?? e, n = this.getStoriesElement(E.PROGRESS) ?? this.createProgressContainer(), r = this.getStoryCount(), i = this.getProgressItemTemplate(n), a = !n.parentElement;
		this.destroyProgress(), this.progressContainer = n, this.progressBars = this.createProgressBars(r, i), this.mountProgressBars(n, this.progressBars), a && l(t, n);
	}
	mountProgressBars(e, t) {
		t.forEach((t, n) => {
			let r = t.parentElement;
			this.bindProgressItem(r, n), l(e, r);
		});
	}
	bindProgressItem(e, t) {
		let n = (e) => {
			e.preventDefault(), e.stopImmediatePropagation(), e.stopPropagation(), this.goToStory(t);
		};
		e.onclick = n, e.onpointerdown = n, this.progressCleanupCallbacks.push(() => {
			e.onclick = null, e.onpointerdown = null;
		});
	}
	setupEdgeSwipeLock(e) {
		b([r.MOUSEDOWN], e, this.handleStoryMouseDown, !0), b([r.MOUSEMOVE], e, this.handleStoryMouseMove, !0), b([r.MOUSEUP, r.MOUSELEAVE], e, this.handleStoryPointerEnd), b([r.TOUCHSTART], e, this.handleStoryTouchStart, !0), b([r.TOUCHMOVE], e, this.handleStoryTouchMove, !0), b([r.TOUCHEND], e, this.handleStoryPointerEnd);
	}
	handleStoryMouseDown = (e) => {
		this.isStoryControlTarget(e.target) || (this.storyPointerStartX = e.clientX, this.startStoryDrag());
	};
	handleStoryMouseMove = (e) => {
		let t = this.storyPointerStartX, n = t === null ? 0 : e.clientX - t, r = e.buttons > 0, i = this.shouldLockEdgeSwipe(n);
		r && i && (e.preventDefault(), e.stopImmediatePropagation());
	};
	handleStoryTouchStart = (e) => {
		let t = e.touches[0], n = this.isStoryControlTarget(e.target);
		this.showTouchControlsTemporarily(), !n && (this.storyTouchStartX = t?.clientX ?? null, this.startStoryDrag());
	};
	handleStoryTouchMove = (e) => {
		let t = e.touches[0], n = this.storyTouchStartX, r = t && n !== null ? t.clientX - n : 0;
		this.shouldLockEdgeSwipe(r) && (e.preventDefault(), e.stopImmediatePropagation());
	};
	handleStoryPointerEnd = () => {
		this.scheduleTouchControlsHide(), this.isDraggingStory && (this.isDraggingStory = !1, window.requestAnimationFrame(() => this.resumeStoryAfterPointerEnd()));
	};
	resumeStoryAfterPointerEnd() {
		let { slideIndex: e } = this.store, t = this.getSafeStoryIndex(e);
		if (t !== this.activeStoryIndex) {
			this.syncStory(t);
			return;
		}
		this.resumeStoryClock();
	}
	startStoryDrag() {
		this.isOpen && (this.isDraggingStory = !0, this.pauseStoryClock());
	}
	pauseStoryClock() {
		let e = this.getRemainingTime();
		this.isPaused || (this.timerState = this.getPausedTimerState(e), this.clearStoryTimeout(), this.activeAnimation?.pause(), this.pauseCurrentVideo());
	}
	resumeStoryClock() {
		let e = this.timerState;
		this.isPaused || e && (this.activeAnimation?.play(), this.playCurrentVideo(), this.startTimer(e.remaining, e.duration));
	}
	shouldLockEdgeSwipe(e) {
		let t = this.getCurrentStoryIndex(), n = this.getStoryCount() - 1;
		return t === 0 && e > 0 || t === n && e < 0;
	}
	isStoryControlTarget(e) {
		let t = e instanceof Element ? e : null;
		return t ? !!(u(t, `.${E.CLOSE}`) || u(t, `.${E.MUTE}`) || u(t, `.${E.PAUSE_INDICATOR}`) || u(t, `.${E.PAUSE}`) || u(t, `.${E.PLAY}`) || u(t, `.${E.PROGRESS_ITEM}`)) : !1;
	}
	setupControls(e) {
		let t = this.storiesLayer ?? e, n = this.getStoriesElement(E.CLOSE) ?? this.createControlButton(E.CLOSE, O.CLOSE, D.CLOSE), r = this.getStoriesElement(E.MUTE) ?? (this.hasVideos() ? this.createMuteControl() : null), i = this.getStoriesElement(E.PAUSE_INDICATOR) ?? this.createPauseControl();
		this.closeButton = n, this.muteButton = r, this.pauseIndicator = i, this.prepareControlButton(n, O.CLOSE), this.prepareControlButton(r, O.MUTE), this.prepareControlButton(i, O.PAUSE), this.hideMediaControls(), this.bindCloseControlEvents(n), this.bindClickControlEvents(r, this.handleMuteClick), this.bindClickControlEvents(i, this.handlePauseClick), this.bindTrackHoverEvents(), this.mountStoriesElement(t, n), this.mountStoriesElement(t, r), this.mountStoriesElement(t, i);
	}
	bindCloseControlEvents(e) {
		let t = [
			r.POINTERDOWN,
			r.MOUSEDOWN,
			r.TOUCHSTART,
			r.CLICK
		];
		e && t.forEach((t) => {
			b([t], e, this.handleCloseClick, !0), this.controlCleanupCallbacks.push(() => {
				w([t], e, this.handleCloseClick, !0);
			});
		});
	}
	bindClickControlEvents(e, t) {
		if (!e) return;
		let n = (e) => {
			this.lastControlPointerTime = performance.now(), t(e);
		}, i = (e) => {
			if (performance.now() - this.lastControlPointerTime < 350) {
				e.preventDefault(), e.stopImmediatePropagation(), e.stopPropagation();
				return;
			}
			t(e);
		};
		b([r.POINTERDOWN], e, n, !0), b([r.CLICK], e, i, !0), this.controlCleanupCallbacks.push(() => {
			w([r.POINTERDOWN], e, n, !0), w([r.CLICK], e, i, !0);
		});
	}
	bindTrackHoverEvents() {
		let e = this.getStoriesTrack();
		e && (b([r.MOUSEENTER], e, this.handleMouseEnter), b([r.MOUSEMOVE], e, this.handleMouseMove), b([r.MOUSELEAVE], e, this.handleMouseLeave), b([r.POINTERDOWN], e, this.handleStoryPointerDown), b([r.POINTERUP, r.POINTERCANCEL], e, this.handleStoryPointerUp));
	}
	mountStoriesElement(e, t) {
		t && (t.parentElement || d(e, t) || l(e, t));
	}
	setupTriggers() {
		this.getTriggerElements().forEach((e) => this.bindTrigger(e));
	}
	bindTrigger(e) {
		let t = (t) => {
			t.preventDefault(), this.lastTriggerElement = e, this.open();
		};
		b([r.CLICK], e, t), this.triggerCleanupCallbacks.push(() => {
			w([r.CLICK], e, t);
		});
	}
	wrapHostNavigation(e) {
		let t = e.next.bind(e), n = e.prev.bind(e), r = e.goTo.bind(e);
		this.hostMethods = {
			next: t,
			prev: n,
			goTo: r
		}, e.next = () => {
			let e = this.getAdjacentStoryIndex(1);
			t(), this.syncHostNavigation(e);
		}, e.prev = () => {
			let e = this.getAdjacentStoryIndex(-1);
			n(), this.syncHostNavigation(e);
		}, e.goTo = (e) => {
			let t = this.getSafeStoryIndex(e);
			r(e), this.syncHostNavigation(t);
		};
	}
	restoreHostNavigation() {
		let e = this.host, t = this.hostMethods;
		!e || !t || (e.next = t.next, e.prev = t.prev, e.goTo = t.goTo, this.hostMethods = null);
	}
	getAdjacentStoryIndex(e) {
		let { activePage: t } = this.store, n = typeof t == "number" ? t : this.activeStoryIndex;
		return this.getSafeStoryIndex(n + e);
	}
	syncHostNavigation(e) {
		this.isOpen && window.requestAnimationFrame(() => {
			this.syncStory(e);
		});
	}
	syncStory(e) {
		let t = this.getSafeStoryIndex(e), n = this.getCurrentStoryDuration(t);
		this.activeStoryIndex = t, this.isPaused = !1, this.isDraggingStory = !1, this.storyPointerStartX = null, this.storyTouchStartX = null, this.clearTimer(), this.syncMultipleVideoControls(t), this.syncProgressState(t, n), this.syncVideoState(t), this.syncMediaControls(t), this.syncPausedState(), this.startTimer(n, n);
	}
	syncProgressState(e, t) {
		this.activeAnimation?.cancel(), this.activeAnimation = null, this.progressBars.forEach((n, r) => {
			this.syncProgressBar(n, r, e, t);
		});
	}
	syncProgressBar(e, t, n, r) {
		let i = t < n, a = t === n, o = e.parentElement;
		if (this.resetProgressItemState(o), i) {
			this.setCompletedProgressItem(o), this.animateProgress(e, 1, 1, 0);
			return;
		}
		if (a) {
			this.setActiveProgressItem(o), this.activeAnimation = this.animateProgress(e, 0, 1, r)[0];
			return;
		}
		this.animateProgress(e, 0, 0, 0);
	}
	resetProgressItemState(e) {
		S(e, [E.ACTIVE_PROGRESS, E.COMPLETED_PROGRESS]);
	}
	setActiveProgressItem(e) {
		c([e], E.ACTIVE_PROGRESS);
	}
	setCompletedProgressItem(e) {
		c([e], E.COMPLETED_PROGRESS);
	}
	animateProgress(e, n, r, i) {
		return e.getAnimations().forEach((e) => e.cancel()), this.animate(e, [{ transform: `scaleX(${n})` }, { transform: `scaleX(${r})` }], {
			duration: i,
			easing: t.LINEAR,
			fill: t.FORWARDS
		});
	}
	startTimer(e, t) {
		let n = performance.now();
		this.clearStoryTimeout(), this.timerState = {
			startedAt: n,
			remaining: e,
			duration: t
		}, this.storyTimer = window.setTimeout(() => this.goToNextStory(), e);
	}
	goToNextStory() {
		let e = this.getCurrentStoryIndex() + 1, t = e >= this.getStoryCount(), { closeOnEnd: n } = this.pluginOptions;
		if (t) {
			n ? this.close() : this.pause();
			return;
		}
		this.goToStory(e);
	}
	goToStory(e) {
		let t = this.host, n = this.getSafeStoryIndex(e);
		t && (t.goTo(n), this.syncStory(n));
	}
	getCurrentStoryIndex() {
		return this.activeStoryIndex;
	}
	getStoryIndexFromPayload(e) {
		return e?.activePage ?? e?.slideIndex ?? 0;
	}
	getCurrentStoryDuration(e) {
		let t = this.getPlayableStoryVideo(e), n = this.pluginOptions.duration;
		return !t || !Number.isFinite(t.duration) ? n : Math.min(t.duration * 1e3, this.pluginOptions.maxVideoDuration);
	}
	syncVideoState(e) {
		let t = this.getPlayableStoryVideo(e);
		this.pauseAllVideos(), t && (t.currentTime = 0, t.muted = this.pluginOptions.useMuted, t.play().catch(() => void 0));
	}
	syncMediaControls(e) {
		let t = this.getPlayableStoryVideo(e);
		this.bindMediaStateEvents(t), this.syncMuteControl(t), this.syncMutedState(t);
	}
	syncMuteControl(e) {
		let t = this.muteButton;
		if (!t) return;
		if (!e) {
			c([t], E.HIDDEN);
			return;
		}
		S(t, E.HIDDEN);
		let n = this.hasVideoAudio(e);
		this.syncMuteDisabledState(t, n), this.syncMuteControlVisibility(t);
	}
	syncMuteDisabledState(e, t) {
		let r = e;
		r.disabled = !t, T(e, n.ARIA_DISABLED, String(!t)), t ? S(e, E.MUTE_DISABLED) : c([e], E.MUTE_DISABLED);
	}
	hideMediaControls() {
		let e = this.muteButton, t = this.pauseIndicator;
		this.isTouchControlsVisible = !1, this.clearMobileControlsTimer(), e && c([e], E.HIDDEN), t && (c([t], E.HIDDEN), this.syncPauseControlIcon(t));
	}
	toggleMuted() {
		let e = this.getCurrentVideo(), t = e ? this.hasVideoAudio(e) : !1;
		if (!e || !t) return;
		let n = !this.isVideoMuted(e);
		this.pluginOptions.useMuted = n, e.muted = n, !n && e.volume === 0 && (e.volume = 1), this.syncMutedState(e);
	}
	syncMutedState(e) {
		let t = this.muteButton, r = e ?? this.getCurrentVideo(), i = r ? this.isVideoMuted(r) : !0;
		if (!t) return;
		this.pluginOptions.useMuted = i, i ? c([t], E.MUTED) : S(t, E.MUTED);
		let a = h(`.${E.MUTE_ON}`, t) ?? null, o = h(`.${E.MUTE_OFF}`, t) ?? null;
		a && o && (i ? (c([a], E.HIDDEN), S(o, E.HIDDEN), T(t, n.ARIA_LABEL, O.MUTE_OFF)) : (S(a, E.HIDDEN), c([o], E.HIDDEN), T(t, n.ARIA_LABEL, O.MUTE_ON)));
	}
	syncMuteControlVisibility(e) {
		if (!this.getCurrentVideo()) {
			c([e], E.HIDDEN);
			return;
		}
		if (!this.supportsHoverPauseControl()) {
			this.isTouchControlsVisible ? S(e, E.HIDDEN) : c([e], E.HIDDEN);
			return;
		}
		this.isStoryHovered ? S(e, E.HIDDEN) : c([e], E.HIDDEN);
	}
	bindMediaStateEvents(e) {
		if (this.clearMediaStateEvents(), !e) return;
		let t = () => {
			this.syncMutedState(e);
		};
		b(["volumechange"], e, t), this.mediaCleanupCallbacks.push(() => {
			w(["volumechange"], e, t);
		});
	}
	clearMediaStateEvents() {
		this.mediaCleanupCallbacks.forEach((e) => e()), this.mediaCleanupCallbacks = [];
	}
	isVideoMuted(e) {
		return e.muted || e.volume === 0;
	}
	togglePause() {
		if (this.isPaused) {
			this.resume();
			return;
		}
		this.pause();
	}
	syncPausedState() {
		let e = this.getRootSelector, t = this.pauseIndicator, n = this.muteButton, r = this.isStoryHovered && this.supportsHoverPauseControl() || this.isTouchControlsVisible;
		e && t && (this.isPaused ? c([e], E.PAUSED) : S(e, E.PAUSED), r ? this.showPauseControlElement(t) : this.hidePauseControl(t), n && this.syncMuteControlVisibility(n), this.syncPauseControlIcon(t));
	}
	supportsHoverPauseControl() {
		return typeof window > "u" ? !1 : window.matchMedia("(hover: hover) and (pointer: fine)").matches;
	}
	showPauseControlElement(e) {
		S(e, E.HIDDEN), c([e], "flex"), S(e, "pointer-events-none"), S(e, "opacity-0"), c([e], "pointer-events-auto"), c([e], "opacity-100"), c([e], E.CONTROL_VISIBLE);
	}
	hidePauseControl(e) {
		!this.supportsHoverPauseControl() && !this.isTouchControlsVisible && (c([e], E.HIDDEN), S(e, "flex")), S(e, "pointer-events-auto"), S(e, "opacity-100"), c([e], "pointer-events-none"), c([e], "opacity-0"), S(e, E.CONTROL_VISIBLE);
	}
	syncPauseControlIcon(e) {
		let t = this.getPauseIcon(e), n = this.getPlayIcon(e);
		if (!t && !n) {
			e.innerHTML = this.isPaused ? D.PLAY : D.PAUSE;
			return;
		}
		this.syncIconVisibility(t, !this.isPaused), this.syncIconVisibility(n, this.isPaused);
	}
	syncIconVisibility(e, t) {
		e && (t ? S(e, E.HIDDEN) : c([e], E.HIDDEN));
	}
	getPauseIcon(e) {
		return h(`.${E.PAUSE}`, e) ?? null;
	}
	getPlayIcon(e) {
		return h(`.${E.PLAY}`, e) ?? null;
	}
	getControlFromEvent(e) {
		let t = e.target instanceof Element ? e.target : null, n = this.getPointTargetFromEvent(e), r = e.composedPath(), i = [E.CLOSE], a = i.find((e) => u(t, `.${e}`));
		if (a) return a;
		let o = i.find((e) => u(n, `.${e}`));
		if (o) return o;
		for (let e of r) {
			if (!(e instanceof Element)) continue;
			let t = i.find((t) => y(e, t));
			if (t) return t;
		}
		return null;
	}
	getPointTargetFromEvent(e) {
		let t = e, n = e, r = n.touches?.[0] ?? n.changedTouches?.[0], i = r?.clientX ?? t.clientX, a = r?.clientY ?? t.clientY;
		return !Number.isFinite(i) || !Number.isFinite(a) ? null : document.elementFromPoint(i, a);
	}
	isPointerInsideStoryRect(e) {
		let t = this.getStoriesTrack(), n = this.pauseIndicator, r = t?.getBoundingClientRect(), i = n?.getBoundingClientRect();
		return r ? this.isPointInsideRect(e, r) || this.isPointInsideOptionalRect(e, i) : !1;
	}
	isPointInsideOptionalRect(e, t) {
		return t ? this.isPointInsideRect(e, t) : !1;
	}
	isPointInsideRect(e, t) {
		return e.clientX >= t.left && e.clientX <= t.right && e.clientY >= t.top && e.clientY <= t.bottom;
	}
	isPointerInsideStoryControlArea() {
		let e = this.getStoriesTrack(), t = this.pauseIndicator?.matches(":hover") ?? !1;
		return e ? e.matches(":hover") || t : !1;
	}
	isStoryHoverBlockedByControl(e) {
		let t = e.target instanceof Element ? e.target : null, n = this.getPointTargetFromEvent(e);
		return [E.CLOSE].some((e) => u(t, `.${e}`) || u(n, `.${e}`));
	}
	showTouchControlsTemporarily() {
		this.supportsHoverPauseControl() || (this.isTouchControlsVisible = !0, this.clearMobileControlsTimer(), this.syncPausedState());
	}
	scheduleTouchControlsHide() {
		this.supportsHoverPauseControl() || (this.clearMobileControlsTimer(), this.mobileControlsTimer = window.setTimeout(() => {
			this.isTouchControlsVisible = !1, this.syncPausedState();
		}, 1800));
	}
	clearMobileControlsTimer() {
		this.mobileControlsTimer !== null && (window.clearTimeout(this.mobileControlsTimer), this.mobileControlsTimer = null);
	}
	isInteractiveStoryControlTarget(e) {
		return e instanceof Element ? !!(u(e, `.${E.CLOSE}`) || u(e, `.${E.MUTE}`) || u(e, `.${E.PAUSE_INDICATOR}`) || u(e, `.${E.PROGRESS}`)) : !1;
	}
	getStoriesTrack() {
		return _(this.$root) ?? null;
	}
	getRemainingTime() {
		let e = this.timerState, t = performance.now(), n = e ? t - e.startedAt : 0;
		return e ? Math.max(0, e.remaining - n) : 0;
	}
	getPausedTimerState(e) {
		let t = this.timerState;
		return t ? {
			startedAt: performance.now(),
			remaining: e,
			duration: t.duration
		} : null;
	}
	getStoryCount() {
		let e = g(this.$root, !1).length;
		return Math.min(e, this.pluginOptions.maxStories);
	}
	getSafeStoryIndex(e) {
		return Math.max(0, Math.min(e, this.getStoryCount() - 1));
	}
	getStoryVideos(e) {
		let t = g(this.$root, !1)[e];
		return t ? Array.from(p(s.VIDEO, t)) : [];
	}
	getPlayableStoryVideo(e) {
		let t = this.getStoryVideos(e), n = t[0] ?? null;
		return this.warnMultipleVideos(e, t), n;
	}
	syncMultipleVideoControls(e) {
		this.getStoryVideos(e).forEach((e, t) => {
			e.controls = t > 0;
		});
	}
	warnMultipleVideos(e, t) {
		let n = e + 1, r = t.length > 1, i = this.warnedMultipleVideoStories.has(e);
		r && (i || (this.warnedMultipleVideoStories.add(e), console.warn(`[BrickSlider Stories] Story ${n} contains more than one video. Only the first video controls duration, mute and playback.`)));
	}
	getCurrentVideo() {
		return this.getPlayableStoryVideo(this.getCurrentStoryIndex());
	}
	pauseCurrentVideo() {
		this.getCurrentVideo()?.pause();
	}
	playCurrentVideo() {
		this.getCurrentVideo()?.play().catch(() => void 0);
	}
	pauseAllVideos() {
		let e = this.getRootSelector;
		(e ? p(s.VIDEO, e) : []).forEach((e) => e.pause());
	}
	hasVideos() {
		let e = this.getRootSelector;
		return (e ? p(s.VIDEO, e) : []).length > 0;
	}
	hasVideoAudio(e) {
		let t = e;
		return t.audioTracks ? t.audioTracks.length > 0 : typeof t.mozHasAudio == "boolean" ? t.mozHasAudio : (typeof t.webkitAudioDecodedByteCount == "number" && t.webkitAudioDecodedByteCount, !0);
	}
	clearStoryTimeout() {
		this.storyTimer !== null && window.clearTimeout(this.storyTimer), this.storyTimer = null;
	}
	clearTimer() {
		this.clearStoryTimeout(), this.activeAnimation?.cancel(), this.activeAnimation = null;
	}
	resetProgress() {
		this.progressBars.forEach((e) => {
			this.animateProgress(e, 0, 0, 0);
		});
	}
	clearTriggers() {
		this.triggerCleanupCallbacks.forEach((e) => e()), this.triggerCleanupCallbacks = [];
	}
	destroyControls() {
		this.clearMediaStateEvents(), this.clearControlEvents(), this.unbindTrackHoverEvents(), this.removeCreatedElement(this.closeButton), this.removeCreatedElement(this.muteButton), this.removeCreatedElement(this.pauseIndicator), this.closeButton = null, this.muteButton = null, this.pauseIndicator = null, this.removeCreatedElement(this.storiesLayer), this.storiesLayer = null;
	}
	clearControlEvents() {
		this.controlCleanupCallbacks.forEach((e) => e()), this.controlCleanupCallbacks = [];
	}
	unbindTrackHoverEvents() {
		let e = this.getStoriesTrack();
		e && (w([r.MOUSEENTER], e, this.handleMouseEnter), w([r.MOUSEMOVE], e, this.handleMouseMove), w([r.MOUSELEAVE], e, this.handleMouseLeave), w([r.POINTERDOWN], e, this.handleStoryPointerDown), w([r.POINTERUP, r.POINTERCANCEL], e, this.handleStoryPointerUp));
	}
	destroyProgress() {
		this.progressCleanupCallbacks.forEach((e) => e()), this.progressCleanupCallbacks = [], this.progressBars.forEach((e) => {
			this.removeCreatedElement(e.parentElement), this.removeCreatedElement(e);
		}), this.removeCreatedElement(this.progressContainer), this.progressContainer = null, this.progressBars = [];
	}
	removeCreatedElement(e) {
		e && this.createdElements.has(e) && (C(e), this.createdElements.delete(e));
	}
	destroyEdgeSwipeLock() {
		let e = this.getRootSelector;
		e && (w([r.MOUSEDOWN], e, this.handleStoryMouseDown, !0), w([r.MOUSEMOVE], e, this.handleStoryMouseMove, !0), w([r.MOUSEUP, r.MOUSELEAVE], e, this.handleStoryPointerEnd), w([r.TOUCHSTART], e, this.handleStoryTouchStart, !0), w([r.TOUCHMOVE], e, this.handleStoryTouchMove, !0), w([r.TOUCHEND], e, this.handleStoryPointerEnd));
	}
	createProgressContainer() {
		let e = f(s.DIV);
		return c([e], E.PROGRESS), this.createdElements.add(e), e;
	}
	createProgressBars(e, t) {
		return Array.from({ length: e }, (e, n) => this.createProgressItem(n, t));
	}
	getProgressItemTemplate(e) {
		return h(`.${E.PROGRESS_ITEM}`, e) ?? null;
	}
	createProgressItem(e, t) {
		let n = e === 0 && t, r = n ? t : this.cloneProgressItem(t), i = this.prepareProgressItem(r);
		return n || (this.createdElements.add(r), this.createdElements.add(i)), i;
	}
	cloneProgressItem(e) {
		return e ? e.cloneNode(!0) : f(s.DIV);
	}
	prepareProgressItem(e) {
		let t = h(`.${E.PROGRESS_BAR}`, e) ?? null, n = t ?? f(s.DIV);
		return c([e], E.PROGRESS_ITEM), c([n], E.PROGRESS_BAR), t || l(e, n), n;
	}
	createPauseControl() {
		let e = this.createControlButton(E.PAUSE_INDICATOR, O.PAUSE, ""), t = f(s.SPAN), n = f(s.SPAN);
		return c([t], E.PAUSE), c([n], E.PLAY), c([n], E.HIDDEN), t.innerHTML = D.PAUSE, n.innerHTML = D.PLAY, l(e, t), l(e, n), e;
	}
	createMuteControl() {
		let e = this.createControlButton(E.MUTE, O.MUTE_ON, ""), t = f(s.SPAN), n = f(s.SPAN);
		return c([t], E.MUTE_ON), c([n], E.MUTE_OFF), c([n], E.HIDDEN), t.innerHTML = D.MUTE_ON, n.innerHTML = D.MUTE_OFF, l(e, t), l(e, n), e;
	}
	createControlButton(e, t, n) {
		let r = f(s.BUTTON);
		return c([r], e), this.prepareControlButton(r, t), r.innerHTML = n, this.createdElements.add(r), r;
	}
	prepareControlButton(e, t) {
		e && (T(e, n.TYPE, s.BUTTON), T(e, n.ARIA_LABEL, t));
	}
	getStoriesElement(t) {
		let n = this.getRootSelector, r = n ? h(`.${t}`, n) ?? null : null, i = e(`.${t}`);
		return r ?? i;
	}
	getTriggerElements() {
		let { trigger: e } = this.pluginOptions;
		return e ? typeof e == "string" ? Array.from(p(e)) : Array.isArray(e) ? e : [e] : [];
	}
	resolveOptions(e) {
		let t = this.resolveDuration(e.duration), n = this.resolveMaxVideoDuration(e.maxVideoDuration), r = this.resolveMaxStories(e.maxStories);
		return {
			trigger: e.trigger,
			duration: t,
			maxVideoDuration: n,
			maxStories: r,
			pauseOnHover: e.pauseOnHover ?? !0,
			closeOnEnd: e.closeOnEnd ?? j.CLOSE_ON_END,
			useMuted: e.useMuted ?? !0
		};
	}
	resolveDuration(e) {
		return Number.isFinite(e) ? Math.max(j.MIN_VIDEO_DURATION, Number(e)) : j.DURATION;
	}
	resolveMaxVideoDuration(e) {
		return Number.isFinite(e) ? (Number(e) > j.MAX_VIDEO_DURATION && console.warn(`[BrickSlider Stories] maxVideoDuration is too high and was capped at ${j.MAX_VIDEO_DURATION}ms.`), Math.min(Math.max(j.MIN_VIDEO_DURATION, Number(e)), j.MAX_VIDEO_DURATION)) : j.MAX_VIDEO_DURATION;
	}
	resolveMaxStories(e) {
		return Number.isFinite(e) ? (Number(e) > j.MAX_STORIES_LIMIT && console.warn(`[BrickSlider Stories] maxStories is too high and was capped at ${j.MAX_STORIES_LIMIT}.`), Math.min(Math.max(1, Math.floor(Number(e))), j.MAX_STORIES_LIMIT)) : j.MAX_STORIES;
	}
};
//#endregion
export { Y as BSStoriesPlugin, Y as BrickSliderStories, Y as StoriesPlugin, Y as default, A as STORIES_EVENTS };
