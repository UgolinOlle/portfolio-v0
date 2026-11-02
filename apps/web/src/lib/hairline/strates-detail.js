import HL from './kernel.js';
import { gatewayScene, ROUTES } from './gateway.js';
import { responsiveScene } from './responsive.js';
import { scannerScene } from './scanner.js';
import { tracerouteScene } from './traceroute.js';

export { ROUTES };

const { mk } = HL;

/**
 * The drawing that steps out of a slab when the pointer picks it. Each layer's drawing is a
 * Hairline figure of its own, drawn here in the stack's projection and at the stack's scale:
 * a secret scanner (security), a traceroute (network), an API gateway (API) and a responsive
 * screen frame (interface). Each scene centres itself on its own footprint, and returns the
 * parts the stack needs: `tick` to move it, and whatever it answers the pointer with.
 */
const SCENES = [
  (g, Q, front, wake, say) => scannerScene(g, Q, front, { wake, onLabel: say }),
  (g, Q, front, wake) => tracerouteScene(g, Q, front, { wake }),
  (g, Q, front, wake) => gatewayScene(g, Q, front, { wake }),
  (g, Q, front, wake) => responsiveScene(g, Q, front, { wake }),
];

/** One group per layer (0 = security … 3 = interface), each in that layer's hue and starting hidden. */
export function buildDetails(parent, Q, front, wake, say = () => {}) {
  return SCENES.map((scene, i) => {
    const g = mk('g', { 'data-layer': i, class: 'lit' }, parent);
    g.style.opacity = '0';
    const live = scene(g, Q, front, wake, (text) => say(i, text));
    live.tick(0);
    return { g, ...live };
  });
}
