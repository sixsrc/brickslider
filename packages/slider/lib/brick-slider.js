/*!
 * brick-slider.js
 * Version  : 0.0.0
 * License  : MIT
 * Copyright: 2023 @malopestorres
 */
var Y = Object.defineProperty;
var J = (e, t, i) => t in e ? Y(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var a = (e, t, i) => (J(e, typeof t != "symbol" ? t + "" : t, i), i);
function Q(e) {
  return e.children.length;
}
function b(e) {
  return (e == null ? void 0 : e.children.item(0)) ?? null;
}
const v = {
  CHILDREN_SELECTOR: ".slider__container",
  DOTS_SELECTOR: ".slider__dots ",
  NEXT_BUTTON: "next-button",
  PREV_BUTTON: "prev-button",
  BRICK_ARROWS: "brick-arrows"
}, K = {
  TRANSITION: "transition"
}, A = {
  UL: "ul",
  LI: "li",
  BUTTON: "button",
  DIV: "div"
}, T = {
  ACTIVE: "active",
  SLIDER_DOT: "slider__dot",
  SELECTED: "slider__dot--active",
  CLONED: "cloned"
}, k = {
  CLASS: "class",
  ARIA_HIDDEN: "aria-hidden",
  ROLE: "role",
  DIRECTION: "data-direction"
}, f = {
  RESIZE: "resize",
  CLICK: "click",
  TOUCHSTART: "touchstart",
  TOUCHEND: "touchend",
  TOUCHMOVE: "touchmove",
  MOUSEDOWN: "mousedown",
  MOUSEUP: "mouseup",
  MOUSELEAVE: "mouseleave",
  MOUSEMOVE: "mousemove",
  TRANSITIONEND: "transitionend"
}, z = v.DOTS_SELECTOR, D = v.CHILDREN_SELECTOR;
function m(e, t) {
  e.forEach((i) => {
    i.classList.add(t);
  });
}
function P(e) {
  return e.offsetWidth;
}
function p(e) {
  const t = document.querySelector(e);
  if (!t)
    throw new Error(`Element not found: ${e}`);
  return t;
}
function S(e, t, i) {
  t.addEventListener(e, i);
}
function _(e, t) {
  e.style.transform = `translate3d(${t()}px, 0, 0)`;
}
var n = /* @__PURE__ */ ((e) => (e.RootSelector = "rootSelector", e.LoadPage = "loadPage", e.SlideIndex = "slideIndex", e.SlideInfiniteIndex = "slideInfiniteIndex", e.NumberOfSlides = "numberOfSlides", e.SliderWidth = "sliderWidth", e.SliderReady = "sliderReady", e.TransitionBypass = "transitionBypass", e.isStopSlider = "isStopSlider", e.isDragging = "isDragging", e.startPos = "startPos", e.prevTranslate = "prevTranslate", e.currentTranslate = "currentTranslate", e.animationID = "animationID", e.Autoplay = "autoplay", e.AutoplaySpeed = "autoplaySpeed", e.Dots = "dots", e.Arrows = "arrows", e.Touch = "touch", e.Infinite = "infinite", e.Speed = "speed", e.Mode = "mode", e.Transition = "transition", e.UseTailwind = "useTailwind", e))(n || {});
const l = class l {
  constructor(t, i = {}) {
    a(this, "key");
    this.key = t, l.state[t] || (l.state[t] = {}, this.initializeState(i));
  }
  initializeState(t) {
    if (l.state[this.key].rootSelector = null, l.state[this.key].loadPage = !0, l.state[this.key].slideIndex = 0, l.state[this.key].slideInfiniteIndex = 0, l.state[this.key].numberOfSlides = 0, l.state[this.key].sliderWidth = 0, l.state[this.key].sliderReady = !0, l.state[this.key].transitionBypass = !1, l.state[this.key].isStopSlider = !1, l.state[this.key].isDragging = !1, l.state[this.key].startPos = 0, l.state[this.key].prevTranslate = 0, l.state[this.key].currentTranslate = 0, l.state[this.key].autoplay = t.autoplay ?? !1, l.state[this.key].autoplaySpeed = t.autoplaySpeed ?? 3e3, l.state[this.key].dots = t.dots ?? !0, l.state[this.key].arrows = t.arrows ?? !0, l.state[this.key].touch = t.touch ?? !0, l.state[this.key].infinite = t.infinite ?? !1, l.state[this.key].speed = t.speed ?? 300, l.state[this.key].mode = t.mode ?? "vertical", l.state[this.key].transition = t.transition ?? "slide", l.state[this.key].useTailwind = t.useTailwind ?? !0, t.sliderOptions)
      for (const i in t.sliderOptions)
        t.sliderOptions.hasOwnProperty(i) && (l.state[this.key][i] = t.sliderOptions[i]);
  }
  get(t) {
    return l.state[this.key][t] ?? "";
  }
  set(t, i) {
    l.state[this.key][t] = i;
  }
  setOptions(t) {
    this.initializeState(t);
  }
  setMultipleState(t) {
    for (const i in t)
      t.hasOwnProperty(i) && (l.state[this.key][i] = t[i]);
  }
};
a(l, "state", {});
let u = l;
function tt(e, t) {
  const i = new u(e), s = i.get(n.SlideIndex), r = i.get(n.SliderWidth), o = -r * s;
  return !t && i.setMultipleState({
    [n.prevTranslate]: o,
    [n.currentTranslate]: o
  }), t || o;
}
function E(e) {
  return p(`${e} ${D}`);
}
function N(e, t) {
  const i = E(e);
  _(i, () => tt(e, t));
}
function et(e) {
  const t = P(E(e));
  new u(e).set(n.SliderWidth, t), N(e);
}
function q(e, t) {
  e.innerHTML = t;
}
function M(e, t, i) {
  e.setAttribute(t, i);
}
function it(e, t) {
  for (const [i, s] of Object.entries(t))
    M(e, i, s);
}
function st(e, t, i) {
  if (e)
    for (let s = 0; s < e; s++) {
      const r = t.children[s].cloneNode(
        !0
      );
      it(r, {
        "aria-hidden": "true",
        role: "presentation"
      }), i.push(r);
    }
  q(t, "");
}
function U(e, t) {
  return e && e.appendChild(t), t;
}
function nt(e, t) {
  t.forEach((i) => {
    U(e, i);
  });
}
function rt(e, t) {
  if (!e)
    throw new Error(` ${t || ""}`);
}
function at(e) {
  return /^[.#].*/.test(e);
}
class ot {
  constructor(t) {
    a(this, "autoplay");
    a(this, "autoplaySpeed");
    a(this, "dots");
    a(this, "arrows");
    a(this, "touch");
    a(this, "infinite");
    a(this, "speed");
    a(this, "mode");
    a(this, "transition");
    a(this, "useTailwind");
    this.autoplay = (t == null ? void 0 : t.autoplay) ?? !1, this.autoplaySpeed = (t == null ? void 0 : t.autoplaySpeed) ?? 500, this.dots = (t == null ? void 0 : t.dots) ?? !0, this.arrows = (t == null ? void 0 : t.arrows) ?? !0, this.infinite = (t == null ? void 0 : t.infinite) ?? !1, this.speed = (t == null ? void 0 : t.speed) ?? 500, this.mode = (t == null ? void 0 : t.mode) ?? "horizontal", this.transition = (t == null ? void 0 : t.transition) ?? "slide", this.touch = (t == null ? void 0 : t.touch) ?? !0, this.useTailwind = (t == null ? void 0 : t.useTailwind) ?? !0;
  }
}
function O(e, t = document) {
  return t.querySelectorAll(e);
}
function lt(e) {
  const {
    /* slideImage,*/
    element: t,
    touchStart: i,
    touchEnd: s,
    touchMove: r
  } = e;
  S(f.TOUCHSTART, t, i), S(f.TOUCHEND, t, s), S(f.TOUCHMOVE, t, r), S(f.MOUSEDOWN, t, i), S(f.MOUSEUP, t, s), S(f.MOUSELEAVE, t, s), S(f.MOUSEMOVE, t, r);
}
function dt(e, t, i) {
  const s = e < -100, r = t < i.length - 1;
  return s && r;
}
function ct(e, t) {
  const i = e > 100, s = t > 0;
  return i && s;
}
function F(e, t) {
  return e < 0 ? t - 1 : e >= t ? e : e === t - 1 ? 0 : e === 0 ? t - 3 : e - 1;
}
function ut(e) {
  const { from: t, currentSlideIndex: i, index: s } = e;
  switch (t) {
    case h.NEXT:
      return i + 1;
    case h.PREV:
      return i - 1;
    case h.DOTS:
    case h.TOUCH:
      return s ?? i;
    default:
      return i;
  }
}
function R(e, t) {
  return e.classList.contains(t);
}
function V(e, t) {
  e.classList.remove(t);
}
function ht(e, t, i, s) {
  const r = new u(e), o = Array.from(
    O(`${D} > *`, E(e))
  ), [d, c] = [
    t === h.PREV && s === 0,
    t === h.NEXT && s === o.length - 1
  ];
  R(i, T.ACTIVE) && (d || c ? r.set(n.isStopSlider, !0) : r.get(n.isStopSlider) || V(i, T.ACTIVE), r.set(n.SlideIndex, s));
}
function y(e, t, i) {
  if (t) {
    new u(e);
    for (const [s, r] of Object.entries(t))
      if (u.state[e][s] !== r)
        return !1;
    return i && i(), !0;
  }
  return !1;
}
function ft(e, t, i) {
  e.style[t] = i;
}
function w(e, t) {
  const i = E(e);
  ft(i, K.TRANSITION, t);
}
class B {
  constructor(t) {
    a(this, "rootSelector");
    a(this, "state");
    a(this, "init", () => {
      const { state: t, rootSelector: i, init: s } = this, [r, o] = [
        t.get(n.currentTranslate),
        t.get(n.isDragging)
      ];
      N(i, r), o && requestAnimationFrame(s);
    });
    this.state = new u(t), this.rootSelector = t;
  }
}
function G(e) {
  const t = E(e), i = Array.from(
    O(`${D} > *`, E(e))
  ), s = new u(e);
  S(f.TRANSITIONEND, t, () => {
  }), y(e, { [n.Infinite]: !0 }, () => {
    i.forEach((r, o) => {
      const d = s.get(n.NumberOfSlides);
      S(f.TRANSITIONEND, t, () => {
        if (R(r, T.ACTIVE) && o === 0) {
          s.set(n.SliderReady, !1), s.set(n.SlideIndex, d);
          const c = new B(e);
          requestAnimationFrame(c.init), N(e), V(r, T.ACTIVE), w(e, "");
        } else
          R(r, T.ACTIVE) && o !== 0 && s.set(n.SliderReady, !0);
      });
    });
  });
}
var h = /* @__PURE__ */ ((e) => (e.DOTS = "dots", e.PREV = "prev", e.NEXT = "next", e.TOUCH = "touch", e))(h || {});
function W(e = {
  rootSelector: ""
}) {
  const { from: t, index: i, rootSelector: s } = e, r = new u(s), o = Array.from(
    O(`${D} > *`, E(s))
  );
  if (o.forEach((d, c) => {
    ht(s, t, d, c);
  }), t && !r.get(n.isStopSlider)) {
    const d = r.get(n.SlideIndex), c = ut({
      from: t,
      currentSlideIndex: d,
      index: i
    });
    m([o[c]], T.ACTIVE), r.set(n.SlideIndex, c), G(s), N(s);
    return;
  }
  r.setMultipleState({
    [n.SliderReady]: !0,
    [n.isStopSlider]: !1
  });
}
function St(e) {
  return p(`${e} ${z}`);
}
function X(e, t) {
  const i = O(A.LI, St(t)), s = e ?? 0;
  i.forEach((r, o) => {
    R(r, T.SELECTED) && V(r, T.SELECTED), o === s && m([r], T.SELECTED);
  });
}
function L(e) {
  return p(`${e}`);
}
class Tt {
  constructor(t) {
    a(this, "state");
    a(this, "rootSelector");
    a(this, "slider");
    this.state = new u(t), this.rootSelector = t, this.slider = L(this.rootSelector);
  }
  init() {
    const { state: t, rootSelector: i, slider: s } = this, [r, o] = [P(s), t.get(n.SlideIndex)], d = o * -r;
    t.setMultipleState({
      [n.currentTranslate]: d,
      [n.prevTranslate]: d
    });
    const [c, I] = [o, h.TOUCH];
    W({
      from: I,
      index: c,
      rootSelector: i
    });
    const C = t.get(n.Infinite), g = t.get(n.NumberOfSlides) + 2, x = C ? F(c, g) : c, j = () => {
      X(x, i);
    };
    y(i, { [n.Dots]: !0 }, j);
  }
}
class Et {
  constructor(t) {
    a(this, "state");
    a(this, "slides");
    a(this, "slider");
    a(this, "rootSelector");
    a(this, "setPositionByIndex");
    a(this, "init", () => {
      const { state: t, slides: i, setPositionByIndex: s } = this;
      G(this.rootSelector), t.set(n.isDragging, !1);
      const r = t.get(n.animationID);
      typeof r == "number" ? (cancelAnimationFrame(r), w(this.rootSelector, "transform 400ms  cubic-bezier(0.25, 1, 0.5,1)")) : w(this.rootSelector, "");
      const o = t.get(n.currentTranslate) - t.get(n.prevTranslate);
      let d = t.get(n.SlideIndex);
      dt(o, d, i) && t.set(n.SlideIndex, d += 1), ct(o, d) && t.set(n.SlideIndex, d -= 1), s.init();
    });
    this.state = new u(t), this.slider = E(t), this.slides = Array.from(O(`${D} > *`, this.slider)), this.setPositionByIndex = new Tt(t), this.rootSelector = t;
  }
}
function Z(e) {
  return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
}
class It {
  constructor(t) {
    a(this, "state");
    a(this, "rootSelector");
    a(this, "slider");
    a(this, "animation");
    a(this, "intervalId", null);
    a(this, "init", (t) => {
      const { state: i, rootSelector: s, animation: r } = this, [o, d, c, I] = [
        i.get(n.isDragging),
        Z(t),
        i.get(n.prevTranslate),
        i.get(n.startPos)
      ];
      if (w(s, ""), o) {
        d - I > 0 && i.get(n.SliderWidth), this.intervalId = setInterval(() => {
        }, 10), i.set(n.currentTranslate, c + d - I);
        const g = i.get(n.currentTranslate);
        i.get(n.SliderReady) && (N(s, g), requestAnimationFrame(r.init));
      }
    });
    this.animation = new B(t), this.state = new u(t), this.rootSelector = t, this.slider = E(this.rootSelector);
  }
}
class gt {
  constructor(t) {
    a(this, "state");
    a(this, "rootSelector");
    a(this, "animation");
    a(this, "slider");
    this.state = new u(t), this.animation = new B(t), this.rootSelector = t, this.slider = L(this.rootSelector);
  }
  init(t) {
    return (i) => {
      const { state: s, animation: r, slider: o } = this;
      s.setMultipleState({
        [n.SlideIndex]: t,
        [n.startPos]: Z(i),
        [n.isDragging]: !0,
        [n.animationID]: requestAnimationFrame(r.init)
      });
    };
  }
}
class mt {
  constructor(t) {
    a(this, "rootSelector");
    a(this, "slider");
    a(this, "slides");
    a(this, "state");
    a(this, "touchStart");
    a(this, "touchEnd");
    a(this, "touchMove");
    this.rootSelector = t, this.slider = E(t), this.slides = Array.from(O(`${D} > *`, this.slider)), this.state = new u(this.rootSelector), this.touchStart = new gt(this.rootSelector), this.touchEnd = new Et(this.rootSelector), this.touchMove = new It(this.rootSelector);
  }
  init() {
    const { slides: t, touchStart: i, touchEnd: s, touchMove: r } = this;
    t.forEach((o, d) => {
      const c = {
        element: o,
        index: d,
        touchStart: i.init(d),
        touchEnd: s.init.bind(s),
        touchMove: r.init.bind(r)
      };
      lt(c);
    });
  }
}
function H(e) {
  return document.createElement(e);
}
function Ot(e) {
  const t = [];
  for (let i = 0; i < e; i++) {
    const s = H(A.BUTTON), r = i === 0;
    M(
      s,
      k.DIRECTION,
      r ? h.NEXT : h.PREV
    ), m([s], v.BRICK_ARROWS), q(s, r ? h.NEXT : h.PREV), t.push(s);
  }
  return t;
}
function Ct(e, t) {
  e.prepend(t);
}
function wt(e, t) {
  const i = L(t);
  return e.forEach((s) => {
    Ct(i, s);
  }), e;
}
function Dt(e, t) {
  return e.getAttribute(t);
}
function At(e, t) {
  return () => {
    const i = new u(t);
    if (!i.get(n.SliderReady))
      return;
    i.set(n.SliderReady, !1);
    const r = Dt(e, k.DIRECTION) === h.PREV;
    w(t, "transform 400ms  cubic-bezier(0.25, 1, 0.5,1)"), W({
      from: r ? h.PREV : h.NEXT,
      rootSelector: t
    });
    const o = i.get(n.Infinite), d = i.get(n.SlideIndex), c = i.get(n.NumberOfSlides) + 2, I = o ? F(d, c) : d, C = () => {
      X(I, t);
    };
    y(t, { [n.Dots]: !0 }, C);
    const g = E(t);
    S(f.TRANSITIONEND, g, () => {
      i.set(n.SliderReady, !0), w(t, "");
    });
  };
}
class Nt {
  constructor(t) {
    a(this, "rootSelector");
    this.rootSelector = t;
  }
  init() {
    const { rootSelector: t } = this, i = Ot(2);
    wt(i, t).forEach((r) => {
      const o = At(r, t);
      S(f.CLICK, r, o);
    });
  }
}
function yt(e, t) {
  const i = new u(e);
  y(e, { [n.Infinite]: !0 }, () => {
    i.set(
      n.NumberOfSlides,
      i.get(n.NumberOfSlides) - 2
    );
  });
  const s = i.get(n.NumberOfSlides);
  for (let r = 0; r < s; r++) {
    const o = H(A.LI);
    U(t, o), m([o], T.SLIDER_DOT), r === 0 && m([o], T.SELECTED);
  }
}
function Rt(e) {
  const t = new u(e), i = h.DOTS;
  let s = t.get(n.SlideIndex);
  X(s, e);
  const r = t.get(n.Infinite);
  W({
    from: i,
    index: r ? ++s : s,
    rootSelector: e
  });
}
class Lt {
  constructor(t) {
    a(this, "rootSelector");
    this.rootSelector = t;
  }
  init() {
    const t = L(this.rootSelector), i = H(A.UL), s = new u(this.rootSelector);
    M(i, k.CLASS, z.replace(".", "")), U(t, i), yt(this.rootSelector, i);
    const r = O(A.LI, i);
    Array.from(r).forEach((o, d) => {
      const c = () => {
        s.set(n.SlideIndex, d), Rt(this.rootSelector);
      };
      S(f.CLICK, o, c);
    });
  }
}
function xt(e, t) {
  const { dots: i, arrows: s, touch: r } = t || {};
  i && new Lt(e).init(), s && new Nt(e).init(), r && new mt(e).init();
}
class bt {
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
function vt(e, t) {
  t.forEach((i) => {
    e.appendChild(i);
  });
}
function $(e) {
  return (e == null ? void 0 : e.children.item(e.children.length - 1)) ?? null;
}
function kt(e) {
  const t = b(e), i = $(e);
  e.insertBefore(i.cloneNode(!0), t), vt(e, [t.cloneNode(!0)]), m([b(e), $(e)], T.CLONED);
}
class Pt extends bt {
  constructor(i, s) {
    super();
    a(this, "clonedSlides", []);
    a(this, "rootSelector");
    a(this, "options");
    rt(at(i), "Main Selector Not Found"), this.rootSelector = i, this.options = { ...new ot(), ...s };
  }
  init() {
    const { rootSelector: i, options: s, clonedSlides: r } = this, o = E(i), d = new u(i, s);
    y(i, { [n.Infinite]: !0 }, () => {
      kt(o);
    });
    const c = Q(o);
    d.set(n.NumberOfSlides, c);
    const I = b(E(i));
    m([I], T.ACTIVE);
    const C = P(o);
    d.set(n.SliderWidth, C);
    const g = () => et(i);
    S(f.RESIZE, window, g);
    const x = d.get(n.NumberOfSlides);
    st(x, o, r), nt(o, r), d.set(n.LoadPage, !1), xt(i, s);
  }
}
window.BrickSlider = Pt;
