"use client";

import type { Design } from "@/lib/reactor";
import { type Results, SEC_STATE, sci } from "@/lib/reactor";
import { COOL_LABELS } from "@/lib/materials";

const HOT = "var(--hot)";
const COLD = "var(--cold)";
const INK = "var(--ink)";
const LINE = "var(--line-strong)";

function Tag({ x, y, title, value, anchor = "middle" }: {
  x: number; y: number; title: string; value: string; anchor?: "start" | "middle" | "end";
}) {
  return (
    <g>
      <text x={x} y={y} textAnchor={anchor}
        className="fill-[var(--muted)] text-[8px] font-semibold uppercase tracking-[0.07em]">
        {title}
      </text>
      <text x={x} y={y + 12} textAnchor={anchor} className="num fill-[var(--ink)] text-[10.5px] font-semibold">
        {value}
      </text>
    </g>
  );
}

function Pump({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={12} fill="var(--surface)" stroke={INK} strokeWidth={1.6} />
      <path d={`M${x - 5},${y - 6} l10,6 l-10,6 z`} fill={INK} />
    </g>
  );
}

function Turbine({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d="M0,0 L74,-18 L74,90 L0,72 Z" fill="var(--surface)" stroke={INK} strokeWidth={1.6} />
      {[15, 30, 45, 60].map((k) => (
        <line key={k} x1={k} y1={-k * 0.245} x2={k} y2={72 + k * 0.245} stroke={LINE} strokeWidth={1} />
      ))}
      <text x="37" y="40" textAnchor="middle" className="fill-[var(--ink)] text-[9.5px] font-semibold">
        Turbine
      </text>
    </g>
  );
}

function Generator({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={30} fill="var(--surface)" stroke={INK} strokeWidth={1.8} />
      <text x={x} y={y - 1} textAnchor="middle" className="fill-[var(--ink)] text-[13px] font-semibold">G</text>
      <text x={x} y={y + 12} textAnchor="middle"
        className="fill-[var(--muted)] text-[7.5px] uppercase tracking-[0.08em]">Gen</text>
    </g>
  );
}

/** The reactor core, drawn in the selected geometry. */
function Core({ geometry }: { geometry: Design["geometry"] }) {
  const fill = "var(--accent-soft)";
  const stroke = "var(--accent)";
  if (geometry === "spherical") {
    return (
      <g>
        <circle cx={0} cy={0} r={30} fill={fill} stroke={stroke} strokeWidth={1.6} />
        <ellipse cx={0} cy={0} rx={30} ry={10} fill="none" stroke={stroke} strokeWidth={0.7} opacity={0.5} />
      </g>
    );
  }
  if (geometry === "cylindrical") {
    return (
      <g>
        <path d="M-25,-24 h50 v48 h-50 z" fill={fill} stroke={stroke} strokeWidth={1.6} />
        <ellipse cx={0} cy={-24} rx={25} ry={8} fill={fill} stroke={stroke} strokeWidth={1.6} />
        <path d="M-25,24 a25,8 0 0 0 50,0" fill="none" stroke={stroke} strokeWidth={1.6} />
      </g>
    );
  }
  return (
    <g>
      <path d="M-24,-18 h42 v42 h-42 z" fill={fill} stroke={stroke} strokeWidth={1.6} />
      <path d="M-24,-18 l10,-10 h42 l-10,10 z" fill="var(--surface)" stroke={stroke} strokeWidth={1.2} />
      <path d="M18,-18 l10,-10 v42 l-10,10 z" fill={fill} stroke={stroke} strokeWidth={1.2} opacity={0.7} />
    </g>
  );
}

