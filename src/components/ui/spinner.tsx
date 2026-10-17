import type { SVGProps } from "react";
import { cn } from "../../utils/cn.js";

export type SpinnerProps = SVGProps<SVGSVGElement> & { label?: string };

export function Spinner({ className, label, ...props }: SpinnerProps) {
  const icon = <svg {...props} className={cn("size-4 animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
  </svg>;
  return label ? <span role="status">{icon}<span className="sr-only">{label}</span></span> : icon;
}
