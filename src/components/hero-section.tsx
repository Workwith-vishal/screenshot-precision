import { Component, Suspense, lazy, type ReactNode } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";

// Browser-only R3F module — loaded lazily so SSR never touches three.js.
const HeroScene = lazy(() => import("./hero-scene"));

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("3D hero scene unavailable, showing static fallback:", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Static CSS fallback used when WebGL is unavailable or the scene fails. */
function SceneFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
      <div className="absolute top-1/3 right-[12%] h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute bottom-1/4 right-[30%] h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mr-[8%] hidden h-56 w-72 -rotate-6 md:block">
        <div className="absolute inset-x-0 bottom-0 h-24 rounded-lg bg-ink-2/80 ring-1 ring-ink-border" />
        <div className="absolute inset-x-2 bottom-16 h-28 rounded-lg bg-ink-2 shadow-2xl shadow-primary/20 ring-1 ring-primary/25" />
        <div className="absolute inset-x-4 bottom-20 h-24 rounded-md bg-ink-foreground/90" />
      </div>
    </div>
  );
}

export default function HeroSection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);

  return (
    <section id="top" ref={ref} className="ink-scene-bg relative min-h-screen overflow-hidden">
      <div data-scene-wrapper className="absolute inset-0">
        <ClientOnly fallback={<SceneFallback />}>
          <Suspense fallback={<SceneFallback />}>
            <SceneBoundary fallback={<SceneFallback />}>
              <HeroScene reduced={!!reduce} />
            </SceneBoundary>
          </Suspense>
        </ClientOnly>
      </div>
      <div className="ink-vignette pointer-events-none absolute inset-0" aria-hidden />

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 pt-24 pb-20"
      >
        <div className="max-w-2xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink-border bg-ink-2/50 px-4 py-1.5 text-xs font-medium text-ink-muted">
            <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden />
            Supporting learners in Trilokpuri since 2016
          </p>
          <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight text-ocean sm:text-6xl lg:text-7xl">
            Dive Into a World of Knowledge.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
            Discover comprehensive, affordable private lessons designed to help students learn
            with confidence, strengthen their concepts, and grow academically.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#classes"
              className="rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-transform hover:scale-[1.03]"
            >
              Explore Our Classes
            </a>
            <a
              href="#contact"
              className="rounded-full border border-ink-border px-7 py-3 font-semibold text-ink-foreground transition-colors hover:bg-ink-2/60"
            >
              Book a Demo
            </a>
          </div>
        </div>
      </motion.div>

      {!reduce && (
        <motion.a
          href="#about"
          aria-label="Scroll to about section"
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-ink-muted"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6" aria-hidden />
        </motion.a>
      )}
    </section>
  );
}