export default function Schematic({ d, r }: { d: Design; r: Results }) {
  const open = r.openLoop;
  const cool = COOL_LABELS[d.coolant];

  return (
    <svg viewBox="0 0 780 420" className="h-auto w-full" role="img"
      aria-label={`Plant schematic: ${open ? "open" : "closed"} loop power conversion system`}>
      <defs>
        <marker id="arrHot" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={HOT} />
        </marker>
        <marker id="arrCold" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={COLD} />
        </marker>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 H0 V20" fill="none" stroke="var(--line)" strokeWidth="0.5" opacity="0.5" />
        </pattern>
      </defs>

      <rect x="0" y="0" width="780" height="420" fill="url(#grid)" />

      {/* ============================================ Containment + vessel */}
      <rect x="18" y="40" width="268" height="336" rx="10" fill="var(--surface)" stroke={LINE}
        strokeWidth="1.2" strokeDasharray="5 4" />
      <text x="152" y="58" textAnchor="middle"
        className="fill-[var(--muted)] text-[8px] font-semibold uppercase tracking-[0.09em]">
        Containment
      </text>

      {/* pressure vessel: cylindrical shell with a domed head */}
      <path d="M76,120 a47,26 0 0 1 94,0 V236 a47,22 0 0 1 -94,0 Z" fill="var(--surface)" stroke={INK} strokeWidth="1.8" />
      <path d="M76,120 a47,26 0 0 0 94,0" fill="none" stroke={LINE} strokeWidth="1" />
      <g transform="translate(123,180)">
        <Core geometry={d.geometry} />
      </g>
      {[107, 123, 139].map((x) => (
        <line key={x} x1={x} y1={82} x2={x} y2={122} stroke={INK} strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
      ))}
      <text x="123" y="286" textAnchor="middle" className="fill-[var(--ink)] text-[9.5px] font-semibold">
        Reactor Core
      </text>
      <text x="123" y="300" textAnchor="middle" className="num fill-[var(--muted)] text-[9px]">
        {sci(r.powerth)} MWth
      </text>
      <text x="123" y="313" textAnchor="middle" className="num fill-[var(--muted)] text-[9px]">
        {sci(r.critMass)} kg {d.fuel.name}
      </text>

      {open ? (
        /* ==================== OPEN LOOP — gas drives the turbine directly */
        <>
          <path d="M170,134 H414" fill="none" stroke={HOT} strokeWidth="3.4" strokeLinecap="round"
            markerEnd="url(#arrHot)" className="flow" />
          <Tag x={292} y={106} title={`${cool} outlet`} value={`${d.maxtemp} K`} />

          <Turbine x={420} y={98} />
          <line x1="494" y1="134" x2="518" y2="134" stroke={INK} strokeWidth="4" />
          <Generator x={548} y={134} />
          <path d="M578,134 H646" fill="none" stroke={INK} strokeWidth="2" />
          <path d="M646,124 v20 M654,124 v20" stroke={INK} strokeWidth="2" />
          <Tag x={664} y={120} title="Net electrical" value={`${sci(r.turbinePower)} MWe`} anchor="start" />
          <Tag x={664} y={158} title="Cycle efficiency" value={`${r.effic.toFixed(1)} %`} anchor="start" />

          {/* exhaust */}
          <path d="M457,188 V236 H556" fill="none" stroke={HOT} strokeWidth="2.6" strokeLinecap="round"
            markerEnd="url(#arrHot)" className="flow" opacity="0.7" />
          <text x="566" y="240" className="fill-[var(--muted)] text-[9px]">Exhaust to atmosphere</text>

          {/* supply tank back to the core */}
          <rect x="520" y="300" width="100" height="66" rx="8" fill="var(--surface)" stroke={INK} strokeWidth="1.6" />
          <text x="570" y="330" textAnchor="middle" className="fill-[var(--ink)] text-[9.5px] font-semibold">{cool}</text>
          <text x="570" y="345" textAnchor="middle" className="fill-[var(--muted)] text-[8.5px]">supply</text>
          <path d="M520,333 H236 V320 H123 V246" fill="none" stroke={COLD} strokeWidth="3" strokeLinecap="round"
            markerEnd="url(#arrCold)" className="flow" />
          <Tag x={370} y={352} title="Flowrate" value={`${sci(d.flowrate)} kg/s`} />

          <text x="596" y="264" className="fill-[var(--muted)] text-[9px] italic">
            Open loop — no steam generator
          </text>
        </>
      ) : (
        /* ============ CLOSED LOOP — steam generator, turbine, condenser */
        <>
          {/* --- primary loop --- */}
          <path d="M170,134 H296" fill="none" stroke={HOT} strokeWidth="3.4" strokeLinecap="round"
            markerEnd="url(#arrHot)" className="flow" />
          <Tag x={233} y={104} title="Hot leg" value={`${d.maxtemp} K`} />

          <rect x="302" y="100" width="72" height="182" rx="34" fill="var(--surface)" stroke={INK} strokeWidth="1.8" />
          <path d="M314,176 h48 M314,194 h48 M314,212 h48" stroke={LINE} strokeWidth="1.2" />
          <Tag x={386} y={188} title="Steam generator" value={`${SEC_STATE[4].P.toFixed(1)} atm`} anchor="start" />

          <path d="M302,250 H236 V320 H123 V248" fill="none" stroke={COLD} strokeWidth="3.2" strokeLinecap="round"
            markerEnd="url(#arrCold)" className="flow" />
          <Tag x={269} y={224} title="Cold leg" value={`${d.mintemp} K`} />
          <Pump x={178} y={320} />
          <Tag x={178} y={342} title="Primary pump" value={`${sci(r.pumpPower)} MWe`} />

          {/* --- secondary loop --- */}
          <path d="M338,100 V60 H414" fill="none" stroke={HOT} strokeWidth="3.2" strokeLinecap="round"
            markerEnd="url(#arrHot)" className="flow" />
          <Tag x={378} y={32} title="Steam ④" value={`${SEC_STATE[4].T} K`} />

          <Turbine x={420} y={24} />
          <line x1="494" y1="60" x2="518" y2="60" stroke={INK} strokeWidth="4" />
          <Generator x={548} y={60} />
          <path d="M578,60 H646" fill="none" stroke={INK} strokeWidth="2" />
          <path d="M646,50 v20 M654,50 v20" stroke={INK} strokeWidth="2" />
          <Tag x={664} y={44} title="Net electrical" value={`${sci(r.turbinePower)} MWe`} anchor="start" />
          <Tag x={664} y={82} title="Cycle efficiency" value={`${r.effic.toFixed(1)} %`} anchor="start" />

          <path d="M457,114 V152 H516" fill="none" stroke={HOT} strokeWidth="2.6" strokeLinecap="round"
            markerEnd="url(#arrHot)" className="flow" opacity="0.7" />
          <Tag x={468} y={126} title="Exhaust ⑤" value={`${SEC_STATE[5].T} K`} anchor="start" />

          {/* condenser */}
          <rect x="520" y="130" width="140" height="60" rx="8" fill="var(--surface)" stroke={INK} strokeWidth="1.7" />
          {[146, 162, 178].map((y) => (
            <path key={y} d={`M532,${y} q11,-8 22,0 t22,0 t22,0 t22,0 t22,0`} fill="none" stroke={COLD} strokeWidth="1.3" />
          ))}
          <text x="598" y="210" textAnchor="middle" className="fill-[var(--ink)] text-[9.5px] font-semibold">
            Condenser
          </text>
          <text x="598" y="224" textAnchor="middle" className="num fill-[var(--muted)] text-[9px]">
            {SEC_STATE[6].T} K · {SEC_STATE[6].P.toFixed(3)} atm
          </text>

          {/* feedwater return */}
          <path d="M532,190 V346 H338 V288" fill="none" stroke={COLD} strokeWidth="3" strokeLinecap="round"
            markerEnd="url(#arrCold)" className="flow" />
          <Pump x={470} y={346} />
          <Tag x={470} y={368} title="Condensate pump" value={`${sci(r.condPumpPower)} MWe`} />
          <Tag x={350} y={310} title="Feedwater ⑦" value={`${sci(r.secFlowrate)} kg/s`} anchor="start" />
        </>
      )}

      {/* -------------------------------------------------------- Loop badge */}
      <g transform="translate(664,300)">
        <rect x="0" y="0" width="104" height="44" rx="7" fill="var(--surface)" stroke={LINE} strokeWidth="1" />
        <text x="12" y="17" className="fill-[var(--muted)] text-[8px] font-semibold uppercase tracking-[0.08em]">
          Conversion
        </text>
        <text x="12" y="33" className="fill-[var(--ink)] text-[11px] font-semibold">
          {open ? "Open loop" : "Closed loop"}
        </text>
      </g>
    </svg>
  );
}
