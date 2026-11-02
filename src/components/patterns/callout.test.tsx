import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Callout } from "./callout.js";

describe("Callout description contrast", () => {
  it.each(["success", "warning", "danger"] as const)(
    "%s inherits its tinted foreground instead of the muted text, which is below 4.5:1 on that tint",
    (variant) => {
      render(<Callout variant={variant} title="Title" description="Details" />);
      const description = screen.getByText("Details");
      expect(description).toHaveClass("text-inherit");
      expect(description).not.toHaveClass("text-muted-foreground");
    },
  );

  it("keeps the muted description on the neutral surface", () => {
    render(<Callout title="Title" description="Details" />);
    expect(screen.getByText("Details")).toHaveClass("text-muted-foreground");
  });
});
