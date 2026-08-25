// Reactor solver — port of MODULE1.BAS (Calculation_Phase) from
// "DESIGN YOUR OWN NUCLEAR REACTOR", H. Peter Alesso, 1993.
//
// Fidelity notes: the 1993 Calculation_Phase contained several leftover debug
// stubs and one scoping slip that overrode computed values. Each is flagged
// FIDELITY below, with the original line quoted in the comment.

import {
  FUELS, MODERATORS, coolantProps,
  type Fuel, type Moderator, type CoolKey, type GeoKey,
} from "./materials";

export const PI = 3.141526;      // the constant as it appears in MODULE1.BAS
const BARN = 1e-24;              // cm^2
const AVOGADRO = 6.06e23;        // as used in Cal_Critical_Mass
const NETA = 2.06;               // eta, fixed at the U-235 value in the original
const CONV_ENTHALPY = 2.3;

export interface Design {
  fuel: Fuel;
  moderator: Moderator;
  coolant: CoolKey;
  geometry: GeoKey;
  lx: number; ly: number; lz: number;   // rectangular, cm
  cr: number; cheight: number;          // cylindrical, cm
  r: number;                            // spherical, cm
  maxtemp: number;   // K
  mintemp: number;   // K
  tubedia: number;   // cm
  porosity: number;
  flowrate: number;  // kg/s
}

export const DEFAULT_DESIGN: Design = {
  fuel: FUELS["U-235"],
  moderator: MODERATORS["H2O"],
  coolant: "H2O",
  geometry: "rectangular",
  lx: 100, ly: 100, lz: 100,
  cr: 50, cheight: 100,
  r: 50,
  maxtemp: 530,
  mintemp: 470,
  tubedia: 0.4,
  porosity: 0.33,
  flowrate: 10000,
};

/** Secondary-loop state points 4-7, fixed in Form_Load of the original. */
export const SEC_STATE = {
  4: { T: 516, P: 34.9, h: 1205, label: "Steam generator outlet" },
  5: { T: 52, P: 0.1436, h: 850, label: "Turbine exhaust" },
  6: { T: 41, P: 0.0769, h: 68, label: "Condenser hotwell" },
  7: { T: 104, P: 34.9, h: 168, label: "Feedwater to steam generator" },
} as const;

export interface Results {
  // geometry
  volume: number;      // m^3
  buckling: number;    // cm^-2
  adjVol: number;      // m^3 of solid (fuel + moderator)
  tubelength: number;  // cm
  // criticality
  ratio: number;       // moderator-to-fuel atom ratio
  Nm: number; Nf: number;
  critMass: number;    // kg
  critical: boolean;
  // thermal
  numbertubes: number;
  powerth: number;         // MWth
  powerdensity: number;    // MW/m^3
  deltaT: number;          // K
  heatflux: number;        // W/cm^2
  tubearea: number;        // cm^2
  fuelTemp: number;        // K
  specificPower: number;   // kW/g
  nFlux: number;           // n/s-cm^2
  burnup: number;          // Mg/yr
  massm: number; massc: number;
  // primary loop
  velocity: number;        // m/s
  machLimited: boolean;
  pressurec: number;       // atm
  priPressure: number;     // atm
  pressureDrop: number;    // atm
  pumpPower: number;       // MWe
  reynolds: number;
  frictionFactor: number;
  densityc: number; heatcap: number; viscosity: number; ccrossabs: number;
  // secondary loop
  secFlowrate: number;     // kg/s
  turbinePower: number;    // MWe
  condPumpPower: number;   // MWe
  effic: number;           // %
  openLoop: boolean;
}

export function geometryOf(d: Design): { volume: number; buckling: number; tubelength: number } {
  switch (d.geometry) {
    case "rectangular":
      return {
        volume: (d.lx * d.ly * d.lz) / 1e6,
        buckling: (PI / d.lx) ** 2 + (PI / d.ly) ** 2 + (PI / d.lz) ** 2,
        tubelength: d.lx,
      };
    case "cylindrical":
      return {
        volume: (PI * d.cr * d.cr * d.cheight) / 1e6,
        buckling: (2.405 / d.cr) ** 2 + (PI / d.cheight) ** 2,
        tubelength: d.cheight,
      };
    case "spherical":
      return {
        volume: ((4 / 3) * PI * d.r ** 3) / 1e6,
        buckling: (PI / d.r) ** 2,
        tubelength: 2 * d.r,
      };
  }
}

