# Design Your Own Nuclear Reactor

**[Run it in your browser → reactor-seven.vercel.app](https://reactor-seven.vercel.app/)**

A preliminary conceptual design tool for thermal nuclear reactors. Choose a fissile fuel, a
moderator, a coolant, and a core shape, set five operating parameters, and the program computes
the critical mass of fuel along with the power, power density, heat flux, coolant velocity, fuel
centreline temperature, neutron flux, and cycle efficiency that follow from those choices.

Originally written by **H. Peter Alesso in 1993** for Windows 3.1 in Microsoft Visual Basic 3, and
reconstructed here as a web application. This repository holds both: the complete 1993 sources and
the browser edition.

---

## Introduction

Reactor design is a parametric problem. Four choices dominate a thermal reactor concept, and each
one pulls on the others:

- **Fuel** sets the probability that an absorbed neutron produces a fission.
- **Moderator** sets the probability that a fast neutron slows to thermal energy without being
  captured or leaking out.
- **Geometry** sets the rate at which neutrons are lost through the core surface.
- **Coolant** absorbs some neutrons, and determines how fast heat leaves the core and at what
  temperature — which fixes the efficiency of the conversion cycle.

Enlarging the core reduces leakage and helps criticality, but costs fuel inventory and power
density. Graphite gives excellent neutron economy but forces a large core. A hotter coolant outlet
raises cycle efficiency but pushes the fuel towards its melting point. Every gain is paid for
somewhere.

This program makes the cost of asking "what if" close to zero, so you can map that trade surface
instead of guessing at it. Every result recomputes the moment you move a slider.

### What it computes

Criticality via the moderator-to-fuel atom ratio, then critical mass, geometric buckling, fuel
number density, moderator and coolant mass, thermal power, power density, average heat flux, fuel
centreline temperature, specific power, thermal neutron flux, annual burnup, coolant velocity,
Reynolds number, friction factor, core pressure drop, pumping power, secondary flow rate, turbine
output, and cycle efficiency.

### What it does not

No burnup over time, fission product poisoning, control rod worth, transients, shielding thickness,
structural analysis, or cost. It assumes a **homogeneous, unreflected** core and uses the thermal
group, homogeneous reactor, and Fermi age approximations. Results are order-of-magnitude estimates
with the right sensitivities — good for teaching parametric trade-offs, not for engineering design.

---

## Running it

### The easy way

Go to **<https://reactor-seven.vercel.app/>**. Nothing to install, no account, no data leaves your
machine — every calculation happens locally in the page. It loads with a demonstration reactor
already configured and solved.

Any current browser works. A screen at least 1200 px wide is best, since it shows the design
controls, the plant diagram, and the results side by side.

### Running locally

Requires [Node.js](https://nodejs.org/) 20 or later.

```bash
git clone https://github.com/alessoh/reactor.git
```

```bash
cd reactor/web && npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>.

To build and serve a production bundle instead:

```bash
npm run build && npm start
```

### Deploying your own copy

The app is a static Next.js site and deploys anywhere. For Vercel:

```bash
cd web && npx vercel deploy --prod
```

---

## Using the program

Work down the left panel in order:

1. **Select the fuel** — U-233, U-235, Pu-239, Pu-241, Am-242, or Cm-245.
2. **Select the moderator** — light water, heavy water, beryllium, carbon-12, or carbon-13.
3. **Select the coolant** — water, hydrogen, helium, or sodium. Hydrogen switches the plant to an
   open loop automatically.
4. **Select the geometry** and enter dimensions in centimetres — rectangular, cylindrical, or
   spherical.
5. **Set the variables** — maximum and minimum coolant temperature (K), tube diameter (cm),
   porosity, and coolant flow rate (kg/s).

Results appear on five output pages: **Reactor**, **Primary**, **Secondary**, **State Points**, and
**Summary**. The Summary page benchmarks your design against Oconee 1 and Pickering.

**Save case** adds the current design to a comparison table for parametric studies. **Files → Save
design** writes a JSON file you can reload later. If your design cannot reach criticality, a warning
banner names the three variables that will fix it.

Full instructions, four worked examples, a glossary, and six appendices of data are in the manual:
**[`manual/Nuclear-Reactor-Design-Manual.pdf`](manual/Nuclear-Reactor-Design-Manual.pdf)**.

---

## What is in this repository

| Path | Contents |
| --- | --- |
| `web/` | The browser edition — Next.js, TypeScript, Tailwind |
| `web/src/lib/reactor.ts` | The solver, ported from `MODULE1.BAS` |
| `web/src/lib/materials.ts` | Fuel, moderator, and coolant property tables |
| `manual/` | The 53-page manual, its figures, and the build scripts |
| `MODULE1.BAS` | Original 1993 physics module |
| `RXMAIN.FRM`, `RXMAIN.TXT` | Original main form: menus, material data, results pages |
| `CALC.FRM` | Calculator accessory (a Microsoft sample application) |
| `*.BMP` | Original toolbar and material bitmaps |
| `Executable/` | The 1993 install set — compressed VB3 runtime and `RX.EX_` |
| `Reactor(2)/` | An incomplete 2007 C# port |
| `USER595.DOC`, `TUTOR595.DOC` | Original user's manual and tutorial |

---

## About the reconstruction

`web/src/lib/materials.ts` and `web/src/lib/reactor.ts` are a direct port of `MODULE1.BAS`. Every
cross section, material property table, coolant step table, and correlation is carried over
unchanged.

Four leftover debugging statements in the original `Calculation_Phase` overrode computed values:
primary pressure was pinned to 45 atm, pump power to 1 MWe, turbine output to a flat 36 per cent
conversion, and a misplaced `End If` let the helium Mach-0.3 test corrupt the coolant velocity for
every coolant. These are corrected so the values respond to your design; each fix is marked
`FIDELITY` in the source with the original line quoted.

**Validation.** The program's own default case — a 1 m³ core of U-235 in light water, water cooled,
closed loop — yields 2633 MWth and 902 MWe at 34.2 per cent cycle efficiency. That matches the
original's hardcoded `Effic = 34` and sits close to the Oconee 1 reference in Appendix C
(2584 MWth, 886 MWe).

---

## Contact

**H. Peter Alesso** — <h.alesso@comcast.net>

AI HIVE Publications, Pleasanton, CA 94566 · [hpeteralesso.com](https://hpeteralesso.com)

Issues and pull requests: <https://github.com/alessoh/reactor/issues>

---

## License

See [LICENSE](LICENSE).
