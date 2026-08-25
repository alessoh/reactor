"use client";

import { useState } from "react";
import { Panel, Row } from "./ui";
import { type Design, type Results as R, SEC_STATE, sci, fixed } from "@/lib/reactor";
import { COOL_LABELS } from "@/lib/materials";
import { EXAMPLES } from "@/lib/content";

const TABS = ["Reactor", "Primary", "Secondary", "State Points", "Summary"] as const;
type Tab = (typeof TABS)[number];

export default function ResultsPanel({ d, r }: { d: Design; r: R }) {
  const [tab, setTab] = useState<Tab>("Reactor");

  return (
    <Panel className="overflow-hidden">
      <div className="flex overflow-x-auto border-b border-line bg-sunken/60 px-1.5 pt-1.5">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-current={tab === t}
            className={`shrink-0 rounded-t-md border border-b-0 px-3 py-1.5 text-[12px] font-medium transition-colors ${
              tab === t
                ? "-mb-px border-line bg-surface text-accent"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Reactor" && (
        <div>
          <Caption>Summary of nuclear reactor design results</Caption>
          <Row name="Volume of reactor" value={`${sci(r.volume)} m³`} />
          <Row name="Reactor geometric buckling" value={`${sci(r.buckling)} cm⁻²`} />
          <Row name="Moderator-to-fuel ratio" value={sci(r.ratio)} tone="accent" />
          <Row name="Fuel number density" value={`${sci(r.Nf)} atoms/cc`} />
          <Row name="Moderator mass" value={`${sci(r.massm)} Mg ${d.moderator.name}`} />
          <Row name="Critical mass" value={`${sci(r.critMass)} kg ${d.fuel.name}`} tone="accent" />
          <Row name="Annual fuel burnup" value={`${sci(r.burnup)} Mg/yr`} />
          <Row name="Specific power" value={`${sci(r.specificPower)} kW/g`} />
          <Row name="Power density" value={`${sci(r.powerdensity)} MW/m³`} />
          <Row name="Avg. heat flux" value={`${sci(r.heatflux)} W/cm²`} />
          <Row name="Maximum fuel temperature" value={`${sci(r.fuelTemp)} K`} tone="hot" />
          <Row name="Avg. thermal neutron flux" value={`${sci(r.nFlux)} n/s·cm²`} />
          <Row name="Thermal power produced" value={`${sci(r.powerth)} MWth`} tone="hot" />
        </div>
      )}

      {tab === "Primary" && (
        <div>
          <Caption>Summary of primary coolant results — {COOL_LABELS[d.coolant]}</Caption>
          <Row name="Reactor porosity / void fraction" value={sci(d.porosity)} />
          <Row name="Coolant tube diameter" value={`${sci(d.tubedia)} cm`} />
          <Row name="Number of coolant channels" value={sci(r.numbertubes)} />
          <Row name="Coolant density" value={`${sci(r.densityc)} g/cc`} />
          <Row name="Primary coolant pressure" value={`${sci(r.priPressure)} atm`} />
          <Row name="Primary coolant flowrate" value={`${sci(d.flowrate)} kg/s`} />
          <Row name="Primary coolant velocity" value={`${sci(r.velocity)} m/s`} tone={r.machLimited ? "hot" : "default"} />
          <Row name="Reynolds number" value={sci(r.reynolds)} />
          <Row name="Friction factor" value={sci(r.frictionFactor)} />
          <Row name="Reactor pressure drop" value={`${sci(r.pressureDrop)} atm`} />
          <Row name="Reactor pump power" value={`${sci(r.pumpPower)} MWe`} />
          <Row name="Coolant mass within reactor" value={`${sci(r.massc)} Mg`} />
          <Row name="Max primary coolant temp." value={`${sci(d.maxtemp)} K`} tone="hot" />
          <Row name="Differential coolant temp." value={`${sci(r.deltaT)} K`} />
          {r.machLimited && (
            <Note tone="hot">
              Gas velocity was clipped to Mach 0.3 and the pressure raised to compensate — Appendix B, limitation 2.
            </Note>
          )}
        </div>
      )}

      {tab === "Secondary" && (
        <div>
          <Caption>
            Summary of secondary coolant results — {r.openLoop ? "open loop" : "closed loop"}
          </Caption>
          {r.openLoop ? (
            <>
              <Row name="Working fluid" value="Hydrogen (direct)" />
              <Row name="Turbine inlet temperature" value={`${sci(d.maxtemp)} K`} tone="hot" />
              <Row name="Conversion efficiency" value={`${fixed(r.effic)} %`} tone="accent" />
              <Row name="Coolant flowrate" value={`${sci(d.flowrate)} kg/s`} />
              <Row name="Electrical power generation" value={`${sci(r.turbinePower)} MWe`} tone="accent" />
              <Note>
                In an open loop the coolant drives the turbine directly and is exhausted. There is no steam
                generator, condenser, or condensate pump.
              </Note>
            </>
          ) : (
            <>
              <Row name="Steam temperature" value={`${sci(SEC_STATE[4].T)} K`} tone="hot" />
              <Row name="Steam generator pressure" value={`${sci(SEC_STATE[4].P)} atm`} />
              <Row name="Turbine efficiency" value="8.00E+01 %" />
              <Row name="Cycle efficiency" value={`${fixed(r.effic)} %`} tone="accent" />
              <Row name="Secondary coolant flowrate" value={`${sci(r.secFlowrate)} kg/s`} />
              <Row name="Condensate pump power" value={`${sci(r.condPumpPower)} MWe`} />
              <Row name="Electrical power generation" value={`${sci(r.turbinePower)} MWe`} tone="accent" />
            </>
          )}
        </div>
      )}

      {tab === "State Points" && (
        <div className="p-4">
          <p className="label mb-2.5">System state points</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-line-strong text-left">
                  <Th>Pt</Th>
                  <Th>Location</Th>
                  <Th right>T (K)</Th>
                  <Th right>P (atm)</Th>
                  <Th right>h (BTU/lb)</Th>
                </tr>
              </thead>
              <tbody className="num">
                <Tr n="1" loc="Core outlet — hot leg" T={d.maxtemp} P={r.priPressure} h="—" tone="hot" />
                <Tr n="2" loc={r.openLoop ? "Turbine inlet" : "Steam generator inlet"} T={d.maxtemp} P={r.priPressure} h="—" tone="hot" />
                <Tr n="3" loc={r.openLoop ? "Turbine exhaust" : "Core inlet — cold leg"} T={d.mintemp} P={r.priPressure - r.pressureDrop} h="—" tone="cold" />
                {!r.openLoop && (
                  <>
                    <Tr n="4" loc={SEC_STATE[4].label} T={SEC_STATE[4].T} P={SEC_STATE[4].P} h={String(SEC_STATE[4].h)} tone="hot" />
                    <Tr n="5" loc={SEC_STATE[5].label} T={SEC_STATE[5].T} P={SEC_STATE[5].P} h={String(SEC_STATE[5].h)} />
                    <Tr n="6" loc={SEC_STATE[6].label} T={SEC_STATE[6].T} P={SEC_STATE[6].P} h={String(SEC_STATE[6].h)} tone="cold" />
                    <Tr n="7" loc={SEC_STATE[7].label} T={SEC_STATE[7].T} P={SEC_STATE[7].P} h={String(SEC_STATE[7].h)} tone="cold" />
                  </>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] leading-snug text-muted">
            Points 1–3 are the primary loop and follow your design. Points 4–7 are the secondary loop and are
            fixed at the manual&rsquo;s tabulated values.
          </p>
        </div>
      )}

      {tab === "Summary" && (
        <div>
          <Caption>Current selections</Caption>
          <Row name="Fuel" value={d.fuel.name} />
          <Row name="Moderator" value={d.moderator.name} />
          <Row name="Primary coolant" value={d.coolant} />
          <Row name="Secondary coolant" value={r.openLoop ? "— (open loop)" : "H2O"} />
          <Row
            name="Geometry"
            value={
              d.geometry === "rectangular"
                ? `${d.lx} × ${d.ly} × ${d.lz} cm`
                : d.geometry === "cylindrical"
                  ? `r ${d.cr} × h ${d.cheight} cm`
                  : `r ${d.r} cm`
            }
          />
          <Row name="Maximum temperature" value={`${d.maxtemp} K`} />
          <Row name="Minimum temperature" value={`${d.mintemp} K`} />
          <Row name="Coolant tube diameter" value={`${d.tubedia} cm`} />
          <Row name="Porosity" value={String(d.porosity)} />
          <Row name="Coolant flowrate" value={`${d.flowrate} kg/s`} />

          <div className="border-t border-line-strong px-4 pb-4 pt-3">
            <p className="label mb-2">Compared with operating plants — Appendix C</p>
            <div className="overflow-x-auto">
              <table className="w-full text-[11.5px]">
                <thead>
                  <tr className="border-b border-line text-left">
                    <Th></Th>
                    <Th right>MWth</Th>
                    <Th right>MWe</Th>
                    <Th right>m³</Th>
                    <Th right>W/cm²</Th>
                  </tr>
                </thead>
                <tbody className="num">
                  <tr className="border-b border-line/70 bg-accentsoft">
                    <td className="py-1.5 pr-2 font-semibold text-accent">Your design</td>
                    <Td>{r.powerth.toFixed(0)}</Td>
                    <Td>{r.turbinePower.toFixed(0)}</Td>
                    <Td>{r.volume.toFixed(1)}</Td>
                    <Td>{r.heatflux.toFixed(1)}</Td>
                  </tr>
                  {EXAMPLES.map((e) => (
                    <tr key={e.name} className="border-b border-line/70 last:border-b-0">
                      <td className="py-1.5 pr-2 text-ink2">
                        {e.name} <span className="text-muted">({e.type})</span>
                      </td>
                      <Td>{e.powerTh}</Td>
                      <Td>{e.powerEl}</Td>
                      <Td>{e.volume}</Td>
                      <Td>{e.heatFlux}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p className="label border-b border-line bg-sunken/40 px-4 py-2">{children}</p>
  );
}

function Note({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "hot" }) {
  return (
    <p
      className={`m-4 rounded-md px-3 py-2 text-[11.5px] leading-snug ${
        tone === "hot" ? "bg-hotsoft text-hot" : "bg-sunken text-ink2"
      }`}
    >
      {children}
    </p>
  );
}

function Th({ children, right }: { children?: React.ReactNode; right?: boolean }) {
  return (
    <th className={`label pb-1.5 font-semibold ${right ? "pl-2 text-right" : "pr-2"}`}>{children}</th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="py-1.5 pl-2 text-right tabular-nums text-ink">{children}</td>;
}

function Tr({ n, loc, T, P, h, tone = "default" }: {
  n: string; loc: string; T: number; P: number; h: string; tone?: "default" | "hot" | "cold";
}) {
  const c = tone === "hot" ? "text-hot" : tone === "cold" ? "text-cold" : "text-ink";
  return (
    <tr className="border-b border-line/70 last:border-b-0">
      <td className={`py-1.5 pr-2 font-semibold ${c}`}>{n}</td>
      <td className="py-1.5 pr-2 text-ink2" style={{ fontFamily: "var(--font-sans)" }}>{loc}</td>
      <td className="py-1.5 pl-2 text-right tabular-nums">{T.toFixed(0)}</td>
      <td className="py-1.5 pl-2 text-right tabular-nums">{P < 1 ? P.toFixed(3) : P.toFixed(1)}</td>
      <td className="py-1.5 pl-2 text-right tabular-nums">{h}</td>
    </tr>
  );
}
