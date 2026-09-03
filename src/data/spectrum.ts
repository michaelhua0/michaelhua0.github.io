/* ============================================================
   The spectral system — one source of truth for the JS side.

   Values point directly to the CSS `--band-*` tokens, so generated
   art and project signatures share the document palette.
   ============================================================ */

export const SPECTRUM = {
  violet: "var(--band-violet)",
  blue: "var(--band-blue)",
  teal: "var(--band-teal)",
  green: "var(--band-green)",
  amber: "var(--band-amber)",
  red: "var(--band-red)",
} as const;

/** Ordered low → high wavelength — use for ramps and generated art. */
export const SPECTRUM_RAMP: string[] = [
  SPECTRUM.violet,
  SPECTRUM.blue,
  SPECTRUM.teal,
  SPECTRUM.green,
  SPECTRUM.amber,
  SPECTRUM.red,
];

/** A research/creative domain, mapped onto the visible spectrum. */
export type Domain = "medical" | "hyperspectral" | "physical-ai" | "history";

export interface Band {
  id: Domain;
  /** Representative wavelength in nm (the spine coordinate). */
  nm: number;
  /** Human-readable domain label. */
  label: string;
  /** Accent color drawn from SPECTRUM. */
  color: string;
}

/* The canonical domain → wavelength map. Ascending nm so the list is
   already in spine order (blue medical → red history). */
export const BANDS: Band[] = [
  { id: "medical", nm: 470, label: "Medical computer vision", color: SPECTRUM.blue },
  { id: "hyperspectral", nm: 520, label: "Hyperspectral imaging", color: SPECTRUM.teal },
  { id: "physical-ai", nm: 600, label: "Physical AI and software", color: SPECTRUM.amber },
  { id: "history", nm: 660, label: "Documentary history", color: SPECTRUM.red },
];

export const bandOf = (id: Domain): Band =>
  BANDS.find((b) => b.id === id) ?? BANDS[0];
