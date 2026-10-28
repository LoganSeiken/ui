"use client";

import { forwardRef, useMemo, useState, type ComponentProps } from "react";
import { cn } from "../../utils/cn.js";

export type SliderStep = { value: number; label: string };

export type SliderProps = Omit<
  ComponentProps<"input">,
  "type" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step"
> & {
  steps: SliderStep[];
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  name?: string;
};

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { steps, value, defaultValue, onValueChange, name, className, ...props },
  ref,
) {
  const ordered = useMemo(
    () => [...steps].sort((left, right) => left.value - right.value),
    [steps],
  );
  const first = ordered[0]?.value ?? 0;
  const last = ordered.at(-1)?.value ?? first;
  const initial = defaultValue ?? first;
  const [internalValue, setInternalValue] = useState(initial);
  const selected = value ?? internalValue;
  const current = ordered.reduce(
    (closest, option) =>
      Math.abs(option.value - selected) < Math.abs(closest.value - selected) ? option : closest,
    ordered[0] ?? { value: selected, label: String(selected) },
  );
  const gaps = ordered
    .slice(1)
    .map((option, index) => option.value - ordered[index]!.value)
    .filter((gap) => gap > 0);
  const step = Math.min(...gaps, 1);

  return (
    <div className="grid gap-2">
      <input
        {...props}
        ref={ref}
        type="range"
        min={first}
        max={last}
        step={step}
        value={selected}
        aria-valuetext={current.label}
        className={cn("h-2 w-full accent-primary", className)}
        onChange={(event) => {
          const raw = Number(event.currentTarget.value);
          const next = ordered.reduce(
            (closest, option) =>
              Math.abs(option.value - raw) < Math.abs(closest.value - raw) ? option : closest,
            ordered[0] ?? { value: raw, label: String(raw) },
          ).value;
          if (value === undefined) setInternalValue(next);
          onValueChange?.(next);
        }}
      />
      {name ? <input type="hidden" name={name} value={String(current.value)} /> : null}
    </div>
  );
});
