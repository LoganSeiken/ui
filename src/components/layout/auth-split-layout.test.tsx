import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthSplitLayout } from "./auth-split-layout.js";

describe("AuthSplitLayout", () => {
  it("renders the brand and authentication content in the main landmark", () => {
    render(
      <AuthSplitLayout brand={<p>Brand panel</p>}>
        <p>Authentication form</p>
      </AuthSplitLayout>,
    );

    const main = screen.getByRole("main");
    expect(main).toHaveTextContent("Brand panel");
    expect(main).toHaveTextContent("Authentication form");
  });

  it("renders an optional corner control", () => {
    render(
      <AuthSplitLayout brand={<p>Brand panel</p>} corner={<button type="button">Language</button>}>
        <p>Authentication form</p>
      </AuthSplitLayout>,
    );

    expect(screen.getByRole("button", { name: "Language" })).toBeInTheDocument();
  });
});
