/*!
 * brick-slider.js
 * Version  : 0.0.0
 * License  : MIT
 * Copyright: 2024 @malopestorres
 */
var it = Object.defineProperty;
var rt = (e, t, s) => t in e ? it(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var o = (e, t, s) => (rt(e, typeof t != "symbol" ? t + "" : t, s), s);
function H(e) {
  const t = document.querySelector(e);
  if (!t)
    throw new Error(`Element not found: ${e}`);
  return t;
}
function p(e) {
  return e.offsetWidth;
}
function W(e, t, s) {
  const n = s * t;
  return -(p(e) * s + n);
}
const $ = {
  CHILDREN_SELECTOR: ".slider__container",
  DOTS_SELECTOR: ".slider__dots ",
  NEXT_BUTTON: "next-button",
  PREV_BUTTON: "prev-button",
  BRICK_ARROWS: "brick-arrows"
}, O = {
  TRANSITION: "transition"
}, L = {
  UL: "ul",
  LI: "li",
  BUTTON: "button",
  DIV: "div"
}, ot = {
  VISIBLE: "visible",
  HIDDEN: "hidden"
}, A = {
  ACTIVE: "active",
  SLIDER_DOT: "slider__dot",
  SELECTED: "slider__dot--active",
  CLONED: "cloned"
}, k = {
  CLASS: "class",
  ARIA_HIDDEN: "aria-hidden",
  ROLE: "role",
  DIRECTION: "data-direction"
}, at = {
  VISIBILITY: "visibility"
}, Q = {
  DEFAULT_TRANSITION_TIME: 400
}, v = {
  TRANSFORM_EASE: `transform ${Q.DEFAULT_TRANSITION_TIME}ms cubic-bezier(0.25,1,0.5,1)`
}, S = {
  RESIZE: "resize",
  CLICK: "click",
  TOUCHSTART: "touchstart",
  TOUCHEND: "touchend",
  TOUCHMOVE: "touchmove",
  MOUSEDOWN: "mousedown",
  MOUSEUP: "mouseup",
  MOUSELEAVE: "mouseleave",
  MOUSEMOVE: "mousemove",
  TRANSITIONSTART: "transitionstart",
  TRANSITIONEND: "transitionend"
}, ct = 100, F = $.DOTS_SELECTOR, b = $.CHILDREN_SELECTOR, lt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ATTRIBUTES: k,
  CLASS_VALUES: A,
  DOM_ELEMENTS: $,
  EVENTS: S,
  PROPERTYS: at,
  PROPERTYS_VALUES: ot,
  STYLES: O,
  TAGS: L,
  TIMES: Q,
  TOUCH_LIMIT: ct,
  TRANSITIONS: v,
  childrenSelector: b,
  dotsSelector: F
}, Symbol.toStringTag, { value: "Module" })), K = (e) => (e.type.includes("mouse"), e);
function _(e) {
  return e.type.includes("mouse") ? e.pageX : e.touches && e.touches.length > 0 ? e.touches[0].clientX : NaN;
}
var r = /* @__PURE__ */ ((e) => (e.isLoadPage = "isLoadPage", e.Counter = "counter", e.Seconds = "seconds", e.SlideIndex = "slideIndex", e.SlideSpacing = "slideSpacing", e.SlidesPerPage = "slidesPerPage", e.NumberOfSlides = "numberOfSlides", e.SliderWidth = "sliderWidth", e.SliderReady = "sliderReady", e.isStopSlider = "isStopSlider", e.isTouch = "isTouch", e.isDragging = "isDragging", e.IsJumpSlide = "isJumpSlide", e.startPos = "startPos", e.prevTranslate = "prevTranslate", e.currentTranslate = "currentTranslate", e.StartTime = "startTime", e.EndTime = "endTime", e.IsMouseLeave = "isMouseLeave", e.animationID = "animationID", e.Autoplay = "autoplay", e.AutoplaySpeed = "autoplaySpeed", e.Dots = "dots", e.Arrows = "arrows", e.Touch = "touch", e.Infinite = "infinite", e.Speed = "speed", e.Transition = "transition", e.UseTailwind = "useTailwind", e))(r || {});
const l = class l {
  constructor(t, s = {}) {
    o(this, "key");
    this.key = t, l.state[t] || (l.state[t] = {}, this.initializeState(s));
  }
  initializeState(t) {
    if (l.state[this.key].isLoadPage = !1, l.state[this.key].counter = 0, l.state[this.key].seconds = 0, l.state[this.key].slideIndex = 0, l.state[this.key].slideSpacing = t.spacing ?? 10, l.state[this.key].slidesPerPage = t.slidesPerPage ?? 1, l.state[this.key].numberOfSlides = 0, l.state[this.key].sliderWidth = 0, l.state[this.key].sliderReady = !0, l.state[this.key].isStopSlider = !1, l.state[this.key].isTouch = !1, l.state[this.key].isDragging = !1, l.state[this.key].isJumpSlide = !1, l.state[this.key].startPos = 0, l.state[this.key].prevTranslate = 0, l.state[this.key].currentTranslate = 0, l.state[this.key].startTime = 0, l.state[this.key].endTime = 0, l.state[this.key].isMouseLeave = !0, l.state[this.key].animationID = 0, l.state[this.key].autoplay = t.autoplay ?? !1, l.state[this.key].autoplaySpeed = t.autoplaySpeed ?? 3e3, l.state[this.key].dots = t.dots ?? !0, l.state[this.key].arrows = t.arrows ?? !0, l.state[this.key].touch = t.touch ?? !0, l.state[this.key].infinite = t.infinite ?? !1, l.state[this.key].speed = t.speed ?? 300, l.state[this.key].transition = t.transition ?? "slide", l.state[this.key].useTailwind = t.useTailwind ?? !0, t.sliderOptions)
      for (const s in t.sliderOptions)
        t.sliderOptions.hasOwnProperty(s) && (l.state[this.key][s] = t.sliderOptions[s]);
  }
  get(t) {
    return l.state[this.key][t] ?? "";
  }
  get store() {
    return l.state[this.key];
  }
  set(t, s) {
    l.state[this.key][t] = s;
  }
  setOptions(t) {
    this.initializeState(t);
  }
  setMultipleState(t) {
    for (const s in t)
      t.hasOwnProperty(s) && (l.state[this.key][s] = t[s]);
  }
};
o(l, "state", {});
let T = l;
function dt(e, t) {
  e.get(r.Infinite) && t();
}
function ut(e) {
  return /^[.#].*/.test(e);
}
function g(e, t, s) {
  if (typeof e == "string")
    t.addEventListener(e, s);
  else if (Array.isArray(e))
    e.forEach((n) => {
      t.addEventListener(n, s);
    });
  else
    throw new Error(
      "The 'events' parameter must be a string or an array of strings"
    );
}
function X(e, t, s) {
  return s > 1 && (t = t - (s + s)), e < 0 ? t - 1 : e >= t ? e : e === t - 1 ? 0 : e === 0 ? t - 3 : e - 1;
}
function M(e, t) {
  e.forEach((s) => {
    s.classList.add(t);
  });
}
function z(e, t) {
  return e && e.appendChild(t), t;
}
function q(e) {
  return document.createElement(e);
}
function U(e, t = document) {
  return t.querySelectorAll(e);
}
function E(e) {
  return H(`${e} ${b}`);
}
function J(e) {
  return e.children.length;
}
function ht(e) {
  return H(`${e} ${F}`);
}
function Tt(e, t) {
  return e.getAttribute(t);
}
function j(e) {
  return H(`${e}`);
}
function ft(e, t) {
  return e.classList.contains(t);
}
function St(e, t) {
  e.prepend(t);
}
function tt(e, t) {
  e.classList.remove(t);
}
function et(e, t, s) {
  e.setAttribute(t, s);
}
function Et(e, t) {
  e.innerHTML = t;
}
function w(e, t, s) {
  e.style[t] = s;
}
function It(e, t) {
  e.style.transform = `translate3d(${t()}px, 0, 0)`;
}
const x = (e) => Array.from(
  U(`${b} > *`, E(e))
);
function st(e, t) {
  let s;
  function n(i) {
    s || (s = i), i - s < e ? requestAnimationFrame(n) : t();
  }
  requestAnimationFrame(n);
}
function mt(e, t) {
  return t > 1 ? Math.floor(e / t) : e;
}
function Ot(e, t) {
  const s = j(t);
  return e.forEach((n) => {
    St(s, n);
  }), e;
}
function gt(e, t) {
  t.forEach((s) => {
    z(e, s);
  });
}
function Nt(e, t) {
  const s = E(e), n = x(e), i = n.length;
  if (i < t)
    return;
  t = Math.min(t, i);
  const c = [];
  for (let a = 0; a < t; a++) {
    const d = n[a].cloneNode(!0);
    c.push(d), s.appendChild(d);
  }
  for (let a = i - t; a < i; a++) {
    const d = n[a].cloneNode(!0);
    c.push(d), s.insertBefore(d, n[0]);
  }
  M(c, A.CLONED);
}
function At(e) {
  const { from: t, currentSlideIndex: s, index: n } = e;
  switch (t) {
    case I.NEXT:
      return s + 1;
    case I.PREV:
      return s - 1;
    case I.DOTS:
    case I.TOUCH:
      return n ?? s;
    default:
      return s;
  }
}
function G(e, t, s) {
  let n = 0;
  for (e.forEach((i) => {
    tt(i, A.ACTIVE);
  }), n; n < s; n++) {
    const i = t * s + n;
    M([e[i]], A.ACTIVE);
  }
}
var I = /* @__PURE__ */ ((e) => (e.DOTS = "dots", e.PREV = "prev", e.NEXT = "next", e.TOUCH = "touch", e))(I || {});
function Y(e = {
  $root: ""
}) {
  const { index: t, $root: s } = e, n = new T(s), i = e.from, c = n.get(r.Infinite), {
    slideIndex: a,
    numberOfSlides: d,
    slidesPerPage: u
  } = n.store, f = x(s);
  let h = At({
    from: i,
    currentSlideIndex: a,
    index: t
  });
  !c && h > d - 1 || !c && h < 0 || (h > d + 1 && (h = h - 1), h < 0 && (h = h + 1), n.set(r.SlideIndex, h), G(f, h, u), D(s));
}
function wt(e) {
  const t = [];
  for (let s = 0; s < e; s++) {
    const n = q(L.BUTTON), i = s === 0;
    et(
      n,
      k.DIRECTION,
      i ? I.NEXT : I.PREV
    ), M([n], $.BRICK_ARROWS), Et(n, i ? I.NEXT : I.PREV), t.push(n);
  }
  return t;
}
function Rt(e, t) {
  const s = new T(e), { slidesPerPage: n } = s.store, i = s.get(r.Infinite), c = E(e), a = J(c);
  i && n <= 1 && s.set(r.NumberOfSlides, a - 2), i && n > 1 && s.set(
    r.NumberOfSlides,
    Math.ceil(a / n) - n
  ), !i && n > 1 && s.set(r.NumberOfSlides, Math.ceil(a / n));
  const d = s.get(r.NumberOfSlides);
  for (let u = 0; u < d; u++) {
    const f = q(L.LI);
    z(t, f), M([f], A.SLIDER_DOT), u === 0 && M([f], A.SELECTED);
  }
}
function V(e, t) {
  const s = U(
    L.LI,
    ht(t)
  ), n = e ?? 0;
  s.forEach((i, c) => {
    ft(i, A.SELECTED) && tt(i, A.SELECTED), c === n && M([i], A.SELECTED);
  });
}
function nt(e, t, s) {
  if (t) {
    new T(e);
    for (const [n, i] of Object.entries(t))
      if (T.state[e][n] !== i)
        return !1;
    return s && s(), !0;
  }
  return !1;
}
function Dt(e, t) {
  return () => {
    const s = new T(t), n = s.get(r.Infinite), i = E(t);
    g(
      S.MOUSELEAVE,
      e,
      () => w(i, O.TRANSITION, "")
    ), w(i, O.TRANSITION, v.TRANSFORM_EASE);
    const a = Tt(e, k.DIRECTION) === I.PREV;
    s.set(r.SliderReady, !1), Y({
      from: a ? I.PREV : I.NEXT,
      $root: t
    });
    const { slidesPerPage: d, slideIndex: u } = s.store, f = J(i), h = n ? X(u, f, d) : u;
    nt(t, { [r.Dots]: !0 }, () => {
      V(h, t);
    }), st(100, () => {
    }), g(S.TRANSITIONEND, i, () => {
      s.set(r.EndTime, Date.now());
      const { startTime: m, endTime: R, numberOfSlides: N } = s.store, y = Math.abs(m - R) >= 300;
      s.set(r.SliderReady, !0), (y || !n && h > N - 1 || !n && N < 0) && w(i, O.TRANSITION, "");
    });
  };
}
class Ct {
  constructor(t) {
    o(this, "$root");
    this.$root = t;
  }
  init() {
    const { $root: t } = this, { EVENTS: s } = lt, n = new T(t), i = wt(2);
    Ot(i, t).forEach((a) => {
      g(s.CLICK, a, () => {
        n.set(r.StartTime, Date.now()), Dt(a, t)();
      });
    });
  }
}
class Lt {
  constructor(t) {
    o(this, "$root");
    this.$root = t;
  }
  init() {
    const t = j(this.$root), s = q(L.UL), n = new T(this.$root);
    et(s, k.CLASS, F.replace(".", "")), z(t, s), Rt(this.$root, s);
    const i = U(L.LI, s);
    Array.from(i).forEach((c, a) => {
      const d = () => {
        n.set(r.SlideIndex, a), Bt(this.$root);
      };
      g(S.CLICK, c, d);
    });
  }
}
class Mt {
  constructor(t) {
    o(this, "state");
    o(this, "$root");
    o(this, "slider");
    this.state = new T(t), this.$root = t, this.slider = j(t);
  }
  init() {
    const { state: t, $root: s, slider: n } = this, {
      slideIndex: i,
      numberOfSlides: c,
      slidesPerPage: a,
      infinite: d
    } = t.store, u = p(n), f = i * -u;
    t.setMultipleState({
      [r.currentTranslate]: f,
      [r.prevTranslate]: f
    });
    const [h, m] = [i, I.TOUCH];
    Y({
      from: m,
      index: h,
      $root: s
    });
    const R = d ? X(h, c, a) : h;
    nt(s, { [r.Dots]: !0 }, () => {
      V(R, s), console.log("pinduco");
    });
  }
}
class Z {
  constructor(t) {
    o(this, "$root");
    o(this, "state");
    o(this, "init", () => {
      const { state: t, $root: s, init: n } = this, { currentTranslate: i, isDragging: c } = t.store;
      D(s, i), c && requestAnimationFrame(n);
    });
    this.state = new T(t), this.$root = t;
  }
}
class yt {
  constructor(t) {
    o(this, "$root");
    o(this, "state");
    o(this, "setPosition");
    o(this, "animation");
    o(this, "init", (t) => {
      const { $root: s, state: n, setPosition: i } = this, c = E(s), {
        animationId: a,
        isJumpSlide: d,
        isMouseLeave: u,
        numberOfSlides: f,
        slidesPerPage: h,
        infinite: m,
        currentTranslate: R,
        prevTranslate: N
      } = n.store, y = x(s), P = R - N;
      u || w(c, O.TRANSITION, v.TRANSFORM_EASE), typeof a == "number" && cancelAnimationFrame(a);
      let C = n.get(r.SlideIndex);
      Ut(P, C, y) && n.set(r.SlideIndex, C += 1), Vt(P, C) && n.set(r.SlideIndex, C -= 1), console.log({ isMouseLeave: u, currentIndex: C }), !u && !d && i.init(), m && V(X(C, 6, h), s), g(S.TRANSITIONEND, c, () => {
        w(c, O.TRANSITION, "");
      }), n.setMultipleState({
        [r.isDragging]: !1,
        [r.IsMouseLeave]: !0,
        [r.isTouch]: !1,
        [r.EndTime]: (/* @__PURE__ */ new Date()).getMilliseconds()
      });
    });
    this.$root = t, this.state = new T(this.$root), this.setPosition = new Mt(this.$root), this.animation = new Z(this.$root);
  }
}
class Pt {
  constructor(t) {
    o(this, "$root");
    o(this, "state");
    o(this, "animation");
    o(this, "init", (t) => {
      const { state: s, $root: n, animation: i } = this, c = K(t), {
        isDragging: a,
        prevTranslate: d,
        startPos: u,
        infinite: f
      } = s.store, h = _(c), m = E(n), R = p(m);
      if (a) {
        s.setMultipleState({
          [r.isTouch]: !0,
          [r.currentTranslate]: d + h - u
        });
        let N = s.get(r.currentTranslate);
        g(
          [S.TOUCHEND, S.MOUSEUP, S.MOUSELEAVE],
          m,
          () => {
            if (f && Math.abs(N) <= R / 2) {
              s.set(r.IsJumpSlide, !0);
              const y = Math.abs(N) + 2352;
              s.set(r.SlideIndex, 4), s.set(r.currentTranslate, -y);
              const P = s.get(r.currentTranslate);
              N = P, w(m, O.TRANSITION, ""), D(n, -P), st(0, () => {
                s.set(r.currentTranslate, -2352), s.set(r.prevTranslate, -2352), w(m, O.TRANSITION, v.TRANSFORM_EASE), D(n, -2352);
              });
            }
          }
        ), D(n, N), requestAnimationFrame(i.init);
      }
    });
    this.$root = t, this.state = new T(this.$root), this.animation = new Z(this.$root);
  }
}
class pt {
  constructor(t) {
    o(this, "$root");
    o(this, "state");
    o(this, "animation");
    this.$root = t, this.state = new T(t), this.animation = new Z(t);
  }
  init(t) {
    return (s) => {
      const { $root: n, state: i, animation: c } = this, {
        slideIndex: a,
        slidesPerPage: d,
        numberOfSlides: u,
        infinite: f
      } = i.store, h = K(s), m = E(n);
      w(m, O.TRANSITION, ""), i.setMultipleState({
        [r.StartTime]: (/* @__PURE__ */ new Date()).getMilliseconds(),
        [r.SlideIndex]: mt(t, d),
        [r.startPos]: _(h),
        [r.isDragging]: !0,
        [r.IsMouseLeave]: !1,
        [r.IsJumpSlide]: !1,
        [r.animationID]: requestAnimationFrame(c.init)
      });
    };
  }
}
function vt(e) {
  const { element: t, touchStart: s, touchEnd: n, touchMove: i } = e;
  g([S.TOUCHSTART, S.MOUSEDOWN], t, s), g(
    [S.TOUCHEND, S.MOUSELEAVE, S.MOUSEUP],
    t,
    n
  ), g([S.TOUCHMOVE, S.MOUSEMOVE], t, i);
}
class xt {
  constructor(t) {
    o(this, "$root");
    o(this, "slider");
    o(this, "slides");
    o(this, "state");
    o(this, "touchStart");
    o(this, "touchEnd");
    o(this, "touchMove");
    this.$root = t, this.slider = E(t), this.slides = Array.from(
      U(`${b} > *`, this.slider)
    ), this.state = new T(this.$root), this.touchStart = new pt(this.$root), this.touchEnd = new yt(this.$root), this.touchMove = new Pt(this.$root);
  }
  init() {
    const { slides: t, touchStart: s, touchEnd: n, touchMove: i } = this;
    t.forEach((c, a) => {
      const d = {
        element: c,
        index: a,
        touchStart: s.init(a),
        touchEnd: n.init.bind(n),
        touchMove: i.init.bind(i)
      };
      vt(d);
    });
  }
}
function $t(e, t) {
  const { dots: s, arrows: n, touch: i } = t || {};
  s && new Lt(e).init(), n && new Ct(e).init(), i && new xt(e).init();
}
function kt(e) {
  const t = new T(e), s = E(e), { currentTranslate: n, slidesPerPage: i, slideIndex: c, slideSpacing: a } = t.store, d = n + 1, u = W(s, a, d);
  Nt(e, i), G(x(e), c, i), D(e, u), t.setMultipleState({
    currentTranslate: u,
    prevTranslate: u,
    slideIndex: d
  });
}
function bt(e, t) {
  const s = new T(e), n = E(e), { slideIndex: i, slideSpacing: c } = s.store, a = W(n, c, i), d = t;
  return !t && s.setMultipleState({
    [r.prevTranslate]: a,
    [r.currentTranslate]: a
  }), d || a;
}
function Ut(e, t, s) {
  const n = e < -294, i = t < s.length - 1;
  return n && i;
}
function Vt(e, t) {
  const s = e > 294, n = t > 0;
  return s && n;
}
function Bt(e) {
  const t = new T(e), s = I.DOTS;
  let n = t.get(r.SlideIndex);
  V(n, e);
  const i = t.get(r.Infinite), c = E(e);
  w(c, O.TRANSITION, v.TRANSFORM_EASE), Y({
    from: s,
    index: i ? ++n : n,
    $root: e
  });
}
function D(e, t) {
  const s = E(e);
  It(s, () => bt(e, t));
}
class Ht {
  constructor(t) {
    o(this, "$root");
    this.$root = t;
  }
  init() {
    const { $root: t } = this, s = new T(t), { slideSpacing: n, slideIndex: i } = s.store, c = p(E(t)), a = E(t), d = W(a, n, i);
    s.set(r.SliderWidth, c), D(t, d);
  }
}
class Wt {
  constructor(t) {
    o(this, "spacing");
    o(this, "slidesPerPage");
    o(this, "autoplay");
    o(this, "autoplaySpeed");
    o(this, "dots");
    o(this, "arrows");
    o(this, "touch");
    o(this, "infinite");
    o(this, "speed");
    o(this, "transition");
    o(this, "useTailwind");
    this.autoplay = (t == null ? void 0 : t.autoplay) ?? !1, this.spacing = (t == null ? void 0 : t.spacing) ?? 10, this.slidesPerPage = (t == null ? void 0 : t.slidesPerPage) ?? 1, this.autoplaySpeed = (t == null ? void 0 : t.autoplaySpeed) ?? 500, this.dots = (t == null ? void 0 : t.dots) ?? !0, this.arrows = (t == null ? void 0 : t.arrows) ?? !0, this.infinite = (t == null ? void 0 : t.infinite) ?? !1, this.speed = (t == null ? void 0 : t.speed) ?? 500, this.transition = (t == null ? void 0 : t.transition) ?? "slide", this.touch = (t == null ? void 0 : t.touch) ?? !0, this.useTailwind = (t == null ? void 0 : t.useTailwind) ?? !0;
  }
}
class Ft {
  constructor() {
  }
  next() {
  }
  prev() {
  }
  goTo(t) {
    console.log("index do slider é", t);
  }
  play() {
  }
  pause() {
  }
  stop() {
  }
  destroy() {
  }
}
function Xt(e, t) {
  if (!e)
    throw new Error(` ${t || ""}`);
}
class B extends Ft {
  constructor(s, n) {
    super();
    o(this, "clonedSlides", []);
    o(this, "$root");
    o(this, "options");
    o(this, "resize");
    Xt(ut(s), "Main Selector Not Found"), this.$root = s, this.options = { ...new Wt(), ...n }, this.resize = new Ht(s);
  }
  init() {
    const { $root: s, options: n, clonedSlides: i, resize: c } = this, a = new T(s, n), d = E(s), { slideIndex: u, slidesPerPage: f } = a.store;
    dt(a, () => kt(s)), a.setMultipleState({
      sliderWidth: p(d),
      numberOfSlides: J(d)
    }), G(x(s), u, f), g(S.RESIZE, window, () => c.init()), gt(d, i), $t(s, n);
  }
}
const zt = new B("#slide4_container", {
  infinite: !0,
  slidesPerPage: 2,
  spacing: 20
});
zt.init();
const qt = new B("#slide1_container", {
  infinite: !0,
  spacing: 20
});
qt.init();
const Jt = new B("#slide2_container", {
  arrows: !0,
  spacing: 20
});
Jt.init();
const jt = new B("#slide3_container", { spacing: 20 });
jt.init();
export {
  B as BrickSlider
};
