/*
* BrickSlider Stories
* Version  : 1.0.9
* License  : MIT
* Copyright: 2026
* Repo: github.com/sixsrc/brickslider
*/
import { $ as e, ANIMATION_OPTIONS as t, ATTRIBUTES as n, DOM_ELEMENT_ALIASES as r, EVENTS as i, FROM as a, Plugin as o, SLIDER_EVENTS as s, TAGS as c, Validation as l, addClass as u, appendToParent as d, closestElement as f, containsElement as p, createNewElement as m, getAllElements as h, getAttribute as g, getChildren as _, getElement as v, getRootSelector as y, getSliderNodeList as b, getTrackChildren as x, hasAttribute as S, hasClass as C, listener as w, removeAttribute as T, removeClass as E, removeElement as D, removeListener as O, setAttribute as k } from "@sixsrc/brick-slider/api";
//#region src/constants.ts
var A = {
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
}, j = {
	CLOSE: "×",
	MUTE_ON: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12zm-2.5-8.7v2.1A7.5 7.5 0 0 1 18.5 12a7.5 7.5 0 0 1-4.5 6.6v2.1A9.5 9.5 0 0 0 20.5 12 9.5 9.5 0 0 0 14 3.3z\"/></svg>",
	MUTE_OFF: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 9v6h4l5 4V5L8 9H4zm10.59 3L12 9.41 13.41 8 16 10.59 18.59 8 20 9.41 17.41 12 20 14.59 18.59 16 16 13.41 13.41 16 12 14.59 14.59 12z\"/></svg>",
	PAUSE: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M8 6h3v12H8zM13 6h3v12h-3z\"/></svg>",
	PLAY: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M8 5v14l11-7z\"/></svg>"
}, M = {
	CLOSE: "Close stories",
	MUTE: "Toggle sound",
	MUTE_ON: "Mute story sound",
	MUTE_OFF: "Unmute story sound",
	PAUSE: "Toggle pause"
}, N = {
	SPACE: " ",
	ESCAPE: "Escape",
	TAB: "Tab"
}, P = {
	OPENED: "storiesOpened",
	MOUNTED: "storiesMounted",
	CLOSED: "storiesClosed"
}, F = {
	DURATION: 5e3,
	MAX_VIDEO_DURATION: 6e4,
	MIN_VIDEO_DURATION: 1e3,
	MAX_STORIES: 10,
	MAX_STORIES_LIMIT: 20,
	CLOSE_ON_END: !0
}, I = { MARKUP: "brickslider.github.io/docs/plugins/stories" }, L = class {
	$root;
	sliderValidation;
	ids = /* @__PURE__ */ new Set();
	details = {};
	constructor(e) {
		this.$root = e, this.sliderValidation = new l(e);
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
		return y(this.$root);
	}
	getTrack() {
		return v(`.${r.TRACK[0]}`, this.getRoot());
	}
	getChildren() {
		return _(this.$root);
	}
	getLayer() {
		return this.getStoriesLayers()[0];
	}
	getProgress() {
		return this.getScopedStoryElements(A.PROGRESS)[0];
	}
	getPauseIndicator() {
		return this.getScopedStoryElements(A.PAUSE_INDICATOR)[0];
	}
	getBackdrop() {
		return this.getOwnedStoryElements(A.BACKDROP)[0];
	}
	getClose() {
		return this.getOwnedStoryElements(A.CLOSE)[0];
	}
	getMute() {
		return this.getOwnedStoryElements(A.MUTE)[0];
	}
	getScopedStoryElements(e) {
		let t = this.getRoot();
		return t ? Array.from(h(`.${e}`, t)) : [];
	}
	getOwnedStoryElements(e) {
		let t = this.getScopedStoryElements(e), n = this.getStoriesLayers().flatMap((t) => Array.from(h(`.${e}`, t)));
		return [...new Set([...t, ...n])];
	}
	getExternalLayer() {
		let e = this.getRoot()?.nextElementSibling;
		if (e && e instanceof HTMLElement && C(e, A.LAYER)) return e;
	}
	getStoriesLayers() {
		let e = this.getScopedStoryElements(A.LAYER), t = this.getExternalLayer();
		return !t || e.includes(t) ? e : [...e, t];
	}
	hasDuplicateStoriesElements() {
		let e = this.getDuplicateStoriesClassNames();
		return e.length === 0 ? !1 : (this.details.DUPLICATE_STORIES_ELEMENTS = e, !0);
	}
	getDuplicateStoriesClassNames() {
		return [
			A.LAYER,
			A.PROGRESS,
			A.PAUSE_INDICATOR,
			A.BACKDROP,
			A.CLOSE,
			A.MUTE
		].filter((e) => e === A.LAYER ? this.getStoriesLayers().length > 1 : this.getOwnedStoryElements(e).length > 1);
	}
	hasInvalidTrackChildOrder() {
		let e = this.getTrack(), t = this.getChildren();
		return !e || !t ? !1 : e.firstElementChild !== t;
	}
	hasInvalidProgressPosition() {
		let e = this.getProgress(), t = this.getTrack();
		return e ? t ? !p(t, e) : !0 : !1;
	}
	hasInvalidProgressStructure() {
		let e = this.getProgress();
		if (!e) return !1;
		let t = v(`.${A.PROGRESS_ITEM}`, e), n = v(`.${A.PROGRESS_BAR}`, e);
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
		let r = p(t, e), i = p(n, e);
		return r || i;
	}
	hasInvalidBackdropPosition() {
		let e = this.getBackdrop(), t = this.getLayer();
		return e ? t ? !p(t, e) : !0 : !1;
	}
	hasInvalidClosePosition() {
		let e = this.getClose(), t = this.getLayer(), n = this.getTrack();
		if (!e) return !1;
		if (!t && !n) return !0;
		let r = p(t, e), i = p(n, e);
		return !r && !i || e.tagName.toLowerCase() !== c.BUTTON;
	}
	hasInvalidMutePosition() {
		let e = this.getMute(), t = this.getLayer(), n = this.getTrack();
		if (!e) return !1;
		if (!t && !n) return !0;
		let r = p(t, e), i = p(n, e);
		return !r && !i || e.tagName.toLowerCase() !== c.BUTTON;
	}
	hasMultipleVideosInSingleStory() {
		return this.getStoriesWithMultipleVideos().length > 0;
	}
	getStoriesWithMultipleVideos() {
		let e = this.getChildren();
		return e ? Array.from(h(`:scope > .${r.SLIDE[0]}`, e)).reduce((e, t, n) => (h(c.VIDEO, t).length > 1 && e.push(String(n + 1)), e), []) : [];
	}
}, R = class e extends L {
	messageMap;
	levelMap;
	rootSelector;
	constructor(t) {
		super(t), this.rootSelector = t, this.messageMap = e.textMessages(t), this.levelMap = e.textLevels();
	}
	static textMessages(e) {
		return {
			NO_ROOT: `Could not find root selector ${e}.\nSee: ${I.MARKUP}`,
			NO_TRACK: `Could not find .bs-track inside ${e}.\nSee: ${I.MARKUP}`,
			NO_CHILDREN: `Could not find .bs-container inside .bs-track for ${e}.\nSee: ${I.MARKUP}`,
			NO_SLIDES: `Could not find any .bs-slide inside .bs-container for ${e}.\nSee: ${I.MARKUP}`,
			DUPLICATE_ELEMENTS: `Found duplicated core slider elements in ${e}.\nSee: ${I.MARKUP}`,
			INVALID_ORDER: `Found invalid core slider markup order in ${e}.\nSee: ${I.MARKUP}`,
			DUPLICATE_STORIES_ELEMENTS: `Found duplicated unique stories elements in ${e}.\nSee: ${I.MARKUP}`,
			INVALID_TRACK_CHILD_ORDER: `Found invalid stories track content order in ${e}. .bs-container must come before stories-only elements inside .bs-track.\nSee: ${I.MARKUP}`,
			INVALID_PROGRESS_POSITION: `Found .bs-stories-progress in the wrong place for ${e}. Place it inside .bs-track.\nSee: ${I.MARKUP}`,
			INVALID_PROGRESS_STRUCTURE: `Found incomplete .bs-stories-progress markup for ${e}. Include both .bs-stories-progress-item and .bs-stories-progress-bar.\nSee: ${I.MARKUP}`,
			INVALID_PAUSE_POSITION: `Found .bs-stories-pause-indicator in the wrong place for ${e}. Place it inside .bs-track.\nSee: ${I.MARKUP}`,
			INVALID_LAYER_POSITION: `Found .bs-stories-layer in the wrong place for ${e}. Place it outside the slider root and outside .bs-track.\nSee: ${I.MARKUP}`,
			INVALID_BACKDROP_POSITION: `Found .bs-stories-backdrop in the wrong place for ${e}. Place it inside .bs-stories-layer.\nSee: ${I.MARKUP}`,
			INVALID_CLOSE_POSITION: `Found invalid .bs-stories-close markup for ${e}. Use a <button> inside .bs-stories-layer or inside .bs-track.\nSee: ${I.MARKUP}`,
			INVALID_MUTE_POSITION: `Found invalid .bs-stories-mute markup for ${e}. Use a <button> inside .bs-stories-layer or inside .bs-track.\nSee: ${I.MARKUP}`,
			MULTIPLE_VIDEOS_IN_STORY: `Found more than one video in the same story for ${e}. Only one video per story is supported.\nSee: ${I.MARKUP}`
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
			if (t.length > 0) return `Found duplicated unique stories elements in ${this.rootSelector}: ${t.map((e) => `.${e}`).join(", ")}.\nSee: ${I.MARKUP}`;
		}
		if (e === "MULTIPLE_VIDEOS_IN_STORY") {
			let t = this.getDetails(e);
			if (t.length > 0) return `Found more than one video in the following stories for ${this.rootSelector}: ${t.map((e) => `#${e}`).join(", ")}. Only one video per story is supported.\nSee: ${I.MARKUP}`;
		}
		return this.messageMap[e];
	}
}, z = class extends o {
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
		t && (e.preventDefault(), e.stopPropagation(), t === A.CLOSE && this.close());
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
		let t = e.key === N.SPACE, n = e.key === N.ESCAPE, r = e.key === N.TAB;
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
		e.pointerType === a.TOUCH && this.isOpen && (this.isInteractiveStoryControlTarget(e.target) || (this.isTouchHoldingStory = !0, this.isStoryHovered = !1, this.shouldResumeAfterTouchHold = !this.isPaused, this.shouldResumeAfterTouchHold ? this.pause() : this.syncPausedState()));
	};
	handleStoryPointerUp = (e) => {
		e && e.pointerType !== a.TOUCH || this.isTouchHoldingStory && (this.isTouchHoldingStory = !1, this.shouldResumeAfterTouchHold ? this.resume() : this.syncPausedState(), this.shouldResumeAfterTouchHold = !1);
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
	setHost(e) {
		super.setHost(e), this.applyStoriesHostState();
	}
	init() {
		let e = this.host, t = this.validateMarkup(), n = this.getRootSelector;
		t && e && n && (this.setupStoriesRoot(n), this.setupStoriesLayer(n), this.setupProgress(n), this.setupControls(n), this.setupEdgeSwipeLock(n), this.setupTriggers(), this.wrapHostNavigation(e), this.syncMutedState(), w([
			i.POINTERDOWN,
			i.MOUSEDOWN,
			i.TOUCHSTART,
			i.CLICK
		], window, this.handleWindowControl, !0), w([i.MOUSEMOVE], window, this.handleWindowMouseMove), w([i.KEYDOWN], document, this.handleKeydown), e.on(s.SLIDE_CHANGE, this.handleSlideChange));
	}
	applyStoriesHostState() {
		this.setState({
			gap: 0,
			slidesPerView: 1,
			slidesPerPage: 1,
			baseSlidesPerView: 1,
			baseSlidesPerPage: 1,
			slideSizes: {},
			baseSlideSizes: {},
			screens: {},
			responsive: {},
			activeBreakpoint: "base",
			useLoop: !1,
			useDragFree: !1,
			useAutoHeight: !1
		});
	}
	validateMarkup() {
		let e = new R(this.$root);
		return e.displayMessage(), e.isValid();
	}
	destroy() {
		let e = this.host;
		this.restoreHostNavigation(), this.close(), this.clearTriggers(), this.clearTimer(), this.destroyControls(), this.destroyProgress(), this.destroyEdgeSwipeLock(), O([
			i.POINTERDOWN,
			i.MOUSEDOWN,
			i.TOUCHSTART,
			i.CLICK
		], window, this.handleWindowControl, !0), O([i.MOUSEMOVE], window, this.handleWindowMouseMove), O([i.KEYDOWN], document, this.handleKeydown), e && e.off(s.SLIDE_CHANGE, this.handleSlideChange);
	}
	open() {
		let e = this.host, t = this.getRootSelector;
		e && t && (this.isOpen = !0, this.isPaused = !1, u([t], A.OPEN), u([document.body], A.BODY_OPEN), E(t, A.ROOT_HIDDEN), this.hideBackgroundFromAssistiveTech(t), this.showStoriesLayer(), window.requestAnimationFrame(() => {
			this.focusInitialControl();
		}), this.goToStory(0), this.emitStoriesLifecycle(P.OPENED), this.emitStoriesMountedWhenReady());
	}
	close() {
		let e = this.host, t = this.getRootSelector;
		t && (this.isOpen = !1, this.isPaused = !1, this.isDraggingStory = !1, this.isTouchHoldingStory = !1, this.shouldResumeAfterTouchHold = !1, this.isStoryHovered = !1, this.storyPointerStartX = null, this.storyTouchStartX = null, this.pauseCurrentVideo(), this.clearTimer(), this.timerState = null, this.resetProgress(), E(t, A.OPEN), E(t, A.PAUSED), E(document.body, A.BODY_OPEN), u([t], A.ROOT_HIDDEN), this.hideStoriesLayer(), this.activeStoryIndex = 0, e?.goTo(0), this.restoreBackgroundForAssistiveTech(), this.restoreTriggerFocus(), this.emitStoriesLifecycle(P.CLOSED));
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
			let t = this.getStoriesTrack(), n = this.storiesLayer, r = b(this.$root, !1)[this.activeStoryIndex], i = t?.getBoundingClientRect().width ?? 0, a = r?.getBoundingClientRect().width ?? 0, o = C(e, A.ROOT_HIDDEN), s = n ? C(n, A.LAYER_HIDDEN) : !1;
			return !this.isOpen || !t || !n || this.progressBars.length === 0 || o || s ? !1 : i > 0 && a > 0;
		}, i = () => {
			t ||= requestAnimationFrame(() => {
				if (t = 0, n += 1, r()) {
					requestAnimationFrame(() => {
						this.focusInitialControl(), this.emitStoriesLifecycle(P.MOUNTED);
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
		if (!n || !p(this.getRootSelector, n)) {
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
		return Array.from(h(t, e)).filter((e) => !S(e, n.ARIA_HIDDEN));
	}
	hideBackgroundFromAssistiveTech(e) {
		this.hiddenBackgroundElements.clear(), this.getBackgroundSiblings(e).forEach((e) => {
			this.hiddenBackgroundElements.set(e, {
				ariaHidden: g(e, n.ARIA_HIDDEN),
				inert: e.inert
			}), k(e, n.ARIA_HIDDEN, "true"), e.inert = !0;
		});
	}
	restoreBackgroundForAssistiveTech() {
		this.hiddenBackgroundElements.forEach((e, t) => {
			e.ariaHidden === null ? T(t, n.ARIA_HIDDEN) : k(t, n.ARIA_HIDDEN, e.ariaHidden), t.inert = e.inert;
		}), this.hiddenBackgroundElements.clear();
	}
	getBackgroundSiblings(e) {
		let t = [], n = this.storiesLayer, r = e;
		for (; r?.parentElement;) {
			let e = r.parentElement;
			if (Array.from(e.children).forEach((e) => {
				e instanceof HTMLElement && e !== r && (n && e === n || p(n, e) || t.push(e));
			}), r = e, e === document.body) break;
		}
		return t;
	}
	setupStoriesRoot(e) {
		u([e], A.ROOT), u([e], A.ROOT_HIDDEN), k(e, n.ROLE, "dialog"), k(e, n.ARIA_MODAL, "true"), k(e, n.TABINDEX, "-1"), S(e, n.ARIA_LABEL) || k(e, n.ARIA_LABEL, "Stories dialog");
	}
	setupStoriesLayer(e) {
		let t = this.getStoriesElement(A.LAYER), n = t ?? this.createStoriesLayer(), r = !t;
		this.storiesLayer = n, r && d(e, n);
	}
	createStoriesLayer() {
		let e = m(c.DIV);
		return u([e], A.LAYER), this.createdElements.add(e), e;
	}
	showStoriesLayer() {
		let e = this.storiesLayer;
		e && E(e, A.LAYER_HIDDEN);
	}
	hideStoriesLayer() {
		let e = this.storiesLayer;
		e && u([e], A.LAYER_HIDDEN);
	}
	setupProgress(e) {
		let t = this.storiesLayer ?? e, n = this.getStoriesElement(A.PROGRESS) ?? this.createProgressContainer(), r = this.getStoryCount(), i = this.getProgressItemTemplate(n), a = !n.parentElement;
		this.destroyProgress(), this.progressContainer = n, this.progressBars = this.createProgressBars(r, i), this.mountProgressBars(n, this.progressBars), a && d(t, n);
	}
	mountProgressBars(e, t) {
		t.forEach((t, n) => {
			let r = t.parentElement;
			this.bindProgressItem(r, n), d(e, r);
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
		w([i.MOUSEDOWN], e, this.handleStoryMouseDown, !0), w([i.MOUSEMOVE], e, this.handleStoryMouseMove, !0), w([i.MOUSEUP, i.MOUSELEAVE], e, this.handleStoryPointerEnd), w([i.TOUCHSTART], e, this.handleStoryTouchStart, !0), w([i.TOUCHMOVE], e, this.handleStoryTouchMove, !0), w([i.TOUCHEND], e, this.handleStoryPointerEnd);
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
		return t ? !!(f(t, `.${A.CLOSE}`) || f(t, `.${A.MUTE}`) || f(t, `.${A.PAUSE_INDICATOR}`) || f(t, `.${A.PAUSE}`) || f(t, `.${A.PLAY}`) || f(t, `.${A.PROGRESS_ITEM}`)) : !1;
	}
	setupControls(e) {
		let t = this.storiesLayer ?? e, n = this.getStoriesElement(A.CLOSE) ?? this.createControlButton(A.CLOSE, M.CLOSE, j.CLOSE), r = this.getStoriesElement(A.MUTE) ?? (this.hasVideos() ? this.createMuteControl() : null), i = this.getStoriesElement(A.PAUSE_INDICATOR) ?? this.createPauseControl();
		this.closeButton = n, this.muteButton = r, this.pauseIndicator = i, this.prepareControlButton(n, M.CLOSE), this.prepareControlButton(r, M.MUTE), this.prepareControlButton(i, M.PAUSE), this.hideMediaControls(), this.bindCloseControlEvents(n), this.bindClickControlEvents(r, this.handleMuteClick), this.bindClickControlEvents(i, this.handlePauseClick), this.bindTrackHoverEvents(), this.mountStoriesElement(t, n), this.mountStoriesElement(t, r), this.mountStoriesElement(t, i);
	}
	bindCloseControlEvents(e) {
		let t = [
			i.POINTERDOWN,
			i.MOUSEDOWN,
			i.TOUCHSTART,
			i.CLICK
		];
		e && t.forEach((t) => {
			w([t], e, this.handleCloseClick, !0), this.controlCleanupCallbacks.push(() => {
				O([t], e, this.handleCloseClick, !0);
			});
		});
	}
	bindClickControlEvents(e, t) {
		if (!e) return;
		let n = (e) => {
			this.lastControlPointerTime = performance.now(), t(e);
		}, r = (e) => {
			if (performance.now() - this.lastControlPointerTime < 350) {
				e.preventDefault(), e.stopImmediatePropagation(), e.stopPropagation();
				return;
			}
			t(e);
		};
		w([i.POINTERDOWN], e, n, !0), w([i.CLICK], e, r, !0), this.controlCleanupCallbacks.push(() => {
			O([i.POINTERDOWN], e, n, !0), O([i.CLICK], e, r, !0);
		});
	}
	bindTrackHoverEvents() {
		let e = this.getStoriesTrack();
		e && (w([i.MOUSEENTER], e, this.handleMouseEnter), w([i.MOUSEMOVE], e, this.handleMouseMove), w([i.MOUSELEAVE], e, this.handleMouseLeave), w([i.POINTERDOWN], e, this.handleStoryPointerDown), w([i.POINTERUP, i.POINTERCANCEL], e, this.handleStoryPointerUp));
	}
	mountStoriesElement(e, t) {
		t && (t.parentElement || p(e, t) || d(e, t));
	}
	setupTriggers() {
		this.getTriggerElements().forEach((e) => this.bindTrigger(e));
	}
	bindTrigger(e) {
		let t = (t) => {
			t.preventDefault(), this.lastTriggerElement = e, this.open();
		};
		w([i.CLICK], e, t), this.triggerCleanupCallbacks.push(() => {
			O([i.CLICK], e, t);
		});
	}
	wrapHostNavigation(e) {
		let t = e.next.bind(e), n = e.prev.bind(e), r = e.goTo.bind(e);
		this.hostMethods = {
			next: t,
			prev: n,
			goTo: r
		}, e.next = () => {
			t();
		}, e.prev = () => {
			n();
		}, e.goTo = (e) => {
			r(e);
		};
	}
	restoreHostNavigation() {
		let e = this.host, t = this.hostMethods;
		!e || !t || (e.next = t.next, e.prev = t.prev, e.goTo = t.goTo, this.hostMethods = null);
	}
	getAdjacentStoryIndex(e) {
		let { activePage: t, slideIndex: n } = this.store, r = typeof n == "number" ? n : typeof t == "number" ? t : this.activeStoryIndex;
		return this.getSafeStoryIndex(r + e);
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
		E(e, [A.ACTIVE_PROGRESS, A.COMPLETED_PROGRESS]);
	}
	setActiveProgressItem(e) {
		u([e], A.ACTIVE_PROGRESS);
	}
	setCompletedProgressItem(e) {
		u([e], A.COMPLETED_PROGRESS);
	}
	animateProgress(e, n, r, i) {
		if (e.getAnimations().forEach((e) => e.cancel()), e.style.transformOrigin = "left center", e.style.scale = `${n} 1`, i <= 0 || n === r) return e.style.scale = `${r} 1`, [];
		let a = this.animate(e, [{ scale: `${n} 1` }, { scale: `${r} 1` }], {
			duration: i,
			easing: t.LINEAR,
			fill: t.FORWARDS
		});
		return a.forEach((e) => e.play()), a;
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
		return e?.slideIndex ?? e?.activePage ?? 0;
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
			u([t], A.HIDDEN);
			return;
		}
		E(t, A.HIDDEN);
		let n = this.hasVideoAudio(e);
		this.syncMuteDisabledState(t, n), this.syncMuteControlVisibility(t);
	}
	syncMuteDisabledState(e, t) {
		let r = e;
		r.disabled = !t, k(e, n.ARIA_DISABLED, String(!t)), t ? E(e, A.MUTE_DISABLED) : u([e], A.MUTE_DISABLED);
	}
	hideMediaControls() {
		let e = this.muteButton, t = this.pauseIndicator;
		this.isTouchControlsVisible = !1, this.clearMobileControlsTimer(), e && u([e], A.HIDDEN), t && (u([t], A.HIDDEN), this.syncPauseControlIcon(t));
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
		this.pluginOptions.useMuted = i, i ? u([t], A.MUTED) : E(t, A.MUTED);
		let a = v(`.${A.MUTE_ON}`, t) ?? null, o = v(`.${A.MUTE_OFF}`, t) ?? null;
		a && o && (i ? (u([a], A.HIDDEN), E(o, A.HIDDEN), k(t, n.ARIA_LABEL, M.MUTE_OFF)) : (E(a, A.HIDDEN), u([o], A.HIDDEN), k(t, n.ARIA_LABEL, M.MUTE_ON)));
	}
	syncMuteControlVisibility(e) {
		if (!this.getCurrentVideo()) {
			u([e], A.HIDDEN);
			return;
		}
		if (!this.supportsHoverPauseControl()) {
			this.isTouchControlsVisible ? E(e, A.HIDDEN) : u([e], A.HIDDEN);
			return;
		}
		this.isStoryHovered ? E(e, A.HIDDEN) : u([e], A.HIDDEN);
	}
	bindMediaStateEvents(e) {
		if (this.clearMediaStateEvents(), !e) return;
		let t = () => {
			this.syncMutedState(e);
		};
		w(["volumechange"], e, t), this.mediaCleanupCallbacks.push(() => {
			O(["volumechange"], e, t);
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
		e && t && (this.isPaused ? u([e], A.PAUSED) : E(e, A.PAUSED), r ? this.showPauseControlElement(t) : this.hidePauseControl(t), n && this.syncMuteControlVisibility(n), this.syncPauseControlIcon(t));
	}
	supportsHoverPauseControl() {
		return typeof window > "u" ? !1 : window.matchMedia("(hover: hover) and (pointer: fine)").matches;
	}
	showPauseControlElement(e) {
		E(e, A.HIDDEN), u([e], "flex"), E(e, "pointer-events-none"), E(e, "opacity-0"), u([e], "pointer-events-auto"), u([e], "opacity-100"), u([e], A.CONTROL_VISIBLE);
	}
	hidePauseControl(e) {
		!this.supportsHoverPauseControl() && !this.isTouchControlsVisible && (u([e], A.HIDDEN), E(e, "flex")), E(e, "pointer-events-auto"), E(e, "opacity-100"), u([e], "pointer-events-none"), u([e], "opacity-0"), E(e, A.CONTROL_VISIBLE);
	}
	syncPauseControlIcon(e) {
		let t = this.getPauseIcon(e), n = this.getPlayIcon(e);
		if (!t && !n) {
			e.innerHTML = this.isPaused ? j.PLAY : j.PAUSE;
			return;
		}
		this.syncIconVisibility(t, !this.isPaused), this.syncIconVisibility(n, this.isPaused);
	}
	syncIconVisibility(e, t) {
		e && (t ? E(e, A.HIDDEN) : u([e], A.HIDDEN));
	}
	getPauseIcon(e) {
		return v(`.${A.PAUSE}`, e) ?? null;
	}
	getPlayIcon(e) {
		return v(`.${A.PLAY}`, e) ?? null;
	}
	getControlFromEvent(e) {
		let t = e.target instanceof Element ? e.target : null, n = this.getPointTargetFromEvent(e), r = e.composedPath(), i = [A.CLOSE], a = i.find((e) => f(t, `.${e}`));
		if (a) return a;
		let o = i.find((e) => f(n, `.${e}`));
		if (o) return o;
		for (let e of r) {
			if (!(e instanceof Element)) continue;
			let t = i.find((t) => C(e, t));
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
		return [A.CLOSE].some((e) => f(t, `.${e}`) || f(n, `.${e}`));
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
		return e instanceof Element ? !!(f(e, `.${A.CLOSE}`) || f(e, `.${A.MUTE}`) || f(e, `.${A.PAUSE_INDICATOR}`) || f(e, `.${A.PROGRESS}`)) : !1;
	}
	getStoriesTrack() {
		return x(this.$root) ?? null;
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
		let e = b(this.$root, !1).length;
		return Math.min(e, this.pluginOptions.maxStories);
	}
	getSafeStoryIndex(e) {
		return Math.max(0, Math.min(e, this.getStoryCount() - 1));
	}
	getStoryVideos(e) {
		let t = b(this.$root, !1)[e];
		return t ? Array.from(h(c.VIDEO, t)) : [];
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
		(e ? h(c.VIDEO, e) : []).forEach((e) => e.pause());
	}
	hasVideos() {
		let e = this.getRootSelector;
		return (e ? h(c.VIDEO, e) : []).length > 0;
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
		e && (O([i.MOUSEENTER], e, this.handleMouseEnter), O([i.MOUSEMOVE], e, this.handleMouseMove), O([i.MOUSELEAVE], e, this.handleMouseLeave), O([i.POINTERDOWN], e, this.handleStoryPointerDown), O([i.POINTERUP, i.POINTERCANCEL], e, this.handleStoryPointerUp));
	}
	destroyProgress() {
		this.progressCleanupCallbacks.forEach((e) => e()), this.progressCleanupCallbacks = [], this.progressBars.forEach((e) => {
			this.removeCreatedElement(e.parentElement), this.removeCreatedElement(e);
		}), this.removeCreatedElement(this.progressContainer), this.progressContainer = null, this.progressBars = [];
	}
	removeCreatedElement(e) {
		e && this.createdElements.has(e) && (D(e), this.createdElements.delete(e));
	}
	destroyEdgeSwipeLock() {
		let e = this.getRootSelector;
		e && (O([i.MOUSEDOWN], e, this.handleStoryMouseDown, !0), O([i.MOUSEMOVE], e, this.handleStoryMouseMove, !0), O([i.MOUSEUP, i.MOUSELEAVE], e, this.handleStoryPointerEnd), O([i.TOUCHSTART], e, this.handleStoryTouchStart, !0), O([i.TOUCHMOVE], e, this.handleStoryTouchMove, !0), O([i.TOUCHEND], e, this.handleStoryPointerEnd));
	}
	createProgressContainer() {
		let e = m(c.DIV);
		return u([e], A.PROGRESS), this.createdElements.add(e), e;
	}
	createProgressBars(e, t) {
		return Array.from({ length: e }, (e, n) => this.createProgressItem(n, t));
	}
	getProgressItemTemplate(e) {
		return v(`.${A.PROGRESS_ITEM}`, e) ?? null;
	}
	createProgressItem(e, t) {
		let n = e === 0 && t, r = n ? t : this.cloneProgressItem(t), i = this.prepareProgressItem(r);
		return n || (this.createdElements.add(r), this.createdElements.add(i)), i;
	}
	cloneProgressItem(e) {
		return e ? e.cloneNode(!0) : m(c.DIV);
	}
	prepareProgressItem(e) {
		let t = v(`.${A.PROGRESS_BAR}`, e) ?? null, n = t ?? m(c.DIV);
		return u([e], A.PROGRESS_ITEM), u([n], A.PROGRESS_BAR), t || d(e, n), n;
	}
	createPauseControl() {
		let e = this.createControlButton(A.PAUSE_INDICATOR, M.PAUSE, ""), t = m(c.SPAN), n = m(c.SPAN);
		return u([t], A.PAUSE), u([n], A.PLAY), u([n], A.HIDDEN), t.innerHTML = j.PAUSE, n.innerHTML = j.PLAY, d(e, t), d(e, n), e;
	}
	createMuteControl() {
		let e = this.createControlButton(A.MUTE, M.MUTE_ON, ""), t = m(c.SPAN), n = m(c.SPAN);
		return u([t], A.MUTE_ON), u([n], A.MUTE_OFF), u([n], A.HIDDEN), t.innerHTML = j.MUTE_ON, n.innerHTML = j.MUTE_OFF, d(e, t), d(e, n), e;
	}
	createControlButton(e, t, n) {
		let r = m(c.BUTTON);
		return u([r], e), this.prepareControlButton(r, t), r.innerHTML = n, this.createdElements.add(r), r;
	}
	prepareControlButton(e, t) {
		e && (k(e, n.TYPE, c.BUTTON), k(e, n.ARIA_LABEL, t));
	}
	getStoriesElement(t) {
		let n = this.getRootSelector, r = n ? v(`.${t}`, n) ?? null : null, i = e(`.${t}`);
		return r ?? i;
	}
	getTriggerElements() {
		let { trigger: e } = this.pluginOptions;
		return e ? typeof e == "string" ? Array.from(h(e)) : Array.isArray(e) ? e : [e] : [];
	}
	resolveOptions(e) {
		let t = this.resolveDuration(e.duration), n = this.resolveMaxVideoDuration(e.maxVideoDuration), r = this.resolveMaxStories(e.maxStories);
		return {
			trigger: e.trigger,
			duration: t,
			maxVideoDuration: n,
			maxStories: r,
			pauseOnHover: e.pauseOnHover ?? !0,
			closeOnEnd: e.closeOnEnd ?? F.CLOSE_ON_END,
			useMuted: e.useMuted ?? !0
		};
	}
	resolveDuration(e) {
		return Number.isFinite(e) ? Math.max(F.MIN_VIDEO_DURATION, Number(e)) : F.DURATION;
	}
	resolveMaxVideoDuration(e) {
		return Number.isFinite(e) ? (Number(e) > F.MAX_VIDEO_DURATION && console.warn(`[BrickSlider Stories] maxVideoDuration is too high and was capped at ${F.MAX_VIDEO_DURATION}ms.`), Math.min(Math.max(F.MIN_VIDEO_DURATION, Number(e)), F.MAX_VIDEO_DURATION)) : F.MAX_VIDEO_DURATION;
	}
	resolveMaxStories(e) {
		return Number.isFinite(e) ? (Number(e) > F.MAX_STORIES_LIMIT && console.warn(`[BrickSlider Stories] maxStories is too high and was capped at ${F.MAX_STORIES_LIMIT}.`), Math.min(Math.max(1, Math.floor(Number(e))), F.MAX_STORIES_LIMIT)) : F.MAX_STORIES;
	}
};
//#endregion
export { z as BSStoriesPlugin, z as BrickSliderStories, z as StoriesPlugin, z as default, P as STORIES_EVENTS };
