"use client";

import { useEffect, useRef, useState } from "react";

export interface MenuItem {
  label: string;
  onSelect?: () => void;
  divider?: boolean;
  checked?: boolean;
}
export interface Menu {
  label: string;
  items: MenuItem[];
}

export default function MenuBar({ menus }: { menus: Menu[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="flex items-center gap-0.5">
      {menus.map((m) => (
        <div key={m.label} className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open === m.label}
            onClick={() => setOpen(open === m.label ? null : m.label)}
            onMouseEnter={() => open && setOpen(m.label)}
            className={`rounded-md px-2.5 py-1 text-[12.5px] font-medium transition-colors ${
              open === m.label ? "bg-accentsoft text-accent" : "text-ink2 hover:bg-sunken"
            }`}
          >
            {m.label}
          </button>
          {open === m.label && (
            <div
              role="menu"
              className="absolute left-0 top-full z-40 mt-1 min-w-[210px] rounded-lg border border-line bg-surface py-1 shadow-[0_10px_28px_rgba(27,26,23,0.15)]"
            >
              {m.items.map((it, i) =>
                it.divider ? (
                  <div key={i} className="my-1 border-t border-line" />
                ) : (
                  <button
                    key={i}
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      it.onSelect?.();
                      setOpen(null);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12.5px] text-ink2 hover:bg-accentsoft hover:text-accent"
                  >
                    <span className="num w-3 shrink-0 text-accent">{it.checked ? "✓" : ""}</span>
                    {it.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
