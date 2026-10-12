"use client";

import { useState } from "react";
import { Button } from "./button.js";

export function DemoCounter() {
  const [count, setCount] = useState(0);

  return (
    <Button variant="secondary" onClick={() => setCount((current) => current + 1)}>
      Clics: {count}
    </Button>
  );
}
