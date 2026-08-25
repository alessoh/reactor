import { solve, DEFAULT_DESIGN, sci, type Design } from "./src/lib/reactor.ts";
import { FUELS, MODERATORS } from "./src/lib/materials.ts";

const D = DEFAULT_DESIGN;

function show(name: string, d: Design) {
  const r = solve(d);
  const dim =
    d.geometry === "rectangular" ? `${d.lx}x${d.ly}x${d.lz}`
    : d.geometry === "cylindrical" ? `r${d.cr} h${d.cheight}` : `r${d.r}`;
  console.log(`\n=== ${name} ===`);
  console.log(`  ${d.fuel.name} / ${d.moderator.name} / ${d.coolant} / ${d.geometry} ${dim} / ${d.mintemp}-${d.maxtemp}K / w=${d.flowrate} / por=${d.porosity} / dia=${d.tubedia}`);
  console.log(`  volume        ${sci(r.volume)} m^3      buckling   ${sci(r.buckling)} cm^-2`);
  console.log(`  Nm/Nf ratio   ${sci(r.ratio)}          Nf         ${sci(r.Nf)} atoms/cc`);
  console.log(`  critMass      ${sci(r.critMass)} kg      critical   ${r.critical}`);
  console.log(`  moderator m   ${sci(r.massm)} Mg       coolant m  ${sci(r.massc)} Mg`);
  console.log(`  powerth       ${sci(r.powerth)} MWth    powerden   ${sci(r.powerdensity)} MW/m^3`);
  console.log(`  channels      ${sci(r.numbertubes)}         heatflux   ${sci(r.heatflux)} W/cm^2`);
  console.log(`  velocity      ${sci(r.velocity)} m/s     mach-lim   ${r.machLimited}`);
  console.log(`  dP            ${sci(r.pressureDrop)} atm     P_pri      ${sci(r.priPressure)} atm`);
  console.log(`  pumpPower     ${sci(r.pumpPower)} MWe     Re         ${sci(r.reynolds)}`);
  console.log(`  fuelTemp      ${sci(r.fuelTemp)} K       nFlux      ${sci(r.nFlux)} n/s-cm2`);
  console.log(`  specPower     ${sci(r.specificPower)} kW/g    burnup     ${sci(r.burnup)} Mg/yr`);
  console.log(`  secFlow       ${sci(r.secFlowrate)} kg/s    turbine    ${sci(r.turbinePower)} MWe`);
  console.log(`  condPump      ${sci(r.condPumpPower)} MWe     effic      ${r.effic.toFixed(1)} %`);
}

// ---- Example 1: the demonstration default, then corrected ----
show("EX1a default demo (1 m^3)", D);
show("EX1b enlarged to 300 cm cube", { ...D, lx: 300, ly: 300, lz: 300 });
show("EX1c 300 cm cube, flow trimmed to 15000", { ...D, lx: 300, ly: 300, lz: 300, flowrate: 15000 });

// ---- Example 2: heavy-water, cylindrical ----
show("EX2 D2O cylinder r=200 h=370", {
  ...D, moderator: MODERATORS["D2O"], geometry: "cylindrical", cr: 200, cheight: 370,
  maxtemp: 570, mintemp: 530, flowrate: 17000, porosity: 0.4,
});

// ---- Example 3: graphite / helium HTGR sphere ----
show("EX3 C-12 + He sphere r=250", {
  ...D, moderator: MODERATORS["C-12"], coolant: "He", geometry: "spherical", r: 250,
  maxtemp: 1000, mintemp: 600, flowrate: 3000, porosity: 0.3, tubedia: 1.2,
});

// ---- Example 4: open-loop hydrogen, compact ----
show("EX4 open loop H2, Be moderator, cyl r=40 h=90", {
  ...D, moderator: MODERATORS["Be"], coolant: "H2", geometry: "cylindrical", cr: 40, cheight: 90,
  maxtemp: 2400, mintemp: 300, flowrate: 40, porosity: 0.5, tubedia: 0.6,
});

// ---- Parametric sweep: cube edge vs critical mass (U-235 / H2O) ----
console.log("\n=== SWEEP A: cube edge (cm) vs critical mass, U-235/H2O ===");
console.log("edge_cm\tvolume_m3\tbuckling\tratio\tcritMass_kg\tcritical");
for (const L of [40, 50, 60, 80, 100, 150, 200, 250, 300, 400, 500]) {
  const r = solve({ ...D, lx: L, ly: L, lz: L });
  console.log(`${L}\t${r.volume.toFixed(2)}\t${r.buckling.toExponential(3)}\t${r.critical ? r.ratio.toFixed(1) : "-"}\t${r.critical ? r.critMass.toFixed(2) : "SUBCRITICAL"}\t${r.critical}`);
}

// ---- Parametric sweep: moderator comparison at fixed 200 cm cube ----
console.log("\n=== SWEEP B: moderator, U-235, 200 cm cube ===");
console.log("mod\tfermi\tL2\tratio\tcritMass_kg\tmodMass_Mg");
for (const k of ["H2O", "D2O", "Be", "C-12", "C-13"] as const) {
  const r = solve({ ...D, moderator: MODERATORS[k], lx: 200, ly: 200, lz: 200 });
  console.log(`${k}\t${MODERATORS[k].fermi}\t${MODERATORS[k].diffus}\t${r.critical ? r.ratio.toFixed(1) : "-"}\t${r.critical ? r.critMass.toFixed(2) : "SUBCRIT"}\t${r.massm.toFixed(1)}`);
}

// ---- Parametric sweep: fuel comparison at fixed 200 cm cube ----
console.log("\n=== SWEEP C: fuel, H2O, 200 cm cube ===");
console.log("fuel\tsig_f\tsig_a\tratio\tcritMass_kg");
for (const k of ["U-233", "U-235", "Pu-239", "Pu-241", "Am-242", "Cm-245"] as const) {
  const r = solve({ ...D, fuel: FUELS[k], lx: 200, ly: 200, lz: 200 });
  console.log(`${k}\t${FUELS[k].crossfiss}\t${FUELS[k].fcrossabs}\t${r.ratio.toFixed(1)}\t${r.critMass.toFixed(2)}`);
}

// ---- Parametric sweep: geometry at equal volume 8 m^3 ----
console.log("\n=== SWEEP D: geometry at ~8 m^3, U-235/H2O ===");
const pi = 3.141526;
const rSph = Math.cbrt((8 * 1e6 * 3) / (4 * pi));
const rCyl = Math.cbrt((8 * 1e6) / (pi * 1.847));
console.log(`sphere r=${rSph.toFixed(1)} cyl r=${rCyl.toFixed(1)} h=${(1.847 * rCyl).toFixed(1)} cube L=200`);
for (const [n, d] of [
  ["cube 200", { ...D, lx: 200, ly: 200, lz: 200 }],
  ["cylinder H=1.847R", { ...D, geometry: "cylindrical" as const, cr: rCyl, cheight: 1.847 * rCyl }],
  ["sphere", { ...D, geometry: "spherical" as const, r: rSph }],
] as const) {
  const r = solve(d as Design);
  console.log(`${n}\tV=${r.volume.toFixed(2)}\tB2=${r.buckling.toExponential(3)}\tratio=${r.ratio.toFixed(1)}\tM=${r.critMass.toFixed(2)} kg`);
}
