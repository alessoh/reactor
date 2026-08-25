"use client";

import { Panel, ChipGroup, NumberField, Button, type ChipOption } from "./ui";
import {
  FUELS, MODERATORS, MOD_LABELS, COOL_LABELS,
  type FuelKey, type ModKey, type CoolKey, type GeoKey,
} from "@/lib/materials";
import type { Design } from "@/lib/reactor";

const FUEL_OPTS: ChipOption<FuelKey>[] = (
  ["U-233", "U-235", "Pu-239", "Pu-241", "Am-242", "Cm-245"] as const
).map((k) => ({ value: k, label: k, sub: `σf ${FUELS[k].crossfiss} b` }));

const MOD_OPTS: ChipOption<ModKey>[] = (["H2O", "D2O", "Be", "C-12", "C-13"] as const).map((k) => ({
  value: k,
  label: k,
  sub: MOD_LABELS[k],
}));

const COOL_OPTS: ChipOption<CoolKey>[] = (["H2O", "H2", "He", "Sodium"] as const).map((k) => ({
  value: k,
  label: k === "Sodium" ? "Na" : k,
  sub: k === "H2" ? "open loop" : COOL_LABELS[k],
}));

const GEO_OPTS: ChipOption<GeoKey>[] = [
  { value: "rectangular", label: "Rect.", sub: "parallelepiped" },
  { value: "cylindrical", label: "Cyl.", sub: "radius + height" },
  { value: "spherical", label: "Sphere", sub: "min. critical mass" },
];

function Group({ label, children, action }: { label: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="border-b border-line px-4 py-3.5 last:border-b-0">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="label">{label}</span>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function DesignPanel({
  d, set, fuelKey, modKey, onCustomFuel, onCustomMod,
}: {
  d: Design;
  set: (patch: Partial<Design>) => void;
  fuelKey: FuelKey;
  modKey: ModKey;
  onCustomFuel: () => void;
  onCustomMod: () => void;
}) {
  return (
    <Panel title="Design Phase" className="overflow-hidden">
      <Group
        label="Fuel"
        action={
          <Button variant="ghost" onClick={onCustomFuel} className="!px-1.5 !py-0.5 !text-[11px]">
            Define your own
          </Button>
        }
      >
        <ChipGroup
          options={FUEL_OPTS}
          value={fuelKey === "custom" ? ("" as FuelKey) : fuelKey}
          onChange={(k) => set({ fuel: FUELS[k as Exclude<FuelKey, "custom">] })}
        />
        {fuelKey === "custom" && (
          <p className="mt-2 rounded-md bg-accentsoft px-2 py-1.5 text-[11.5px] text-accent">
            Custom fuel: <span className="num font-semibold">{d.fuel.name}</span>
          </p>
        )}
      </Group>

      <Group
        label="Moderator"
        action={
          <Button variant="ghost" onClick={onCustomMod} className="!px-1.5 !py-0.5 !text-[11px]">
            Define your own
          </Button>
        }
      >
        <ChipGroup
          options={MOD_OPTS}
          value={modKey === "custom" ? ("" as ModKey) : modKey}
          onChange={(k) => set({ moderator: MODERATORS[k as Exclude<ModKey, "custom">] })}
        />
        {modKey === "custom" && (
          <p className="mt-2 rounded-md bg-accentsoft px-2 py-1.5 text-[11.5px] text-accent">
            Custom moderator: <span className="num font-semibold">{d.moderator.name}</span>
          </p>
        )}
      </Group>

      <Group label="Coolant">
        <ChipGroup options={COOL_OPTS} value={d.coolant} onChange={(coolant) => set({ coolant })} columns={4} />
        <p className="mt-2 text-[11px] leading-snug text-muted">
          {d.coolant === "H2"
            ? "Hydrogen drives the turbine directly — an open loop system with no steam generator."
            : `${COOL_LABELS[d.coolant]} primary, water secondary — a closed loop system.`}
        </p>
      </Group>

      <Group label="Geometry">
        <ChipGroup options={GEO_OPTS} value={d.geometry} onChange={(geometry) => set({ geometry })} />
        <div className="mt-3 space-y-2.5">
          {d.geometry === "rectangular" && (
            <>
              <NumberField label="Length x" unit="cm" value={d.lx} onChange={(lx) => set({ lx })} min={10} max={1000} slider />
              <NumberField label="Length y" unit="cm" value={d.ly} onChange={(ly) => set({ ly })} min={10} max={1000} slider />
              <NumberField label="Length z" unit="cm" value={d.lz} onChange={(lz) => set({ lz })} min={10} max={1000} slider />
            </>
          )}
          {d.geometry === "cylindrical" && (
            <>
              <NumberField label="Radius" unit="cm" value={d.cr} onChange={(cr) => set({ cr })} min={5} max={500} slider />
              <NumberField label="Height" unit="cm" value={d.cheight} onChange={(cheight) => set({ cheight })} min={10} max={1000} slider
                hint="Minimum critical volume occurs at H = 1.847 R." />
            </>
          )}
          {d.geometry === "spherical" && (
            <NumberField label="Radius" unit="cm" value={d.r} onChange={(r) => set({ r })} min={5} max={500} slider
              hint="A sphere gives the smallest critical mass for a given composition." />
          )}
        </div>
      </Group>

      <Group label="Variables">
        <div className="space-y-2.5">
          <NumberField label="Max coolant temp." unit="K" value={d.maxtemp} onChange={(maxtemp) => set({ maxtemp })} min={300} max={1400} slider />
          <NumberField label="Min coolant temp." unit="K" value={d.mintemp} onChange={(mintemp) => set({ mintemp })} min={273} max={1300} slider />
          <NumberField label="Coolant tube dia." unit="cm" value={d.tubedia} onChange={(tubedia) => set({ tubedia })} min={0.1} max={5} step={0.1} slider />
          <NumberField label="Porosity" value={d.porosity} onChange={(porosity) => set({ porosity })} min={0.05} max={0.9} step={0.01} slider
            hint="Void fraction of the core occupied by coolant." />
          <NumberField label="Coolant flowrate" unit="kg/s" value={d.flowrate} onChange={(flowrate) => set({ flowrate })} min={100} max={40000} step={100} slider />
        </div>
      </Group>
    </Panel>
  );
}
