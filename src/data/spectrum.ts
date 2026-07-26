/* ============================================================
   The spectral system — one source of truth for the JS side.

   These hexes mirror the CSS `--band-*` tokens in
   src/styles/global.css; keep the two in sync. Anything that
   needs spectral color in TypeScript (generated art, per-project
   signatures, the wavelength spine) imports from here instead of
   redefining its own palette.
   ============================================================ */

export const SPECTRUM = {
  violet: "#8b7bff",
  blue: "#4f8dff",
  teal: "#2fd4bf",
  green: "#46c86b",
  amber: "#e6b23f",
  red: "#ec6a63",
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
  { id: "medical", nm: 470, label: "Medical · Computer vision", color: SPECTRUM.blue },
  { id: "hyperspectral", nm: 520, label: "Hyperspectral imaging", color: SPECTRUM.teal },
  { id: "physical-ai", nm: 600, label: "Physical AI · Software", color: SPECTRUM.amber },
  { id: "history", nm: 660, label: "History · Documentary", color: SPECTRUM.red },
];

export const bandOf = (id: Domain): Band =>
  BANDS.find((b) => b.id === id) ?? BANDS[0];
