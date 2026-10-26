import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CenteredPage, FormCardSkeleton, TextLink } from "../index.js";
import { CardContent } from "./patterns/card.js";
import { FormCard } from "./patterns/form-card.js";

describe("U6 centered page patterns", () => {
  it("keeps focused content in a max-width card and exposes the corner slot", () => {
    render(<CenteredPage corner={<span>Corner</span>}><CardContent>Content</CardContent></CenteredPage>);
    expect(screen.getByText("Content").closest(".max-w-md")).toBeTruthy();
    expect(screen.getByText("Corner")).toBeInTheDocument();
  });

  it("renders router-compatible text links", () => {
    function RouterLink({ href, children, ...props }: { href?: string; children?: React.ReactNode; className?: string }) {
      return <a href={href} {...props}>{children}</a>;
    }
    render(<TextLink linkComponent={RouterLink} href="/hub" variant="muted">Back to Hub</TextLink>);
    expect(screen.getByRole("link", { name: "Back to Hub" })).toHaveClass("text-sm", "underline");
  });

  it("uses the responsive two-column form skeleton", () => {
    render(<FormCardSkeleton label="Loading form" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("status").querySelector(".md\\:grid-cols-2")).toBeTruthy();
  });

  it("renders plain forms without their own card chrome", () => {
    render(<FormCard variant="plain"><span>Form</span></FormCard>);
    const form = screen.getByText("Form").closest("form");
    expect(form).toBeTruthy();
    expect(form).not.toHaveClass("border", "bg-surface", "rounded-md");
  });
});
