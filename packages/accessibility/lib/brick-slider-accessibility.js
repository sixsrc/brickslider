/*
 * BrickSliderAccessibility
 * Version  : 1.0.11
 * License  : MIT
 * Copyright: 2026
 * Repo: github.com/sixsrc/brickslider
 */

import { $ as e, ATTRIBUTES as t, CLASS_VALUES as n, DOM_ELEMENT_ALIASES as r, EVENTS as i, FROM as a, Plugin as o, SLIDER_EVENTS as s, SlideMeta as c, TAGS as l, TIMES as u, appendToParent as d, createNewElement as f, getAllElements as p, getAttribute as m, getElement as h, getSliderNodeList as g, hasAttribute as _, hasClass as v, listener as y, removeAttribute as b, removeElement as x, removeListener as S, setAttribute as C, waitFor as w } from "@sixsrc/brick-slider/api";
//#region src/constants.ts
var T = "bs-a11y-style", E = "bs-a11y-live", D = .75, O = {
	ARROW_LEFT: "ArrowLeft",
	ARROW_RIGHT: "ArrowRight",
	HOME: "Home",
	END: "End",
	ENTER: "Enter",
	SPACE: " "
}, k = class extends o {
	dotCleanupCallbacks = [];
	pluginOptions;
	rootCleanupCallback = null;
	slideClassObserver = null;
	slideClassFrame = 0;
	slideMeta;
	handleMounted = () => {
		this.syncAccessibilityWithDelay({ announce: !0 });
	};
	handleSlideChange = (e) => {
		this.syncAccessibilityWithDelay({ announce: !0 });
	};
	handleDestroyed = () => {
		this.destroy();
	};
	handleResize = () => {
		w(0, () => {
			this.syncAccessibilityWithDelay({ announce: !1 });
		});
	};
	constructor(e = {}, t = {}) {
		let n = typeof e == "string", r = n ? e : void 0, i = n ? t : e;
		super(r), this.pluginOptions = this.resolveOptions(i), this.slideMeta = new c(this.getPluginRoot());
	}
	init() {
		let e = this.host;
		e && (this.ensureAccessibilityStyle(), this.setupRootAccessibility(), this.setupTrackAccessibility(), this.setupArrowAccessibility(), this.setupDotsAccessibility(), this.setupKeyboardNavigation(), this.observeSlideClassChanges(), e.on(s.MOUNTED, this.handleMounted), e.on(s.SLIDE_CHANGE, this.handleSlideChange), e.on(s.DESTROYED, this.handleDestroyed), y([i.RESIZE], window, this.handleResize));
	}
	destroy() {
		let e = this.host;
		e && (e.off(s.MOUNTED, this.handleMounted), e.off(s.SLIDE_CHANGE, this.handleSlideChange), e.off(s.DESTROYED, this.handleDestroyed)), this.clearDotsAccessibility(), this.clearRootAccessibility(), this.removeLiveRegion(), this.disconnectSlideClassObserver(), S([i.RESIZE], window, this.handleResize);
	}
	syncAccessibility({ announce: e = !1 } = {}) {
		this.setupRootAccessibility(), this.setupTrackAccessibility(), this.setupArrowAccessibility(), this.setupDotsAccessibility(), this.setupKeyboardNavigation(), this.syncSlidesAccessibility(), e && this.updateLiveRegion();
	}
	observeSlideClassChanges() {}
	hasSlideClassMutation(e) {
		return e.some((e) => {
			let t = e.target;
			return t instanceof HTMLElement && v(t, r.SLIDE[0]);
		});
	}
	scheduleSlideClassSync() {
		this.slideClassFrame ||= requestAnimationFrame(() => {
			this.slideClassFrame = 0, this.syncSlidesAccessibility();
		});
	}
	disconnectSlideClassObserver() {
		this.slideClassObserver?.disconnect(), this.slideClassObserver = null, this.slideClassFrame &&= (cancelAnimationFrame(this.slideClassFrame), 0);
	}
	syncAccessibilityWithDelay(e = {}) {
		let t = u.DEFAULT_TRANSITION_TIME + 50;
		this.syncAccessibility(e), w(0, () => {
			this.syncAccessibility(e);
		}), w(t, () => {
			this.syncAccessibility(e);
		});
	}
	ensureAccessibilityStyle() {
		let t = e(`#${T}`), n = this.createAccessibilityStyleElement();
		t || d(document.head, n);
	}
	createAccessibilityStyleElement() {
		let e = f(l.STYLE);
		return e.id = T, e.textContent = `
      .${E} {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }
    `, e;
	}
	setupRootAccessibility() {
		let e = this.getRootSelector;
		e && (_(e, t.ARIA_LABEL) || C(e, t.ARIA_LABEL, this.getRootAriaLabel()), C(e, t.ROLE, "region"), C(e, t.ARIA_ROLEDESCRIPTION, "carousel"), C(e, t.TABINDEX, "0"), this.ensureLiveRegion(e));
	}
	setupTrackAccessibility() {
		let e = this.$track;
		e && (C(e, t.ARIA_LIVE, "polite"), C(e, t.ARIA_ATOMIC, "true"));
	}
	setupArrowAccessibility() {
		let e = this.getRootSelector, n = e ? this.getArrowElements(e) : [], r = m(e, t.ID);
		e && n.forEach((e) => this.setupArrowElementAccessibility(e, r));
	}
	setupArrowElementAccessibility(e, n) {
		let r = this.getArrowDirection(e), i = this.getArrowLabel(r), a = this.isArrowDisabled(r);
		C(e, t.ARIA_LABEL, i), C(e, t.TYPE, l.BUTTON), C(e, t.ARIA_DISABLED, String(a)), this.setArrowControls(e, n);
	}
	getArrowDirection(e) {
		return v(e, r.ARROW_PREV[0]) ? a.PREV : a.NEXT;
	}
	getArrowLabel(e) {
		return e === a.PREV ? this.pluginOptions.labels.previousSlide : this.pluginOptions.labels.nextSlide;
	}
	setArrowControls(e, n) {
		n && C(e, t.ARIA_CONTROLS, n);
	}
	setupDotsAccessibility() {
		let e = this.getRootSelector, n = this.getDotsContainerElement(), r = n ? this.getDotElements(n) : [], i = this.getCurrentFocusedDot(r), a = m(e, t.ID);
		e && n && (this.clearDotsAccessibility(), this.setupDotsContainerAccessibility(n), this.setupDotsElementsAccessibility(r, a), this.syncFocusedDot(r, i));
	}
	setupDotsContainerAccessibility(e) {
		C(e, t.ROLE, "navigation"), C(e, t.ARIA_LABEL, this.pluginOptions.labels.pagination);
	}
	setupDotsElementsAccessibility(e, t) {
		e.forEach((e, n) => this.setupDotElementAccessibility(e, n, t));
	}
	setupDotElementAccessibility(e, n, r) {
		let i = this.isCurrentDot(e), a = this.createDotKeydownHandler(e);
		this.setDotRole(e), C(e, t.TABINDEX, i ? "0" : "-1"), C(e, t.ARIA_LABEL, this.pluginOptions.labels.page(n + 1)), this.setDotControls(e, r), this.setDotCurrentAttribute(e, i), this.bindDotKeydown(e, a);
	}
	setDotRole(e) {
		if (e.tagName.toLowerCase() === l.BUTTON) {
			b(e, t.ROLE);
			return;
		}
		C(e, t.ROLE, "button");
	}
	createDotKeydownHandler(e) {
		return (t) => {
			this.handleDotKeydown(t, e);
		};
	}
	handleDotKeydown(e, t) {
		let n = e.key === O.ENTER, r = e.key === O.SPACE;
		(n || r) && (e.preventDefault(), t.click());
	}
	setDotControls(e, n) {
		n && C(e, t.ARIA_CONTROLS, n);
	}
	setDotCurrentAttribute(e, n) {
		if (n) {
			C(e, t.ARIA_CURRENT, "page");
			return;
		}
		b(e, t.ARIA_CURRENT);
	}
	bindDotKeydown(e, t) {
		y([i.KEYDOWN], e, t), this.dotCleanupCallbacks.push(() => {
			S([i.KEYDOWN], e, t);
		});
	}
	syncFocusedDot(e, t) {
		let n = this.shouldFocusActiveDot(e, t), r = this.getActiveDot(e);
		n && r?.focus();
	}
	shouldFocusActiveDot(e, t) {
		return this.pluginOptions.useFocusManagement && t !== null && e[t] !== void 0;
	}
	getActiveDot(e) {
		return e.find((e) => this.isCurrentDot(e));
	}
	syncSlidesAccessibility() {
		let e = g(this.$root), t = g(this.$root, !1).length;
		e.forEach((e, n) => {
			let r = this.isSlideVisibleForAccessibility(e);
			this.setSlideAccessibility(e, n, t, r);
		});
	}
	isSlideVisibleForAccessibility(e) {
		let { useDragFree: t } = this.store;
		return t ? this.isSlideVisibleInViewport(e) : v(e, n.ACTIVE);
	}
	setSlideAccessibility(e, n, r, i) {
		let a = this.getSlideNumber(e, n), o = !i;
		C(e, t.ROLE, "group"), C(e, t.ARIA_ROLEDESCRIPTION, "slide"), C(e, t.ARIA_LABEL, this.pluginOptions.labels.slide(a, Math.max(r, a))), C(e, t.ARIA_HIDDEN, String(o));
	}
	ensureLiveRegion(e) {
		let t = this.getLiveRegionElement(), n = this.createLiveRegionElement();
		t || d(e, n);
	}
	createLiveRegionElement() {
		let e = f(l.DIV);
		return e.className = E, C(e, t.ARIA_LIVE, "polite"), C(e, t.ARIA_ATOMIC, "true"), e;
	}
	removeLiveRegion() {
		let e = this.getRootSelector, t = this.getLiveRegionElement();
		e && x(t);
	}
	updateLiveRegion() {
		let e = this.getLiveRegionElement();
		e && (e.textContent = this.getLiveRegionMessage());
	}
	getLiveRegionMessage() {
		let e = g(this.$root, !1).length, t = this.getVisibleSlidesForLiveRegion();
		if (!(t.length > 0)) return this.pluginOptions.labels.liveRegionFallback(e);
		let n = this.getFirstLiveRegionSlideNumber(t), r = this.getLastLiveRegionSlideNumber(t);
		return n === r ? this.pluginOptions.labels.liveRegionSingle(n, e) : this.pluginOptions.labels.liveRegionRange(n, r, e);
	}
	getVisibleSlidesForLiveRegion() {
		return g(this.$root).filter((e) => this.isSlideVisibleInViewport(e));
	}
	getFirstLiveRegionSlideNumber(e) {
		return this.getSlideNumber(e[0], 0);
	}
	getLastLiveRegionSlideNumber(e) {
		let t = e.length - 1;
		return this.getSlideNumber(e[t], t);
	}
	clearDotsAccessibility() {
		this.dotCleanupCallbacks.forEach((e) => e()), this.dotCleanupCallbacks = [];
	}
	setupKeyboardNavigation() {
		let e = this.getRootSelector, t = this.createKeyboardNavigationHandler(), n = this.pluginOptions.useKeyboardNavigation;
		e && n && (this.clearRootAccessibility(), this.bindKeyboardNavigation(e, t));
	}
	createKeyboardNavigationHandler() {
		return (e) => {
			this.handleKeyboardNavigation(e);
		};
	}
	handleKeyboardNavigation(e) {
		let t = this.host;
		if (t) {
			if (e.key === O.ARROW_LEFT) {
				e.preventDefault(), t.prev();
				return;
			}
			if (e.key === O.ARROW_RIGHT) {
				e.preventDefault(), t.next();
				return;
			}
			if (e.key === O.HOME) {
				e.preventDefault(), t.goTo(0);
				return;
			}
			e.key === O.END && (e.preventDefault(), t.goTo(this.getLastPageIndex()));
		}
	}
	bindKeyboardNavigation(e, t) {
		y([i.KEYDOWN], e, t), this.rootCleanupCallback = () => {
			S([i.KEYDOWN], e, t);
		};
	}
	clearRootAccessibility() {
		this.rootCleanupCallback?.(), this.rootCleanupCallback = null;
	}
	getSlideNumber(e, t) {
		let n = this.slideMeta.getSlideDataIndex(e);
		return Number.isInteger(n) && n >= 0 ? n + 1 : t + 1;
	}
	isSlideVisibleInViewport(e) {
		let t = this.$track, n = e.getBoundingClientRect(), r = this.getTrackRect(t), i = this.getVisibleSlideWidth(n, r), a = Math.max(0, i), o = this.getVisibilityRatio(n, a);
		return t ? o >= D : !1;
	}
	getTrackRect(e) {
		return e?.getBoundingClientRect() ?? new DOMRect();
	}
	getVisibleSlideWidth(e, t) {
		return Math.min(e.right, t.right) - Math.max(e.left, t.left);
	}
	getVisibilityRatio(e, t) {
		return e.width > 0 ? t / e.width : 0;
	}
	getRootAriaLabel() {
		return this.pluginOptions.labels.root;
	}
	getLastPageIndex() {
		let e = this.getDotsContainerElement(), t = e ? this.getDotElements(e) : [];
		return Math.max(0, t.length - 1);
	}
	getArrowElements(e) {
		return p(`.${r.ARROW[0]}`, e);
	}
	getDotsContainerElement() {
		return h(`.${r.DOTS[0]}`, this.getRootSelector);
	}
	getDotElements(e) {
		return Array.from(p(`.${r.DOT[0]}`, e));
	}
	getLiveRegionElement() {
		return h(`.${E}`, this.getRootSelector);
	}
	isArrowDisabled(e) {
		let { useLoop: t, activePage: n, numberOfPages: r, useDragFree: i } = this.store;
		return t || i ? !1 : e === a.PREV ? n <= 0 : n >= r - 1;
	}
	getCurrentFocusedDot(e) {
		let t = document.activeElement, n = this.getFocusedDotIndex(e, t);
		return this.isValidDotIndex(n) ? n : null;
	}
	getFocusedDotIndex(e, t) {
		return t instanceof HTMLElement ? e.indexOf(t) : -1;
	}
	isValidDotIndex(e) {
		return e >= 0;
	}
	isCurrentDot(e) {
		return m(e, t.ARIA_CURRENT) === "page";
	}
	resolveOptions(e) {
		return {
			useKeyboardNavigation: e.useKeyboardNavigation ?? !0,
			useFocusManagement: e.useFocusManagement ?? !0,
			labels: {
				root: "BrickSlider carousel",
				pagination: "Slider pagination",
				previousSlide: "Previous slide",
				nextSlide: "Next slide",
				slide: (e, t) => `Slide ${e} of ${t}`,
				page: (e) => `Go to page ${e}`,
				liveRegionSingle: (e, t) => `Showing slide ${e} of ${t}.`,
				liveRegionRange: (e, t, n) => `Showing slides ${e} to ${t} of ${n}.`,
				liveRegionFallback: (e) => `Carousel updated. ${e} slides available.`,
				...e.labels
			}
		};
	}
};
//#endregion
export { k as AccessibilityPlugin, k as BrickSliderAccessibility, k as default };
