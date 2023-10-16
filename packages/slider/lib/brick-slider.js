/*!
 * brick-slider.js
 * Version  : 0.0.0
 * License  : MIT
 * Copyright: 2023 @malopestorres
 */
var at = Object.defineProperty;
var ct = (e, t, n) => t in e ? at(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var o = (e, t, n) => (ct(e, typeof t != "symbol" ? t + "" : t, n), n);
function w(e) {
  return e.children.length;
}
function b(e) {
  return (e == null ? void 0 : e.children.item(0)) ?? null;
}
function L(e) {
  return e.offsetWidth;
}
function $(e) {
  const t = document.querySelector(e);
  if (!t)
    throw new Error(`Element not found: ${e}`);
  return t;
}
function m(e, t, n) {
  t.addEventListener(e, n);
}
function M(e, t, n) {
  const i = n * t;
  return -(L(e) * n + i);
}
function lt(e, t) {
  return setTimeout(() => {
    t();
  }, e);
}
function dt(e) {
  clearTimeout(e);
}
function g(e) {
  return $(`${e} ${W}`);
}
function v(e, t = document) {
  return t.querySelectorAll(e);
}
const U = {
  CHILDREN_SELECTOR: ".slider__container",
  DOTS_SELECTOR: ".slider__dots ",
  NEXT_BUTTON: "next-button",
  PREV_BUTTON: "prev-button",
  BRICK_ARROWS: "brick-arrows"
}, D = {
  TRANSITION: "transition"
}, x = {
  UL: "ul",
  LI: "li",
  BUTTON: "button",
  DIV: "div"
}, N = {
  ACTIVE: "active",
  SLIDER_DOT: "slider__dot",
  SELECTED: "slider__dot--active",
  CLONED: "cloned"
}, V = {
  CLASS: "class",
  ARIA_HIDDEN: "aria-hidden",
  ROLE: "role",
  DIRECTION: "data-direction"
}, G = {
  DEFAULT_TRANSITION_TIME: 300
}, B = {
  TRANSFORM_EASE: `transform ${G.DEFAULT_TRANSITION_TIME}ms cubic-bezier(0.25,1,0.5,1)`
}, O = {
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
}, Z = (e) => (e.type.includes("mouse"), e), Y = U.DOTS_SELECTOR, W = U.CHILDREN_SELECTOR, R = (e) => Array.from(v(`${W} > *`, g(e)));
function A(e, t) {
  e.forEach((n) => {
    n.classList.add(t);
  });
}
function F(e, t) {
  return e && e.appendChild(t), t;
}
function ut(e, t) {
  t.forEach((n) => {
    F(e, n);
  });
}
function St(e, t) {
  if (!e)
    throw new Error(` ${t || ""}`);
}
var s = /* @__PURE__ */ ((e) => (e.isLoadPage = "isLoadPage", e.SlideIndex = "slideIndex", e.SlideSpacing = "slideSpacing", e.SlidesPerPage = "slidesPerPage", e.NumberOfSlides = "numberOfSlides", e.SliderWidth = "sliderWidth", e.SliderReady = "sliderReady", e.isStopSlider = "isStopSlider", e.isDragging = "isDragging", e.startPos = "startPos", e.prevTranslate = "prevTranslate", e.currentTranslate = "currentTranslate", e.TouchStartTime = "touchStartTime", e.TouchEndTime = "touchEndTime", e.IsMouseLeave = "isMouseLeave", e.animationID = "animationID", e.Autoplay = "autoplay", e.AutoplaySpeed = "autoplaySpeed", e.Dots = "dots", e.Arrows = "arrows", e.Touch = "touch", e.Infinite = "infinite", e.Speed = "speed", e.Transition = "transition", e.UseTailwind = "useTailwind", e))(s || {});
const d = class d {
  constructor(t, n = {}) {
    o(this, "key");
    this.key = t, d.state[t] || (d.state[t] = {}, this.initializeState(n));
  }
  initializeState(t) {
    if (d.state[this.key].isLoadPage = !1, d.state[this.key].slideIndex = 0, d.state[this.key].slideSpacing = t.spacing ?? 10, d.state[this.key].slidesPerPage = t.slidesPerPage ?? 1, d.state[this.key].numberOfSlides = 0, d.state[this.key].sliderWidth = 0, d.state[this.key].sliderReady = !0, d.state[this.key].isStopSlider = !1, d.state[this.key].isDragging = !1, d.state[this.key].startPos = 0, d.state[this.key].prevTranslate = 0, d.state[this.key].currentTranslate = 0, d.state[this.key].touchStartTime = 0, d.state[this.key].touchEndTime = 0, d.state[this.key].isMouseLeave = !0, d.state[this.key].animationID = 0, d.state[this.key].autoplay = t.autoplay ?? !1, d.state[this.key].autoplaySpeed = t.autoplaySpeed ?? 3e3, d.state[this.key].dots = t.dots ?? !0, d.state[this.key].arrows = t.arrows ?? !0, d.state[this.key].touch = t.touch ?? !0, d.state[this.key].infinite = t.infinite ?? !1, d.state[this.key].speed = t.speed ?? 300, d.state[this.key].transition = t.transition ?? "slide", d.state[this.key].useTailwind = t.useTailwind ?? !0, t.sliderOptions)
      for (const n in t.sliderOptions)
        t.sliderOptions.hasOwnProperty(n) && (d.state[this.key][n] = t.sliderOptions[n]);
  }
  get(t) {
    return d.state[this.key][t] ?? "";
  }
  set(t, n) {
    d.state[this.key][t] = n;
  }
  setOptions(t) {
    this.initializeState(t);
  }
  setMultipleState(t) {
    for (const n in t)
      t.hasOwnProperty(n) && (d.state[this.key][n] = t[n]);
  }
};
o(d, "state", {});
let h = d;
function ht(e) {
  return /^[.#].*/.test(e);
}
class ft {
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
function Tt(e) {
  const { element: t, touchStart: n, touchEnd: i, touchMove: r } = e;
  m(O.TOUCHSTART, t, n), m(O.TOUCHEND, t, i), m(O.TOUCHMOVE, t, r), m(O.MOUSEDOWN, t, n), m(O.MOUSEUP, t, i), m(O.MOUSELEAVE, t, i), m(O.MOUSEMOVE, t, r);
}
function y(e, t, n) {
  e.style[t] = n;
}
function gt(e, t, n) {
  const i = e < -180, r = t < n.length - 1;
  return i && r;
}
function It(e, t) {
  const n = e > 180, i = t > 0;
  return n && i;
}
function J(e, t) {
  return e < 0 ? t - 1 : e >= t ? e : e === t - 1 ? 0 : e === 0 ? t - 3 : e - 1;
}
function Et(e, t) {
  e.style.transform = `translate3d(${t()}px, 0, 0)`;
}
function mt(e, t) {
  const n = new h(e), i = g(e), r = n.get(s.SlideIndex), a = n.get(s.SlideSpacing), l = M(i, a, r), c = t;
  return !t && n.setMultipleState({
    [s.prevTranslate]: l,
    [s.currentTranslate]: l
  }), c || l;
}
function C(e, t) {
  const n = g(e);
  Et(n, () => mt(e, t));
}
function Ot(e) {
  const { from: t, currentSlideIndex: n, index: i } = e;
  switch (t) {
    case I.NEXT:
      return n + 1;
    case I.PREV:
      return n - 1;
    case I.DOTS:
    case I.TOUCH:
      return i ?? n;
    default:
      return n;
  }
}
class p {
  constructor(t) {
    o(this, "rootSelector");
    o(this, "state");
    o(this, "init", () => {
      const { state: t, rootSelector: n, init: i } = this, [r, a] = [
        t.get(s.currentTranslate),
        t.get(s.isDragging)
      ];
      C(n, r), a && requestAnimationFrame(i);
    });
    this.state = new h(t), this.rootSelector = t;
  }
}
function Q(e, t) {
  e.classList.remove(t);
}
function Pt(e, t, n) {
  new h(e).set(s.SlideIndex, n), C(e), Q(t, N.ACTIVE);
}
function K(e, t) {
  return e.classList.contains(t);
}
function Nt(e, t) {
  const n = new h(e), i = t.style.transform, r = n.get(s.SlideSpacing), a = w(t);
  n.get(s.SlidesPerPage);
  const c = `translate3d(${M(t, r, a - a)}px, 0px, 0px)`;
  return i.includes(c);
}
function At(e, t) {
  const n = new h(e), i = t.style.transform, r = n.get(s.SlideSpacing), a = w(t);
  n.get(s.SlidesPerPage);
  const c = `translate3d(${M(t, r, a - 1)}px, 0px, 0px)`;
  return i.includes(c);
}
function Ct(e, t) {
  const n = g(e), i = w(n), [r, a] = [Nt(e, n), At(e, n)], l = [
    { first: r, index: i - i, jumpToIndex: i - 2 },
    { last: a, index: i - 1, jumpToIndex: i - i + 1 }
  ], c = l.findIndex(
    (u) => u.first || u.last
  );
  if (c !== -1) {
    const { index: u, jumpToIndex: S } = l[c], f = K(t[u], N.ACTIVE), T = t[u];
    f && Pt(e, T, S);
  }
}
const xt = (e, t) => {
  const n = g(e), i = G.DEFAULT_TRANSITION_TIME - 100, r = R(e), a = lt(i, () => {
    y(n, D.TRANSITION, ""), t && Ct(e, r), dt(a);
  });
};
function _(e, t, n, i) {
  for (let r = 0; r < n; r++) {
    const a = t * n + r;
    A([e[a]], N.ACTIVE);
  }
}
var I = /* @__PURE__ */ ((e) => (e.DOTS = "dots", e.PREV = "prev", e.NEXT = "next", e.TOUCH = "touch", e))(I || {});
function H(e = {
  rootSelector: ""
}) {
  const { index: t, rootSelector: n } = e, i = new h(n), r = i.get(s.NumberOfSlides), a = e.from, l = g(n), c = R(n), u = i.get(s.SlideIndex), S = Ot({
    from: a,
    currentSlideIndex: u,
    index: t
  }), f = i.get(s.Infinite);
  if (!f && S > r - 1 || !f && S < 0)
    return;
  i.get(s.isStopSlider);
  const T = i.get(s.SlidesPerPage);
  i.get(s.SlideSpacing), i.get(s.SliderWidth), _(c, S, T), i.set(s.SlideIndex, S);
  const E = new p(n);
  C(n), requestAnimationFrame(E.init);
  const P = () => xt(n, f);
  T <= 1 && m(O.TRANSITIONSTART, l, P);
}
function Rt(e) {
  return $(`${e} ${Y}`);
}
function X(e, t) {
  const n = v(x.LI, Rt(t)), i = e ?? 0;
  n.forEach((r, a) => {
    K(r, N.SELECTED) && Q(r, N.SELECTED), a === i && A([r], N.SELECTED);
  });
}
function z(e) {
  return $(`${e}`);
}
function tt(e, t, n) {
  if (t) {
    new h(e);
    for (const [i, r] of Object.entries(t))
      if (h.state[e][i] !== r)
        return !1;
    return n && n(), !0;
  }
  return !1;
}
class wt {
  constructor(t) {
    o(this, "state");
    o(this, "rootSelector");
    o(this, "slider");
    this.state = new h(t), this.rootSelector = t, this.slider = z(this.rootSelector);
  }
  init() {
    const { state: t, rootSelector: n, slider: i } = this, r = t.get(s.SlideIndex), a = L(i), l = r * -a;
    t.setMultipleState({
      [s.currentTranslate]: l,
      [s.prevTranslate]: l
    });
    const c = r, u = I.TOUCH;
    H({
      from: u,
      index: c,
      rootSelector: n
    });
    const S = t.get(s.NumberOfSlides) + 2, f = t.get(s.Infinite), T = t.get(s.SlidesPerPage), E = f && T <= 1 ? J(c, S) : c, P = () => {
      X(E, n);
    };
    tt(n, { [s.Dots]: !0 }, P);
  }
}
class Dt {
  constructor(t) {
    o(this, "$root");
    o(this, "state");
    o(this, "setPositionByIndex");
    o(this, "animation");
    o(this, "init", () => {
      const { $root: t, state: n, setPositionByIndex: i } = this;
      console.log("vou te pegar 2");
      const r = g(t);
      n.set(s.isDragging, !1);
      const a = n.get(s.animationID), l = n.get(s.IsMouseLeave), c = n.get(s.Infinite), u = n.get(s.SlideIndex), S = n.get(s.SliderReady), f = n.get(s.SlidesPerPage);
      if (c && u <= 0 && f <= 1 && !S)
        return;
      l || y(r, D.TRANSITION, B.TRANSFORM_EASE), typeof a == "number" && cancelAnimationFrame(a);
      const T = n.get(s.currentTranslate) - n.get(s.prevTranslate);
      let E = n.get(s.SlideIndex);
      const P = R(t);
      gt(T, E, P) && n.set(s.SlideIndex, E += 1), It(T, E) && n.set(s.SlideIndex, E -= 1), i.init(), n.setMultipleState({
        [s.TouchEndTime]: Date.now(),
        [s.IsMouseLeave]: !0
        // [State_Keys.prevTranslate]: state.get(State_Keys.currentTranslate)
      });
    });
    this.$root = t, this.state = new h(this.$root), this.setPositionByIndex = new wt(this.$root), this.animation = new p(this.$root);
  }
}
function et(e) {
  return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
}
class yt {
  constructor(t) {
    o(this, "$root");
    o(this, "state");
    o(this, "animation");
    o(this, "init", (t) => {
      const { state: n, $root: i, animation: r } = this, a = Z(t), l = n.get(s.isDragging), c = et(a), u = n.get(s.prevTranslate), S = n.get(s.startPos), f = n.get(s.SlideIndex), T = n.get(s.Infinite), E = n.get(s.SliderReady), P = n.get(s.SlidesPerPage);
      if (!(T && f <= 0 && P <= 1 && !E) && l) {
        n.setMultipleState({
          [s.currentTranslate]: u + c - S
        });
        const k = n.get(s.currentTranslate);
        C(i, k), requestAnimationFrame(r.init);
      }
    });
    this.$root = t, this.state = new h(this.$root), this.animation = new p(this.$root);
  }
}
function Lt(e, t) {
  return t > 1 ? Math.floor(e / t) : e;
}
class Mt {
  constructor(t) {
    o(this, "$root");
    o(this, "state");
    o(this, "animation");
    this.$root = t, this.state = new h(t), this.animation = new p(t);
  }
  init(t) {
    return (n) => {
      const { state: i, animation: r } = this;
      console.log("vou te pegar 1");
      const a = Z(n), l = g(this.$root);
      i.get(s.SliderReady);
      const c = i.get(s.Infinite), u = i.get(s.SlideIndex), S = i.get(s.SlidesPerPage);
      c && u <= 0 && S <= 1 && i.set(s.SliderReady, !0), y(l, D.TRANSITION, ""), i.setMultipleState({
        [s.TouchStartTime]: Date.now(),
        [s.SlideIndex]: Lt(t, S),
        [s.startPos]: et(a),
        [s.isDragging]: !0,
        [s.IsMouseLeave]: !1,
        [s.animationID]: requestAnimationFrame(r.init)
      });
    };
  }
}
class vt {
  constructor(t) {
    o(this, "$root");
    o(this, "slider");
    o(this, "slides");
    o(this, "state");
    o(this, "touchStart");
    o(this, "touchEnd");
    o(this, "touchMove");
    this.$root = t, this.slider = g(t), this.slides = Array.from(v(`${W} > *`, this.slider)), this.state = new h(this.$root), this.touchStart = new Mt(this.$root), this.touchEnd = new Dt(this.$root), this.touchMove = new yt(this.$root);
  }
  init() {
    const { slides: t, touchStart: n, touchEnd: i, touchMove: r } = this;
    t.forEach((a, l) => {
      const c = {
        element: a,
        index: l,
        touchStart: n.init(l),
        // touchEnd: (event: Event) => touchEnd.init(event),
        touchEnd: i.init.bind(i),
        //touchEnd: touchEnd.init(index),
        touchMove: r.init.bind(r)
      };
      Tt(c);
    });
  }
}
function q(e) {
  return document.createElement(e);
}
function nt(e, t, n) {
  e.setAttribute(t, n);
}
function pt(e, t) {
  e.innerHTML = t;
}
function kt(e) {
  const t = [];
  for (let n = 0; n < e; n++) {
    const i = q(x.BUTTON), r = n === 0;
    nt(i, V.DIRECTION, r ? I.NEXT : I.PREV), A([i], U.BRICK_ARROWS), pt(i, r ? I.NEXT : I.PREV), t.push(i);
  }
  return t;
}
function bt(e, t) {
  e.prepend(t);
}
function $t(e, t) {
  const n = z(t);
  return e.forEach((i) => {
    bt(n, i);
  }), e;
}
function Ut(e, t) {
  return e.getAttribute(t);
}
function Vt(e, t) {
  return () => {
    const n = new h(t), r = Ut(e, V.DIRECTION) === I.PREV, a = g(t);
    n.get(s.SliderReady);
    const l = n.get(s.Infinite);
    console.log("index", n.get(s.SliderReady)), y(a, D.TRANSITION, B.TRANSFORM_EASE), H({
      from: r ? I.PREV : I.NEXT,
      rootSelector: t
    });
    const c = n.get(s.SlidesPerPage), u = n.get(s.SlideIndex), S = n.get(s.NumberOfSlides) + 2, f = l && c <= 1 ? J(u, S) : u;
    tt(t, { [s.Dots]: !0 }, () => {
      X(f, t);
    }), m(O.TRANSITIONEND, a, () => {
      n.set(s.SliderReady, !0);
    });
  };
}
class Bt {
  constructor(t) {
    o(this, "$root");
    this.$root = t;
  }
  init() {
    const { $root: t } = this, n = kt(2);
    $t(n, t).forEach((r) => {
      const a = Vt(r, t);
      m(O.CLICK, r, a);
    });
  }
}
function Wt(e, t) {
  const n = new h(e), i = n.get(s.Infinite), r = g(e), a = w(r), l = n.get(s.SlidesPerPage);
  i && n.set(s.NumberOfSlides, a - 2), l > 1 && n.set(s.NumberOfSlides, Math.ceil(a / 2));
  const c = n.get(s.NumberOfSlides);
  for (let u = 0; u < c; u++) {
    const S = q(x.LI);
    F(t, S), A([S], N.SLIDER_DOT), u === 0 && A([S], N.SELECTED);
  }
}
function Ft(e) {
  const t = new h(e), n = I.DOTS;
  let i = t.get(s.SlideIndex);
  X(i, e);
  const r = t.get(s.Infinite), a = t.get(s.SlidesPerPage), l = g(e);
  y(l, D.TRANSITION, B.TRANSFORM_EASE), H({
    from: n,
    index: r && a <= 1 ? ++i : i,
    rootSelector: e
  });
}
class Ht {
  constructor(t) {
    o(this, "$root");
    this.$root = t;
  }
  init() {
    const t = z(this.$root), n = q(x.UL), i = new h(this.$root);
    nt(n, V.CLASS, Y.replace(".", "")), F(t, n), Wt(this.$root, n);
    const r = v(x.LI, n);
    Array.from(r).forEach((a, l) => {
      const c = () => {
        i.set(s.SlideIndex, l), Ft(this.$root);
      };
      m(O.CLICK, a, c);
    });
  }
}
function Xt(e, t) {
  const { dots: n, arrows: i, touch: r } = t || {};
  n && new Ht(e).init(), i && new Bt(e).init(), r && new vt(e).init();
}
class zt {
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
function qt(e, t) {
  t.forEach((n) => {
    e.appendChild(n);
  });
}
function j(e) {
  return (e == null ? void 0 : e.children.item(e.children.length - 1)) ?? null;
}
function jt(e) {
  const t = b(e), n = j(e);
  e.insertBefore(n.cloneNode(!0), t), qt(e, [t.cloneNode(!0)]), A([b(e), j(e)], N.CLONED);
}
class Gt {
  constructor(t) {
    o(this, "$root");
    this.$root = t;
  }
  init() {
    const { $root: t } = this, n = L(g(t));
    new h(t).set(s.SliderWidth, n), C(t);
  }
}
class Zt extends zt {
  constructor(n, i) {
    super();
    o(this, "clonedSlides", []);
    o(this, "$root");
    o(this, "options");
    o(this, "resize");
    St(ht(n), "Main Selector Not Found"), this.$root = n, this.options = { ...new ft(), ...i }, this.resize = new Gt(n);
  }
  init() {
    const { $root: n, options: i, clonedSlides: r, resize: a } = this, l = g(n), c = new h(n, i), u = c.get(s.currentTranslate), S = u + 1, f = c.get(s.SlideSpacing), T = M(l, f, S), E = c.get(s.Infinite), P = c.get(s.SlidesPerPage), k = R(n)[u];
    E && P <= 1 && (jt(l), c.set(s.SlideIndex, S), A([k], N.ACTIVE), C(n, T), c.setMultipleState({
      [s.currentTranslate]: T,
      [s.prevTranslate]: T
    }));
    const st = L(l);
    c.set(s.SliderWidth, st);
    const it = w(l);
    c.set(s.NumberOfSlides, it), b(g(n)), c.get(s.NumberOfSlides);
    const rt = c.get(s.SlideIndex);
    E || _(R(n), rt, P);
    const ot = () => a.init();
    m(O.RESIZE, window, ot), ut(l, r), Xt(n, i);
  }
}
window.BrickSlider = Zt;
