// Components import the files they need directly: this barrel pulls in `motion/react`, which
// would turn every importer into a client module.
export { Motion } from './provider';
export { duration, ease, exitRatio, spring, stagger } from './tokens';
export { transition } from './transitions';
export { useMotionSafe } from './use-motion-safe';
export { collapse, fade, pop, rise, slideX, stagged } from './variants';
