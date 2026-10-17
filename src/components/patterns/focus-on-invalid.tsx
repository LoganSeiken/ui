"use client";

import { useEffect, useRef } from "react";

export function FocusOnInvalid({ when }: { when: unknown }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (when === undefined || when === null || when === false) return;
    ref.current?.closest("form")?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [when]);
  return <span hidden ref={ref} />;
}
