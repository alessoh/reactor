"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import MenuBar, { type Menu } from "@/components/MenuBar";
import DesignPanel from "@/components/DesignPanel";
import ResultsPanel from "@/components/Results";
import Schematic from "@/components/Schematic";
import { Panel, Button } from "@/components/ui";
import {
  CustomFuelDialog, CustomModDialog, TutorialDialog, TablesDialog, AboutDialog,
} from "@/components/Dialogs";
import { DEFAULT_DESIGN, solve, sci, fixed, type Design } from "@/lib/reactor";
import {
  FUELS, MODERATORS, type Fuel, type Moderator, type FuelKey, type ModKey,
} from "@/lib/materials";

interface Case extends Design {
  id: number;
  label: string;
}

export default function Page() {
  const [d, setD] = useState<Design>(DEFAULT_DESIGN);
  const [cases, setCases] = useState<Case[]>([]);
  const [dialog, setDialog] = useState<null | "fuel" | "mod" | "tutorial" | "tables" | "about">(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  const r = useMemo(() => solve(d), [d]);
  const set = useCallback((patch: Partial<Design>) => setD((x) => ({ ...x, ...patch })), []);

  const fuelKey = (Object.keys(FUELS).find(
    (k) => FUELS[k as Exclude<FuelKey, "custom">].name === d.fuel.name
  ) ?? "custom") as FuelKey;
  const modKey = (Object.keys(MODERATORS).find(
    (k) => MODERATORS[k as Exclude<ModKey, "custom">].name === d.moderator.name
  ) ?? "custom") as ModKey;

  /* ------------------------------------------------------------ File I/O */

  const saveDesign = () => {
    const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `reactor-${d.fuel.name}-${d.geometry}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const openDesign = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const loaded = JSON.parse(String(reader.result));
        setD({ ...DEFAULT_DESIGN, ...loaded });
      } catch {
        alert("That file is not a saved reactor design.");
      }
    };
    reader.readAsText(file);
  };

  const addCase = () =>
    setCases((c) => [
      ...c,
      { ...d, id: nextId.current++, label: `${d.fuel.name} / ${d.moderator.name} / ${d.coolant}` },
    ]);

  /* -------------------------------------------------------------- Menus */

  const menus: Menu[] = [
    {
      label: "Files",
      items: [
        { label: "Open design…", onSelect: () => fileRef.current?.click() },
        { label: "Save design…", onSelect: saveDesign },
        { divider: true, label: "" },
        { label: "Print page", onSelect: () => window.print() },
        { divider: true, label: "" },
        { label: "Reset to defaults", onSelect: () => setD(DEFAULT_DESIGN) },
      ],
    },
    {
      label: "Design Reactor",
      items: [
        { label: "Define your own fuel…", onSelect: () => setDialog("fuel") },
        { label: "Define your own moderator…", onSelect: () => setDialog("mod") },
        { divider: true, label: "" },
        { label: "Rectangular parallelepiped", checked: d.geometry === "rectangular", onSelect: () => set({ geometry: "rectangular" }) },
        { label: "Cylindrical", checked: d.geometry === "cylindrical", onSelect: () => set({ geometry: "cylindrical" }) },
        { label: "Spherical", checked: d.geometry === "spherical", onSelect: () => set({ geometry: "spherical" }) },
      ],
    },
    {
      label: "Reactor Results",
      items: [
        { label: "Save this case for comparison", onSelect: addCase },
        { label: "Clear saved cases", onSelect: () => setCases([]) },
      ],
    },
    {
      label: "Tools",
      items: [{ label: "Appendix A — data tables", onSelect: () => setDialog("tables") }],
    },
    {
      label: "Help",
      items: [
        { label: "Tutorial — contents", onSelect: () => setDialog("tutorial") },
        { label: "Assumptions & limitations", onSelect: () => setDialog("tables") },
        { divider: true, label: "" },
        { label: "About", onSelect: () => setDialog("about") },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && openDesign(e.target.files[0])}
      />

      {/* ------------------------------------------------------------ Header */}
      <header className="sticky top-0 z-30 border-b border-line bg-paper/92 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-x-5 gap-y-2 px-5 py-2.5">
          <div className="flex items-center gap-2.5">
            <Atom />
            <div>
              <h1 className="text-[14px] font-semibold leading-tight tracking-tight text-ink">
                Design Your Own Nuclear Reactor
              </h1>
              <p className="text-[10.5px] leading-tight text-muted">
                H. Peter Alesso · 1993 · reconstructed
              </p>
            </div>
          </div>
          <div className="ml-auto flex w-full items-center gap-2 overflow-x-auto sm:w-auto">
            <MenuBar menus={menus} />
            <Button variant="primary" onClick={addCase}>Save case</Button>
          </div>
        </div>
      </header>

      {/* ----------------------------------------------------- Criticality */}
      {!r.critical && (
        <div className="border-b border-danger/25 bg-dangersoft">
          <div className="mx-auto flex max-w-[1500px] items-start gap-3 px-5 py-2.5">
            <span className="mt-px text-[15px] leading-none text-danger">⚠</span>
            <p className="text-[12.5px] leading-snug text-danger">
              <strong>This reactor design will not achieve criticality.</strong> The moderator-to-fuel ratio is
              negative — neutron leakage and absorption exceed production. Enlarge the core, choose a moderator
              with a shorter Fermi age, or select a fuel with a larger fission cross section.
            </p>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-[1500px] px-5 py-5">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[330px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)_400px]">
          {/* ------------------------------------------------- Design rail */}
          <div className="min-w-0 lg:sticky lg:top-[62px] lg:self-start">
            <DesignPanel
              d={d}
              set={set}
              fuelKey={fuelKey}
              modKey={modKey}
              onCustomFuel={() => setDialog("fuel")}
              onCustomMod={() => setDialog("mod")}
            />
          </div>

          {/* --------------------------------------- Schematic + key stats */}
          <div className="min-w-0 space-y-5">
            <Panel
              title="System Diagram"
              aside={
                <span className="num text-[11px] text-muted">
                  {d.fuel.name} · {d.moderator.name} · {d.coolant}
                </span>
              }
            >
              <div className="p-3">
                <Schematic d={d} r={r} />
              </div>
            </Panel>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Critical mass" value={sci(r.critMass)} unit={`kg ${d.fuel.name}`} tone="accent" />
              <Stat label="Thermal power" value={sci(r.powerth)} unit="MWth" tone="hot" />
              <Stat label="Electrical power" value={sci(r.turbinePower)} unit="MWe" />
              <Stat label="Cycle efficiency" value={fixed(r.effic)} unit="%" />
              <Stat label="Mod./fuel ratio" value={sci(r.ratio)} unit="atoms" />
              <Stat label="Power density" value={sci(r.powerdensity)} unit="MW/m³" />
              <Stat label="Max fuel temp." value={sci(r.fuelTemp)} unit="K" tone="hot" />
              <Stat label="Neutron flux" value={sci(r.nFlux)} unit="n/s·cm²" />
            </div>

            {cases.length > 0 && <Cases cases={cases} setCases={setCases} onLoad={setD} />}
          </div>

          {/* ----------------------------------------------- Output phase */}
          <div className="min-w-0 xl:sticky xl:top-[62px] xl:self-start">
            <ResultsPanel d={d} r={r} />
          </div>
        </div>

        <footer className="mt-8 border-t border-line pt-4 text-[11.5px] leading-relaxed text-muted">
          A preliminary conceptual design tool using Fermi age, thermal group, and homogeneous reactor
          approximations. Results are rough estimates for teaching parametric trade-offs — not for engineering
          use.{" "}
          <button type="button" onClick={() => setDialog("about")} className="text-accent underline underline-offset-2">
            About this reconstruction
          </button>
        </footer>
      </main>

      {/* ---------------------------------------------------------- Dialogs */}
      <CustomFuelDialog
        key={`f${dialog === "fuel"}`}
        open={dialog === "fuel"}
        onClose={() => setDialog(null)}
        initial={d.fuel}
        onApply={(fuel: Fuel) => set({ fuel })}
      />
      <CustomModDialog
        key={`m${dialog === "mod"}`}
        open={dialog === "mod"}
        onClose={() => setDialog(null)}
        initial={d.moderator}
        onApply={(moderator: Moderator) => set({ moderator })}
      />
      <TutorialDialog open={dialog === "tutorial"} onClose={() => setDialog(null)} />
      <TablesDialog open={dialog === "tables"} onClose={() => setDialog(null)} />
      <AboutDialog open={dialog === "about"} onClose={() => setDialog(null)} />
    </div>
  );
}

/* ------------------------------------------------------------------ Parts */

function Stat({
  label, value, unit, tone = "default",
}: { label: string; value: string; unit: string; tone?: "default" | "accent" | "hot" }) {
  const c = tone === "accent" ? "text-accent" : tone === "hot" ? "text-hot" : "text-ink";
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2.5">
      <div className="label">{label}</div>
      <div className={`num mt-1 text-[15px] font-semibold leading-none tabular-nums ${c}`}>{value}</div>
      <div className="num mt-1 truncate text-[10.5px] text-muted">{unit}</div>
    </div>
  );
}

function Cases({
  cases, setCases, onLoad,
}: { cases: Case[]; setCases: (c: Case[]) => void; onLoad: (d: Design) => void }) {
  return (
    <Panel
      title={`Saved cases · ${cases.length}`}
      aside={<Button variant="ghost" onClick={() => setCases([])} className="!px-1.5 !py-0.5 !text-[11px]">Clear all</Button>}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="label px-4 py-1.5">Design</th>
              <th className="label px-2 py-1.5 text-right">Crit. mass kg</th>
              <th className="label px-2 py-1.5 text-right">MWth</th>
              <th className="label px-2 py-1.5 text-right">MWe</th>
              <th className="label px-2 py-1.5 text-right">Nm/Nf</th>
              <th className="label px-4 py-1.5 text-right"></th>
            </tr>
          </thead>
          <tbody className="num">
            {cases.map((c) => {
              const cr = solve(c);
              return (
                <tr key={c.id} className="border-b border-line/70 last:border-b-0">
                  <td className="px-4 py-1.5 text-ink">{c.label}</td>
                  <td className={`px-2 py-1.5 text-right tabular-nums ${cr.critical ? "text-ink" : "text-danger"}`}>
                    {cr.critical ? sci(cr.critMass) : "subcritical"}
                  </td>
                  <td className="px-2 py-1.5 text-right tabular-nums">{cr.powerth.toFixed(0)}</td>
                  <td className="px-2 py-1.5 text-right tabular-nums">{cr.turbinePower.toFixed(0)}</td>
                  <td className="px-2 py-1.5 text-right tabular-nums">{sci(cr.ratio)}</td>
                  <td className="whitespace-nowrap px-4 py-1.5 text-right">
                    <button
                      type="button"
                      onClick={() => onLoad(c)}
                      className="mr-3 text-accent underline underline-offset-2"
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      onClick={() => setCases(cases.filter((x) => x.id !== c.id))}
                      className="text-muted hover:text-danger"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function Atom() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="3.2" fill="var(--accent)" />
      <ellipse cx="16" cy="16" rx="13.5" ry="5.6" fill="none" stroke="var(--accent)" strokeWidth="1.4" opacity="0.85" />
      <ellipse cx="16" cy="16" rx="13.5" ry="5.6" fill="none" stroke="var(--accent)" strokeWidth="1.4"
        opacity="0.6" transform="rotate(60 16 16)" />
      <ellipse cx="16" cy="16" rx="13.5" ry="5.6" fill="none" stroke="var(--accent)" strokeWidth="1.4"
        opacity="0.6" transform="rotate(120 16 16)" />
    </svg>
  );
}
