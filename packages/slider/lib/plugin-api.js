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
}, l = { PLUGIN_ROOT_PLACEHOLDER: "#__brickslider_plugin_root__" };
function u(e, t) {
	e.forEach((e) => {
		e.classList.add(t);
	});
}
function d(e, t, n) {
	if (!e) throw Error("Element is required for animation.");
	return (Array.isArray(e) ? e : [e]).map((e) => e.animate(t, n));
}
function f(e, t) {
	if (e && t) return e.appendChild(t), t;
}
function p(e) {
	e?.remove();
}
function m(e) {
	return document.createElement(e);
}
function h(e, t = document) {
	return t.querySelectorAll(e);
}
function g(e, t = document) {
	return t.querySelector(e) ?? void 0;
}
function _(e) {
	return g(e);
}
function v(t) {
	return _(`${t} .${e.DOTS[0]}`);
}
function y(t) {
	return _(`${t} .${e.CHILDREN[0]}`);
}
function b(e) {
	return e ? e.children.length : 0;
}
function x(e) {
	return _(`${e}`);
}
function S(t, n = !0) {
	let r = `:scope > .${e.SLIDE[0]}${n ? "" : ":not(.cloned)"}`;
	return Array.from(h(r, y(t)));
}
function C(e) {
	if (e) return e.offsetWidth;
}
function w(t) {
	return _(`${t} .${e.TRACK[0]}`);
}
function T(e, t) {
	return e.classList.contains(t);
}
function E(e, t) {
	return !e || !t ? !1 : e.contains(t);
}
function D(e, t) {
	if (e) return e.closest(t) ?? void 0;
}
function O(e, t) {
	return e ? e.hasAttribute(t) : !1;
}
function k(e, t) {
	return e ? e.getAttribute(t) : null;
}
function A(e, t) {
	e.classList.remove(...Array.isArray(t) ? t : [t]);
}
function j(e, t, n) {
	e.setAttribute(t, n);
}
function M(e) {
	return e.type.includes("mouse") ? e : e.touches[0];
}
function N(e, t, n, r) {
	Array.isArray(e) && e.forEach((e) => {
		t.addEventListener(e, n, r);
	});
}
function P(e, t, n, r) {
	Array.isArray(e) && e.forEach((e) => {
		t.removeEventListener(e, n, r);
	});
}
function F(e, t) {
	e.removeAttribute(t);
}
function I(e) {
	return `translate3d(${e}px, 0px, 0px)`;
}
function L(e, t) {
	let n;
	function r(i) {
		n ||= i, i - n < e ? requestAnimationFrame(r) : t();
	}
	requestAnimationFrame(r);
}
//#endregion
//#region src/State.ts
var R = class t {
	static state = {};
	key;
	constructor(e, n) {
		this.key = e, t.state[e] || (t.state[e] = {}, n && this.initializeState(n));
	}
	initializeState(e) {
		t.state[this.key].prevSlideIndex = 0, t.state[this.key].activePage = 0, t.state[this.key].activeDataIndex = 0, t.state[this.key].slideIndex = 0, t.state[this.key].gap = e.gap ?? 0, t.state[this.key].slidesPerPage = e.slidesPerPage ?? 1, t.state[this.key].slidesPerView = e.slidesPerView ?? 1, t.state[this.key].baseSlidesPerPage = e.slidesPerPage ?? 1, t.state[this.key].baseSlidesPerView = e.slidesPerView ?? 1, t.state[this.key].numberOfPages = 0, t.state[this.key].numberOfSlides = 0, t.state[this.key].sliderWidth = 0, t.state[this.key].slideSizes = this.normalizeSlideSizes(e.slideSizes), t.state[this.key].baseSlideSizes = this.normalizeSlideSizes(e.slideSizes), t.state[this.key].screens = this.normalizeScreens(e.screens), t.state[this.key].responsive = this.normalizeResponsive(e.responsive), t.state[this.key].activeBreakpoint = "base", t.state[this.key].isInitialRender = !0, t.state[this.key].isTouch = !1, t.state[this.key].isPagedActive = !0, t.state[this.key].isCompleteGroup = !0, t.state[this.key].isDragging = !1, t.state[this.key].isJumpSlide = !1, t.state[this.key].isFastNavigation = !1, t.state[this.key].startPos = 0, t.state[this.key].startX = 0, t.state[this.key].startY = 0, t.state[this.key].endX = 0, t.state[this.key].prevTranslate = 0, t.state[this.key].currentTranslate = 0, t.state[this.key].currentEventType = null, t.state[this.key].currentSlideMovement = null, t.state[this.key].startTime = 0, t.state[this.key].endTime = 0, t.state[this.key].isMouseLeave = !0, t.state[this.key].animationID = 0, t.state[this.key].useDragFree = e.useDragFree ?? !1, t.state[this.key].dots = !t.state[this.key].useDragFree && this.hasDotsMarkup(), t.state[this.key].dotIndex = 0, t.state[this.key].arrows = this.hasArrowsMarkup(), t.state[this.key].touch = e.useTouch ?? !0, t.state[this.key].useLoop = !t.state[this.key].useDragFree && (e.useLoop ?? !1), t.state[this.key].useAutoHeight = e.useAutoHeight ?? !1, t.state[this.key].navigationLockUntil = 0, t.state[this.key].isPagedActive = !t.state[this.key].useDragFree;
	}
	hasDotsMarkup() {
		return !!v(this.key);
	}
	hasArrowsMarkup() {
		let t = x(this.key);
		return t ? h(e.ARROW.map((e) => `.${e}`).join(", "), t).length > 0 : !1;
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
}, z = class {
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
}, B = class e {
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
		this.$root = t, this.getRootSelector = x(t), this.slides = S(t), this.state = new R(this.$root), this.store = R.store(this.$root), this.emitter = e.getEmitter(this.$root), this.$children = y(this.$root), this.$track = w(t), this.childrenCount = b(this.$children), this.sliderWidth = C(this.$children);
	}
	getRootKey() {
		return this.$root;
	}
	static getEmitter(t) {
		let n = e.emitters.get(t), r = new z();
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
		return d(e, t, n);
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
		let { sliderWidth: t } = this.store, n = t ?? this.sliderWidth ?? C(this.$children) ?? 0;
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
		return [{ transform: I(e ?? t) }];
	}
	setState(e) {
		this.state.set(e);
	}
	getFirstIndex() {
		return this.slides.findIndex((e) => e.dataset.index === "1");
	}
	getDataSlideNumber(e) {
		return this.slides.findIndex((n) => n.dataset.slideNumber === e && !T(n, t.CLONED));
	}
	getDataIndex(e) {
		return Number(this.slides.find((n) => n.dataset.slideNumber === e && !T(n, t.CLONED))?.dataset.index ?? -1);
	}
	getClonePreviousPosition(e) {
		let n = this.getDataIndex(e), r = this.slides.find((e) => e.dataset.index === String(n) && T(e, t.CLONED));
		return Number(r?.dataset.slideNumber) - 1;
	}
	getFirstClonedIndex() {
		return this.slides.findIndex((e) => e.dataset.index === "1" && T(e, t.CLONED));
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
		let { slidesPerPage: e, slidesPerView: t } = this.store, n = S(this.$root, !1).length, r = n - Math.floor(n / e) * e, i = Math.max(0, t - r);
		return {
			isMissing: i > 0,
			leftOver: i
		};
	}
}, V = class extends B {
	host = null;
	hasConfiguredRoot;
	constructor(e) {
		super(e ?? l.PLUGIN_ROOT_PLACEHOLDER), this.hasConfiguredRoot = !!e;
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
};
//#endregion
export { _ as $, c as ANIMATION_OPTIONS, i as ATTRIBUTES, t as CLASS_VALUES, e as DOM_ELEMENT_ALIASES, o as EVENTS, r as FROM, l as INTERNAL_SELECTORS, V as Plugin, s as SLIDER_EVENTS, n as TAGS, a as TIMES, u as addClass, f as appendToParent, D as closestElement, E as containsElement, m as createNewElement, h as getAllElements, k as getAttribute, g as getElement, S as getSliderNodeList, w as getTrackChildren, O as hasAttribute, T as hasClass, N as listener, F as removeAttribute, A as removeClass, p as removeElement, P as removeListener, j as setAttribute, L as waitFor };
