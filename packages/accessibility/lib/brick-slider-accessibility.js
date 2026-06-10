import { $ as e, ATTRIBUTES as t, DOM_ELEMENT_ALIASES as n, EVENTS as r, FROM as i, Plugin as a, SLIDER_EVENTS as o, TAGS as s, TIMES as c, appendToParent as l, createNewElement as u, getAllElements as d, getAttribute as f, getElement as p, getSliderNodeList as m, hasAttribute as h, hasClass as g, listener as _, removeAttribute as v, removeElement as y, removeListener as b, setAttribute as x, waitFor as S } from "@sixsrc/brick-slider/plugin-api";
//#region src/constants.ts
var C = "bs-a11y-style", w = "bs-a11y-live", T = .75, E = {
	ARROW_LEFT: "ArrowLeft",
	ARROW_RIGHT: "ArrowRight",
	HOME: "Home",
	END: "End",
	ENTER: "Enter",
	SPACE: " "
}, D = class extends a {
	dotCleanupCallbacks = [];
	pluginOptions;
	rootCleanupCallback = null;
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
		S(0, () => {
			this.syncAccessibilityWithDelay({ announce: !1 });
		});
	};
	constructor(e = {}, t = {}) {
		let n = typeof e == "string", r = n ? e : void 0, i = n ? t : e;
		super(r), this.pluginOptions = this.resolveOptions(i);
	}
	init() {
		let e = this.host;
		e && (this.ensureAccessibilityStyle(), this.setupRootAccessibility(), this.setupTrackAccessibility(), this.setupArrowAccessibility(), this.setupDotsAccessibility(), this.setupKeyboardNavigation(), e.on(o.MOUNTED, this.handleMounted), e.on(o.SLIDE_CHANGE, this.handleSlideChange), e.on(o.DESTROYED, this.handleDestroyed), _([r.RESIZE], window, this.handleResize));
	}
	destroy() {
		let e = this.host;
		e && (e.off(o.MOUNTED, this.handleMounted), e.off(o.SLIDE_CHANGE, this.handleSlideChange), e.off(o.DESTROYED, this.handleDestroyed)), this.clearDotsAccessibility(), this.clearRootAccessibility(), this.removeLiveRegion(), b([r.RESIZE], window, this.handleResize);
	}
	syncAccessibility({ announce: e = !1 } = {}) {
		this.setupRootAccessibility(), this.setupTrackAccessibility(), this.setupArrowAccessibility(), this.setupDotsAccessibility(), this.setupKeyboardNavigation(), this.syncSlidesAccessibility(), e && this.updateLiveRegion();
	}
	syncAccessibilityWithDelay(e = {}) {
		let t = c.DEFAULT_TRANSITION_TIME + 50;
		this.syncAccessibility(e), S(0, () => {
			this.syncAccessibility(e);
		}), S(t, () => {
			this.syncAccessibility(e);
		});
	}
	ensureAccessibilityStyle() {
		let t = e(`#${C}`), n = this.createAccessibilityStyleElement();
		t || l(document.head, n);
	}
	createAccessibilityStyleElement() {
		let e = u(s.STYLE);
		return e.id = C, e.textContent = `
      .${w} {
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
		e && (h(e, t.ARIA_LABEL) || x(e, t.ARIA_LABEL, this.getRootAriaLabel()), x(e, t.ROLE, "region"), x(e, t.ARIA_ROLEDESCRIPTION, "carousel"), x(e, t.TABINDEX, "0"), this.ensureLiveRegion(e));
	}
	setupTrackAccessibility() {
		let e = this.$track;
		e && (x(e, t.ARIA_LIVE, "polite"), x(e, t.ARIA_ATOMIC, "true"));
	}
	setupArrowAccessibility() {
		let e = this.getRootSelector, n = e ? this.getArrowElements(e) : [], r = f(e, t.ID);
		e && n.forEach((e) => this.setupArrowElementAccessibility(e, r));
	}
	setupArrowElementAccessibility(e, n) {
		let r = this.getArrowDirection(e), i = this.getArrowLabel(r), a = this.isArrowDisabled(r);
		x(e, t.ARIA_LABEL, i), x(e, t.TYPE, s.BUTTON), x(e, t.ARIA_DISABLED, String(a)), this.setArrowControls(e, n);
	}
	getArrowDirection(e) {
		return g(e, n.ARROW_PREV[0]) ? i.PREV : i.NEXT;
	}
	getArrowLabel(e) {
		return e === i.PREV ? this.pluginOptions.labels.previousSlide : this.pluginOptions.labels.nextSlide;
	}
	setArrowControls(e, n) {
		n && x(e, t.ARIA_CONTROLS, n);
	}
	setupDotsAccessibility() {
		let e = this.getRootSelector, n = this.getDotsContainerElement(), r = n ? this.getDotElements(n) : [], i = this.getCurrentFocusedDot(r), a = f(e, t.ID);
		e && n && (this.clearDotsAccessibility(), this.setupDotsContainerAccessibility(n), this.setupDotsElementsAccessibility(r, a), this.syncFocusedDot(r, i));
	}
	setupDotsContainerAccessibility(e) {
		x(e, t.ROLE, "navigation"), x(e, t.ARIA_LABEL, this.pluginOptions.labels.pagination);
	}
	setupDotsElementsAccessibility(e, t) {
		e.forEach((e, n) => this.setupDotElementAccessibility(e, n, t));
	}
	setupDotElementAccessibility(e, r, i) {
		let a = g(e, n.DOT_ACTIVE[0]), o = this.createDotKeydownHandler(e);
		x(e, t.ROLE, "button"), x(e, t.TABINDEX, a ? "0" : "-1"), x(e, t.ARIA_LABEL, this.pluginOptions.labels.page(r + 1)), this.setDotControls(e, i), this.setDotCurrentAttribute(e, a), this.bindDotKeydown(e, o);
	}
	createDotKeydownHandler(e) {
		return (t) => {
			this.handleDotKeydown(t, e);
		};
	}
	handleDotKeydown(e, t) {
		let n = e.key === E.ENTER, r = e.key === E.SPACE;
		(n || r) && (e.preventDefault(), t.click());
	}
	setDotControls(e, n) {
		n && x(e, t.ARIA_CONTROLS, n);
	}
	setDotCurrentAttribute(e, n) {
		if (n) {
			x(e, t.ARIA_CURRENT, "page");
			return;
		}
		v(e, t.ARIA_CURRENT);
	}
	bindDotKeydown(e, t) {
		_([r.KEYDOWN], e, t), this.dotCleanupCallbacks.push(() => {
			b([r.KEYDOWN], e, t);
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
		return e.find((e) => g(e, n.DOT_ACTIVE[0]));
	}
	syncSlidesAccessibility() {
		let e = m(this.$root), t = m(this.$root, !1).length;
		e.forEach((e, n) => {
			let r = this.isSlideVisibleInViewport(e);
			this.setSlideAccessibility(e, n, t, r);
		});
	}
	setSlideAccessibility(e, n, r, i) {
		let a = this.getSlideNumber(e, n), o = !i;
		x(e, t.ROLE, "group"), x(e, t.ARIA_ROLEDESCRIPTION, "slide"), x(e, t.ARIA_LABEL, this.pluginOptions.labels.slide(a, Math.max(r, a))), x(e, t.ARIA_HIDDEN, String(o));
	}
	ensureLiveRegion(e) {
		let t = this.getLiveRegionElement(), n = this.createLiveRegionElement();
		t || l(e, n);
	}
	createLiveRegionElement() {
		let e = u(s.DIV);
		return e.className = w, x(e, t.ARIA_LIVE, "polite"), x(e, t.ARIA_ATOMIC, "true"), e;
	}
	removeLiveRegion() {
		let e = this.getRootSelector, t = this.getLiveRegionElement();
		e && y(t);
	}
	updateLiveRegion() {
		let e = this.getLiveRegionElement();
		e && (e.textContent = this.getLiveRegionMessage());
	}
	getLiveRegionMessage() {
		let e = m(this.$root, !1).length, t = this.getVisibleSlidesForLiveRegion();
		if (!(t.length > 0)) return this.pluginOptions.labels.liveRegionFallback(e);
		let n = this.getFirstLiveRegionSlideNumber(t), r = this.getLastLiveRegionSlideNumber(t);
		return n === r ? this.pluginOptions.labels.liveRegionSingle(n, e) : this.pluginOptions.labels.liveRegionRange(n, r, e);
	}
	getVisibleSlidesForLiveRegion() {
		return m(this.$root).filter((e) => this.isSlideVisibleInViewport(e));
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
			if (e.key === E.ARROW_LEFT) {
				e.preventDefault(), t.prev();
				return;
			}
			if (e.key === E.ARROW_RIGHT) {
				e.preventDefault(), t.next();
				return;
			}
			if (e.key === E.HOME) {
				e.preventDefault(), t.goTo(0);
				return;
			}
			e.key === E.END && (e.preventDefault(), t.goTo(this.getLastPageIndex()));
		}
	}
	bindKeyboardNavigation(e, t) {
		_([r.KEYDOWN], e, t), this.rootCleanupCallback = () => {
			b([r.KEYDOWN], e, t);
		};
	}
	clearRootAccessibility() {
		this.rootCleanupCallback?.(), this.rootCleanupCallback = null;
	}
	getSlideNumber(e, t) {
		let n = Number(e?.dataset.index);
		return Number.isInteger(n) && n > 0 ? n : t + 1;
	}
	isSlideVisibleInViewport(e) {
		let t = this.$track, n = e.getBoundingClientRect(), r = this.getTrackRect(t), i = this.getVisibleSlideWidth(n, r), a = Math.max(0, i), o = this.getVisibilityRatio(n, a);
		return t ? o >= T : !1;
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
		return d(`.${n.ARROW[0]}`, e);
	}
	getDotsContainerElement() {
		return p(`.${n.DOTS[0]}`, this.getRootSelector);
	}
	getDotElements(e) {
		return Array.from(d(`.${n.DOT[0]}`, e));
	}
	getLiveRegionElement() {
		return p(`.${w}`, this.getRootSelector);
	}
	isArrowDisabled(e) {
		let { useLoop: t, activePage: n, numberOfPages: r, useDragFree: a } = this.store;
		return t || a ? !1 : e === i.PREV ? n <= 0 : n >= r - 1;
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
export { D as AccessibilityPlugin, D as BrickSliderAccessibility, D as default };
