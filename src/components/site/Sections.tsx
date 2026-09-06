import {
  Camera,
  ScanEye,
  MonitorDot,
  Brain,
  HardDrive,
  Network,
  ArrowUpRight,
} from "lucide-react";

const CCTV_PILLARS = [
  {
    index: "01",
    title: "Camera",
    icon: Camera,
    body: "Device selection matched to scene, light, and mounting reality — fixed, varifocal, multi-sensor and PTZ, specified per position rather than per catalogue.",
  },
  {
    index: "02",
    title: "Coverage",
    icon: ScanEye,
    body: "Field-of-view and pixel-density planning against the site drawing, so identification, recognition and detection distances are engineered, not assumed.",
  },
  {
    index: "03",
    title: "Monitoring",
    icon: MonitorDot,
    body: "Operator workstations, video walls and mobile views with role-based access, so the right people see the right stream at the right moment.",
  },
  {
    index: "04",
    title: "Analytics",
    icon: Brain,
    body: "Rule-driven detection at the edge or server side — line crossing, loitering, occupancy — tuned to reduce false alarms in live conditions.",
  },
  {
    index: "05",
    title: "Recording",
    icon: HardDrive,
    body: "Retention modelled from stream count, bitrate and policy, with redundancy and failover so evidence survives disk, power and link faults.",
  },
  {
    index: "06",
    title: "Network",
    icon: Network,
    body: "PoE switching, VLAN segmentation, fibre backbone and bandwidth headroom — the layer that decides whether the whole system stays up.",
  },
];

const CAPABILITIES = [
  {
    title: "Security systems",
    lines: ["CCTV & video management", "Access control", "Intrusion & perimeter"],
  },
  {
    title: "Network infrastructure",
    lines: ["Structured cabling", "Fibre backbone", "Switching & wireless"],
  },
  {
    title: "IT & data centre",
    lines: ["Racks & containment", "Power & cooling readiness", "Monitoring"],
  },
  {
    title: "Managed services",
    lines: ["Preventive maintenance", "SLA-based support", "System health reporting"],
  },
];

const PHASES = [
  ["Assess", "Site survey, risk review and current-state audit."],
  ["Design", "Drawings, device schedules, bandwidth and retention modelling."],
  ["Deliver", "Installation, termination, configuration and commissioning."],
  ["Sustain", "Documentation handover, maintenance and lifecycle planning."],
];

export function Sections() {
  return (
    <>
      {/* CCTV & SECURITY ------------------------------------------------ */}
      <section id="solutions" className="section-light relative border-t border-border">
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
          <div className="flex flex-col gap-6 border-b border-border pb-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="label-mono">Solutions — CCTV &amp; security</p>
              <h2 className="mt-4 font-display text-[clamp(1.9rem,4.4vw,3.25rem)] font-semibold leading-[1.02]">
                Six layers decide whether surveillance works.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              We engineer all six as one system. A camera list is not a security design — coverage,
              network and retention are what hold up during an incident.
            </p>
          </div>

          <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {CCTV_PILLARS.map(({ index, title, body, icon: Icon }) => (
              <article
                key={index}
                className="group relative bg-surface p-7 transition-colors hover:bg-accent sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="label-mono">[{index}]</span>
                  <Icon className="h-4.5 w-4.5 text-signal" strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES ------------------------------------------------------- */}
      <section id="services" className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
          <p className="label-mono">Services</p>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.04]">
            Delivery discipline from survey to sustained operation.
          </h2>
          <div className="mt-14 grid gap-px bg-border md:grid-cols-4">
            {PHASES.map(([title, body], i) => (
              <div key={title} className="bg-background p-6 sm:p-7">
                <span className="label-mono">0{i + 1}</span>
                <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((c) => (
              <div key={c.title} className="bg-background p-6 sm:p-7">
                <h3 className="font-display text-base font-semibold">{c.title}</h3>
                <ul className="mt-4 space-y-2">
                  {c.lines.map((l) => (
                    <li key={l} className="flex gap-2.5 text-sm text-muted-foreground">
                      <span className="mt-2 h-px w-3 shrink-0 bg-signal" />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS ------------------------------------------------------- */}
      <section id="projects" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-mono">Projects</p>
              <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.04]">
                Reference work, published with client consent.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              This section is structured and ready for real project records — photography, scope,
              device schedules and outcomes. Nothing is shown until it is verified.
            </p>
          </div>

          <div className="mt-12 grid gap-px bg-border md:grid-cols-3">
            {["Commercial facility", "Industrial site", "Campus network"].map((t) => (
              <div key={t} className="flex flex-col bg-background p-6 sm:p-7">
                <div className="hairline-grid flex aspect-[4/3] items-end border border-border p-4">
                  <span className="label-mono">Awaiting project assets</span>
                </div>
                <h3 className="mt-5 font-display text-base font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Scope, drawings and results to be added from the delivered record.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY ----------------------------------------------------- */}
      <section id="technology" className="border-t border-border">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-2">
          <div>
            <p className="label-mono">Technology</p>
            <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.04]">
              Vendor-neutral by principle.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Platforms are selected against the requirement — open standards, documented APIs and
              supportable lifecycles. Product pages, specification sheets and 3D models are added
              here only once the manufacturer material is confirmed, so nothing on this site
              represents a product we have not verified.
            </p>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-signal hover:underline"
            >
              Request our current platform list
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <dl className="grid gap-px self-start bg-border sm:grid-cols-2">
            {[
              ["Standards", "ONVIF-aligned integration"],
              ["Cabling", "Structured, certified & tested"],
              ["Documentation", "As-built drawings on handover"],
              ["Support", "SLA-backed response"],
            ].map(([k, v]) => (
              <div key={k} className="bg-background p-6">
                <dt className="label-mono">{k}</dt>
                <dd className="mt-3 text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ABOUT ---------------------------------------------------------- */}
      <section id="about" className="section-light border-t border-border">
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="label-mono">About Fiberon IT</p>
              <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.04]">
                An engineering-led integrator for technology, infrastructure and security.
              </h2>
            </div>
            <div className="space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Fiberon IT delivers the layers most projects treat separately — cabling, networks,
                surveillance and support — under one design and one accountable team.
              </p>
              <p>
                Company details, certifications and team information will be published here from
                the official company record.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT -------------------------------------------------------- */}
      <section id="contact" className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="label-mono">Contact</p>
              <h2 className="mt-4 font-display text-[clamp(1.9rem,4.4vw,3.25rem)] font-semibold leading-[1.02]">
                Start with the site, not the shopping list.
              </h2>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                Share the facility, the concern and the constraints. We respond with an assessment
                approach and the information we need to design properly.
              </p>
            </div>
            <div className="border border-border p-7 sm:p-9">
              <p className="label-mono">Direct</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Official phone, email and address are pending confirmation from the company record
                and will be published here — we have not invented placeholder contact details.
              </p>
              <a
                href="https://fiberon-it.com/"
                className="mt-6 inline-flex items-center gap-2 border border-border-strong px-5 py-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                fiberon-it.com
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="font-display text-sm font-semibold tracking-[0.14em]">FIBERON IT</span>
          <span className="label-mono">Technology. Infrastructure. Security.</span>
        </div>
      </footer>
    </>
  );
}
