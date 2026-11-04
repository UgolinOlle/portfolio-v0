import HL from './kernel.js';
import { ROUTES, buildDetails } from './strates-detail.js';

/**
 * Strates: four slabs stacked like the layers of one product, each carrying what
 * makes it that layer: an interface (title bar and a panel), an API (rows of
 * code), a network (three linked nodes), a vault door for security. At rest the
 * stack is slightly open and the interface is bright. The slab under the pointer
 * slides out like a drawer and takes the bright edge; the stack opens wider and
 * steps left, and a second drawing of that layer comes out of the slab on the right.
 * The slider is how wide the stack opens.
 *
 * The pattern: discrete items on tweens (which slab), one spring for the gap
 * (the stack is open or not), a stagger by distance, and a hit test on bands
 * built from the fully opened target pose, so a slab sliding cannot flip the pick.
 */
const {
  Cam, clamp, facing, fillet, fit, lerp, poly, prism, proj, put, r2, rings, seg, solid,
  reducedMotion, spring, stepS, tdone, tset, tval, tween, disposer, mk, place, pointer, register,
} = HL;

const N = 4, W = 84, D = 58, T = 4, R = 7, B = 1.3, SL = 14, REST_GAP = 13, GMAX = 24, STEP = 45;
// Idle loop: the bright edge rests on the top slab, then a request walks down the stack and back.
const PULSE = 5, HOLD = 3200, HOP = 650;
// When a layer is picked the stack steps aside, at its own size, to make room for its drawing (which may run past the frame).
// the reflow's damping: the further the slider opens the stack, the more the blocks spring
const damp = (v) => 20 - (v - 16) * 1.75;
// Auto-play, while no pointer is on the figure: rest, then each layer in turn (top to bottom) shows its
// drawing and drives it through four positions t, as a hand would.
const AUTO_REST = 2400, AUTO_LAYER = 5200, AUTO_ORDER = [3, 2, 1, 0], AUTO_T = [[0.05, 0.5, 1, 0.5], [0.1, 0.4, 0.65, 0.9], [0.25, 0.55, 0.8, 1], [0.12, 0.5, 0.62, 0.95]];
const SC = 1, SHIFT = -100, OX = 103, OY = -3;
const NAMES = ["sécurité", "réseau", "api", "interface"];
const NODES = [[16, 16], [66, 20], [36, 44]];

/** A rounded rectangle on the slab's top, as a closed path through w(u, v). */
const box = (w, a, b, c, d, r) => poly(fillet([[a, b], [c, b], [c, d], [a, d]], [r, r, r, r]).map(([u, v]) => w(u, v)));

