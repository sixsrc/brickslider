/*!
 * brick-slider.js
 * Version  : 0.0.0
 * License  : MIT
 * Copyright: 2023 @malopestorres
 */
var z = Object.defineProperty;
var q = (e, t, s) => t in e ? z(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var o = (e, t, s) => (q(e, typeof t != "symbol" ? t + "" : t, s), s);
function F(e) {
  return e.children.length;
}
function G(e) {
  return (e == null ? void 0 : e.children.item(0)) ?? null;
}
const L = {
  CHILDREN_SELECTOR: ".slider__container",
  DOTS_SELECTOR: ".slider__dots ",
  NEXT_BUTTON: "next-button",
  PREV_BUTTON: "prev-button",
  BRICK_ARROWS: "brick-arrows"
}, C = {
  UL: "ul",
  LI: "li",
  BUTTON: "button",
  DIV: "div"
}, g = {
  ACTIVE: "active",
  SLIDER_DOT: "slider__dot",
  SELECTED: "slider__dot--active"
}, N = {
  CLASS: "class",
  ARIA_HIDDEN: "aria-hidden",
  ROLE: "role",
  DIRECTION: "data-direction"
}, E = {
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
}, B = L.DOTS_SELECTOR, D = L.CHILDREN_SELECTOR;
function O(e, t) {
  e.forEach((s) => {
    s.classList.add(t);
  });
}
function v(e) {
  return e.offsetWidth;
}
function k(e) {
  const t = document.querySelector(e);
  if (!t)
    throw new Error(`Element not found: ${e}`);
  return t;
}
function T(e, t, s) {
  t.addEventListener(e, s);
}
function Z(e, t) {
  e.style.transform = `translateX(${t()}px)`;
}
var r = /* @__PURE__ */ ((e) => (e.RootSelector = "rootSelector", e.SlideIndex = "slideIndex", e.NumberOfSlides = "numberOfSlides", e.SliderWidth = "sliderWidth", e.SliderReady = "sliderReady", e.isStopSlider = "isStopSlider", e.isDragging = "isDragging", e.startPos = "startPos", e.prevTranslate = "prevTranslate", e.currentTranslate = "currentTranslate", e.animationID = "animationID", e.Autoplay = "autoplay", e.AutoplaySpeed = "autoplaySpeed", e.Dots = "dots", e.Arrows = "arrows", e.Touch = "touch", e.Infinite = "infinite", e.Speed = "speed", e.Mode = "mode", e.Transition = "transition", e.UseTailwind = "useTailwind", e))(r || {});
const c = class c {
  constructor(t, s = {}) {
    o(this, "key");
    this.key = t, c.state[t] || (c.state[t] = {}, this.initializeState(s));
  }
  initializeState(t) {
    if (c.state[this.key].rootSelector = null, c.state[this.key].slideIndex = 0, c.state[this.key].numberOfSlides = 0, c.state[this.key].sliderWidth = 0, c.state[this.key].sliderReady = !0, c.state[this.key].isStopSlider = !1, c.state[this.key].isDragging = !1, c.state[this.key].startPos = 0, c.state[this.key].prevTranslate = 0, c.state[this.key].currentTranslate = 0, c.state[this.key].autoplay = t.autoplay ?? !1, c.state[this.key].autoplaySpeed = t.autoplaySpeed ?? 3e3, c.state[this.key].dots = t.dots ?? !0, c.state[this.key].arrows = t.arrows ?? !0, c.state[this.key].touch = t.touch ?? !0, c.state[this.key].infinite = t.infinite ?? !0, c.state[this.key].speed = t.speed ?? 300, c.state[this.key].mode = t.mode ?? "vertical", c.state[this.key].transition = t.transition ?? "slide", c.state[this.key].useTailwind = t.useTailwind ?? !0, t.sliderOptions)
      for (const s in t.sliderOptions)
        t.sliderOptions.hasOwnProperty(s) && (c.state[this.key][s] = t.sliderOptions[s]);
  }
  get(t) {
    return c.state[this.key][t] ?? "";
  }
  set(t, s) {
    c.state[this.key][t] = s;
  }
  setOptions(t) {
    this.initializeState(t);
  }
  setMultipleState(t) {
    for (const s in t)
      t.hasOwnProperty(s) && (c.state[this.key][s] = t[s]);
  }
};
o(c, "state", {});
let u = c;
function j(e, t) {
  const s = new u(e), i = s.get(r.SlideIndex), n = s.get(r.SliderWidth), a = -n * i;
  return !t && s.setMultipleState({
    [r.prevTranslate]: a,
    [r.currentTranslate]: a
  }), t || a;
}
function I(e) {
  return k(`${e} ${D}`);
}
function y(e, t) {
  const s = I(e);
  Z(s, () => j(e, t));
}
function J(e) {
  const t = v(I(e));
  new u(e).set(r.SliderWidth, t), y(e);
}
function W(e, t) {
  e.innerHTML = t;
}
function b(e, t, s) {
  e.setAttribute(t, s);
}
function Q(e, t) {
  for (const [s, i] of Object.entries(t))
    b(e, s, i);
}
function Y(e, t, s) {
  if (e)
    for (let i = 0; i < e; i++) {
      const n = t.children[i].cloneNode(
        !0
      );
      Q(n, {
        "aria-hidden": "true",
        role: "presentation"
      }), s.push(n);
    }
  W(t, "");
}
function M(e, t) {
  return e && e.appendChild(t), t;
}
function K(e, t) {
  t.forEach((s) => {
    M(e, s);
  });
}
function _(e, t) {
  if (!e)
    throw new Error(` ${t || ""}`);
}
function tt(e) {
  return /^[.#].*/.test(e);
}
class et {
  constructor(t) {
    o(this, "autoplay");
    o(this, "autoplaySpeed");
    o(this, "dots");
    o(this, "arrows");
    o(this, "touch");
    o(this, "infinite");
    o(this, "speed");
    o(this, "mode");
    o(this, "transition");
    o(this, "useTailwind");
    this.autoplay = (t == null ? void 0 : t.autoplay) ?? !1, this.autoplaySpeed = (t == null ? void 0 : t.autoplaySpeed) ?? 500, this.dots = (t == null ? void 0 : t.dots) ?? !0, this.arrows = (t == null ? void 0 : t.arrows) ?? !0, this.infinite = (t == null ? void 0 : t.infinite) ?? !1, this.speed = (t == null ? void 0 : t.speed) ?? 500, this.mode = (t == null ? void 0 : t.mode) ?? "horizontal", this.transition = (t == null ? void 0 : t.transition) ?? "slide", this.touch = (t == null ? void 0 : t.touch) ?? !0, this.useTailwind = (t == null ? void 0 : t.useTailwind) ?? !0;
  }
}
function w(e, t = document) {
  return t.querySelectorAll(e);
}
function st(e) {
  const {
    /* slideImage,*/
    element: t,
    touchStart: s,
    touchEnd: i,
    touchMove: n
  } = e;
  T(E.TOUCHSTART, t, s), T(E.TOUCHEND, t, i), T(E.TOUCHMOVE, t, n), T(E.MOUSEDOWN, t, s), T(E.MOUSEUP, t, i), T(E.MOUSELEAVE, t, i), T(E.MOUSEMOVE, t, n);
}
function it(e, t, s) {
  const i = e < -100, n = t < s.length - 1;
  return i && n;
}
function nt(e, t) {
  const s = e > 100, i = t > 0;
  return s && i;
}
function R(e, t) {
  return e.classList.contains(t);
}
function H(e, t) {
  e.classList.remove(t);
}
function rt(e) {
  const { from: t, currentSlideIndex: s, index: i } = e;
  switch (t) {
    case S.NEXT:
      return s + 1;
    case S.PREV:
      return s - 1;
    case S.DOTS:
    case S.TOUCH:
      return i ?? s;
    default:
      return s;
  }
}
function p(e, t, s) {
  if (t) {
    new u(e);
    for (const [i, n] of Object.entries(t))
      if (u.state[e][i] !== n)
        return !1;
    return s && s(), !0;
  }
  return !1;
}
var S = /* @__PURE__ */ ((e) => (e.DOTS = "dots", e.PREV = "prev", e.NEXT = "next", e.TOUCH = "touch", e))(S || {});
function P(e = {
  rootSelector: ""
}) {
  const { from: t, index: s, rootSelector: i } = e, n = new u(i), a = I(i), l = Array.from(
    w(`${D} > *`, a)
  ), d = p(i, {
    [r.Infinite]: !0
  });
  if (l.forEach((h, f) => {
    const [m, x] = [
      !d && t === "prev" && f === 0,
      !d && t === "next" && f === l.length - 1
    ];
    switch (!0) {
      case (R(h, g.ACTIVE) && (m || x)):
        n.set(r.isStopSlider, !0);
        break;
      case (R(h, g.ACTIVE) && !n.get(r.isStopSlider)):
        H(h, g.ACTIVE), n.set(r.SlideIndex, f);
        break;
    }
  }), !n.get(r.isStopSlider) && t) {
    const h = n.get(r.SlideIndex), f = rt({
      from: t,
      currentSlideIndex: h,
      index: s
    }), m = (f + l.length) % l.length;
    O([l[m]], g.ACTIVE), n.set(r.SlideIndex, m), y(i);
  } else
    n.setMultipleState({
      [r.SliderReady]: !0,
      [r.isStopSlider]: !1
    });
}
function ot(e) {
  return k(`${e} ${B}`);
}
function U(e, t) {
  const s = w(
    C.LI,
    ot(t)
  ), i = e ?? 0, n = new u(t);
  s.forEach((a, l) => {
    R(a, g.SELECTED) && (H(a, g.SELECTED), n.set(r.SlideIndex, i)), l === i && O([a], g.SELECTED);
  });
}
function A(e) {
  return k(`${e}`);
}
class at {
  constructor(t) {
    o(this, "state");
    o(this, "rootSelector");
    o(this, "slider");
    this.state = new u(t), this.rootSelector = t, this.slider = A(this.rootSelector);
  }
  init() {
    const { state: t, rootSelector: s, slider: i } = this, [n, a] = [
      v(i),
      t.get(r.SlideIndex)
    ], l = a * -n;
    t.setMultipleState({
      [r.currentTranslate]: l,
      [r.prevTranslate]: l
    });
    const [d, h] = [a, S.TOUCH];
    P({
      from: h,
      index: d,
      rootSelector: s
    });
    const f = () => {
      U(d, s);
    };
    p(s, { [r.Dots]: !0 }, f);
  }
}
class lt {
  constructor(t) {
    o(this, "state");
    o(this, "slides");
    o(this, "slider");
    o(this, "rootSelector");
    o(this, "setPositionByIndex");
    o(this, "init", () => {
      const { state: t, slides: s, slider: i, setPositionByIndex: n } = this;
      t.set(r.isDragging, !1), i.oncontextmenu = null;
      const a = t.get(r.animationID);
      typeof a == "number" && cancelAnimationFrame(a);
      const l = t.get(r.currentTranslate) - t.get(r.prevTranslate);
      let d = t.get(r.SlideIndex);
      it(l, d, s) && t.set(r.SlideIndex, d += 1), nt(l, d) && t.set(r.SlideIndex, d -= 1), n.init();
    });
    this.state = new u(t), this.slider = I(t), this.slides = Array.from(
      w(`${D} > *`, this.slider)
    ), this.setPositionByIndex = new at(t), this.rootSelector = t;
  }
}
function X(e) {
  return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
}
class $ {
  constructor(t) {
    o(this, "rootSelector");
    o(this, "state");
    o(this, "init", () => {
      const { state: t, rootSelector: s, init: i } = this, [n, a] = [
        t.get(r.currentTranslate),
        t.get(r.isDragging)
      ];
      y(s, n), a && requestAnimationFrame(i);
    });
    this.state = new u(t), this.rootSelector = t;
  }
}
class ct {
  constructor(t) {
    o(this, "state");
    o(this, "rootSelector");
    o(this, "animation");
    o(this, "init", (t) => {
      const { state: s, rootSelector: i, animation: n } = this, [a, l, d, h] = [
        s.get(r.isDragging),
        X(t),
        s.get(r.prevTranslate),
        s.get(r.startPos)
      ];
      a && s.set(
        r.currentTranslate,
        d + l - h
      );
      const f = s.get(r.currentTranslate);
      y(i, f), requestAnimationFrame(n.init);
    });
    this.animation = new $(t), this.state = new u(t), this.rootSelector = t;
  }
}
class dt {
  constructor(t) {
    o(this, "state");
    o(this, "rootSelector");
    o(this, "animation");
    o(this, "slider");
    this.state = new u(t), this.animation = new $(t), this.rootSelector = t, this.slider = A(this.rootSelector);
  }
  init(t) {
    return (s) => {
      const { state: i, animation: n, slider: a } = this;
      a.oncontextmenu = (l) => (l.preventDefault(), l.stopPropagation(), !1), i.setMultipleState({
        [r.SlideIndex]: t,
        [r.startPos]: X(s),
        [r.isDragging]: !0,
        [r.animationID]: requestAnimationFrame(n.init)
      });
    };
  }
}
class ut {
  constructor(t) {
    o(this, "rootSelector");
    o(this, "slider");
    o(this, "slides");
    o(this, "state");
    o(this, "touchStart");
    o(this, "touchEnd");
    o(this, "touchMove");
    this.rootSelector = t, this.slider = I(t), this.slides = Array.from(
      w(`${D} > *`, this.slider)
    ), this.state = new u(this.rootSelector), this.touchStart = new dt(this.rootSelector), this.touchEnd = new lt(this.rootSelector), this.touchMove = new ct(this.rootSelector);
  }
  init() {
    const { slides: t, touchStart: s, touchEnd: i, touchMove: n } = this;
    t.forEach((a, l) => {
      const d = {
        element: a,
        index: l,
        touchStart: s.init(l),
        touchEnd: i.init.bind(i),
        touchMove: n.init.bind(n)
      };
      st(d);
    });
  }
}
function V(e) {
  return document.createElement(e);
}
function ht(e) {
  const t = [];
  for (let s = 0; s < e; s++) {
    const i = V(C.BUTTON), n = s === 0;
    b(
      i,
      N.DIRECTION,
      n ? S.NEXT : S.PREV
    ), O([i], L.BRICK_ARROWS), W(i, n ? S.NEXT : S.PREV), t.push(i);
  }
  return t;
}
function St(e, t) {
  e.prepend(t);
}
function ft(e, t) {
  const s = A(t);
  return e.forEach((i) => {
    St(s, i);
  }), e;
}
function Et(e, t) {
  return e.getAttribute(t);
}
function Tt(e, t) {
  return () => {
    const s = new u(t);
    if (!s.get(r.SliderReady))
      return;
    s.set(r.SliderReady, !1);
    const i = Et(e, N.DIRECTION), n = I(t), a = i === S.PREV;
    P({
      from: a ? S.PREV : S.NEXT,
      rootSelector: t
    });
    const l = s.get(r.SlideIndex), d = () => {
      U(l, t);
    };
    p(t, { [r.Dots]: !0 }, d), T(E.TRANSITIONEND, n, () => {
      s.set(r.SliderReady, !0);
    });
  };
}
class gt {
  constructor(t) {
    o(this, "rootSelector");
    this.rootSelector = t;
  }
  init() {
    const { rootSelector: t } = this, s = ht(2);
    ft(s, t).forEach((n) => {
      const a = Tt(n, t);
      T(E.CLICK, n, a);
    });
  }
}
function It(e, t) {
  for (let s = 0; s < e; s++) {
    const i = V(C.LI);
    M(t, i), O([i], g.SLIDER_DOT), s === 0 && O([i], g.SELECTED);
  }
}
const mt = (e) => {
  const t = new u(e), s = t.get(r.SlideIndex);
  U(s, e), P({
    from: S.DOTS,
    index: s,
    rootSelector: e
  });
};
class Ot {
  constructor(t) {
    o(this, "rootSelector");
    this.rootSelector = t;
  }
  init() {
    const t = A(this.rootSelector), s = V(C.UL), i = new u(this.rootSelector), n = i.get(r.NumberOfSlides);
    b(
      s,
      N.CLASS,
      B.replace(".", "")
    ), M(t, s), n && It(n, s);
    const a = w(C.LI, s);
    Array.from(a).forEach((l, d) => {
      const h = () => {
        i.set(r.SlideIndex, d), mt(this.rootSelector);
      };
      T(E.CLICK, l, h);
    });
  }
}
function Ct(e, t) {
  const { dots: s, arrows: i, touch: n } = t || {};
  s && new Ot(e).init(), i && new gt(e).init(), n && new ut(e).init();
}
class wt {
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
class Dt extends wt {
  constructor(s, i) {
    super();
    o(this, "clonedSlides", []);
    o(this, "rootSelector");
    o(this, "options");
    _(tt(s), "Main Selector Not Found"), this.rootSelector = s, this.options = { ...new et(), ...i };
  }
  init() {
    const { rootSelector: s, options: i, clonedSlides: n } = this, a = new u(s, i), l = I(s), d = F(l);
    a.set(r.NumberOfSlides, d);
    const h = G(I(s));
    h && O([h], g.ACTIVE);
    const f = v(l);
    a.set(r.SliderWidth, f);
    const m = () => J(s);
    T(E.RESIZE, window, m);
    const x = a.get(r.NumberOfSlides);
    Y(x, l, n), K(l, n), Ct(s, i);
  }
}
window.BrickSlider = Dt;
