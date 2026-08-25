// Material property tables ported from the 1993 Visual Basic 3 source
// (RXMAIN.FRM menu handlers and MODULE1.BAS coolant subroutines).
// Cross sections in barns; densities in g/cc.

export type FuelKey = "U-233" | "U-235" | "Pu-239" | "Pu-241" | "Am-242" | "Cm-245" | "custom";
export type ModKey = "H2O" | "D2O" | "Be" | "C-12" | "C-13" | "custom";
export type CoolKey = "H2O" | "H2" | "He" | "Sodium";
export type GeoKey = "rectangular" | "cylindrical" | "spherical";

export interface Fuel {
  name: string;
  crossfiss: number;      // thermal fission cross section, barns
  crosscatf: number;      // thermal capture cross section, barns
  fcrossabs: number;      // thermal absorption cross section, barns
  densityf: number;       // g/cc
  Af: number;             // atomic mass number
  thermalconduct: number; // BTU/hr-ft-F
}

export interface Moderator {
  name: string;
  diffus: number;    // diffusion length squared, cm^2
  fermi: number;     // Fermi age, cm^2
  densitym: number;  // g/cc
  mcrossabs: number; // thermal absorption cross section, barns
  Am: number;        // mass number
}

export const FUELS: Record<Exclude<FuelKey, "custom">, Fuel> = {
  "U-233":  { name: "U-233",  crossfiss: 514,  crosscatf: 14, fcrossabs: 569,  densityf: 19, Af: 233, thermalconduct: 14 },
  "U-235":  { name: "U-235",  crossfiss: 582,  crosscatf: 15, fcrossabs: 679,  densityf: 19, Af: 235, thermalconduct: 14 },
  "Pu-239": { name: "Pu-239", crossfiss: 760,  crosscatf: 11, fcrossabs: 1030, densityf: 19, Af: 239, thermalconduct: 14 },
  "Pu-241": { name: "Pu-241", crossfiss: 988,  crosscatf: 10, fcrossabs: 1384, densityf: 19, Af: 241, thermalconduct: 14 },
  "Am-242": { name: "Am-242", crossfiss: 6000, crosscatf: 12, fcrossabs: 7700, densityf: 19, Af: 242, thermalconduct: 14 },
  "Cm-245": { name: "Cm-245", crossfiss: 1700, crosscatf: 20, fcrossabs: 2000, densityf: 19, Af: 245, thermalconduct: 14 },
};

export const MODERATORS: Record<Exclude<ModKey, "custom">, Moderator> = {
  "H2O":  { name: "H2O",  diffus: 7.617, fermi: 31.36, densitym: 1,    mcrossabs: 0.66,  Am: 18 },
  "D2O":  { name: "D2O",  diffus: 10000, fermi: 121,   densitym: 1.1,  mcrossabs: 0.002, Am: 20 },
  "Be":   { name: "Be",   diffus: 441,   fermi: 84.64, densitym: 1.85, mcrossabs: 0.01,  Am: 9 },
  "C-12": { name: "C-12", diffus: 4121,  fermi: 350,   densitym: 1.9,  mcrossabs: 0.004, Am: 12 },
  "C-13": { name: "C-13", diffus: 4121,  fermi: 350,   densitym: 1.9,  mcrossabs: 0.002, Am: 13 },
};

export const FUEL_LABELS: Record<FuelKey, string> = {
  "U-233": "Uranium-233", "U-235": "Uranium-235", "Pu-239": "Plutonium-239",
  "Pu-241": "Plutonium-241", "Am-242": "Americium-242", "Cm-245": "Curium-245",
  custom: "Your Own Fuel",
};

export const MOD_LABELS: Record<ModKey, string> = {
  "H2O": "Light Water", "D2O": "Heavy Water", Be: "Beryllium",
  "C-12": "Carbon-12", "C-13": "Carbon-13", custom: "Your Own Moderator",
};

export const COOL_LABELS: Record<CoolKey, string> = {
  "H2O": "Water", H2: "Hydrogen", He: "Helium", Sodium: "Sodium",
};

// --- Coolant property lookups (MODULE1.BAS step tables, verbatim) ---

export interface CoolantProps {
  heatcap: number;   // J/kg-K
  densityc: number;  // g/cc (after 0.016 lb/ft^3 -> g/cc conversion)
  viscosity: number;
  pressurec: number; // atmospheres
  enthalpyc: number; // J/g
  ccrossabs: number; // thermal absorption cross section, barns
}

const CONV_HEATCAP = 4180;    // J/kg-K
const CONV_DENSITY = 0.016;   // lb/ft^3 -> g/cc
const CONV_ENTHALPY = 2.3;    // BTU/lb -> J/g
export const SAFETY_FACTOR = 2;

