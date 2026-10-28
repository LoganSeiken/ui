import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SidebarItem } from "./sidebar.js";
import { SubNavItem } from "./sub-nav.js";

const RouterLink = ({ href, ...props }: { href?: string }) => (
  <a data-router="true" href={href} {...props} />
);

describe("navigation items", () => {
  it("render a plain anchor by default", () => {
    render(
      <>
        <SidebarItem href="/a" icon={null}>
          One
        </SidebarItem>
        <SubNavItem href="/b">Two</SubNavItem>
      </>,
    );
    expect(screen.getByRole("link", { name: "One" })).not.toHaveAttribute("data-router");
    expect(screen.getByRole("link", { name: "Two" })).not.toHaveAttribute("data-router");
  });

  it("render through linkComponent for client-side navigation", () => {
    render(
      <>
        <SidebarItem href="/a" icon={null} linkComponent={RouterLink} active>
          One
        </SidebarItem>
        <SubNavItem href="/b" linkComponent={RouterLink}>
          Two
        </SubNavItem>
      </>,
    );
    expect(screen.getByRole("link", { name: "One" })).toHaveAttribute("data-router", "true");
    expect(screen.getByRole("link", { name: "One" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Two" })).toHaveAttribute("data-router", "true");
  });
});
