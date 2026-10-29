import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Fade-and-rise scroll reveal that respects reduced-motion preferences. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
      <span className="inline-block h-1 w-6 rounded-full bg-gold" aria-hidden />
      {children}
    </p>
  );
}