/** What sits on slab i's top face: line work as one path, and the dots. */
function feat(i, w) {
  if (i === 3) {
    return { d: seg(w(8, 10), w(W - 8, 10)) + box(w, 8, 18, 40, D - 8, 2.4) + seg(w(48, 18), w(W - 8, 18)) + seg(w(48, 28), w(W - 16, 28)), dots: [] };
  }
  if (i === 2) {
    return { d: seg(w(8, 12), w(54, 12)) + seg(w(14, 24), w(40, 24)) + seg(w(14, 36), w(66, 36)) + seg(w(8, 48), w(30, 48)), dots: [] };
  }
  if (i === 1) {
    const [a, b, c] = NODES.map(([u, v]) => w(u, v));
    return { d: seg(a, b) + seg(a, c) + seg(b, c), dots: [a, b, c] };
  }
  return { d: box(w, 12, 8, W - 12, D - 8, 6) + box(w, 18, 14, W - 18, D - 14, 3.5), dots: [w(W / 2, D / 2)] };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;

  // Fitted to the most open pose with a slab slid out, so nothing leaves the frame at intensity 1.
  const C = Cam(45, 0.5, 2.15);
  const zTop = (N - 1) * (T + GMAX) + T;
  fit(C, [[0, 0, 0], [W + SL, D, 0], [W + SL, 0, 0], [0, D, 0], [0, 0, zTop], [W + SL, D, zTop]], 200, 166);
  const P = proj(C), front = facing(C);
  const [ring, inner] = rings(0, 0, W, D, R, B);

  const g = mk("g", {}, svg);
  const layers = [];
  for (let i = 0; i < N; i++) {
    const grp = mk("g", { "data-layer": i }, g);
    const s = solid(grp);
    const lines = mk("path", { class: "nf lo feat" }, grp);
    const dots = (i === 1 ? NODES : i === 0 ? [0] : []).map(() => mk("circle", { r: 1.5, class: i === 1 ? "dot m" : "dot off" }, grp));
    layers.push({ grp, s, lines, dots, slide: tween(0), key: "" });
  }

  // The detail drawings stand to the right of the stack, on the same ground, and emerge from the stack's side.
  const up = P(0, 0, 0)[1] - P(0, 0, 1)[1];
  const GZ = (P(OX, OY, 0)[1] - 166) / up - 12;
  const Q = (x, y, z) => P(OX + x, OY + y, GZ + z);
  const dg = mk("g", {}, svg);
  const details = buildDetails(dg, Q, front, () => B_?.wake(), (i, t) => { if (act === i && t !== 'rest') read.textContent = t; }).map(({ g: el, ...live }) => ({ el, ...live, tw: tween(0), d: -1 }));

  function draw(i) {
    const L = layers[i], z = i * (T + gap.x), s = tval(L.slide, performance.now());
    const key = r2(gap.x) + "," + r2(s);
    if (key === L.key) return;
    L.key = key;
    const Ps = (x, y, zz) => P(x + s, y, zz);
    put(L.s, prism(Ps, front, ring, inner, z, z + T));
    const f = feat(i, (u, v) => Ps(u, v, z + T));
    L.lines.setAttribute("d", f.d);
    L.dots.forEach((el, k) => place(el, f.dots[k]));
  }

  const gap = spring(REST_GAP);
  let act = -2, lit = -1, t0 = 0;

  /** Layer i carries the one bright edge, and its colour (see .hero-figure [data-layer] in global.css). */
  function light(i) {
    if (i === lit) return;
    lit = i;
    layers.forEach((L, k) => { L.s.sil.classList.toggle("hi", k === i); L.grp.classList.toggle("lit", k === i); });
  }

  /** The stack steps left and shrinks as it opens: one transform on its group, driven by the gap spring. */
  let pk = -1;
  function place_stack() {
    const p = clamp((gap.x - REST_GAP) / Math.max(open - REST_GAP, 1), 0, 1);
    if (p === pk) return;
    pk = p;
    g.setAttribute("transform", `translate(${r2(200 + SHIFT * p)} 166) scale(${r2(1 - (1 - SC) * p)}) translate(-200 -166)`);
  }

  let B_, hand = false, autoT0 = 0, autoStep = -1, autoLayer = -2;

  /** Drives the layer's own drawing to position t, and reads out what it says. */
  function play(layer, t) {
    if (layer === 2) { const i = details[2].to(t); read.textContent = i >= 0 ? ROUTES[i] : NAMES[2]; }
    else if (layer === 0) details[0].to(t);
    else read.textContent = details[layer].to(t);
  }

  B_ = register(stage, (dt, now) => {
    let moving = stepS(gap, dt);
    if (!hand && !reducedMotion()) {
      if (!autoT0) autoT0 = now;
      const u = (now - autoT0) % (AUTO_REST + AUTO_ORDER.length * AUTO_LAYER), k = Math.floor((u - AUTO_REST) / AUTO_LAYER);
      const layer = u < AUTO_REST ? -1 : AUTO_ORDER[k], step = layer < 0 ? -1 : Math.min(3, Math.floor((u - AUTO_REST - k * AUTO_LAYER) / (AUTO_LAYER / 4)));
      if (layer !== autoLayer) { autoLayer = layer; autoStep = -1; setActive(layer); }
      if (layer >= 0 && step !== autoStep) { autoStep = step; play(layer, AUTO_T[layer][step]); }
      moving = true;
    }
    if (act < 0 && !reducedMotion()) {
      const t = (now - t0) % (HOLD + (N - 1) * HOP);
      const i = t < HOLD ? N - 1 : N - 2 - Math.floor((t - HOLD) / HOP);
      if (i !== lit) {
        light(i);
        layers.forEach((L, k) => tset(L.slide, k === i && i !== N - 1 ? PULSE : 0, now, 0));
      }
      moving = true;
    }
    for (let i = 0; i < N; i++) { draw(i); if (!tdone(layers[i].slide, now)) moving = true; }
    place_stack();
    details.forEach((D_) => {
      const d = tval(D_.tw, now);
      if (d !== D_.d) {
        D_.d = d;
        D_.el.style.opacity = r2(d);
        D_.el.setAttribute("transform", `translate(${r2((d - 1) * 48)} 0)`);
      }
      if (d > 0.01 && D_.tick && D_.tick(now) !== false) moving = true;
      if (!tdone(D_.tw, now)) moving = true;
    });
    return moving;
  });
  bag.add(B_.unregister);

  // hit zones, all from poses that never depend on the one on screen: the resting stack, where it
  // lands once a layer is picked, and everything the pointer may cross on the way to the drawing.
  const cx = (P(0, D, 0)[0] + P(W, 0, 0)[0]) / 2, rx = (P(W, 0, 0)[0] - P(0, D, 0)[0]) / 2 + 4;
  const cyAt = (i, g) => P(W / 2, D / 2, i * (T + g) + T)[1], ry = (P(W, D, 0)[1] - P(0, 0, 0)[1]) / 2;
  const cy = (i) => cyAt(i, GMAX);
  const pitchAt = (g) => cyAt(0, g) - cyAt(1, g);
  const rest = { l: cx - rx, r: cx + rx, t: cy(N - 1) - ry, b: cy(0) + ry };
  // What the resting stack really covers: its slabs are packed at REST_GAP, tighter than the opened pose.
  const resting = { ...rest, t: cyAt(N - 1, REST_GAP) - ry, b: cyAt(0, REST_GAP) + ry };
  const tx = (x) => 200 + (x - 200) * SC + SHIFT, ty = (y) => 166 + (y - 166) * SC;
  const aside = { l: tx(rest.l), r: tx(rest.r), t: ty(rest.t), b: ty(rest.b) };
  const keep = { l: Math.min(rest.l, aside.l), r: 400, t: Math.min(rest.t, aside.t), b: Math.max(rest.b, aside.b) };
  const inside = (z, [x, y]) => x >= z.l && x <= z.r && y >= z.t && y <= z.b;
  const pick = (y0, y, step) => clamp(Math.round((y0 - y) / step), 0, N - 1);
  /** Picks from the resting stack; once picked, only the stack's new place changes the pick, so it cannot flicker. */
  const hit = (p) => {
    if (act < 0) return inside(resting, p) ? pick(cyAt(0, REST_GAP), p[1], pitchAt(REST_GAP)) : -1;
    if (!inside(keep, p)) return -1;
    return inside(aside, p) ? pick(ty(cyAt(0, open)), p[1], pitchAt(open) * SC) : act;
  };

  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : Math.max(act, 0);
    act = a;
    t0 = now;
    light(a >= 0 ? a : N - 1);
    gap.t = a >= 0 ? open : REST_GAP;
    layers.forEach((L, i) => {
      tset(L.slide, a === i ? SL : 0, now, Math.abs(i - from) * STEP);
      tset(details[i].tw, a === i ? 1 : 0, now, a === i ? STEP * 3 : 0);
    });
    if (a !== 2) details[2].pick(-1);
    if (a !== 3) details[3].leave();
    if (a !== 0) details[0].leave();
    if (a !== 1) details[1].leave();
    read.textContent = a < 0 ? "rest" : NAMES[a];
    B_?.wake();
  }

  for (let i = 0; i < N; i++) draw(i);
  details[2].set(open - 6);
  details[3].set(damp(open));
  details[1].set(damp(open));
  details[0].set(damp(open));
  setActive(-1);
  B_?.wake();
  /** On the API layer the pointer also picks one of the gateway's services, in the drawing on the right. */
  function route(p) {
    const i = details[2].pick(details[2].hit(p));
    read.textContent = i >= 0 ? ROUTES[i] : NAMES[2];
  }
  bag.add(pointer(stage, { move: (p) => { hand = true; setActive(hit(p)); if (act === 2) route(p); else if (act === 3 && p[0] > aside.r) read.textContent = details[3].move(p); else if (act === 1 && p[0] > aside.r) read.textContent = details[1].move(p); else if (act === 0 && p[0] > aside.r) details[0].move(p); }, leave: () => { hand = false; autoT0 = 0; autoLayer = -2; setActive(-1); } }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { open = v; details[2].set(v - 6); details[3].set(damp(v)); details[1].set(damp(v)); details[0].set(damp(v)); if (act >= 0) gap.t = v; B_?.wake(); },
    destroy: bag.dispose,
  };
}

export const means =
  "Quatre strates empilées : celle sous le pointeur sort comme un tiroir, et son dessin apparaît à droite.";
export const range = [16, 20, 24];
export { mount };
