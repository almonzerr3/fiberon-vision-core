import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Solutions", href: "#solutions" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Technology", href: "#technology" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex max-w-[1400px] items-center justify-between px-5 transition-all duration-500 sm:px-8",
          scrolled ? "h-14" : "h-20",
        ].join(" ")}
      >
        <a href="#top" className="group flex items-baseline gap-2">
          <span
            className={[
              "font-display font-semibold tracking-[0.12em] transition-all duration-500",
              scrolled ? "text-base" : "text-lg",
            ].join(" ")}
          >
            FIBERON
          </span>
          <span className="label-mono hidden text-[0.6rem] sm:inline">IT</span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="relative py-1 text-[0.8125rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-signal transition-transform duration-300 hover:scale-x-100" />
            </a>
          ))}
          <a
            href="#contact"
            className="border border-border-strong px-4 py-2 text-[0.8125rem] font-medium transition-colors hover:bg-foreground hover:text-background"
          >
            Talk to engineering
          </a>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center border border-border lg:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex max-w-[1400px] flex-col px-5 py-2 sm:px-8">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3.5 text-sm font-medium text-muted-foreground last:border-0"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
