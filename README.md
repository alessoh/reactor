# Design Your Own Nuclear Reactor

A preliminary conceptual design tool for thermal nuclear reactors, originally written by
H. Peter Alesso in 1993 for Windows 3.1 in Microsoft Visual Basic 3.

This repository holds the original 1993 sources alongside a browser reconstruction.

## Contents

| Path | What it is |
| --- | --- |
| `web/` | The reconstruction — Next.js, deployed to Vercel |
| `MODULE1.BAS` | Original physics module (criticality, thermal-hydraulics, coolant tables) |
| `RXMAIN.FRM` / `RXMAIN.TXT` | Original main form: menus, material tables, results pages |
| `CALC.FRM` | Calculator accessory (a Microsoft sample application) |
| `*.BMP` | Original toolbar and material bitmaps |
| `Executable/` | The 1993 install set (compressed VB3 runtime + `RX.EX_`) |
| `Reactor(2)/` | An incomplete 2007 C# port |
| `USER595.DOC`, `TUTOR595.DOC` | User's manual and tutorial |

## The reconstruction

`web/src/lib/materials.ts` and `web/src/lib/reactor.ts` are a direct port of `MODULE1.BAS`.
Every cross section, material table, and correlation is carried over unchanged.

Four leftover debug stubs in the original `Calculation_Phase` overrode computed values —
primary pressure was pinned to 45 atm, pump power to 1 MWe, turbine output to a flat 36%
conversion, and a misplaced `End If` let the helium Mach-0.3 test clobber the coolant
velocity for every coolant. These are corrected so results respond to the design; each fix
is marked `FIDELITY` in the source with the original line quoted.

Validation: the program's own default case (1 m³ core, U-235, water, closed loop) yields
2633 MWth / 902 MWe at 34.2% cycle efficiency, matching the original's hardcoded
`Effic = 34` and sitting close to the Oconee 1 reference in Appendix C (2584 MWth / 886 MWe).

## Running locally

```bash
cd web
npm install
npm run dev
```

## Limitations

Criticality uses Fermi age, thermal group, and homogeneous reactor approximations with no
reflector. Results are rough estimates for teaching parametric trade-offs, not for
engineering use.