/** Sub water() — saturated-water property table keyed on minimum coolant temperature (K). */
export function water(mintemp: number): CoolantProps {
  const rows: [number, number, number, number, number, number][] = [
    // [ T upper bound, enthalpy, viscosity, heatcap, pressure, density ]
    [273, 0.01, 4.32, 1, 0.0235, 62.57],
    [293, 36.09, 4.32, 1.0074, 0.0728, 62.46],
    [313, 72.04, 3.1, 0.9988, 0.199, 62.09],
    [333, 108.9, 1.61, 0.998, 0.47, 61.52],
    [353, 143.9, 1.05, 0.9994, 1, 60.81],
    [373, 180.1, 0.74, 1.002, 1.958, 59.97],
    [393, 216.5, 0.6, 1.007, 3.565, 59.01],
    [413, 253.3, 0.5, 1.015, 6.27, 57.95],
    [433, 292.1, 0.4, 1.023, 9.86, 56.79],
    [453, 328, 0.3, 1.037, 15.305, 55.5],
    [473, 366.4, 0.25, 1.05, 23.3, 54.11],
    [493, 413, 0.2, 1.076, 33.3, 52.59],
    [513, 447, 0.16, 1.101, 46.24, 50.92],
    [533, 487, 0.16, 1.136, 62.7, 49.02],
    [553, 530, 0.16, 1.182, 83.3, 46.98],
    [573, 575, 0.16, 1.244, 111.56, 44.59],
    [593, 631, 0.16, 1.368, 144.21, 43],
    [Infinity, 687, 0.16, 1.3, 184, 42],
  ];
  const r = rows.find((x) => mintemp <= x[0])!;
  return {
    enthalpyc: r[1] * CONV_ENTHALPY,
    viscosity: r[2],
    heatcap: r[3] * CONV_HEATCAP,
    pressurec: r[4] * SAFETY_FACTOR,
    densityc: r[5] * CONV_DENSITY,
    ccrossabs: 0.66,
  };
}

/** Sub hydrogen() */
export function hydrogen(mintemp: number): CoolantProps {
  const rows: [number, number, number][] = [
    [30, 2.589, 0.052], [50, 2.508, 0.031], [100, 2.682, 0.015], [150, 3.101, 0.01],
    [200, 3.234, 0.0076], [250, 3.358, 0.00613], [300, 3.419, 0.0055], [350, 3.448, 0.0051],
    [400, 3.461, 0.0044], [450, 3.463, 0.0038], [500, 3.465, 0.0034], [550, 3.471, 0.00307],
    [600, 3.47, 0.00279], [700, 3.481, 0.00255], [800, 3.505, 0.00218], [900, 3.54, 0.0019],
    [1000, 3.575, 0.0017], [1100, 3.622, 0.0015], [1200, 3.67, 0.00139], [1300, 3.72, 0.00128],
    [Infinity, 3.735, 0.00118],
  ];
  const r = rows.find((x) => mintemp <= x[0])!;
  return {
    heatcap: r[1] * CONV_HEATCAP,
    densityc: r[2] * CONV_DENSITY,
    viscosity: 0.022,
    pressurec: 1,
    enthalpyc: 0,
    ccrossabs: 0.33,
  };
}

/** Sub helium() */
export function helium(mintemp: number): CoolantProps {
  const dRows: [number, number][] = [
    [60, 0.0915], [100, 0.211], [150, 0.0152], [200, 0.0119], [353, 0.0083],
    [593, 0.00517], [920, 0.00376], [Infinity, 0.0033],
  ];
  const vRows: [number, number][] = [[400, 0.045], [800, 0.06], [Infinity, 0.09]];
  return {
    heatcap: 1.242 * CONV_HEATCAP,
    densityc: dRows.find((x) => mintemp <= x[0])![1] * CONV_DENSITY,
    viscosity: vRows.find((x) => mintemp <= x[0])![1],
    pressurec: 1,
    enthalpyc: 0,
    ccrossabs: 0.007,
  };
}

/** Sub sodium() */
export function sodium(mintemp: number): CoolantProps {
  const rows: [number, number, number, number][] = [
    [373, 0.3305, 57.87, 2], [473, 0.32, 56.44, 1.7], [573, 0.3116, 55.06, 1.089],
    [673, 0.3055, 53.63, 0.835], [773, 0.3015, 52.07, 0.687], [873, 0.2998, 50.51, 0.587],
    [973, 0.3003, 48.48, 0.508], [1073, 0.303, 47.26, 0.45], [1173, 0.3079, 46.5, 0.39],
    [Infinity, 0.3, 45, 0.362],
  ];
  const r = rows.find((x) => mintemp <= x[0])!;
  return {
    heatcap: r[1] * CONV_HEATCAP,
    densityc: r[2] * CONV_DENSITY,
    viscosity: r[3],
    pressurec: 1,
    enthalpyc: 0,
    ccrossabs: 0.525,
  };
}

export function coolantProps(kind: CoolKey, mintemp: number): CoolantProps {
  switch (kind) {
    case "H2O": return water(mintemp);
    case "H2": return hydrogen(mintemp);
    case "He": return helium(mintemp);
    case "Sodium": return sodium(mintemp);
  }
}
