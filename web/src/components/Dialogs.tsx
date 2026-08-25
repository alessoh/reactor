"use client";

import { useState } from "react";
import { Modal, Button, NumberField } from "./ui";
import { FUELS, MODERATORS, type Fuel, type Moderator } from "@/lib/materials";
import { TUTORIAL, ASSUMPTIONS } from "@/lib/content";

/* ------------------------------------------------------ Custom fuel input */

export function CustomFuelDialog({
  open, onClose, initial, onApply,
}: { open: boolean; onClose: () => void; initial: Fuel; onApply: (f: Fuel) => void }) {
  const [f, setF] = useState<Fuel>(initial);
  const set = (p: Partial<Fuel>) => setF((x) => ({ ...x, ...p }));

  return (
    <Modal open={open} onClose={onClose} title="Design Your Own Fuel"
      subtitle="Reference values for the built-in isotopes are in Appendix A, Table I.">
      <div className="space-y-3 px-5 py-4">
        <label className="block">
          <span className="text-[12px] font-medium text-ink2">Fuel name</span>
          <input
            value={f.name}
            onChange={(e) => set({ name: e.target.value })}
            maxLength={12}
            className="num mt-1 w-full rounded-md border border-line bg-surface px-2 py-1 text-[13px]"
          />
        </label>
        <NumberField label="Thermal fission cross section" unit="barns" value={f.crossfiss}
          onChange={(v) => set({ crossfiss: v })} min={1} max={20000} />
        <NumberField label="Thermal absorption cross section" unit="barns" value={f.fcrossabs}
          onChange={(v) => set({ fcrossabs: v })} min={1} max={20000} />
        <NumberField label="Thermal conductivity" unit="BTU/hr·ft·F" value={f.thermalconduct}
          onChange={(v) => set({ thermalconduct: v })} min={0.5} max={200} step={0.5} />
        <NumberField label="Density" unit="g/cc" value={f.densityf}
          onChange={(v) => set({ densityf: v })} min={1} max={30} step={0.1} />
        <NumberField label="Atomic mass number" value={f.Af} onChange={(v) => set({ Af: v })} min={200} max={260} />
      </div>
      <footer className="flex items-center justify-between gap-2 border-t border-line bg-sunken/50 px-5 py-3">
        <Button variant="ghost" onClick={() => setF(FUELS["U-235"])}>Reset to U-235</Button>
        <div className="flex gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => { onApply(f); onClose(); }}>Use this fuel</Button>
        </div>
      </footer>
    </Modal>
  );
}

/* ------------------------------------------------- Custom moderator input */

export function CustomModDialog({
  open, onClose, initial, onApply,
}: { open: boolean; onClose: () => void; initial: Moderator; onApply: (m: Moderator) => void }) {
  const [m, setM] = useState<Moderator>(initial);
  const set = (p: Partial<Moderator>) => setM((x) => ({ ...x, ...p }));

  return (
    <Modal open={open} onClose={onClose} title="Design Your Own Moderator"
      subtitle="Reference values for the built-in moderators are in Appendix A, Table II.">
      <div className="space-y-3 px-5 py-4">
        <label className="block">
          <span className="text-[12px] font-medium text-ink2">Moderator name</span>
          <input
            value={m.name}
            onChange={(e) => set({ name: e.target.value })}
            maxLength={12}
            className="num mt-1 w-full rounded-md border border-line bg-surface px-2 py-1 text-[13px]"
          />
        </label>
        <NumberField label="Diffusion length squared" unit="cm²" value={m.diffus}
          onChange={(v) => set({ diffus: v })} min={0.1} max={50000} step={0.1} />
        <NumberField label="Fermi age" unit="cm²" value={m.fermi}
          onChange={(v) => set({ fermi: v })} min={1} max={2000} step={0.01} />
        <NumberField label="Thermal absorption cross section" unit="barns" value={m.mcrossabs}
          onChange={(v) => set({ mcrossabs: v })} min={0.0001} max={10} step={0.001} />
        <NumberField label="Density" unit="g/cc" value={m.densitym}
          onChange={(v) => set({ densitym: v })} min={0.01} max={20} step={0.01} />
        <NumberField label="Mass number" value={m.Am} onChange={(v) => set({ Am: v })} min={1} max={250} />
      </div>
      <footer className="flex items-center justify-between gap-2 border-t border-line bg-sunken/50 px-5 py-3">
        <Button variant="ghost" onClick={() => setM(MODERATORS["H2O"])}>Reset to H2O</Button>
        <div className="flex gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => { onApply(m); onClose(); }}>Use this moderator</Button>
        </div>
      </footer>
    </Modal>
  );
}

/* --------------------------------------------------------------- Tutorial */

