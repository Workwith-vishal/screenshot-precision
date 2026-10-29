import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpenText, Menu, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/site-data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-ink-border bg-ink/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label={`${SITE.name} — home`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
            <BookOpenText className="h-5 w-5" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-bold tracking-wide text-ink-foreground">
              ELITE STUDY POINT
            </span>
            <span className="block text-[11px] font-medium text-gold">{SITE.tagline}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-foreground/80 transition-colors hover:text-ink-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03]"
          >
            Enquire Now
          </a>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-foreground md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(true)}
        >
          <Menu className="h-6 w-6" aria-hidden />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 md:hidden" id="mobile-menu">
            <motion.button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              aria-label="Mobile"
              className="absolute inset-y-0 right-0 flex w-[85%] max-w-xs flex-col gap-2 border-l border-ink-border bg-ink p-6 pt-20"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-lg text-ink-foreground"
              >
                <X className="h-6 w-6" aria-hidden />
              </button>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 font-display text-lg font-semibold text-ink-foreground transition-colors hover:bg-white/5 hover:bg-ink-2/60"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-4 rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25"
              >
                Enquire Now
              </a>
              <p className="mt-auto pt-6 text-xs text-ink-muted">
                {SITE.locationLabel} · Since {SITE.established}
              </p>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
