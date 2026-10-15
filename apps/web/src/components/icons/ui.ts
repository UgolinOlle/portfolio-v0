/**
 * Single entry point for the Phosphor icons used across the docs/portfolio
 * chrome (nav, sidebar, feedback states, pagination). Import from here
 * instead of '@phosphor-icons/react' directly so the design system's icon set
 * stays auditable in one place. Registry/example/shadcn-package components are
 * intentionally excluded — they must stay self-contained for distribution.
 *
 * Names keep the `*Icon` convention so call sites don't depend on the library.
 * The `ssr` entry has no React context, so these work in server and client
 * components alike.
 */
export {
  ArrowRight as ArrowRightIcon,
  ArrowUpRight as ArrowUpRightIcon,
  Check as CheckIcon,
  CaretDown as ChevronDownIcon,
  CaretLeft as ChevronLeftIcon,
  CaretRight as ChevronRightIcon,
  CircleHalf as ThemeIcon,
  CircleNotch as LoaderCircleIcon,
  Copy as CopyIcon,
  CornersIn as MinimizeIcon,
  CornersOut as MaximizeIcon,
  ArrowCounterClockwise as RotateCcwIcon,
  List as MenuIcon,
  MagnifyingGlass as SearchIcon,
  PencilSimple as EditIcon,
  SidebarSimple as SidebarIcon,
  TextAlignLeft as TextIcon,
} from '@phosphor-icons/react/ssr';
