"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ Panel */

export function Panel({
  title, aside, children, className = "",
}: { title?: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-lg border border-line bg-surface shadow-[0_1px_2px_rgba(27,26,23,0.04)] ${className}`}
    >
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
          <h2 className="label">{title}</h2>
          {aside}
        </header>
      )}
      {children}
    </section>
  );
}

/* ------------------------------------------------------------- Chip group */

export interface ChipOption<T extends string> {
  value: T;
  label: string;
  sub?: string;
}

export function ChipGroup<T extends string>({
  options, value, onChange, columns = 3,
}: { options: ChipOption<T>[]; value: T; onChange: (v: T) => void; columns?: number }) {
  return (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={on}
            aria-label={o.sub ? `${o.label} — ${o.sub}` : o.label}
            title={o.sub}
            className={`rounded-md border px-2 py-1.5 text-left transition-colors ${
              on
                ? "border-accentline bg-accentsoft text-accent"
                : "border-line bg-surface text-ink2 hover:border-line-strong hover:bg-sunken"
            }`}
          >
            <div className={`num text-[12.5px] leading-tight ${on ? "font-semibold" : "font-medium"}`}>
              {o.label}
            </div>
            {o.sub && <div className="mt-0.5 truncate text-[10.5px] text-muted">{o.sub}</div>}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------ Number field */

export function NumberField({
  label, unit, value, onChange, min, max, step = 1, slider = false, hint,
}: {
  label: string; unit?: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number; slider?: boolean; hint?: string;
}) {
  const [draft, setDraft] = useState(String(value));
  const focused = useRef(false);
  useEffect(() => {
    if (!focused.current) setDraft(String(value));
  }, [value]);

  const commit = (raw: string) => {
    const n = Number(raw);
    if (!Number.isFinite(n)) return setDraft(String(value));
    const c = Math.min(max, Math.max(min, n));
    onChange(c);
    setDraft(String(c));
  };

  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[12px] font-medium text-ink2">{label}</span>
        <span className="num text-[10.5px] text-muted">
          {min}–{max}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="number"
          value={draft}
          min={min}
          max={max}
          step={step}
          onFocus={() => (focused.current = true)}
          onChange={(e) => {
            setDraft(e.target.value);
            const n = Number(e.target.value);
            if (Number.isFinite(n) && n >= min && n <= max) onChange(n);
          }}
          onBlur={(e) => {
            focused.current = false;
            commit(e.target.value);
          }}
          className="num w-[92px] shrink-0 rounded-md border border-line bg-surface px-2 py-1 text-[13px] text-ink tabular-nums"
        />
        {unit && <span className="num shrink-0 text-[11px] text-muted">{unit}</span>}
        {slider && (
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label={label}
            className="min-w-0 flex-1"
          />
        )}
      </div>
      {hint && <p className="mt-1 text-[10.5px] leading-snug text-muted">{hint}</p>}
    </label>
  );
}

/* -------------------------------------------------------------- Data rows */

export function Row({
  name, value, tone = "default",
}: { name: string; value: string; tone?: "default" | "accent" | "hot" | "cold" }) {
  const toneClass =
    tone === "accent" ? "text-accent" : tone === "hot" ? "text-hot" : tone === "cold" ? "text-cold" : "text-ink";
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line/70 px-4 py-[7px] last:border-b-0">
      <span className="text-[12.5px] leading-snug text-ink2">{name}</span>
      <span className={`num shrink-0 text-[12.5px] font-medium tabular-nums ${toneClass}`}>{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ Modal */

export function Modal({
  open, onClose, title, subtitle, wide = false, children,
}: {
  open: boolean; onClose: () => void; title: string; subtitle?: string;
  wide?: boolean; children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/25 p-4 backdrop-blur-[1px] sm:p-8"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`my-auto w-full rounded-xl border border-line bg-surface shadow-[0_16px_48px_rgba(27,26,23,0.18)] ${
          wide ? "max-w-3xl" : "max-w-md"
        }`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-3.5">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[12px] text-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-0.5 rounded-md px-2 py-1 text-[18px] leading-none text-muted hover:bg-sunken hover:text-ink"
          >
            ×
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Button */

export function Button({
  children, onClick, variant = "default", type = "button", disabled, className = "",
}: {
  children: ReactNode; onClick?: () => void; variant?: "default" | "primary" | "ghost";
  type?: "button" | "submit"; disabled?: boolean; className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-colors disabled:opacity-45 disabled:pointer-events-none";
  const styles = {
    primary: "bg-accent text-white hover:bg-[#0c6159] shadow-[0_1px_2px_rgba(27,26,23,0.12)]",
    default: "border border-line bg-surface text-ink2 hover:bg-sunken hover:text-ink",
    ghost: "text-muted hover:bg-sunken hover:text-ink",
  }[variant];
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}
