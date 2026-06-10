//#region src/helpers.ts
var e = {
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
}, t = {
	ACTIVE: "active",
	SLIDER_DOT: "bs-dot",
	SELECTED: "bs-dot--active",
	CLONED: "cloned",
	HIDE: "bs-hidden",
	START: "start",
	END: "end"
}, n = {
	UL: "ul",
	LI: "li",
	BUTTON: "button",
	DIV: "div",
	SPAN: "span",
	STYLE: "style",
	VIDEO: "video"
}, r = {
	DOTS: "dots",
	RIGHT_CLICK: "contextmenu",
	PREV: "prev",
	NEXT: "next",
	TOUCH: "touch",
	TOUCHEND: "touchend"
}, i = {
	ID: "id",
	TYPE: "type",
	TABINDEX: "tabindex",
	DATA_INDEX: "data-index",
	DATA_NUMBER: "data-slide-number",
	DATA_PROGRESS_SYNCED_AT: "data-progress-synced-at",
	CLASS: "class",
	STYLE: "style",
	ARIA_LABEL: "aria-label",
	ARIA_HIDDEN: "aria-hidden",
	ARIA_LIVE: "aria-live",
	ARIA_ATOMIC: "aria-atomic",
	ARIA_CURRENT: "aria-current",
	ARIA_DISABLED: "aria-disabled",
	ARIA_CONTROLS: "aria-controls",
	ARIA_MODAL: "aria-modal",
	ARIA_ROLEDESCRIPTION: "aria-roledescription",
	ROLE: "role",
	DISABLED: "disabled",
	DRAGGABLE: "draggable",
	ARIA_VALUE_MIN: "aria-valuemin",
	ARIA_VALUE_MAX: "aria-valuemax",
	ARIA_VALUE_NOW: "aria-valuenow"
}, a = {
	DEFAULT_TRANSITION_TIME: 560,
	DRAG_FREE_RELEASE_TIME: 1500,
	FAST_NAVIGATION_OFFSET: 100,
	NAVIGATION_GUARD: 220,
	PROGRESS_TRANSITION_TIME: 560,
	SWIPE_MOUSE_LEAVE_DELAY: 100
}, o = {
	RESIZE: "resize",
	CLICK: "click",
	POINTERDOWN: "pointerdown",
	POINTERUP: "pointerup",
	POINTERCANCEL: "pointercancel",
	KEYDOWN: "keydown",
	TOUCHSTART: "touchstart",
	TOUCHEND: "touchend",
	TOUCHMOVE: "touchmove",
	MOUSEDOWN: "mousedown",
	MOUSEUP: "mouseup",
	MOUSELEAVE: "mouseleave",
	MOUSEENTER: "mouseenter",
	MOUSEMOVE: "mousemove",
	CONTEXTMENU: "contextmenu",
	TRANSITIONSTART: "transitionstart",
	TRANSITIONEND: "transitionend",
	TRANSITIONCANCEL: "transitioncancel",
	DRAGSTART: "dragstart",
	DRAGOVER: "dragover",
	DRAGEND: "dragend"
}, s = {
	MOUNTED: "mounted",
	DESTROYED: "destroyed",
	SLIDE_CHANGE: "slideChange"
}, c = {
	FORWARDS: "forwards",
	LINEAR: "linear",
	EASEOUT: "cubic-bezier(0.22, 0.61, 0.36, 1)",
	DRAG_FREE_EASING: "cubic-bezier(0.22, 1, 0.36, 1)"
}, l = [
	"xs",
	"sm",
	"md",
	"lg",
	"xl",
	"2xl"
], u = {
	TRACK: "track",
	CHILDREN: "children",
	SLIDE: "slide",
	ARROW: "bs-arrow",
	PAGES: "bs-pages"
}, d = { PLUGIN_ROOT_PLACEHOLDER: "#__brickslider_plugin_root__" }, f = {
	FAST_SWIPE_MAX_MS: 180,
	FAST_VELOCITY_THRESHOLD: .35,
	SLOW_LIMIT: 35,
	MAX_LIMIT: 55,
	DRAG_FREE_SETTLE_FACTOR: .12
}, p = {
	RIGHT: "right",
	LEFT: "left"
}, m = {
	GET_STARTED: "brickslider.github.io/docs/get-started",
	BASIC_HTML_DOC: "brickslider.github.io/docs/basic-html"
};
function h(e, t) {
	e.forEach((e) => {
		e.classList.add(t);
	});
}
function g(e, t, n) {
	if (!e) throw Error("Element is required for animation.");
	return (Array.isArray(e) ? e : [e]).map((e) => e.animate(t, n));
}
function _(e, t) {
	if (e && t) return e.appendChild(t), t;
}
function ee(e, t, n) {
	if (e && t && n) return e.insertBefore(t, n), t;
}
function te(e) {
	e?.remove();
}
function ne(e, t, n) {
	let r = C(n);
	return e && t <= 1 ? r - 2 : e && t > 1 ? Math.ceil(r / t) - t : !e && t > 1 ? Math.ceil(r / t) : r;
}
function re(e) {
	return document.createElement(e);
}
function v(e, t = document) {
	return t.querySelectorAll(e);
}
function y(e, t = document) {
	return t.querySelector(e) ?? void 0;
}
function b(e) {
	return y(e);
}
function x(t) {
	return b(`${t} .${e.DOTS[0]}`);
}
function ie(t) {
	return b(`${t} .${e.PROGRESS[0]}`);
}
function S(t) {
	return b(`${t} .${e.CHILDREN[0]}`);
}
function C(e) {
	return e ? e.children.length : 0;
}
function ae(t) {
	return b(`${t} .${e.DOTS[0]}`);
}
function oe(t) {
	return b(`${t} .${e.PAGES[0]}`);
}
function w(e) {
	return b(`${e}`);
}
function T(t, n = !0) {
	let r = `:scope > .${e.SLIDE[0]}${n ? "" : ":not(.cloned)"}`;
	return Array.from(v(r, S(t)));
}
function E(e) {
	if (e) return e.offsetWidth;
}
function D(t) {
	return b(`${t} .${e.TRACK[0]}`);
}
function O(e, t) {
	return e.classList.contains(t);
}
function se(e, t) {
	return !e || !t ? !1 : e.contains(t);
}
function ce(e, t) {
	return e ? e.getAttribute(t) : null;
}
function k(e, t) {
	e.classList.remove(...Array.isArray(t) ? t : [t]);
}
function A(e, t, n) {
	return e.slice(t, n);
}
function j(e, t, n) {
	e.setAttribute(t, n);
}
function le(e, t) {
	for (let [n, r] of Object.entries(t)) j(e, n, String(r));
}
function M(e) {
	return e.type.includes("mouse") ? e : e.touches[0];
}
function N(e) {
	return e instanceof MouseEvent ? e.button === 0 : !0;
}
function P(e) {
	return e.type.includes("mouse") ? e.pageX : e.touches && e.touches.length > 0 ? e.touches[0].clientX : NaN;
}
function F(e) {
	return e === r.NEXT ? "increment" : "decrement";
}
function ue(e) {
	return /^[.#].*/.test(e);
}
function I(e, t, n, r) {
	Array.isArray(e) && e.forEach((e) => {
		t.addEventListener(e, n, r);
	});
}
function L(e, t, n, r) {
	Array.isArray(e) && e.forEach((e) => {
		t.removeEventListener(e, n, r);
	});
}
function R(e, t) {
	e.removeAttribute(t);
}
function z(e) {
	return `translate3d(${e}px, 0px, 0px)`;
}
function B(e, t) {
	let n;
	function r(i) {
		n ||= i, i - n < e ? requestAnimationFrame(r) : t();
	}
	requestAnimationFrame(r);
}
//#endregion
//#region src/State.ts
var V = class t {
	static state = {};
	key;
	constructor(e, n) {
		this.key = e, t.state[e] || (t.state[e] = {}, n && this.initializeState(n));
	}
	initializeState(e) {
		t.state[this.key].prevSlideIndex = 0, t.state[this.key].activePage = 0, t.state[this.key].activeDataIndex = 0, t.state[this.key].slideIndex = 0, t.state[this.key].gap = e.gap ?? 0, t.state[this.key].slidesPerPage = e.slidesPerPage ?? 1, t.state[this.key].slidesPerView = e.slidesPerView ?? 1, t.state[this.key].baseSlidesPerPage = e.slidesPerPage ?? 1, t.state[this.key].baseSlidesPerView = e.slidesPerView ?? 1, t.state[this.key].numberOfPages = 0, t.state[this.key].numberOfSlides = 0, t.state[this.key].sliderWidth = 0, t.state[this.key].slideSizes = this.normalizeSlideSizes(e.slideSizes), t.state[this.key].baseSlideSizes = this.normalizeSlideSizes(e.slideSizes), t.state[this.key].screens = this.normalizeScreens(e.screens), t.state[this.key].responsive = this.normalizeResponsive(e.responsive), t.state[this.key].activeBreakpoint = "base", t.state[this.key].isInitialRender = !0, t.state[this.key].isTouch = !1, t.state[this.key].isPagedActive = !0, t.state[this.key].isCompleteGroup = !0, t.state[this.key].isDragging = !1, t.state[this.key].isJumpSlide = !1, t.state[this.key].isFastNavigation = !1, t.state[this.key].startPos = 0, t.state[this.key].startX = 0, t.state[this.key].startY = 0, t.state[this.key].endX = 0, t.state[this.key].prevTranslate = 0, t.state[this.key].currentTranslate = 0, t.state[this.key].currentEventType = null, t.state[this.key].currentSlideMovement = null, t.state[this.key].startTime = 0, t.state[this.key].endTime = 0, t.state[this.key].isMouseLeave = !0, t.state[this.key].animationID = 0, t.state[this.key].useDragFree = e.useDragFree ?? !1, t.state[this.key].dots = !t.state[this.key].useDragFree && this.hasDotsMarkup(), t.state[this.key].dotIndex = 0, t.state[this.key].arrows = this.hasArrowsMarkup(), t.state[this.key].touch = e.useTouch ?? !0, t.state[this.key].useLoop = !t.state[this.key].useDragFree && (e.useLoop ?? !1), t.state[this.key].useAutoHeight = e.useAutoHeight ?? !1, t.state[this.key].navigationLockUntil = 0, t.state[this.key].isPagedActive = !t.state[this.key].useDragFree;
	}
	hasDotsMarkup() {
		return !!x(this.key);
	}
	hasArrowsMarkup() {
		let t = w(this.key);
		return t ? v(e.ARROW.map((e) => `.${e}`).join(", "), t).length > 0 : !1;
	}
	normalizeSlideSizes(e) {
		if (!e || Object.entries(e).some(([e, t]) => !this.isValidSlideSizePosition(Number(e)) || !this.hasSlideSize(t))) return {};
		let t = [];
		return Object.entries(e).forEach(([e, n]) => {
			let r = Number(e);
			this.isValidSlideSizePosition(r) && this.hasSlideSize(n) && t.push([r, this.formatSlideSize(n)]);
		}), t.sort(([e], [t]) => e - t).reduce((e, [t, n]) => (e[t] = n, e), {});
	}
	isValidSlideSizePosition(e) {
		return typeof e == "number" && Number.isInteger(e) && e >= 0;
	}
	hasSlideSize(e) {
		return typeof e == "number" && Number.isFinite(e) && e >= 0;
	}
	formatSlideSize(e) {
		return e;
	}
	normalizeResponsive(e) {
		if (!e) return {};
		let t = {};
		return Object.entries(e).forEach(([e, n]) => {
			!this.isResponsiveBreakpoint(e) || !n || (t[e] = {
				slidesPerView: this.getResponsiveNumber(n.slidesPerView),
				slidesPerPage: this.getResponsiveNumber(n.slidesPerPage),
				slideSizes: this.normalizeSlideSizes(n.slideSizes),
				useSlidesPerView: n.useSlidesPerView === !1 ? !1 : void 0,
				useSlidesPerPage: n.useSlidesPerPage === !1 ? !1 : void 0,
				useSlideSizes: n.useSlideSizes === !1 ? !1 : void 0
			});
		}), t;
	}
	normalizeScreens(e) {
		if (!e) return {};
		let t = {};
		return Object.entries(e).forEach(([e, n]) => {
			if (!this.isResponsiveBreakpoint(e)) return;
			let r = this.getResponsiveNumber(n);
			r !== void 0 && (t[e] = r);
		}), t;
	}
	isResponsiveBreakpoint(e) {
		return [
			"xs",
			"sm",
			"md",
			"lg",
			"xl",
			"2xl"
		].includes(e);
	}
	getResponsiveNumber(e) {
		return typeof e == "number" && Number.isFinite(e) && e >= 0 ? e : void 0;
	}
	setOptions(e) {
		this.initializeState(e);
	}
	static store(e) {
		return t.state[e];
	}
	invalidationConditions(e, t) {
		return {
			isPrevOrCurrent: e === "prevTranslate" || e === "currentTranslate",
			isNumber: typeof t == "number",
			isNaNValue: typeof t == "number" && isNaN(t),
			isUndefined: t === void 0
		};
	}
	shouldInvalidateKey(e, t) {
		let { isPrevOrCurrent: n, isNaNValue: r, isUndefined: i } = this.invalidationConditions(e, t);
		return n && r || i;
	}
	set(e) {
		for (let n in e) if (e.hasOwnProperty(n)) {
			let r = e[n];
			this.shouldInvalidateKey(n, r) || (t.state[this.key][n] = r);
		}
	}
}, H = class {
	listeners = {};
	on(e, t) {
		this.listeners[e] || (this.listeners[e] = []), this.listeners[e].push(t);
	}
	off(e, t) {
		this.listeners[e] && (this.listeners[e] = this.listeners[e].filter((e) => e !== t));
	}
	emit(e, ...t) {
		this.listeners[e] && this.listeners[e].forEach((e) => e(...t));
	}
}, U = class e {
	static emitters = /* @__PURE__ */ new Map();
	$root;
	getRootSelector;
	state;
	store;
	emitter;
	$children;
	$track;
	childrenCount;
	sliderWidth;
	slides;
	translate;
	movement;
	constructor(e) {
		this.syncRootContext(e), this.translate = 0, this.movement = !1;
	}
	syncRootContext(t) {
		this.$root = t, this.getRootSelector = w(t), this.slides = T(t), this.state = new V(this.$root), this.store = V.store(this.$root), this.emitter = e.getEmitter(this.$root), this.$children = S(this.$root), this.$track = D(t), this.childrenCount = C(this.$children), this.sliderWidth = E(this.$children);
	}
	getRootKey() {
		return this.$root;
	}
	static getEmitter(t) {
		let n = e.emitters.get(t), r = new H();
		return e.emitters.set(t, r), n || r;
	}
	on(e, t) {
		this.emitter.on(e, t);
	}
	off(e, t) {
		this.emitter.off(e, t);
	}
	emit(e, ...t) {
		this.emitter.emit(e, ...t);
	}
	defineEventTarget(e) {
		return {
			clientX: M(e).clientX,
			clientY: M(e).clientY
		};
	}
	forEachSlide(e, t) {
		e.forEach((e, n) => t(e, n));
	}
	forEachButton(e, t) {
		Array.from(e).forEach((e, n) => t(e, n));
	}
	isDotTarget(e) {
		let { dotIndex: t } = this.store, n = null;
		if (t === -1 ? n = e - 1 : t === e && (n = 0), n === null) return;
		let r = { dotIndex: n };
		this.setState(r);
	}
	animate(e, t, n) {
		return g(e, t, n);
	}
	calcTranslateForIndex(e) {
		let { gap: t } = this.store, n = t || 0, r = 0;
		for (let t = 0; t < e; t++) {
			let e = this.slides[t];
			e && (r += e.offsetWidth + n);
		}
		return this.safeTranslate(r);
	}
	calcTranslate() {
		let { slideIndex: e } = this.store, t = typeof e == "number" ? e : 0;
		return this.calcTranslateForIndex(t);
	}
	safeTranslate(e) {
		let { sliderWidth: t } = this.store, n = t ?? this.sliderWidth ?? E(this.$children) ?? 0;
		this.sliderWidth = n;
		let r = this.getTotalWidth() - n;
		return e > r ? r : e < 0 ? 0 : e;
	}
	getTotalWidth() {
		let { gap: e } = this.store;
		return this.slides.length === 0 ? 0 : this.slides.reduce((t, n, r) => t + n.offsetWidth + (r < this.slides.length - 1 ? e : 0), 0);
	}
	getVisibleSlidesForHeight(e) {
		let { slideIndex: t, slidesPerView: n } = this.store, r = typeof e == "number" ? e : typeof t == "number" ? t : 0, i = Math.max(1, n || 1);
		return this.slides.slice(r, r + i);
	}
	getMeasuredSlideHeight(e) {
		if (!e) return 0;
		let t = e.firstElementChild;
		return Math.max(e.offsetHeight, e.scrollHeight, t?.offsetHeight ?? 0, t?.scrollHeight ?? 0);
	}
	getAutoHeightTarget(e) {
		let t = this.getVisibleSlidesForHeight(e).map((e) => this.getMeasuredSlideHeight(e));
		return Math.max(0, ...t);
	}
	syncAutoHeight(e, t = a.DEFAULT_TRANSITION_TIME) {
		let { useAutoHeight: n, isJumpSlide: r, currentEventType: i } = this.store, o = this.getRootSelector;
		if (!n || !o || !this.$track) return;
		let s = this.getAutoHeightTarget(e), c = this.$track.offsetHeight, l = r || i === "touchmove" ? 0 : t, u = [{ height: `${s}px` }], d = this.options(l);
		s <= 0 || c !== s && this.animate(this.$track, u, d);
	}
	options(e = 0) {
		return {
			duration: e,
			easing: c.EASEOUT,
			fill: c.FORWARDS
		};
	}
	keyFrames(e) {
		let { currentTranslate: t } = this.store;
		return [{ transform: z(e ?? t) }];
	}
	setState(e) {
		this.state.set(e);
	}
	getFirstIndex() {
		return this.slides.findIndex((e) => e.dataset.index === "1");
	}
	getDataSlideNumber(e) {
		return this.slides.findIndex((n) => n.dataset.slideNumber === e && !O(n, t.CLONED));
	}
	getDataIndex(e) {
		return Number(this.slides.find((n) => n.dataset.slideNumber === e && !O(n, t.CLONED))?.dataset.index ?? -1);
	}
	getClonePreviousPosition(e) {
		let n = this.getDataIndex(e), r = this.slides.find((e) => e.dataset.index === String(n) && O(e, t.CLONED));
		return Number(r?.dataset.slideNumber) - 1;
	}
	getFirstClonedIndex() {
		return this.slides.findIndex((e) => e.dataset.index === "1" && O(e, t.CLONED));
	}
	getLastGroupStep(e, t, n) {
		let r = n, i = Math.max(e - t, 0), a = i - Math.floor(i / r) * r;
		return a > 0 ? a : r;
	}
	hasRemaining(e) {
		let { slidesPerView: t, slidesPerPage: n } = this.store;
		return (e - t) % n !== 0;
	}
	isAlign(e, t) {
		return e % t === 0;
	}
	getMissingSlides() {
		let { slidesPerPage: e, slidesPerView: t } = this.store, n = T(this.$root, !1).length, r = n - Math.floor(n / e) * e, i = Math.max(0, t - r);
		return {
			isMissing: i > 0,
			leftOver: i
		};
	}
}, W = class {
	$root;
	ids = /* @__PURE__ */ new Set();
	details = {};
	arrElements;
	fixedOrder;
	constructor(e) {
		this.$root = e, this.arrElements = this.getRoot()?.children, this.fixedOrder = [
			u.TRACK,
			u.CHILDREN,
			u.SLIDE
		];
	}
	getRoot() {
		return w(this.$root);
	}
	getElementClasses(e) {
		return e ? Array.from(e).flatMap((e) => {
			if (this.isTrackElement(e)) return this.getTrackClasses(e);
			let t = this.normalizeElementRole(e);
			return t ? [t] : [];
		}) : [];
	}
	getTrackClasses(t) {
		let n = t.children[0], r = n ? y(`.${e.SLIDE[0]}`, n) : void 0;
		return r ? [
			this.normalizeElementRole(t),
			this.normalizeElementRole(n),
			this.normalizeElementRole(r)
		] : [];
	}
	normalizeElementRole(t) {
		return t ? this.hasAliasClass(t, e.TRACK) ? u.TRACK : this.hasAliasClass(t, e.CHILDREN) ? u.CHILDREN : this.hasAliasClass(t, e.SLIDE) ? u.SLIDE : this.hasAliasClass(t, e.ARROW) ? u.ARROW : this.hasAliasClass(t, e.PAGES) ? u.PAGES : t.classList[0] ?? null : null;
	}
	hasAliasClass(e, t) {
		return t.some((t) => O(e, t));
	}
	isTrackElement(t) {
		return this.hasAliasClass(t, e.TRACK);
	}
	getButtonElements() {
		return Array.from(this.arrElements || []).slice(0, this.getBeforeTrack().length);
	}
	getBeforeTrack() {
		let e = this.getElementClasses(this.arrElements).indexOf(u.TRACK);
		return A(this.getElementClasses(this.arrElements), 0, e);
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
		let t = this.getBeforeTrack(), r = this.getButtonElements(), i = Array.from(this.arrElements || []).slice(0, t.length).filter((t) => O(t, e.PAGES[0])), a = r.filter((t) => O(t, e.ARROW[0]));
		return t.length > 3 || !t.every((e) => [u.ARROW, u.PAGES].includes(e)) || i.length > 1 || !a.every((e) => e.tagName.toLowerCase() === n.BUTTON);
	}
	hasAllElementsInOrder() {
		let e = this.getElementClasses(this.arrElements), t = e.indexOf(u.TRACK), n = t >= 0 ? A(e, t, t + 3) : [];
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
		let t = {}, n = [...e.TRACK, ...e.CHILDREN];
		return v(this.$root).forEach((e) => {
			n.forEach((n) => {
				O(e, n) && (t[n] = (t[n] ?? 0) + 1);
			});
		}), Object.entries(t).filter(([, e]) => e > 1).map(([e]) => e);
	}
	getInvalidOrderDetails() {
		let t = D(this.$root), n = S(this.$root);
		this.getBeforeTrack();
		let r = [], i = !!(n && y(`.${e.SLIDE[0]}`, n));
		return this.isInvalidBeforeTrack() && r.push(`Optional arrows must be <button> elements, and optional .${e.PAGES[0]} must stay before .${e.TRACK[0]}.`), n && t && !se(t, n) && r.push(`Found .${e.CHILDREN[0]} outside .${e.TRACK[0]}.`), t && n && t.firstElementChild !== n && r.push(`.${e.CHILDREN[0]} must be the first child inside .${e.TRACK[0]}.`), n && !i && r.push(`Could not find any .${e.SLIDE[0]} inside .${e.CHILDREN[0]}.`), r.length === 0 && r.push(`Expected structure: .${e.TRACK[0]} > .${e.CHILDREN[0]} > .${e.SLIDE[0]}.`), r;
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
		return b(`${this.$root} .${e.DOTS[0]}`);
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
		return l.includes(e);
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
		return D(this.$root);
	}
	hasChildrenContainer() {
		return S(this.$root);
	}
	hasSlide() {
		return b(`${this.$root} .${e.CHILDREN[0]} > .${e.SLIDE[0]}`);
	}
}, de = class e extends W {
	messageMap;
	levelMap;
	rootSelector;
	constructor(t) {
		super(t), this.rootSelector = t, this.messageMap = e.TextMessages(t), this.levelMap = e.TextLevels();
	}
	static TextMessages(e) {
		return {
			NO_ROOT: `Could not find root selector ${e}.\nSee: ${m.GET_STARTED}`,
			NO_TRACK: `Could not find .bs-track inside ${e}.\nSee: ${m.BASIC_HTML_DOC}`,
			NO_CHILDREN: `Could not find .bs-container inside .bs-track for ${e}.\nSee: ${m.BASIC_HTML_DOC}`,
			NO_SLIDES: `Could not find any .bs-slide inside .bs-container for ${e}.\nSee: ${m.BASIC_HTML_DOC}`,
			DUPLICATE_ELEMENTS: `Found duplicated core slider elements in ${e}.\nSee: ${m.BASIC_HTML_DOC}`,
			INVALID_ORDER: `Found invalid core slider markup order in ${e}.\nSee: ${m.BASIC_HTML_DOC}`,
			INVALID_SLIDE_SIZES_VALUES: `slideSizes for ${e} is invalid and will be ignored. Use only non-negative numbers. String values such as "30px", "50%" or "2rem" are not supported.\nSee: ${m.BASIC_HTML_DOC}`,
			UNSUPPORTED_SLIDE_SIZES_SINGLE_VIEW: `slideSizes for ${e} will be ignored because this option is not supported when slidesPerView is 1. To use slideSizes, set slidesPerView to 2 or greater.\nSee: ${m.BASIC_HTML_DOC}`,
			RESPONSIVE_WITHOUT_SCREENS: `responsive for ${e} will be ignored because no screens object was provided. Define screens with the breakpoint widths before using responsive.\nSee: ${m.BASIC_HTML_DOC}`,
			INVALID_SCREENS_BREAKPOINT_KEYS: `screens for ${e} contains unsupported breakpoint names. Use only xs, sm, md, lg, xl or 2xl. Invalid keys will be ignored.\nSee: ${m.BASIC_HTML_DOC}`,
			INVALID_RESPONSIVE_BREAKPOINT_KEYS: `responsive for ${e} contains unsupported breakpoint names. Use only xs, sm, md, lg, xl or 2xl. Invalid keys will be ignored.\nSee: ${m.BASIC_HTML_DOC}`,
			RESPONSIVE_BREAKPOINTS_MISSING_IN_SCREENS: `responsive for ${e} contains breakpoints that are missing or invalid in screens. Define the same breakpoint with a numeric value in screens before using it in responsive.\nSee: ${m.BASIC_HTML_DOC}`,
			DRAG_FREE_WITH_DOTS: `dots for ${e} will be ignored because useDragFree is enabled. Drag free mode does not support pagination dots.\nSee: ${m.BASIC_HTML_DOC}`
		};
	}
	static TextLevels() {
		return {
			NO_ROOT: "error",
			NO_TRACK: "error",
			NO_CHILDREN: "error",
			NO_SLIDES: "error",
			DUPLICATE_ELEMENTS: "error",
			INVALID_ORDER: "error",
			INVALID_SLIDE_SIZES_VALUES: "warn",
			UNSUPPORTED_SLIDE_SIZES_SINGLE_VIEW: "warn",
			RESPONSIVE_WITHOUT_SCREENS: "warn",
			INVALID_SCREENS_BREAKPOINT_KEYS: "warn",
			INVALID_RESPONSIVE_BREAKPOINT_KEYS: "warn",
			RESPONSIVE_BREAKPOINTS_MISSING_IN_SCREENS: "warn",
			DRAG_FREE_WITH_DOTS: "warn"
		};
	}
	displayMessage(e) {
		this.runValidations(e), this.getIds().forEach((e) => {
			let t = this.getMessageById(e), n = this.levelMap[e] ?? "error";
			console[n](t);
		});
	}
	displayWarning(e) {
		console.warn(e);
	}
	displayError(e) {
		console.error(e);
	}
	displayInvalidGoToIndex(e) {
		this.displayWarning(`[BrickSlider] goTo(index) expects a finite number. Received: ${String(e)}. Ignoring call.`);
	}
	displayDragFreeGoToIgnored() {
		this.displayWarning("[BrickSlider] goTo(index) is ignored when useDragFree is enabled. Drag free mode does not support paginated navigation.");
	}
	displayInvalidPluginType() {
		this.displayError("[BrickSlider] Plugin rejected. Official plugins must extend Plugin.");
	}
	displayPluginRootMismatch(e) {
		this.displayError(`[BrickSlider] Plugin rejected. "${e}" must use the same root selector as the current slider instance.`);
	}
	getMessageById(e) {
		if (e === "DUPLICATE_ELEMENTS") {
			let t = this.getDetails(e);
			if (t.length > 0) return `Found duplicated core slider elements in ${this.rootSelector}: ${t.map((e) => `.${e}`).join(", ")}.\nSee: ${m.BASIC_HTML_DOC}`;
		}
		if (e === "INVALID_ORDER") {
			let t = this.getDetails(e);
			if (t.length > 0) return `Found invalid core slider markup order in ${this.rootSelector}.\n${t.join("\n")}\nSee: ${m.BASIC_HTML_DOC}`;
		}
		if (e === "RESPONSIVE_BREAKPOINTS_MISSING_IN_SCREENS") {
			let t = this.getDetails(e);
			if (t.length > 0) {
				let e = t.map((e) => `[${e.toUpperCase()}]`).join(", ");
				return `responsive for ${this.rootSelector} contains breakpoints without prior screen configuration: ${e}. Define the same breakpoint with a numeric value in screens before using it in responsive.\nSee: ${m.BASIC_HTML_DOC}`;
			}
		}
		return this.messageMap[e];
	}
}, G = class extends U {
	sync() {
		let e = this.getArrowButtons();
		this.forEachButton(e, (e) => {
			let t = this.getArrowEventType(e), n = this.isArrowDisabled(t);
			this.setArrowDisabledState(e, n);
		});
	}
	getArrowButtons() {
		return v(e.ARROW.map((e) => `${this.$root} .${e}`).join(", "));
	}
	getArrowEventType(e) {
		return this.getExplicitArrowType(e) || this.getFallbackArrowType(e);
	}
	getExplicitArrowType(t) {
		if (this.matchesArrowClass(t, e.ARROW_PREV)) return r.PREV;
		if (this.matchesArrowClass(t, e.ARROW_NEXT)) return r.NEXT;
	}
	matchesArrowClass(e, t) {
		return t.some((t) => O(e, t));
	}
	getFallbackArrowType(e) {
		return this.getScopedArrowButtons().indexOf(e) <= 0 ? r.PREV : r.NEXT;
	}
	getScopedArrowButtons() {
		let t = w(this.$root);
		if (!t) return [];
		let n = e.ARROW.map((e) => `.${e}`).join(", ");
		return Array.from(v(n, t));
	}
	isArrowDisabled(e) {
		let { useLoop: t, useDragFree: n, activePage: i, numberOfPages: a, currentTranslate: o, sliderWidth: s } = this.store;
		if (t) return !1;
		if (n) {
			let t = Math.max(0, this.getTotalWidth() - (s ?? this.sliderWidth ?? 0)), n = Math.abs(o ?? 0), i = n <= 0, a = n >= t - 1;
			return e === r.PREV ? i : a;
		}
		let c = Math.max(1, a || 0), l = Math.max(0, Math.min(i || 0, c - 1)), u = l === 0, d = l === c - 1;
		return e === r.PREV ? u : d;
	}
	setArrowDisabledState(e, t) {
		let n = e;
		if (t) {
			n.disabled = !0, j(e, i.ARIA_DISABLED, "true");
			return;
		}
		n.disabled = !1, R(e, i.DISABLED), j(e, i.ARIA_DISABLED, "false");
	}
}, K = class extends U {
	containerProgress;
	progressBar;
	constructor(e) {
		super(e), this.containerProgress = ie(e), this.progressBar = this.getExistingProgressBar();
	}
	init() {
		this.containerProgress && (this.progressBar = this.ensureProgressBar(), this.sync());
	}
	sync() {
		let e = this.progressBar ?? this.ensureProgressBar(), t = this.containerProgress;
		!e || !t || this.updateProgress(e, t);
	}
	updateProgress(e, t) {
		let { progressKeyFrames: n, duration: r, progressNow: i } = this.getProgressAnimation(e);
		this.stopProgressAnimations(e), this.animate(e, n, this.options(r)), this.setProgressNow(t, i), this.setProgressSyncedAt(e);
	}
	stopProgressAnimations(e) {
		e.getAnimations().forEach((e) => e.cancel());
	}
	getProgressAnimation(e) {
		let { currentEventType: t, isFastNavigation: n } = this.store, r = this.getProgressValue(), i = this.getElapsedSinceLastSync(e), a = t === o.TOUCHMOVE || t === o.TOUCHEND || n, s = this.getCurrentProgressScale(e), c = r / 100, l = a ? 0 : this.getResponsiveProgressDuration(i), u = Math.round(r);
		return {
			progressKeyFrames: this.getProgressKeyFrames(s, c),
			duration: l,
			progressNow: u
		};
	}
	getResponsiveProgressDuration(e) {
		return e === null ? a.PROGRESS_TRANSITION_TIME : e <= 32 ? 90 : Math.max(90, Math.min(a.PROGRESS_TRANSITION_TIME, e));
	}
	getElapsedSinceLastSync(e) {
		let t = ce(e, i.DATA_PROGRESS_SYNCED_AT), n = Number(t);
		return !t || !Number.isFinite(n) ? null : Math.max(0, Date.now() - n);
	}
	setProgressSyncedAt(e) {
		j(e, i.DATA_PROGRESS_SYNCED_AT, String(Date.now()));
	}
	getProgressKeyFrames(e, t) {
		return [{ scale: `${e} 1` }, { scale: `${t} 1` }];
	}
	setProgressNow(e, t) {
		e.setAttribute(i.ARIA_VALUE_NOW, `${t}`);
	}
	ensureProgressBar() {
		let e = this.containerProgress, t = this.getExistingProgressBar(), n = this.createProgressBar();
		if (e) return t || (this.mountProgressBar(e, n), n);
	}
	createProgressBar() {
		return re(n.DIV);
	}
	mountProgressBar(t, n) {
		h([n], e.PROGRESS_BAR[0]), _(t, n);
	}
	getExistingProgressBar() {
		return this.containerProgress?.querySelector(`.${e.PROGRESS_BAR[0]}`);
	}
	getProgressValue() {
		let { useDragFree: e } = this.store;
		return e ? this.getDragFreeProgressValue() : this.getPagedProgressValue();
	}
	getPagedProgressValue() {
		let { activePage: e, numberOfPages: t } = this.store, n = Math.max(1, t || 0);
		return 100 * (Math.max(0, Math.min(e || 0, n - 1)) + 1) / n;
	}
	getDragFreeProgressValue() {
		let { currentTranslate: e, sliderWidth: t } = this.store, n = Math.abs(e ?? 0), r = Math.max(0, this.getTotalWidth() - (t ?? this.sliderWidth ?? 0));
		return r <= 0 ? 100 : Math.max(0, Math.min(n / r * 100, 100));
	}
	getCurrentProgressScale(e) {
		let t = window.getComputedStyle(e), n = this.getScaleFromProperty(t.scale), r = this.getScaleFromTransform(t.transform);
		return n === null ? r : n;
	}
	getScaleFromProperty(e) {
		return !e || e === "none" ? null : this.getScaleFromComputedScale(e);
	}
	getScaleFromTransform(e) {
		let t = this.getScaleFromMatrix(e, "matrix3d"), n = this.getScaleFromMatrix(e, "matrix");
		return !e || e === "none" ? 0 : t === null ? n === null ? 0 : n : t;
	}
	getScaleFromMatrix(e, t) {
		let n = e.match(RegExp(`${t}\\(([^)]+)\\)`));
		return n ? this.getScaleFromMatrixValue(n[1]) : null;
	}
	getScaleFromMatrixValue(e) {
		let t = e.split(",").map((e) => Number(e.trim()))[0] ?? 0;
		return this.clampProgressScale(t);
	}
	getScaleFromComputedScale(e) {
		let [t] = e.split(" "), n = Number(t);
		return this.clampProgressScale(n);
	}
	clampProgressScale(e) {
		return Number.isFinite(e) ? Math.max(0, Math.min(e, 1)) : 0;
	}
}, q = class extends U {
	constructor(e) {
		super(e);
	}
	init = (e) => new Promise((t) => {
		requestAnimationFrame(() => {
			let n = g(this.$children, this.keyFrames(), this.options());
			new K(this.$root).sync(), e?.onStart && queueMicrotask(() => {
				e.onStart?.(n);
			});
			let r = n.map((e) => e.finished);
			Promise.all(r).then(() => {
				e?.onEnd?.(n), t(n);
			});
		});
	});
	keyFrames() {
		let { currentTranslate: e } = this.store;
		return [{ transform: z(e) }];
	}
	options(e = a.DEFAULT_TRANSITION_TIME) {
		let { currentEventType: t, isJumpSlide: n, useDragFree: r } = this.store, i = t === o.TOUCHMOVE, s = r && t === o.TOUCHEND, l = i || n ? 0 : e;
		return {
			duration: s ? a.DRAG_FREE_RELEASE_TIME : l > 0 ? l : 0,
			easing: s ? c.DRAG_FREE_EASING : c.EASEOUT,
			fill: c.FORWARDS
		};
	}
}, J = class extends U {
	containerPages;
	constructor(e) {
		super(e), this.containerPages = oe(e);
	}
	init() {
		this.sync();
	}
	sync() {
		let e = this.containerPages, { useDragFree: t } = this.store;
		if (e) {
			if (t) {
				e.textContent = "";
				return;
			}
			e.textContent = this.getPagesLabel();
		}
	}
	getPagesLabel() {
		let { activePage: e, numberOfPages: t, useDragFree: n, slideIndex: r } = this.store, i = this.getSafePagesCount(t, n);
		return `${this.getSafeCurrentPage(e, i, n, r)}/${i}`;
	}
	getSafePagesCount(e, n) {
		if (!n) return Math.max(1, e || 0);
		let r = T(this.$root, !1).filter((e) => !O(e, t.CLONED)).length;
		return Math.max(1, r);
	}
	getSafeCurrentPage(e, t, n, r) {
		return n ? Math.max(0, Math.min(r || 0, t - 1)) + 1 : Math.max(0, Math.min(e || 0, t - 1)) + 1;
	}
}, Y = class extends U {
	constructor(e) {
		super(e);
	}
	getAllSlides() {
		return T(this.$root);
	}
	updateActiveSlides(e, t) {
		let n = this.getAllSlides(), r = this.getActiveIndexes(e, t);
		r && this.syncActiveSlides(n, r);
	}
	syncActiveSlides(e, t) {
		this.resetActiveClasses(), this.applyActiveSlides(e, t);
	}
	getActiveIndexes(e, t) {
		return e ? t === void 0 ? e : e.slice(0, t) : null;
	}
	applyActiveSlides(e, t) {
		e.forEach((e, n) => {
			this.toggleActiveSlide(e, t.includes(n));
		});
	}
	toggleActiveSlide(e, n) {
		if (n) {
			h([e], t.ACTIVE);
			return;
		}
		k(e, t.ACTIVE);
	}
	resetActiveClasses() {
		this.slides.forEach((e) => k(e, t.ACTIVE));
	}
}, fe = class extends U {
	visibleIndexes = /* @__PURE__ */ new Set();
	visibleDataIndexes = /* @__PURE__ */ new Set();
	elementToIndexMap = /* @__PURE__ */ new Map();
	animationFrameId = null;
	lastIndex = 0;
	constructor(e) {
		super(e), this.observeSlides(), this.startObserving();
	}
	observeSlides() {
		let { useLoop: e } = this.store;
		this.slides.forEach((t, n) => {
			e && this.elementToIndexMap.set(t, n);
		});
	}
	startObserving() {
		let e = () => {
			this.checkVisibleSlides(), this.animationFrameId = requestAnimationFrame(e);
		};
		this.animationFrameId = requestAnimationFrame(e);
	}
	checkVisibleSlides() {
		let e = this.getVisibleSlides(), t = this.getVisibleIndexes(e), n = this.getVisibleDataIndexSet(e);
		this.hasVisibleSlidesChanged(t, n) && this.updateVisibleSlides(t, n);
	}
	getVisibleSlides() {
		let e = this.$track.getBoundingClientRect();
		return this.slides.filter((t) => this.isSlideVisible(t, e));
	}
	isSlideVisible(e, t) {
		let n = this.getSlideVisibleRatio(e, t), r = this.getSlideNumber(e), i = this.getSlideIndex(e, r);
		return n >= .75 && i !== -1 && r !== -1;
	}
	getSlideVisibleRatio(e, t) {
		let n = e.getBoundingClientRect();
		return (Math.min(n.right, t.right) - Math.max(n.left, t.left)) / n.width;
	}
	getVisibleIndexes(e) {
		return new Set(e.map((e) => {
			let t = this.getSlideNumber(e);
			return this.getSlideIndex(e, t);
		}));
	}
	getVisibleDataIndexSet(e) {
		return new Set(e.map((e) => this.getSlideNumber(e)));
	}
	getSlideNumber(e) {
		return parseInt(e.dataset.slideNumber || "-1");
	}
	getSlideIndex(e, t) {
		let { useLoop: n } = this.store;
		return n ? this.elementToIndexMap.get(e) ?? -1 : t - 1;
	}
	hasVisibleSlidesChanged(e, t) {
		return this.setsDiffer(this.visibleIndexes, e) || this.setsDiffer(this.visibleDataIndexes, t);
	}
	updateVisibleSlides(e, t) {
		this.visibleIndexes = e, this.visibleDataIndexes = t, this.updateLastIndex();
	}
	setsDiffer(e, t) {
		if (e.size !== t.size) return !0;
		for (let n of e) if (!t.has(n)) return !0;
		return !1;
	}
	updateLastIndex() {
		if (this.visibleDataIndexes.size > 0) {
			let e = [...this.visibleDataIndexes].sort((e, t) => e - t), { slidesPerPage: t } = this.store, n = e.slice(0, t), r = n[n.length - 1];
			this.lastIndex = r, this.setState(this.setActiveDataIndexState());
		}
	}
	setActiveDataIndexState() {
		return { activeDataIndex: this.lastIndex };
	}
	getVisibleSlideIndexes() {
		return [...this.visibleIndexes].sort((e, t) => e - t);
	}
	getVisibleDataIndexes() {
		return [...this.visibleDataIndexes].sort((e, t) => e - t);
	}
	getLastVisibleDataIndex() {
		return this.lastIndex;
	}
	destroy() {
		this.animationFrameId && cancelAnimationFrame(this.animationFrameId);
	}
}, X = class extends U {
	animation;
	currentIndex;
	slides;
	validPositions;
	mutate;
	observer;
	constructor(e) {
		super(e), this.animation = new q(this.$root), this.currentIndex = 0, this.slides = T(e), this.mutate = new Y(e), this.observer = new fe(e), this.validPositions = [];
	}
	computeValidPositions() {
		let { useLoop: e, slidesPerPage: t, slidesPerView: n } = this.store, r = t || 1, i = n || 1, a = Math.max(this.slides.length - i, 0), o = [];
		if (e) return this.computeLoopValidPositions();
		for (let e = 0; e <= a; e += r) o.push(e);
		return o.includes(a) || o.push(a), o;
	}
	computeLoopValidPositions() {
		let { slidesPerPage: e } = this.store, n = e || 1, r = this.slides.filter((e) => !O(e, t.CLONED)).length, i = this.getInitialIndexFromClones(), a = [];
		for (let e = 0; e < r; e += n) a.push(i + e);
		return a.length > 0 ? a : [i];
	}
	getPositions() {
		let e = this.computeValidPositions();
		return this.validPositions = e, e;
	}
	nearestPosition(e, t) {
		let n = t && t.length ? t : this.validPositions.length ? this.validPositions : this.computeValidPositions();
		return !n || n.length === 0 ? 0 : n.reduce((t, n) => Math.abs(n - e) < Math.abs(t - e) ? n : t, n[0]);
	}
	resolveStartIndex(e) {
		let t = this.slides[e];
		return t ? parseInt(t.dataset.index || "1", 10) - 1 : e;
	}
	updateCurrentIndexFromTranslate() {
		let { currentTranslate: e } = this.store;
		this.currentIndex = this.normalizeIndex(this.resolveIndexFromTranslate(e));
	}
	calcTranslateForIndex(e) {
		let { gap: t } = this.store, n = t || 0, r = 0;
		for (let t = 0; t < e; t++) {
			let e = this.slides[t];
			e && (r += e.offsetWidth + n);
		}
		return r;
	}
	setSlideTarget(e) {
		this.shouldBlockPagedNavigation(e.from) || (this.updateCurrentIndexFromTranslate(), this.currentIndex = this.setIndexBased(e), this.nextAction());
	}
	goToDotIndex(e) {
		if (this.shouldBlockPagedNavigation(r.DOTS)) return;
		let t = this.normalizeIndex(e), n = {
			currentSlideMovement: null,
			currentEventType: r.DOTS
		};
		this.setState(n), this.currentIndex = t, this.commitCurrentIndex();
	}
	goToPageIndex(e) {
		if (this.shouldBlockPagedNavigation(r.DOTS)) return;
		let t = [...new Set(this.getPositions())], n = Math.max(0, t.length - 1), i = t[Math.max(0, Math.min(Math.floor(e), n))] ?? t[0] ?? 0, a = {
			currentSlideMovement: null,
			currentEventType: r.DOTS
		};
		this.setState(a), this.currentIndex = i, this.commitCurrentIndex();
	}
	goToFreeDirection(e) {
		if (this.shouldBlockPagedNavigation(e)) return;
		let { currentTranslate: t } = this.store, n = t ?? 0, i = this.getDragFreeOffset(), a = e === r.NEXT ? n - i : n + i;
		this.commitFreeTranslate(a);
	}
	commitFreeTranslate(e) {
		let { slideIndex: t } = this.store, n = this.clampFreeTranslate(e), r = this.resolveIndexFromTranslate(n), i = this.getDragFreeActiveIndexes(r), a = {
			prevSlideIndex: t,
			slideIndex: r,
			activePage: r,
			prevTranslate: n,
			currentTranslate: n,
			currentSlideMovement: null
		};
		this.setState(a), this.syncAutoHeight(r), this.animationFrame(), this.updateDOM(), this.mutate.updateActiveSlides(i, i.length), this.updateSlider(), this.emitSlideChange();
	}
	normalizeIndex(e) {
		return this.getPositions(), this.nearestPosition(e, this.validPositions);
	}
	setIndexBased(e) {
		let t = [...new Set(this.getPositions())], { from: n, touchIndex: i } = e;
		return n === r.NEXT ? this.getNextPositionIndex(t) : n === r.PREV ? this.getPrevPositionIndex(t) : n === r.DOTS || n === r.TOUCHEND ? this.getTargetIndexFromInput(n, i) : this.currentIndex;
	}
	getNextPositionIndex(e) {
		return e.find((e) => e > this.currentIndex) ?? this.currentIndex;
	}
	shouldBlockPagedNavigation(e) {
		return this.canGuardNavigation(e) ? this.isNavigationLocked() ? !0 : (this.lockNavigation(), !1) : !1;
	}
	canGuardNavigation(e) {
		return [
			r.NEXT,
			r.PREV,
			r.TOUCHEND,
			r.DOTS
		].includes(e);
	}
	isNavigationLocked() {
		let { navigationLockUntil: e = 0 } = this.store;
		return Date.now() < e;
	}
	lockNavigation() {
		let e = Date.now() + a.NAVIGATION_GUARD;
		this.setState({ navigationLockUntil: e });
	}
	getPrevPositionIndex(e) {
		return e.slice().reverse().find((e) => e < this.currentIndex) ?? this.currentIndex;
	}
	getTargetIndexFromInput(e, t) {
		let { useLoop: n } = this.store;
		if (t === void 0) return this.currentIndex;
		let i = e === r.TOUCHEND && n ? t : this.resolveStartIndex(t);
		return this.normalizeIndex(i);
	}
	mapDotIndexForLoop(e, n) {
		let { useLoop: r, slidesPerPage: i } = this.store, a = this.slides.filter((e) => !O(e, t.CLONED)), o = i || 1, s = Math.ceil(a.length / o), c = this.getRealSlideDataIndex(a[0]), l = this.getRealSlideDataIndex(a[a.length - 1]);
		return r ? n < c ? s - 1 : n > l ? 0 : Math.floor(n / o) : e;
	}
	getRealSlideDataIndex(e) {
		return parseInt(e?.dataset.index || "1", 10) - 1;
	}
	defineDotIndex() {
		let { isPagedActive: e } = this.store, t = this.getPositions(), n = this.getDotStartIndex(), r = this.getComputedDotIndex(t, n), i = this.dotIndexState(r);
		e && this.setState(i);
	}
	getDotStartIndex() {
		let e = this.getDotRawStartIndex();
		return this.resolveStartIndex(e);
	}
	getDotRawStartIndex() {
		let { slideIndex: e } = this.store;
		return typeof e == "number" ? e : this.currentIndex;
	}
	getComputedDotIndex(e, t) {
		let n = this.getDotIndexFromPositions(e, t), r = this.getSafeDotIndex(n, e);
		return this.mapDotIndexForLoop(r, t);
	}
	getDotIndexFromPositions(e, t) {
		let n = e.findIndex((e) => e === t);
		return n === -1 ? this.getNearestPreviousDotIndex(e, t) : n;
	}
	getNearestPreviousDotIndex(e, t) {
		for (let n = e.length - 1; n >= 0; n--) if (e[n] <= t) return n;
		return 0;
	}
	getSafeDotIndex(e, t) {
		return Math.max(0, Math.min(e, t.length - 1));
	}
	dotIndexState(e) {
		return { dotIndex: e };
	}
	updateSlider() {
		this.defineDotIndex(), this.updateDots(this.$root), new J(this.$root).sync(), new G(this.$root).sync(), new K(this.$root).sync();
	}
	updateDOM() {}
	updateDots(r) {
		let { dotIndex: i, dots: a } = this.store, o = i ?? 0, s = v(n.LI, ae(r)), c = { activePage: o };
		this.setState(c), a && s.forEach((n, r) => {
			O(n, t.SELECTED) && k(n, t.SELECTED), O(n, e.DOT_ACTIVE[0]) && k(n, e.DOT_ACTIVE[0]), r === Math.abs(o) && (h([n], t.SELECTED), h([n], e.DOT_ACTIVE[0]));
		});
	}
	nextAction() {
		let e = this.getLoopJumpAction();
		if (!e) {
			this.commitCurrentIndex();
			return;
		}
		this.runLoopJumpAction(e);
	}
	getLoopJumpAction() {
		let { useLoop: e, activePage: t, currentSlideMovement: n, numberOfPages: i } = this.store, a = F(r.NEXT), o = F(r.PREV);
		return e && n === a && t === i - 1 ? a : e && n === o && t === 0 ? o : null;
	}
	runLoopJumpAction(e) {
		let t = F(r.NEXT), n = F(r.PREV);
		if (e === t) {
			this.runForwardLoopJump();
			return;
		}
		e === n && this.runBackwardLoopJump();
	}
	runForwardLoopJump() {
		let e = this.getForwardLoopCloneIndex(), t = this.getFirstIndex();
		this.currentIndex = e, this.enableJumpSlide(), this.commitCurrentIndex(), B(0, () => this.completeLoopJump(t));
	}
	getForwardLoopCloneIndex() {
		let e = this.slides.find((e) => O(e, t.ACTIVE))?.dataset.index || "1", n = this.slides.find((n) => n.dataset.index === e && O(n, t.CLONED));
		return Number(n?.dataset.slideNumber) - 1;
	}
	runBackwardLoopJump() {
		let { slidesPerPage: e, numberOfPages: t } = this.store, n = this.getFirstClonedIndex(), r = this.getFirstIndex() + e * (t - 1);
		this.currentIndex = n, this.enableJumpSlide(), this.commitCurrentIndex(), B(0, () => this.completeLoopJump(r));
	}
	completeLoopJump(e) {
		this.disableJumpSlide(), this.currentIndex = e, this.commitCurrentIndex();
	}
	enableJumpSlide() {
		this.setState(this.jumpSlideState(!0));
	}
	disableJumpSlide() {
		this.setState(this.jumpSlideState(!1));
	}
	jumpSlideState(e) {
		return { isJumpSlide: e };
	}
	commitCurrentIndex() {
		this.syncCurrentActiveSlides(), this.syncAutoHeight(this.currentIndex), this.animationFrame(), this.setState(this.mainState()), this.updateDOM(), this.updateSlider(), this.emitSlideChange();
	}
	syncCurrentActiveSlides() {
		let { useDragFree: e } = this.store;
		if (e) return;
		let t = this.getMaxActiveSlides(), n = this.getPagedActiveIndexes(this.currentIndex, t);
		this.canSyncTargetActiveIndexes(n) && this.mutate.updateActiveSlides(n, n.length);
	}
	canSyncTargetActiveIndexes(e) {
		let t = this.observer?.getVisibleSlideIndexes() || [];
		return t.length === 0 ? !1 : e.every((e) => t.includes(e));
	}
	getPagedActiveIndexes(e, t) {
		return Array.from({ length: t }, (t, n) => e + n).filter((e) => e >= 0 && e < this.slides.length);
	}
	resolveIndexFromTranslate(e) {
		let { gap: t } = this.store, n = t || 0, r = Math.abs(e), i = this.getResolvedIndexFromRemainingTranslate(r, n);
		return this.getSafeSlideIndex(i);
	}
	getResolvedIndexFromRemainingTranslate(e, t) {
		let n = e, r = 0;
		for (let e = 0; e < this.slides.length; e++) {
			let i = this.getSlideWidthWithGap(e, t);
			if (n < i) {
				r = e;
				break;
			}
			n -= i, r = e + 1;
		}
		return r;
	}
	getSlideWidthWithGap(e, t) {
		return (this.slides[e]?.offsetWidth ?? 0) + t;
	}
	getSafeSlideIndex(e) {
		return Math.max(0, Math.min(e, this.slides.length - 1));
	}
	mainState() {
		let e = this.calcTranslateForIndex(this.currentIndex), t = this.safeTranslate(e);
		return {
			slideIndex: this.currentIndex,
			prevTranslate: -t,
			currentTranslate: -t
		};
	}
	animationFrame() {
		let { useDragFree: e } = this.store;
		if (e) {
			this.runDragFreeAnimation();
			return;
		}
		this.runPagedAnimation();
	}
	runDragFreeAnimation() {
		this.animation.init().then(() => {});
	}
	runPagedAnimation() {
		let e = this.getMaxActiveSlides(), t = null;
		this.animation.init({
			onStart: () => {
				t = this.startActiveSlidesSync(e);
			},
			onEnd: () => {
				t = this.stopActiveSlidesSync(t);
			}
		}).then(() => {});
	}
	startActiveSlidesSync(e) {
		return window.setInterval(() => {
			this.syncActiveSlides(e);
		}, 10);
	}
	stopActiveSlidesSync(e) {
		return e !== null && clearInterval(e), null;
	}
	syncActiveSlides(e) {
		let t = this.observer?.getVisibleSlideIndexes() || [];
		this.mutate.updateActiveSlides(t, e);
	}
	getMaxActiveSlides() {
		let { slidesPerView: e, slidesPerPage: t } = this.store;
		return Math.max(1, Math.min(e, t));
	}
	clampFreeTranslate(e) {
		let { sliderWidth: t } = this.store, n = this.getTotalWidth() - (t ?? 0), r = -Math.max(0, n);
		return e > 0 ? 0 : e < r ? r : e;
	}
	getDragFreeOffset() {
		let { sliderWidth: e } = this.store;
		return (e ?? this.sliderWidth ?? 0) * .85;
	}
	getDragFreeActiveIndexes(e) {
		let t = this.getMaxActiveSlides();
		return Array.from({ length: t }, (t, n) => e + n).filter((e) => e >= 0 && e < this.slides.length);
	}
	emitSlideChange() {
		let { slideIndex: e, activePage: t } = this.store;
		this.emit(s.SLIDE_CHANGE, {
			rootSelector: this.$root,
			slideIndex: e,
			activePage: t
		});
	}
	getInitialIndexFromClones() {
		let e = 0, n = T(this.$root);
		for (let r = 0; r < n.length; r++) {
			let i = n[r];
			if (O(i, t.CLONED)) e++;
			else break;
		}
		return e;
	}
}, pe = class extends U {
	$root;
	slider;
	lastClickTimestamps = [];
	lastTouchArrowTimestamp = 0;
	constructor(e) {
		super(e), this.$root = e, this.slider = new X(this.$root);
	}
	init() {
		let e = this.getArrowButtons();
		this.bindArrowEvents(e), new G(this.$root).sync();
	}
	getArrowButtons() {
		return v(e.ARROW.map((e) => `${this.$root} .${e}`).join(", "));
	}
	bindArrowEvents(e) {
		this.forEachButton(e, (e) => {
			I([o.POINTERDOWN], e, (t) => this.handleArrowPointerDown(t, e)), I([o.CLICK], e, (t) => this.handleArrowClick(t, e));
		});
	}
	handleArrowPointerDown(e, t) {
		(e.pointerType === "touch" || e.pointerType === "pen") && (e.preventDefault(), this.lastTouchArrowTimestamp = Date.now(), this.handleArrowInteraction(t));
	}
	handleArrowClick(e, t) {
		this.shouldIgnoreSyntheticTouchClick(e) || this.handleArrowInteraction(t);
	}
	shouldIgnoreSyntheticTouchClick(e) {
		return Date.now() - this.lastTouchArrowTimestamp < a.DEFAULT_TRANSITION_TIME ? (e.preventDefault(), !0) : !1;
	}
	handleArrowInteraction(e) {
		let t = this.setTime();
		e.disabled || (this.scheduleClickSpeedUpdate(t), this.arrowHandler(e, this.$root));
	}
	scheduleClickSpeedUpdate(e) {
		setTimeout(() => {
			this.updateClickSpeed();
		}, e);
	}
	updateClickSpeed() {
		let e = Date.now(), t = this.hasEnoughClickSamplesAfterNextClick(), n = this.createFastNavigationState(e);
		t && (this.registerClickTimestamp(e), this.setFastNavigationState(n));
	}
	createFastNavigationState(e) {
		let t = this.getAverageClickDelta(e);
		return this.getFastNavigationState(t);
	}
	getFastNavigationState(e) {
		return { isFastNavigation: e < a.DEFAULT_TRANSITION_TIME - a.FAST_NAVIGATION_OFFSET };
	}
	setFastNavigationState(e) {
		this.setState(e);
	}
	hasEnoughClickSamplesAfterNextClick() {
		return this.lastClickTimestamps.length + 1 >= 3;
	}
	registerClickTimestamp(e) {
		this.lastClickTimestamps.push(e), this.trimClickTimestamps();
	}
	trimClickTimestamps() {
		this.lastClickTimestamps.length <= 3 || this.lastClickTimestamps.shift();
	}
	getAverageClickDelta(e) {
		let t = e ? [...this.lastClickTimestamps, e] : this.lastClickTimestamps, n = t.slice(1).map((e, n) => e - t[n]);
		return n.reduce((e, t) => e + t, 0) / n.length;
	}
	setTime() {
		let e = T(this.$root, !1).length;
		return this.getTime(e) ? a.DEFAULT_TRANSITION_TIME - a.FAST_NAVIGATION_OFFSET : 0;
	}
	getTime(e) {
		let { activePage: t, numberOfPages: n } = this.store, r = t >= n - 1, i = this.hasRemaining(e), a = !!this.store.isFastNavigation;
		return r && i && a;
	}
	getArrowEventType(e) {
		return this.getExplicitArrowType(e) || this.getFallbackArrowType(e);
	}
	getExplicitArrowType(t) {
		if (this.matchesArrowClass(t, e.ARROW_PREV)) return r.PREV;
		if (this.matchesArrowClass(t, e.ARROW_NEXT)) return r.NEXT;
	}
	matchesArrowClass(e, t) {
		return t.some((t) => O(e, t));
	}
	getFallbackArrowType(e) {
		let t = this.getScopedArrowButtons();
		return this.getArrowButtonIndex(t, e) <= 0 ? r.PREV : r.NEXT;
	}
	getScopedArrowButtons() {
		let t = w(this.$root);
		if (!t) return [];
		let n = e.ARROW.map((e) => `.${e}`).join(", ");
		return Array.from(v(n, t));
	}
	getArrowButtonIndex(e, t) {
		return e.indexOf(t);
	}
	arrowHandler(e, t) {
		let { slideIndex: n, useDragFree: r } = this.store, i = this.getArrowEventType(e);
		if (r) {
			this.handleFreeArrowNavigation(n, i);
			return;
		}
		this.handlePagedArrowNavigation(n, t, i);
	}
	applyArrowNavigationState(e, t) {
		let n = this.getArrowSlideMovement(t), r = this.getArrowNavigationState(e, t);
		this.applyArrowSlideMovementState(n), this.enableMovement(), this.applyArrowStartPosState(), this.applyArrowNavigationTargetState(r);
	}
	getArrowSlideMovement(e) {
		return F(e);
	}
	getArrowNavigationState(e, t) {
		return {
			prevSlideIndex: e,
			currentEventType: t
		};
	}
	applyArrowSlideMovementState(e) {
		this.setState({ currentSlideMovement: e });
	}
	enableMovement() {
		this.movement = !0;
	}
	applyArrowStartPosState() {
		let e = this.startPosState();
		this.setState(e);
	}
	applyArrowNavigationTargetState(e) {
		this.setState(e);
	}
	runFreeArrowNavigation(e) {
		this.slider.goToFreeDirection(e);
	}
	runPagedArrowNavigation(e, t) {
		this.slider.setSlideTarget({
			$root: e,
			from: t
		});
	}
	handleFreeArrowNavigation(e, t) {
		this.applyArrowNavigationState(e, t), this.runFreeArrowNavigation(t);
	}
	handlePagedArrowNavigation(e, t, n) {
		this.applyArrowNavigationState(e, n), this.runPagedArrowNavigation(t, n);
	}
	evalSlideConditions() {
		let { slideIndex: e, slidesPerPage: t } = this.store;
		return {
			FIRST: e === 0,
			LAST: e === Math.ceil(this.childrenCount / t) - 1
		};
	}
	startPosState() {
		return { startPos: Infinity };
	}
}, Z = class extends U {
	slider;
	containerDots;
	slides;
	constructor(e) {
		super(e), this.slider = new X(e), this.containerDots = x(e), this.slides = T(e);
	}
	init() {
		this.createDots(), this.eventMount();
	}
	calculateDots() {
		let { slidesPerView: e, slidesPerPage: t, useLoop: n } = this.store, r = this.getActualSlideCount(), i = this.getTotalPages(n, r, t, e);
		return this.canCalculateDots(r, t, e) ? this.getSafeTotalPages(i) : 0;
	}
	getTotalPages(e, t, n, r) {
		return e ? this.getLoopTotalPages(t, n) : this.getPagedTotalPages(t, n, r);
	}
	getActualSlideCount() {
		return this.slides.filter((e) => !O(e, t.CLONED)).length;
	}
	canCalculateDots(e, t, n) {
		return e > 0 && t > 0 && n > 0;
	}
	getLoopTotalPages(e, t) {
		return Math.ceil(e / t);
	}
	getPagedTotalPages(e, t, n) {
		return Math.ceil((e - n) / t) + 1;
	}
	getSafeTotalPages(e) {
		return Math.max(1, e);
	}
	createDots() {
		let e = this.calculateDots(), t = this.canRenderDots(), n = this.paginationState(e), r = t ? this.getTemplateDot() : void 0, i = this.canCreateDots(t, r);
		this.applyPaginationState(n, e), i && (this.renderDots(r, e), this.setInitialActiveDot());
	}
	applyPaginationState(e, t) {
		this.setState(e), this.setState(this.numOfSlidesState(t));
	}
	canCreateDots(e, t) {
		return e && !!t;
	}
	paginationState(e) {
		let { dotIndex: t } = this.store, n = this.getSafeDotIndex(t, e);
		return {
			numberOfPages: e,
			dotIndex: n,
			activePage: n
		};
	}
	getSafeDotIndex(e, t) {
		return Math.max(0, Math.min(e ?? 0, Math.max(0, t - 1)));
	}
	canRenderDots() {
		let { dots: e } = this.store;
		return !!e && !!this.containerDots;
	}
	getExistingDots() {
		return v(n.LI, this.containerDots);
	}
	getTemplateDot() {
		let e = this.getExistingDots();
		if (e.length !== 0) return e[0].cloneNode(!0);
	}
	renderDots(e, t) {
		this.clearExistingDots();
		for (let n = 0; n < t; n++) {
			let t = e.cloneNode(!0);
			_(this.containerDots, t);
		}
	}
	clearExistingDots() {
		let e = this.getExistingDots();
		Array.from(e).forEach((e) => te(e));
	}
	setInitialActiveDot() {
		this.getExistingDots().forEach((e, t) => {
			this.toggleDotState(e, t === 0);
		});
	}
	toggleDotState(e, t) {
		if (t) {
			this.activateDot(e);
			return;
		}
		this.deactivateDot(e);
	}
	activateDot(n) {
		h([n], t.SELECTED), h([n], e.DOT_ACTIVE[0]);
	}
	deactivateDot(n) {
		k(n, [t.SELECTED, e.DOT_ACTIVE[0]]);
	}
	dotHandler(e) {
		this.setState(this.currentEventType()), this.movement = !0, this.slider.goToDotIndex(e), this.slider.updateSlider();
	}
	numOfSlidesState(e) {
		return { numberOfSlides: e };
	}
	eventMount() {
		let { dots: e } = this.store, t = this.getDotElements();
		e && this.containerDots && this.bindDotEvents(t);
	}
	getDotElements() {
		return v(n.LI, this.containerDots);
	}
	bindDotEvents(e) {
		this.forEachDot(e, (e, t) => this.handleClick(e, t));
	}
	forEachDot(e, t) {
		e.forEach((e, n) => t(e, n));
	}
	getDotTargetIndex(e) {
		let { slidesPerPage: t, slidesPerView: n, useLoop: r } = this.store, i = this.getRealSlides().length, a = this.getStepSize(t);
		return r ? this.getLoopDotTargetIndex(e, a, i) : this.getPagedDotTargetIndex(a, n, i, e);
	}
	getRealSlides() {
		return this.slides.filter((e) => !O(e, t.CLONED));
	}
	getStepSize(e) {
		return e || 1;
	}
	getLoopDotTargetIndex(e, t, n) {
		return Math.min(e * t, n - 1) + this.slider.getInitialIndexFromClones();
	}
	getPagedDotTargetIndex(e, t, n, r) {
		let i = Math.max(n - (t || 1), 0);
		return this.getPagedPositions(e, i)[r] ?? i;
	}
	getPagedPositions(e, t) {
		let n = [];
		for (let r = 0; r <= t; r += e) n.push(r);
		return n.includes(t) || n.push(t), n;
	}
	handleClick(e, t) {
		I([o.CLICK], e, () => {
			let e = this.getDotTargetIndex(t);
			this.setState(this.slideIndexState(e)), this.dotHandler(e);
		});
	}
	currentEventType() {
		return { currentEventType: r.DOTS };
	}
	slideIndexState(e) {
		return { slideIndex: e };
	}
	numberOfSlidesState() {
		let { useLoop: e, slidesPerPage: t } = this.store, { $children: n } = this;
		return { numberOfSlides: ne(e, t, n) };
	}
}, me = class extends U {
	resizeObserver = null;
	onResize;
	lastObservedWidth = null;
	lastObservedViewportWidth = null;
	hasWindowListener = !1;
	resizeFrame = null;
	constructor(e) {
		super(e), this.sliderWidth = E(this.$children);
	}
	init(e) {
		this.onResize = e, this.observe(), this.listenWindowResize(), this.applyResponsiveState(), this.onResize?.();
	}
	observe() {
		let e = this.getRootSelector ?? this.$children;
		this.resizeObserver || !e || (this.resizeObserver = new ResizeObserver(() => this.handleSizeChange()), this.lastObservedWidth = E(this.$children) ?? 0, this.lastObservedViewportWidth = this.getViewportWidth(), this.resizeObserver.observe(e));
	}
	listenWindowResize() {
		this.hasWindowListener || (this.enableWindowListener(), this.bindWindowResize());
	}
	enableWindowListener() {
		this.hasWindowListener = !0;
	}
	bindWindowResize() {
		I([o.RESIZE], window, () => this.scheduleWindowResize());
	}
	scheduleWindowResize() {
		this.hasPendingResizeFrame() && this.cancelResizeFrame(), this.resizeFrame = requestAnimationFrame(() => {
			this.clearResizeFrame(), this.handleSizeChange();
		});
	}
	hasPendingResizeFrame() {
		return this.resizeFrame !== null;
	}
	cancelResizeFrame() {
		this.resizeFrame !== null && cancelAnimationFrame(this.resizeFrame);
	}
	clearResizeFrame() {
		this.resizeFrame = null;
	}
	handleSizeChange() {
		let e = E(this.$children) ?? 0, t = this.getViewportWidth(), n = this.lastObservedWidth !== e, r = this.lastObservedViewportWidth !== t;
		!n && !r || (this.lastObservedWidth = e, this.lastObservedViewportWidth = t, this.applyResponsiveState(), this.onResize?.());
	}
	applyResponsiveState() {
		let e = E(this.$children) ?? 0, t = this.getViewportWidth(), n = this.getResponsiveState(t);
		this.setState({
			sliderWidth: e,
			...n
		});
	}
	getViewportWidth() {
		return typeof window > "u" ? 0 : window.innerWidth;
	}
	getResponsiveState(e) {
		let t = this.getResponsiveContext(e), n = this.getResponsiveSlideCounts(t.matchedConfig, t.baseSlidesPerView, t.baseSlidesPerPage, t.totalSlides), r = this.getResponsiveSlideSizes(t.matchedConfig, t.baseSlideSizes), i = this.getResponsiveSlideIndex(t.totalSlides, n.slidesPerView, n.slidesPerPage);
		return this.createResponsiveState(n.slidesPerView, n.slidesPerPage, r, i, t.activeBreakpoint);
	}
	getResponsiveContext(e) {
		let { screens: t, responsive: n, baseSlidesPerView: r, baseSlidesPerPage: i, baseSlideSizes: a } = this.store, o = t, s = n, c = this.getActiveBreakpoint(e, o, s);
		return {
			activeBreakpoint: c,
			baseSlideSizes: a,
			baseSlidesPerPage: i,
			baseSlidesPerView: r,
			matchedConfig: this.getMatchedResponsiveConfig(c, s),
			totalSlides: T(this.$root, !1).length
		};
	}
	getResponsiveSlideCounts(e, t, n, r) {
		let i = this.getResponsiveSlidesPerView(e, t, r);
		return {
			slidesPerPage: this.getResponsiveSlidesPerPage(e, n, r),
			slidesPerView: i
		};
	}
	createResponsiveState(e, t, n, r, i) {
		return {
			slidesPerView: e,
			slidesPerPage: t,
			slideSizes: n,
			slideIndex: r,
			activeBreakpoint: i ?? "base"
		};
	}
	getMatchedResponsiveConfig(e, t) {
		if (!(!e || !t)) return t[e];
	}
	getResponsiveSlidesPerView(e, t, n) {
		let r = e?.useSlidesPerView === !1 ? t : e?.slidesPerView ?? t;
		return this.clampSlideCount(r, n);
	}
	getResponsiveSlidesPerPage(e, t, n) {
		let r = e?.useSlidesPerPage === !1 ? t : e?.slidesPerPage ?? t;
		return this.clampSlideCount(r, n);
	}
	getResponsiveSlideSizes(e, t) {
		return e?.useSlideSizes === !1 ? {} : e?.slideSizes && Object.keys(e.slideSizes).length > 0 ? e.slideSizes : t;
	}
	getResponsiveSlideIndex(e, t, n) {
		let { slideIndex: r, useLoop: i } = this.store, a = this.getCurrentResponsiveSlideIndex(r), o = this.getValidPositions(e, t, n);
		return i ? this.getLoopResponsiveSlideIndex(a) : o.length === 0 ? 0 : this.getClosestResponsiveSlideIndex(a, o);
	}
	getCurrentResponsiveSlideIndex(e) {
		return typeof e == "number" ? e : 0;
	}
	getLoopResponsiveSlideIndex(e) {
		return Math.max(0, e);
	}
	getClosestResponsiveSlideIndex(e, t) {
		return t.reduce((t, n) => Math.abs(n - e) < Math.abs(t - e) ? n : t, t[0]);
	}
	getValidPositions(e, t, n) {
		let r = Math.max(e - t, 0), i = Math.max(1, n), a = [];
		for (let e = 0; e <= r; e += i) a.push(e);
		return a.includes(r) || a.push(r), a;
	}
	getActiveBreakpoint(e, t, n) {
		let r = this.hasResponsiveConfig(t, n), i = this.getOrderedBreakpoints(t, n);
		return r ? this.resolveActiveBreakpoint(e, i) : null;
	}
	hasResponsiveConfig(e, t) {
		return !!e && Object.keys(e).length > 0 && !!t && Object.keys(t).length > 0;
	}
	getOrderedBreakpoints(e, t) {
		return !e || !t ? [] : Object.entries(e).filter(([e, n]) => this.isConfiguredBreakpoint(e, n, t)).sort(([, e], [, t]) => Number(e) - Number(t));
	}
	isConfiguredBreakpoint(e, t, n) {
		return n[e] !== void 0 && typeof t == "number";
	}
	resolveActiveBreakpoint(e, t) {
		return t.reduce((t, [n, r]) => e >= r ? n : t, null);
	}
	clampSlideCount(e, t) {
		return t <= 0 ? 1 : Math.max(1, Math.min(e, t));
	}
}, he = class extends U {
	slides;
	clonedSlides;
	mount;
	dataIndex;
	totalWidthBefore;
	slidesBefore = [];
	slider;
	constructor(e) {
		super(e), this.slides = [], this.slider = new X(e), this.clonedSlides = [], this.dataIndex = "0", this.totalWidthBefore = 0, this.slidesBefore = [];
	}
	init() {
		this.duplicateSlides(), this.setState(this.slidePositionState()), this.setTranslate();
	}
	duplicateSlides() {
		let { $root: e, childrenCount: t } = this, { slidesPerView: n } = this.store, r = this.getCloneQuantity();
		t < n || (this.slides = T(e), this.loopByClonedSlides(r, t));
	}
	getCloneQuantity() {
		let { slidesPerPage: e, slidesPerView: t } = this.store, n = this.getMaxResponsiveSlideCount(), r = Math.max(t, n), i = Math.max(e, n);
		return r < i ? i : r * 2;
	}
	getMaxResponsiveSlideCount() {
		let { responsive: e } = this.store, t = e;
		return t ? Object.values(t).reduce((e, t) => {
			let n = this.getResponsiveCloneCount(t);
			return Math.max(e, n);
		}, 0) : 0;
	}
	getResponsiveCloneCount(e) {
		return Math.max(e?.slidesPerPage ?? 0, e?.slidesPerView ?? 0);
	}
	loopByClonedSlides(e, t) {
		let n = [...Array(e).keys()], r = [...Array(e).keys()].map((e) => t - e - 1).reverse();
		this.mountClonedSlides(n, r);
	}
	slidePositionState() {
		let { useLoop: e } = this.store, t = this.calcTranslate();
		return {
			currentTranslate: t,
			prevTranslate: t,
			slideIndex: e ? this.slider.getInitialIndexFromClones() : 0,
			isInitialRender: !1
		};
	}
	mountClonedSlides(e, t) {
		for (let e of t) this.mountStartClone(e);
		for (let t of e) this.mountEndClone(t);
		this.syncSlideNumbers(), this.mount = new Q(this.$root), this.mount.setSlidesWidth();
	}
	mountStartClone(e) {
		let t = this.createClonedSlide(e);
		ee(this.$children, t, this.slides[0]), this.clonedSlides.push(t);
	}
	mountEndClone(e) {
		let t = this.createClonedSlide(e);
		_(this.$children, t), this.clonedSlides.push(t);
	}
	createClonedSlide(e) {
		let n = this.slides[e], r = n.cloneNode(!0);
		return h([r], t.CLONED), this.syncCloneDataIndex(r, n), r;
	}
	syncCloneDataIndex(e, t) {
		let n = t.getAttribute(i.DATA_INDEX);
		j(e, i.DATA_INDEX, n);
	}
	syncSlideNumbers() {
		this.getMountedSlides().forEach((e, t) => {
			j(e, i.DATA_NUMBER, String(t + 1));
		});
	}
	getMountedSlides() {
		return T(this.$root);
	}
	calcTranslate() {
		let e = T(this.$root), { gap: t } = this.store;
		return this.checkDataIndex(e), this.setTotalWidth(t), -this.totalWidthBefore;
	}
	checkDataIndex(e) {
		this.slidesBefore = [];
		for (let t of e) if (this.dataIndex = t.getAttribute("data-index"), this.dataIndex !== "1") this.slidesBefore.push(t);
		else break;
	}
	setTotalWidth(e) {
		this.totalWidthBefore = this.slidesBefore.reduce((t, n) => t + n.offsetWidth + e, 0);
	}
	setTranslate() {
		this.animate(this.$children, this.keyFrames(), this.options());
	}
}, ge = class e extends U {
	static TOUCH_MOVE_ACTIONS = {
		DRAG_FREE: "dragFree",
		SWIPE: "swipe",
		FALLBACK: "fallback"
	};
	animation;
	slider;
	moveSlider;
	constructor(e) {
		super(e), this.slider = new X(this.$root), this.slides = T(this.$root), this.animation = new q(this.$root), this.moveSlider = 0;
	}
	init = (e) => {
		this.nextAction(e);
	};
	nextAction(e) {
		let t = this.shouldBeEqual(e), n = this.shouldNotBeSwipe(), r = this.shouldBeEqual(e);
		n || (r ? this.setTargetCondition()[t] : this.action());
	}
	shouldBeEqual(e) {
		return Object.keys(this.evalSwipeConditions(e)).find((t) => this.evalSwipeConditions(e)[t]);
	}
	shouldNotBeSwipe() {
		let { currentEventType: e } = this.store;
		return e !== o.TOUCHMOVE;
	}
	evalSwipeConditions(e) {
		return { FIRST: e?.type === o.MOUSELEAVE };
	}
	setTargetCondition() {
		return {
			FIRST: B(a.SWIPE_MOUSE_LEAVE_DELAY, () => this.action()),
			SECOND: B(0, () => this.action())
		};
	}
	action() {
		let e = { endTime: Date.now() };
		this.setState(e), this.setState(this.eventTargetState()), this.handleTouchMove(), this.setState(this.mainState());
	}
	mainState() {
		return {
			isDragging: !1,
			isMouseLeave: !0,
			isTouch: !1
		};
	}
	getTouchLimit(e) {
		let { startTime: t, endTime: n } = this.store, r = Math.max(0, n - t), i = Math.abs(e) / Math.max(1, r), a = this.hasTouchTiming(t, n), o = this.isFastSwipe(r, i);
		return !a || o ? 0 : this.getAdaptiveTouchLimit(i);
	}
	hasTouchTiming(e, t) {
		return !!e && !!t;
	}
	isFastSwipe(e, t) {
		return e <= f.FAST_SWIPE_MAX_MS || t >= f.FAST_VELOCITY_THRESHOLD;
	}
	getAdaptiveTouchLimit(e) {
		let t = this.getTouchSpeedRatio(e), n = this.getTouchThreshold(t);
		return this.clampTouchLimit(n);
	}
	getTouchSpeedRatio(e) {
		let t = (f.FAST_VELOCITY_THRESHOLD - e) / f.FAST_VELOCITY_THRESHOLD;
		return Math.min(1, Math.max(0, t));
	}
	getTouchThreshold(e) {
		let t = f.MAX_LIMIT - f.SLOW_LIMIT;
		return f.SLOW_LIMIT + Math.round(e * t);
	}
	clampTouchLimit(e) {
		return Math.min(f.MAX_LIMIT, Math.max(f.SLOW_LIMIT, e));
	}
	handleTouchMove() {
		let e = this.getTouchMoveContext();
		this.applyTouchMoveSetup(e.moveSlider, e.slideIndex), this.handleTouchMoveAction(e);
	}
	handleDragFreeTouchEnd(e, t, n) {
		let r = this.getTouchMovementState(), i = n + this.moveSlider * f.DRAG_FREE_SETTLE_FACTOR;
		this.applyTouchMovementState(r), this.handleDragFreeTouchEndCommit(e, t, i);
	}
	applyTouchMoveSetup(e, t) {
		this.setMoveSlider(e), this.applyPrevSlideState(t);
	}
	setMoveSlider(e) {
		this.moveSlider = e;
	}
	handleTouchMoveAction(e) {
		let { useDragFree: t, isTouch: n, isMouseLeave: r, currentTranslate: i, swipeDirection: a, movementState: o } = e, s = this.getTouchMoveAction(t, a);
		this.runTouchMoveAction(s, n, r, i, a, o);
	}
	getTouchMoveContext() {
		let { isMouseLeave: e, isTouch: t, slideIndex: n, currentTranslate: r, prevTranslate: i, useDragFree: a } = this.store, o = r - i, s = this.getTouchMovementState(), c = this.actionsMove(o);
		return {
			slideIndex: n,
			currentTranslate: r,
			moveSlider: o,
			useDragFree: a,
			isTouch: t,
			isMouseLeave: e,
			swipeDirection: this.getSwipeDirection(c),
			movementState: s
		};
	}
	shouldHandleDragFreeTouchEnd(e) {
		return e;
	}
	getTouchMoveAction(t, n) {
		let r = this.shouldHandleDragFreeTouchEnd(t), i = this.shouldHandleSwipeNavigation(n);
		return r ? e.TOUCH_MOVE_ACTIONS.DRAG_FREE : i ? e.TOUCH_MOVE_ACTIONS.SWIPE : e.TOUCH_MOVE_ACTIONS.FALLBACK;
	}
	runTouchMoveAction(t, n, r, i, a, o) {
		if (t === e.TOUCH_MOVE_ACTIONS.DRAG_FREE) {
			this.runDragFreeTouchEnd(n, r, i);
			return;
		}
		if (t === e.TOUCH_MOVE_ACTIONS.SWIPE) {
			this.runSwipeNavigation(a);
			return;
		}
		this.handleTouchMoveFallback(n, r, o);
	}
	runDragFreeTouchEnd(e, t, n) {
		this.handleDragFreeTouchEnd(e, t, n);
	}
	shouldHandleSwipeNavigation(e) {
		return e !== null;
	}
	runSwipeNavigation(e) {
		e && this.handleSwipeNavigation(e);
	}
	applyTouchMovementState(e) {
		this.setState(e);
	}
	handleDragFreeTouchEndCommit(e, t, n) {
		this.shouldCommitDragFreeTouchEnd(e, t) && this.commitDragFreeTouchEnd(n);
	}
	shouldCommitDragFreeTouchEnd(e, t) {
		return e && !t;
	}
	commitDragFreeTouchEnd(e) {
		this.slider.commitFreeTranslate(e), this.cancelAnimationFrame(), this.disableMovement();
	}
	navigateBySwipeDirection(e) {
		let { slideIndex: t } = this.store, n = F(e), r = this.calcTranslate(), i = this.getSwipeNavigationState(t, r, n);
		this.applySwipeNavigationState(i), this.navigateToSwipeTarget(e);
	}
	getSwipeNavigationState(e, t, n) {
		return {
			prevSlideIndex: e,
			currentTranslate: -t,
			prevTranslate: -t,
			currentSlideMovement: n,
			currentEventType: o.TOUCHEND
		};
	}
	applySwipeNavigationState(e) {
		this.setState(e);
	}
	navigateToSwipeTarget(e) {
		this.slider.setSlideTarget({
			from: e,
			$root: this.$root
		});
	}
	actionsMove(e) {
		let { slideIndex: t } = this.store, { slides: n } = this;
		return {
			isNext: this.goToNextSlide(e, t, n),
			isPrev: this.goToPrevSlide(e, t)
		};
	}
	getSwipeDirection(e) {
		let { isNext: t, isPrev: n } = e;
		return t ? r.NEXT : n ? r.PREV : null;
	}
	handleSwipeNavigation(e) {
		this.navigateBySwipeDirection(e), this.cancelAnimationFrame(), this.enableMovement();
	}
	handleTouchMoveFallback(e, t, n) {
		if (!this.shouldCommitTouchMoveFallback(e, t)) {
			this.applyTouchMovementState(n);
			return;
		}
		this.applyTouchMovementState(n), this.commitTouchMoveFallback();
	}
	shouldCommitTouchMoveFallback(e, t) {
		return e && !t;
	}
	commitTouchMoveFallback() {
		this.setPosition(), this.cancelAnimationFrame(), this.disableMovement();
	}
	keyFrames() {
		let { currentTranslate: e } = this.store;
		return [{ transform: z(e) }];
	}
	getSpeedInteraction() {
		let { startTime: e, endTime: t } = this.store;
		return Math.abs(e - t);
	}
	cancelAnimationFrame() {
		let { animationId: e } = this.store;
		typeof e == "number" && cancelAnimationFrame(e);
	}
	goToNextSlide(e, t, n) {
		let r = this.getTouchLimit(e), i = e < -this.sliderWidth * r / 100, a = t < n.length - 1;
		return i && a;
	}
	goToPrevSlide(e, t) {
		let n = this.getTouchLimit(e);
		return e > this.sliderWidth * n / 100 && t > 0;
	}
	setPosition() {
		let { slideIndex: e } = this.store, t = this.calcTranslate(), n = this.getTouchEndTranslateState(t);
		this.applyTouchEndTranslateState(n), this.navigateToTouchEndTarget(e);
	}
	getTouchEndTranslateState(e) {
		return {
			currentTranslate: -e,
			prevTranslate: -e
		};
	}
	applyTouchEndTranslateState(e) {
		this.setState(e);
	}
	navigateToTouchEndTarget(e) {
		this.slider.setSlideTarget({
			from: "touchend",
			touchIndex: e,
			$root: this.$root
		});
	}
	getTouchMovementState() {
		return { currentSlideMovement: null };
	}
	applyPrevSlideState(e) {
		let t = this.prevSlideState(e);
		this.setState(t);
	}
	enableMovement() {
		this.movement = !0;
	}
	disableMovement() {
		this.movement = !1;
	}
	prevSlideState(e) {
		return { prevSlideIndex: e };
	}
	eventTargetState() {
		return { currentEventType: o.TOUCHEND };
	}
}, _e = class extends U {
	currentPosition;
	previousPosition;
	skipSlide;
	currentIndex;
	translate;
	animation;
	constructor(e) {
		super(e), this.currentPosition = 0, this.previousPosition = 0, this.currentIndex = 0, this.translate = 0, this.skipSlide = !1, this.animation = new q(e);
	}
	init(e) {
		let { isDragging: t } = this.store;
		t && (this.updatePosition(e), this.setState(this.eventTargetState()), this.setState(this.skipSlide ? this.infiniteState() : this.mainState()));
	}
	updatePosition(e) {
		this.previousPosition = this.currentPosition, this.currentPosition = P(e);
	}
	eventTargetState() {
		return { currentEventType: o.TOUCHMOVE };
	}
	infiniteState() {
		let { currentIndex: e, translate: t } = this;
		return {
			slideIndex: e,
			prevTranslate: t
		};
	}
	mainState() {
		let { prevTranslate: e, startPos: t } = this.store, { currentPosition: n } = this;
		return {
			isTouch: !0,
			isMouseLeave: !1,
			currentTranslate: e + n - t,
			animationID: requestAnimationFrame(() => this.animation.init())
		};
	}
	movingTo(e) {
		let { currentTranslate: t } = this.store, n = Math.abs(t), r = Math.abs(this.sliderWidth * 3 / 100 - this.sliderWidth);
		return e === p.RIGHT ? n <= r : n >= r;
	}
}, ve = class extends U {
	animation;
	constructor(e) {
		super(e), this.animation = new q(e);
	}
	init() {
		this.setDragListeners(this.params());
	}
	params() {
		let { dragStart: e } = this;
		return {
			element: this.getRootSelector,
			dragStart: e.bind(this)
		};
	}
	setDragListeners(e) {
		let { dragStart: t } = e, n = this.getRootSelector;
		I([o.MOUSEDOWN, o.TOUCHSTART], n, t);
	}
	dragStart(e) {
		if (!N(e)) return;
		let t = this.defineEventTarget(e).clientX, n = this.defineEventTarget(e).clientY, r = [o.MOUSEMOVE, o.TOUCHMOVE], i = [o.MOUSEUP, o.TOUCHEND];
		this.setState(this.axisState(t, n)), I(r, document, this.handleMove), I(i, document, this.handleEnd), e.preventDefault();
	}
	handleMove = (e) => {
		let { isDragging: t, startX: n } = this.store, r = this.defineEventTarget(e).clientX;
		t || Math.abs(r - n) > 0 && this.setState(this.draggingState(!0));
	};
	handleEnd = () => {
		let e = [o.MOUSEMOVE, o.TOUCHMOVE], t = [o.MOUSEUP, o.TOUCHEND];
		L(e, document, this.handleMove), L(t, document, this.handleEnd), this.setState(this.draggingState(!1));
	};
	axisState(e, t) {
		return {
			startX: e,
			startY: t
		};
	}
	draggingState(e) {
		return { isDragging: e };
	}
}, ye = class extends U {
	draggable;
	constructor(e) {
		super(e), this.draggable = new ve(e);
	}
	init(e) {
		N(e) && (this.handleEvents(), this.setState(this.mainState(e)));
	}
	handleEvents() {
		this.draggable.init();
	}
	mainState(e) {
		let { slideIndex: t } = this.store;
		return {
			currentEventType: o.TOUCHSTART,
			startTime: Date.now(),
			slideIndex: t,
			startPos: P(e),
			isMouseLeave: !1
		};
	}
}, be = class extends U {
	touchStart;
	touchEnd;
	touchMove;
	constructor(e) {
		super(e), this.touchStart = new ye(this.$root), this.touchEnd = new ge(this.$root), this.touchMove = new _e(this.$root);
	}
	init() {
		this.setListeners(this.params());
	}
	params() {
		let { touchStart: e, touchEnd: t, touchMove: n } = this;
		return {
			element: this.$track,
			index: 0,
			touchStart: e.init.bind(e),
			touchEnd: t.init.bind(t),
			touchMove: n.init.bind(n)
		};
	}
	setListeners(e) {
		let { element: t, touchStart: n, touchEnd: r, touchMove: i } = e, a = [o.TOUCHSTART, o.MOUSEDOWN], s = [
			o.TOUCHEND,
			o.MOUSELEAVE,
			o.MOUSEUP
		], c = [o.TOUCHMOVE, o.MOUSEMOVE];
		I(a, t, n), I(s, t, r), I(c, t, i);
	}
}, xe = class extends U {
	constructor(e) {
		super(e);
	}
	init() {
		this.setContextListener(this.params());
	}
	rightClick(e) {
		let t = this.contextMenuState();
		this.setState(t);
	}
	contextMenuState() {
		return {
			currentEventType: r.RIGHT_CLICK,
			isDragging: !1,
			isTouch: !1,
			isMouseLeave: !0
		};
	}
	params() {
		let { rightClick: e } = this;
		return {
			element: this.getRootSelector,
			rightClick: e.bind(this)
		};
	}
	setContextListener(e) {
		let { rightClick: t } = e, n = this.getRootSelector;
		I([o.CONTEXTMENU], n, t);
	}
}, Q = class extends U {
	clonedSlides = [];
	resize;
	clone;
	mutate;
	slider;
	resolvedSlideWidths = /* @__PURE__ */ new Map();
	constructor(e) {
		super(e), this.slides = T(this.$root), this.clone = new he(this.$root), this.resize = new me(this.$root), this.mutate = new Y(e), this.slider = new X(e);
	}
	init() {
		this.setState(this.mountState()), this.normalizeSlidesConfig(), this.setProperties(), this.cloneSlides(), this.appendSlider(), this.handleResize(), this.endMount();
	}
	setProperties() {
		this.slides.forEach((e, t) => {
			le(e, this.setAttr(t));
		});
	}
	normalizeSlidesConfig() {
		let { slidesPerPage: e, slidesPerView: t } = this.store, n = this.getTotalOriginalSlides(), r = this.getNormalizedSlidesConfig(e, t, n);
		t > n && this.setState(this.slidesPerViewState(n)), this.setState(r);
	}
	getTotalOriginalSlides() {
		return this.slides.filter((e) => !O(e, t.CLONED)).length;
	}
	getNormalizedSlidesConfig(e, t, n) {
		return this.canUseOriginalSlidesConfig(e, t, n) ? {
			slidesPerPage: e,
			slidesPerView: t
		} : { slidesPerPage: this.getMaxSlidesPerPage(e, t, n) };
	}
	canUseOriginalSlidesConfig(e, t, n) {
		return t + e <= n;
	}
	getMaxSlidesPerPage(e, t, n) {
		let r = Math.max(1, n - t);
		return Math.min(e, r);
	}
	slidesPerViewState(e) {
		return { slidesPerView: e };
	}
	cloneSlides() {
		let { useLoop: e } = this.store;
		e && (this.clone.init(), this.slides = T(this.$root), this.slider = new X(this.$root));
	}
	setAttr(e) {
		return {
			"data-index": e + 1,
			"data-slide-number": e + 1
		};
	}
	appendSlider() {
		let { $children: e } = this;
		this.clonedSlides.forEach((t) => {
			_(e, t);
		});
	}
	setControls() {
		let { arrows: e, touch: t, useDragFree: n } = this.store, { $root: r } = this;
		r && new xe(r).init(), n || new Z(r).init(), new J(r).init(), new K(r).init(), e && new pe(r).init(), t && new be(r).init();
	}
	keyFrames(e) {
		let t = this.getSlideWidth(e), { gap: n } = this.store;
		return [{
			marginRight: `${n}px`,
			width: t,
			maxWidth: "100%",
			boxSizing: "border-box"
		}];
	}
	getDefaultSlideWidth() {
		let e = this.getAvailableWidth(), t = this.getSlideWidthFromAvailableWidth(e);
		return Math.max(0, t);
	}
	getSlideWidthFromAvailableWidth(e) {
		let { slidesPerView: t } = this.store;
		return e / t;
	}
	getSlideWidth(e) {
		let t = this.slides[e], n = this.getSlidePosition(t, e);
		return this.hasCustomSlideSizes() ? (this.resolvedSlideWidths.has(n) || this.resolveGroupWidths(n), this.resolvedSlideWidths.get(n) ?? `${this.getDefaultSlideWidth()}px`) : `${this.getDefaultSlideWidth()}px`;
	}
	getSlidePosition(e, t) {
		let n = Number(e?.dataset.index);
		return Number.isInteger(n) && n > 0 ? n - 1 : t;
	}
	hasCustomSlideSizes() {
		let { slideSizes: e } = this.store;
		return Object.keys(e ?? {}).length > 0;
	}
	resolveGroupWidths(e) {
		let t = this.getGroupPositions(e), { slideSizes: n } = this.store, r = n ?? {}, i = this.getCustomSlideSizeEntries(t, r);
		if (i.length === 0) return;
		let a = this.getCustomSlideSizeScale(t, i, r), o = this.getFallbackSlideSizePercentage(t, i, r, a), s = this.getAvailableWidth();
		this.setResolvedGroupWidths(t, r, o, a, s);
	}
	getCustomSlideSizeEntries(e, t) {
		return e.filter((e) => typeof t[e] == "number").map((e) => [e, t[e]]);
	}
	getCustomSlideSizeScale(e, t, n) {
		let r = this.getCustomSlideSizeTotal(t), i = this.getMaxCustomSlideSizeBudget(e, n);
		return r > i ? i / r : 1;
	}
	getCustomSlideSizeTotal(e, t = 1) {
		return e.reduce((e, [, n]) => e + n * t, 0);
	}
	getMaxCustomSlideSizeBudget(e, t) {
		let n = this.getFlexibleSlideSizePositions(e, t), r = n.length * this.getDefaultSlotPercentage(e);
		return n.length > 0 ? 100 - r : 100;
	}
	getDefaultSlotPercentage(e) {
		return 100 / Math.max(1, e.length);
	}
	getFallbackSlideSizePercentage(e, t, n, r) {
		let i = this.getFlexibleSlideSizePositions(e, n), a = this.getCustomSlideSizeTotal(t, r), o = Math.max(0, 100 - a);
		return i.length > 0 ? o / i.length : 0;
	}
	getFlexibleSlideSizePositions(e, t) {
		return e.filter((e) => t[e] === void 0);
	}
	setResolvedGroupWidths(e, t, n, r, i) {
		e.forEach((e) => {
			let a = t[e], o = a === void 0 ? n : a * r;
			this.resolvedSlideWidths.set(e, `${i * o / 100}px`);
		});
	}
	getGroupPositions(e) {
		let { slidesPerView: t } = this.store, n = t || 1, r = T(this.$root, !1).length, i = Math.floor(e / n) * n, a = Math.min(i + n, r);
		return Array.from({ length: Math.max(0, a - i) }, (e, t) => i + t);
	}
	getAvailableWidth() {
		let { gap: e, slidesPerView: t, sliderWidth: n } = this.store, r = Math.max(0, (t - 1) * e);
		return Math.max(0, n - r);
	}
	mountState() {
		let { $children: e } = this, t = E(e);
		return this.sliderWidth = t, {
			sliderWidth: t,
			numberOfSlides: C(e)
		};
	}
	handleResize() {
		this.resize.init(() => this.syncSlidesWidthOnResize());
	}
	syncSlidesWidthOnResize() {
		this.normalizeSlidesConfig();
		let e = this.getPreservedSlideIndexOnResize(), t = {
			...this.mountState(),
			slideIndex: e
		};
		this.setState(t), this.applyResolvedWidthsOnResize(), B(0, () => this.applyResolvedWidthsOnResize());
	}
	getPreservedSlideIndexOnResize() {
		let { slideIndex: e } = this.store;
		return typeof e == "number" ? e : 0;
	}
	applyResolvedWidthsOnResize() {
		this.resolvedSlideWidths.clear(), this.setSlidesWidth(), this.syncTranslateOnResize(), this.syncAutoHeight(), this.syncPaginationOnResize();
	}
	syncTranslateOnResize() {
		let e = this.calcTranslateFromCurrentIndex(), t = {
			prevTranslate: -e,
			currentTranslate: -e
		};
		this.setState(t), this.animate(this.$children, super.keyFrames(-e), this.options(0)), this.setActiveSlides();
	}
	syncPaginationOnResize() {
		new Z(this.$root).init(), new K(this.$root).init(), this.slider = new X(this.$root), this.slider.updateSlider();
	}
	calcTranslateFromCurrentIndex() {
		let { gap: e, slideIndex: t } = this.store, n = e || 0, r = typeof t == "number" ? t : 0, i = 0, a = [];
		for (let e = 0; e < r; e++) {
			let t = this.slides[e];
			t && (a.push(t.offsetWidth), i += t.offsetWidth + n);
		}
		return this.safeTranslate(i);
	}
	setVisibility() {
		k(this.getRootSelector, e.HIDDEN[0]);
	}
	setActiveSlides() {
		let e = this.getVisibleSlideIndexes(), t = this.getVisualActiveCount();
		this.mutate.updateActiveSlides(e, t);
	}
	setSlidesWidth() {
		this.resolvedSlideWidths.clear(), this.slides.forEach((e, t) => {
			this.animate(e, this.keyFrames(t), this.options());
		});
	}
	getVisibleSlideIndexes() {
		let { slidesPerView: e, slideIndex: t } = this.store, n = e || 1, r = typeof t == "number" ? t : 0;
		return Array.from({ length: n }, (e, t) => r + t).filter((e) => e >= 0 && e < this.slides.length);
	}
	getVisualActiveCount() {
		let { slidesPerView: e, slidesPerPage: t } = this.store;
		return Math.max(1, Math.min(e || 1, t || 1));
	}
	endMount() {
		this.setActiveSlides(), this.setSlidesWidth(), this.setSlidesWidth(), this.syncAutoHeight(0, 0), this.setVisibility(), this.setControls();
	}
}, $ = class extends U {
	host = null;
	hasConfiguredRoot;
	constructor(e) {
		super(e ?? d.PLUGIN_ROOT_PLACEHOLDER), this.hasConfiguredRoot = !!e;
	}
	init() {}
	destroy() {}
	setHost(e) {
		this.host = e, this.hasConfiguredRoot || this.syncRootContext(e.getRootKey());
	}
	getPluginRoot() {
		return this.$root;
	}
	usesExplicitRoot() {
		return this.hasConfiguredRoot;
	}
}, Se = class extends U {
	userOptions;
	mount = null;
	plugins = [];
	validate;
	message;
	initialInnerHTML;
	initialClassName;
	initialStyle;
	constructor(e, t) {
		super(e), this.initialInnerHTML = this.getInitialInnerHTML(), this.initialClassName = this.getInitialClassName(), this.initialStyle = this.getInitialStyle(), this.validate = new W(e), this.message = new de(e), this.message.displayMessage(t), this.validation(e, this.validate.sanitizeOptions(t));
	}
	validation(e, t) {
		ue(e) && this.validate.isValid() && this.defineConfigs(e, t);
	}
	defineConfigs(e, t) {
		this.userOptions = t, this.mount = new Q(e), this.setOptions(t);
	}
	setOptions(e) {
		let t = this.userOptions;
		!e || !t || this.state.setOptions(t);
	}
	init() {
		this.clearDestroyedState(), this.mount?.init(), this.emitMountedWhenReady();
	}
	emitMountedWhenReady() {
		let t = this.getRootSelector;
		if (!t) return;
		let n = null, r = !1, a = 0, o = 0, c = () => {
			n?.disconnect(), n = null;
		}, l = () => {
			r || (r = !0, c(), this.emit(s.MOUNTED, this.$root));
		}, u = () => {
			let n = t.querySelector(`.${e.TRACK[0]}`), r = n?.querySelector(`.${e.CHILDREN[0]}`), i = T(this.$root), a = i[0], o = t.getBoundingClientRect().width, s = t.classList.contains(e.HIDDEN[0]);
			return !n || !r || i.length === 0 || s || o <= 0 ? !1 : (a?.getBoundingClientRect().width ?? 0) > 0;
		}, d = () => {
			r || a || (a = requestAnimationFrame(() => {
				if (a = 0, o += 1, u()) {
					requestAnimationFrame(() => l());
					return;
				}
				if (o < 30) {
					d();
					return;
				}
				l();
			}));
		};
		n = new MutationObserver(() => {
			d();
		}), n.observe(t, {
			childList: !0,
			subtree: !0,
			attributes: !0,
			attributeFilter: [i.CLASS, i.STYLE]
		}), d();
	}
	next() {
		this.navigate(r.NEXT);
	}
	prev() {
		this.navigate(r.PREV);
	}
	goTo(e) {
		let { useDragFree: t } = this.store;
		if (this.canInteract()) {
			if (t) {
				this.message.displayDragFreeGoToIgnored();
				return;
			}
			if (!Number.isFinite(e)) {
				this.message.displayInvalidGoToIndex(e);
				return;
			}
			this.getSlider().goToPageIndex(e);
		}
	}
	destroy() {
		let e = this.getRootSelector;
		e && (this.destroyPlugins(), this.restoreRootElement(e), this.resetMountState(), this.emit(s.DESTROYED, this.$root));
	}
	use(e) {
		let t = this.getPluginName(e);
		if (!this.isValidPluginType(e)) {
			this.message.displayInvalidPluginType();
			return;
		}
		if (e.usesExplicitRoot() && !this.isMatchingPluginRoot(e)) {
			this.message.displayPluginRootMismatch(t);
			return;
		}
		e.setHost(this), e.init(), this.plugins.push(e);
	}
	canInteract() {
		return !!this.mount && !!this.getRootSelector;
	}
	destroyPlugins() {
		this.plugins.forEach((e) => {
			e.destroy();
		}), this.plugins = [];
	}
	getSlider() {
		return new X(this.$root);
	}
	getPluginName(e) {
		return e.constructor?.name ?? "UnknownPlugin";
	}
	isValidPluginType(e) {
		return e instanceof $;
	}
	isMatchingPluginRoot(e) {
		return e.getPluginRoot() === this.$root;
	}
	getInitialInnerHTML() {
		return this.getRootSelector?.innerHTML ?? "";
	}
	getInitialClassName() {
		return this.getRootSelector?.className ?? "";
	}
	getInitialStyle() {
		return this.getRootSelector?.getAttribute(i.STYLE) ?? null;
	}
	navigate(e) {
		let { useDragFree: t } = this.store;
		if (this.canInteract()) {
			if (t) {
				this.getSlider().goToFreeDirection(e);
				return;
			}
			this.setState(this.getNavigationState(e)), this.getSlider().setSlideTarget({
				$root: this.$root,
				from: e
			});
		}
	}
	getNavigationState(e) {
		let { slideIndex: t } = this.store;
		return {
			currentSlideMovement: F(e),
			prevSlideIndex: t,
			currentEventType: e,
			startPos: Infinity
		};
	}
	restoreRootElement(e) {
		let { initialInnerHTML: t, initialClassName: n, initialStyle: r } = this, i = {
			innerHTML: t,
			className: n,
			style: r
		};
		e.innerHTML = i.innerHTML, e.className = i.className, this.restoreRootStyle(e, i.style), this.restoreRootVisibility(e), this.applyDestroyedMarkupFallback(e);
	}
	restoreRootStyle(e, t) {
		if (t === null) {
			R(e, i.STYLE);
			return;
		}
		j(e, i.STYLE, t);
	}
	restoreRootVisibility(t) {
		k(t, e.HIDDEN[0]);
	}
	applyDestroyedMarkupFallback(t) {
		h([t], e.DESTROYED[0]);
	}
	clearDestroyedState() {
		let t = this.getRootSelector;
		t && k(t, e.DESTROYED[0]);
	}
	resetMountState() {
		let { userOptions: e } = this;
		if (!e) {
			this.mount = null;
			return;
		}
		this.mount = new Q(this.$root), this.setOptions(e);
	}
};
//#endregion
export { Se as BrickSlider, $ as Plugin };
