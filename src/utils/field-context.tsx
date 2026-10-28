"use client";

import { createContext, useContext, type ReactNode } from "react";

type FieldControl = { htmlFor: string; describedBy: string };

const FieldControlContext = createContext<FieldControl | null>(null);

export function FieldControlProvider({
  value,
  children,
}: {
  value: FieldControl | null;
  children: ReactNode;
}) {
  return <FieldControlContext.Provider value={value}>{children}</FieldControlContext.Provider>;
}

// Controls whose id matches the surrounding Field's htmlFor inherit its description and error ids.
export function useFieldDescribedBy(
  id: string | undefined,
  own: string | undefined,
): string | undefined {
  const field = useContext(FieldControlContext);
  const inherited = field && id && id === field.htmlFor ? field.describedBy : undefined;
  return [own, inherited].filter(Boolean).join(" ") || undefined;
}