export function TutorialDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [active, setActive] = useState(TUTORIAL[0].id);
  const sec = TUTORIAL.find((s) => s.id === active)!;

  return (
    <Modal open={open} onClose={onClose} wide title="The World of Reactor Design"
      subtitle="A tutorial, from the 1993 user's manual">
      <div className="grid max-h-[70vh] grid-cols-1 sm:grid-cols-[190px_1fr]">
        <nav className="thin-scroll overflow-y-auto border-b border-line bg-sunken/50 p-2 sm:border-b-0 sm:border-r">
          {TUTORIAL.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              className={`block w-full rounded-md px-2.5 py-1.5 text-left text-[12px] leading-snug transition-colors ${
                s.id === active ? "bg-accentsoft font-semibold text-accent" : "text-ink2 hover:bg-surface"
              }`}
            >
              {s.title}
            </button>
          ))}
        </nav>
        <div className="thin-scroll overflow-y-auto px-5 py-4">
          <h3 className="text-[15px] font-semibold tracking-tight text-ink">{sec.title}</h3>
          <div className="mt-3 space-y-3">
            {sec.body.map((p, i) => (
              <p key={i} className="text-[13px] leading-relaxed text-ink2">{p}</p>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ---------------------------------------------------- Appendix A / B data */

export function TablesDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} wide title="Appendix A — Data Tables"
      subtitle="The material data used by this program">
      <div className="thin-scroll max-h-[70vh] overflow-y-auto px-5 py-4">
        <h3 className="label mb-2">I. Reactor fuels</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-line-strong text-left">
                <TH>Isotope</TH><TH r>Density g/cc</TH><TH r>Mass no.</TH>
                <TH r>σ fission, b</TH><TH r>σ absorption, b</TH>
              </tr>
            </thead>
            <tbody className="num">
              {Object.values(FUELS).map((f) => (
                <tr key={f.name} className="border-b border-line/70 last:border-b-0">
                  <td className="py-1.5 pr-2 font-medium text-ink">{f.name}</td>
                  <TD>{f.densityf.toFixed(1)}</TD><TD>{f.Af}</TD>
                  <TD>{f.crossfiss}</TD><TD>{f.fcrossabs}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="label mb-2 mt-6">II. Reactor moderators</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-line-strong text-left">
                <TH>Material</TH><TH r>Diffusion L², cm²</TH><TH r>Fermi age, cm²</TH>
                <TH r>Density g/cc</TH><TH r>σ absorption, b</TH>
              </tr>
            </thead>
            <tbody className="num">
              {Object.values(MODERATORS).map((m) => (
                <tr key={m.name} className="border-b border-line/70 last:border-b-0">
                  <td className="py-1.5 pr-2 font-medium text-ink">{m.name}</td>
                  <TD>{m.diffus}</TD><TD>{m.fermi}</TD>
                  <TD>{m.densitym}</TD><TD>{m.mcrossabs}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="label mb-2 mt-6">Appendix B — Assumptions and limitations</h3>
        <ol className="space-y-1.5">
          {ASSUMPTIONS.map((a, i) => (
            <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-ink2">
              <span className="num shrink-0 text-muted">{i + 1}.</span>
              {a}
            </li>
          ))}
        </ol>
      </div>
    </Modal>
  );
}

function TH({ children, r }: { children?: React.ReactNode; r?: boolean }) {
  return <th className={`label pb-1.5 font-semibold ${r ? "pl-2 text-right" : "pr-2"}`}>{children}</th>;
}
function TD({ children }: { children: React.ReactNode }) {
  return <td className="py-1.5 pl-2 text-right tabular-nums text-ink2">{children}</td>;
}

/* ------------------------------------------------------------------ About */

export function AboutDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="About this program"
      subtitle="Design Your Own Nuclear Reactor">
      <div className="space-y-3 px-5 py-4 text-[12.5px] leading-relaxed text-ink2">
        <p>
          Originally written by <strong className="text-ink">H. Peter Alesso</strong> in 1993 for Windows 3.1,
          in Microsoft Visual Basic 3. This is a faithful reconstruction for the browser, ported from the
          original <span className="num">MODULE1.BAS</span> and <span className="num">RXMAIN.FRM</span> sources.
        </p>
        <p>
          Every material table, cross section, and correlation is carried over unchanged. Four leftover debug
          stubs in the original <span className="num">Calculation_Phase</span> — which pinned primary pressure,
          pump power, and turbine output to constants, and which let the helium Mach test clobber the velocity
          of every coolant — have been corrected so the values respond to your design. Each correction is marked{" "}
          <span className="num">FIDELITY</span> in the source.
        </p>
        <p className="rounded-md bg-sunken px-3 py-2">
          The program performs a <em>preliminary conceptual</em> design using Fermi age, thermal group, and
          homogeneous reactor approximations. Results are rough estimates intended for teaching parametric
          trade-offs — not for engineering use.
        </p>
      </div>
      <footer className="flex justify-end border-t border-line bg-sunken/50 px-5 py-3">
        <Button variant="primary" onClick={onClose}>Close</Button>
      </footer>
    </Modal>
  );
}
