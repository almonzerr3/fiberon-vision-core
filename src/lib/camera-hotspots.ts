/**
 * Hotspot metadata for the CCTV camera study.
 * Browser-safe (no three.js imports) so SSR pages can render the technical
 * panel and copy without pulling the 3D bundle.
 *
 * `spec` values marked "Placeholder" are intentionally unfilled until real
 * product data sheets are supplied.
 */
export type HotspotKey = "lens" | "ir" | "housing" | "mount";

export const HOTSPOT_ANCHORS: Record<HotspotKey, [number, number, number]> = {
  lens: [0.0, 0.32, 1.02],
  ir: [0.42, 0.62, 0.88],
  housing: [-0.42, 0.42, -0.35],
  mount: [0.0, -0.42, -1.1],
};

export const HOTSPOTS: {
  key: HotspotKey;
  index: string;
  title: string;
  note: string;
  spec: [string, string][];
}[] = [
  {
    key: "lens",
    index: "01",
    title: "Lens",
    note: "Optical block reference point — motorised varifocal assembly behind IP-rated front glass.",
    spec: [
      ["Type", "Varifocal, motorised"],
      ["Aperture", "Placeholder — product data"],
      ["Focus", "Auto / remote back-focus"],
    ],
  },
  {
    key: "ir",
    index: "02",
    title: "IR illumination",
    note: "Ring of infrared emitters for zero-lux operation with adaptive power control.",
    spec: [
      ["Emitters", "Ring array"],
      ["Range", "Placeholder — product data"],
      ["Control", "Adaptive, per-zone"],
    ],
  },
  {
    key: "housing",
    index: "03",
    title: "Housing",
    note: "Sealed metal barrel with integrated shield for outdoor perimeter and industrial sites.",
    spec: [
      ["Material", "Die-cast metal"],
      ["Sealing", "Weather-rated enclosure"],
      ["Shield", "Integrated sun / rain hood"],
    ],
  },
  {
    key: "mount",
    index: "04",
    title: "Mount",
    note: "Articulated bracket with concealed cable routing through the wall-plate gland.",
    spec: [
      ["Fixing", "4-point wall plate"],
      ["Adjust", "Pan / tilt knuckle"],
      ["Cabling", "Concealed gland exit"],
    ],
  },
];