export function solve(d: Design): Results {
  const { volume, buckling, tubelength } = geometryOf(d);
  const openLoop = d.coolant === "H2";

  // --- Cal_Number_Tubes ---
  const heatvolume = d.porosity * volume * 1e6;              // cm^3
  const tubevolume = ((d.tubedia * d.tubedia) / 4) * PI * tubelength;
  const numbertubes = heatvolume / tubevolume;

  // --- Cal_Coolant ---
  const cp = coolantProps(d.coolant, d.mintemp);
  const { densityc, heatcap, viscosity, ccrossabs } = cp;
  let pressurec = cp.pressurec;
  let velocity =
    (10 * d.flowrate) / (densityc * numbertubes * ((d.tubedia * d.tubedia) / 4) * PI);

  // Mach 0.3 ceiling on the gas coolants (Appendix B, limitation 2).
  // FIDELITY: in the original, the helium test sat outside its own
  // If namecool1 = "He" block and so clobbered velocity for every coolant.
  // Scoped correctly here.
  let machLimited = false;
  if (d.coolant === "H2" || d.coolant === "He") {
    const gamma = d.coolant === "H2" ? 1.4 : 1.66;
    const molarMass = d.coolant === "H2" ? 2 : 8; // as coded in MODULE1.BAS
    const vmax = Math.sqrt((gamma * 8315 * d.maxtemp) / molarMass) / 3;
    if (velocity > vmax) {
      pressurec = pressurec * 2 * (velocity / vmax);
      velocity = vmax;
      machLimited = true;
    }
  }

  // --- Cal_Rx_Pressure_Drop --- (English units, smooth pipe, turbulent flow)
  const gc = 9.8;
  const R_velocity = velocity * 11880;
  const R_densityc = densityc / 0.016;
  const R_tubedia = d.tubedia / 30.48;
  const reynolds = (R_velocity * R_densityc * R_tubedia) / viscosity;
  const frictionFactor = 0.079 / Math.sqrt(Math.sqrt(reynolds));
  const term_pd1 = 1.5 * 4 * frictionFactor * (tubelength / d.tubedia);
  const pressureDrop = (term_pd1 * densityc * 100 * velocity * velocity) / (2 * gc * 1034);

  // --- Cal_Primary_Pressure ---
  // FIDELITY: the original ended with the stub Pri_Pressure = 45, discarding
  // the balance it had just computed.
  let priPressure = pressurec - pressureDrop;
  if (priPressure < 0) priPressure = 1;

  // --- Cal_Pri_Pump_Power ---
  // FIDELITY: the original ended with the stub Pump_Power = 1.
  const pumpEffic = 0.8;
  const pumpPower =
    pumpEffic * pressureDrop * ((PI * d.tubedia * d.tubedia) / 4) * numbertubes * velocity * 1e-5;

  // --- Cal_Power_Density ---
  const deltaT = d.maxtemp - d.mintemp;
  const powerth = (heatcap * deltaT * d.flowrate) / 1e6;   // MWth
  const adjVol = volume * (1 - d.porosity);
  const powerdensity = powerth / adjVol;

  // --- Cal_Fuel_Temperature ---
  let fuelR = (1 / (1 - d.porosity)) * (d.tubedia / 2);
  if (fuelR < 0.4) fuelR = 0.4;
  const fuelTemp =
    d.maxtemp + 200 + (100 * powerdensity * fuelR * fuelR) / (4 * 1.73 * d.fuel.thermalconduct);

  // --- Cal_Mass ---
  const massm = d.moderator.densitym * adjVol;      // Mg
  const massc = densityc * (volume * d.porosity);   // Mg
  const burnup = (365 * powerth) / 1e6;             // Mg/yr

  // --- Cal_Heat_Flux ---
  const tubearea = PI * d.tubedia * tubelength * numbertubes;
  const heatflux = (powerth * 1e6) / tubearea;      // W/cm^2

  // --- Cal_Critical_Mass --- (Fermi age, one-group, homogeneous, unreflected)
  const a = d.fuel.fcrossabs;
  const factor = massm / (massc + massm);
  const b = factor * d.moderator.mcrossabs + (1 - factor) * ccrossabs;
  const terma = NETA * Math.exp(-buckling * d.moderator.fermi) - 1;
  const termb = 1 + d.moderator.diffus * buckling;
  const ratio = (terma * a) / (termb * b);
  const Nm = (d.moderator.densitym * AVOGADRO) / d.moderator.Am;
  const Nf = Nm / ratio;
  let critMass = volume * (d.fuel.Af / d.moderator.Am) * (d.moderator.densitym / ratio) * 1000;
  const critical = critMass > 0 && Number.isFinite(critMass);
  if (!critical) critMass = 0.0001;

  // --- Cal_Specific_power / Cal_Neutron_Flux ---
  const specificPower = powerth / critMass;                 // kW/g
  const nFlux = (powerth * 3.1e10) / (volume * Nf * d.fuel.crossfiss * BARN);

  // --- Cal_Sec_Flowrate / Turbine / Condensate / Efficiency ---
  const secFlowrate = openLoop
    ? d.flowrate
    : (powerth * 1000) / ((SEC_STATE[4].h - SEC_STATE[7].h) * CONV_ENTHALPY);
  // FIDELITY: the original computed a turbine enthalpy drop, then overwrote it
  // with a flat 36% conversion. The enthalpy form is used here for the closed
  // loop; the 36% figure is retained for the open loop, where the coolant
  // drives the turbine directly and there is no steam generator.
  const turbinePower = openLoop
    ? d.flowrate * heatcap * deltaT * 0.36 * 1e-6
    : (secFlowrate * (SEC_STATE[4].h - SEC_STATE[5].h) * CONV_ENTHALPY * 1000) / 1e6;
  // FIDELITY: Cal_Sec_Condensate_Pump computed the 6 -> 7 enthalpy rise (which
  // is the feedwater heating duty, not pump work) and then discarded it for
  // `Sec_Flowrate * flowrate * .000001`, a product of two mass flow rates.
  // Replaced with isentropic pump work, m * v * dP / eta.
  const condPumpPower = openLoop
    ? 0
    : (secFlowrate * (SEC_STATE[7].P - SEC_STATE[6].P) * 101325 * 0.001) / (0.8 * 1e6);
  const effic = 100 * (turbinePower / powerth);

  return {
    volume, buckling, adjVol, tubelength,
    ratio, Nm, Nf, critMass, critical,
    numbertubes, powerth, powerdensity, deltaT, heatflux, tubearea, fuelTemp,
    specificPower, nFlux, burnup, massm, massc,
    velocity, machLimited, pressurec, priPressure, pressureDrop, pumpPower,
    reynolds, frictionFactor, densityc, heatcap, viscosity, ccrossabs,
    secFlowrate, turbinePower, condPumpPower, effic, openLoop,
  };
}

/** VB Format(x, "0.00E+00") — the display format used by every results page. */
export function sci(x: number): string {
  if (!Number.isFinite(x)) return "—";
  if (x === 0) return "0.00E+00";
  const exp = Math.floor(Math.log10(Math.abs(x)));
  const mant = x / 10 ** exp;
  const sign = exp < 0 ? "-" : "+";
  return `${mant.toFixed(2)}E${sign}${String(Math.abs(exp)).padStart(2, "0")}`;
}

export function fixed(x: number, n = 1): string {
  if (!Number.isFinite(x)) return "—";
  return x.toLocaleString("en-US", { minimumFractionDigits: n, maximumFractionDigits: n });
}

export type { Fuel, Moderator, CoolKey, GeoKey };
