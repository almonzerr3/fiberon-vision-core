import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HOTSPOTS, type HotspotKey } from "@/lib/camera-hotspots";

const SceneStage = lazy(() => import("../three/SceneStage"));

/**
 * Act I: hero + interactive camera study.
 * Act II: the same pinned canvas pulls back and the camera dissolves into
 * the network it runs on. Scroll drives both through a single progress ref.
 */
export function Experience() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState<HotspotKey>("lens");
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      progress.current = p;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setPhase(p);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const detail = HOTSPOTS.find((h) => h.key === active) ?? HOTSPOTS[0]!;
  const heroFade = Math.max(0, 1 - phase / 0.22);
  const netFade = Math.min(1, Math.max(0, (phase - 0.55) / 0.25));

  return (
    <div id="top" ref={wrapRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 3D layer */}
        <div className="absolute inset-0">
          <ClientOnly
            fallback={<div className="h-full w-full bg-[#0d1013]" aria-hidden="true" />}
          >
            <Suspense fallback={<div className="h-full w-full bg-[#0d1013]" />}>
              <SceneStage
                progress={progress}
                active={active}
                setActive={setActive}
                hotspotsVisible={phase < 0.34}
              />
            </Suspense>
          </ClientOnly>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_10%,transparent_35%,rgba(6,8,10,0.82)_100%)]" />

        {/* Hero copy */}
        <div
          className="pointer-events-none absolute inset-0 mx-auto flex max-w-[1400px] flex-col justify-center px-5 sm:px-8"
          style={{ opacity: heroFade, transform: `translateY(${(1 - heroFade) * -24}px)` }}
        >
          <div className="max-w-2xl">
            <p className="label-mono">Fiberon IT — Enterprise systems integrator</p>
            <h1 className="mt-5 font-display text-[clamp(2.4rem,7vw,5.25rem)] font-semibold leading-[0.94]">
              FIBERON
              <span className="mt-2 block text-[clamp(1.5rem,3.4vw,2.6rem)] font-medium leading-tight text-muted-foreground">
                Technology. Infrastructure. Security.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              We design, deploy and maintain the physical and digital backbone of critical
              facilities — structured cabling, networks, and enterprise-grade CCTV and security
              systems, engineered as one coherent platform.
            </p>
            <div className="pointer-events-auto mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#solutions"
                className="group inline-flex items-center gap-2 bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Explore solutions
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-border-strong px-5 py-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                Request a site assessment
              </a>
            </div>
          </div>
        </div>

        {/* Technical panel */}
        <div
          className="absolute bottom-6 right-5 w-[min(320px,calc(100vw-2.5rem))] border border-border bg-background/80 p-4 backdrop-blur-md transition-opacity duration-500 sm:right-8 sm:bottom-10"
          style={{ opacity: phase < 0.34 ? 1 : 0 }}
          aria-hidden={phase >= 0.34}
        >
          <div className="flex items-baseline justify-between">
            <span className="label-mono">[{detail.index}]</span>
            <span className="label-mono">Camera study</span>
          </div>
          <h2 className="mt-2 font-display text-lg font-semibold">{detail.title}</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{detail.note}</p>
          <dl className="mt-3 border-t border-border pt-3">
            {detail.spec.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-1 text-[0.75rem]">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-mono text-[0.7rem]">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex gap-1.5">
            {HOTSPOTS.map((h) => (
              <button
                key={h.key}
                type="button"
                onClick={() => setActive(h.key)}
                className={[
                  "flex-1 border py-1.5 font-mono text-[0.65rem] transition-colors",
                  active === h.key
                    ? "border-signal text-foreground"
                    : "border-border text-muted-foreground hover:border-border-strong",
                ].join(" ")}
              >
                {h.index}
              </button>
            ))}
          </div>
        </div>

        {/* Narrative overlay for act II */}
        <div
          className="pointer-events-none absolute inset-x-0 top-24 mx-auto max-w-[1400px] px-5 sm:px-8"
          style={{ opacity: netFade }}
        >
          <div className="max-w-md">
            <p className="label-mono">Act 02 — From device to network</p>
            <h2 className="mt-4 font-display text-[clamp(1.6rem,3.6vw,2.6rem)] font-semibold leading-tight">
              One camera is a sensor.
              <br />
              The network is the system.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Edge devices, PoE aggregation, resilient links, recording and analytics — designed
              together so coverage, retention and response hold up under load.
            </p>
          </div>
        </div>

        <div
          className="label-mono pointer-events-none absolute bottom-6 left-5 sm:left-8"
          style={{ opacity: heroFade }}
        >
          Scroll — drag / hover to inspect
        </div>
      </div>
    </div>
  );
}
