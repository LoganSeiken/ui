import type { ComponentProps } from "react";
import { cn } from "../../utils/cn.js";

export type MiniBarDatum = { success: number; danger?: number };

export type MiniBarChartProps = Omit<ComponentProps<"svg">, "children"> & {
  data: MiniBarDatum[];
  label: string;
  height?: number;
};

const BAR = 6;
const GAP = 3;

export function MiniBarChart({ data, label, height = 56, className, ...props }: MiniBarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.success + (d.danger ?? 0)));
  const width = data.length * (BAR + GAP) - GAP;
  return (
    <svg
      {...props}
      role="img"
      aria-label={label}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("h-14 w-full", className)}
    >
      {data.map((d, i) => {
        const danger = ((d.danger ?? 0) / max) * height;
        const success = (d.success / max) * height;
        const x = i * (BAR + GAP);
        return (
          <g key={i}>
            <rect
              x={x}
              y={height - danger}
              width={BAR}
              height={danger}
              className="fill-chart-danger"
            />
            <rect
              x={x}
              y={height - danger - success}
              width={BAR}
              height={success}
              className="fill-chart-success"
            />
          </g>
        );
      })}
      <line
        x1="0"
        x2={width}
        y1={height - 0.5}
        y2={height - 0.5}
        className="stroke-border"
        strokeWidth="1"
      />
    </svg>
  );
}
