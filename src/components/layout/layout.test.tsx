import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  AppShell,
  AsidePanel,
  PageContainer,
  PageHeader,
  Sidebar,
  SidebarItem,
  SubNav,
  SubNavItem,
  SubNavSection,
  SubNavTitle,
  TopBar,
} from "../../index.js";

describe("AppShell", () => {
  it("renders the page content inside a single main landmark", () => {
    render(<AppShell topBar={<TopBar start="Brand" />}>Content</AppShell>);
    expect(screen.getByRole("main")).toHaveTextContent("Content");
    expect(screen.getByRole("banner")).toHaveTextContent("Brand");
  });

  it("can render the content area without a main landmark when embedded", () => {
    render(
      <AppShell topBar={<TopBar />} main={false}>
        Embedded
      </AppShell>,
    );
    expect(screen.queryByRole("main")).not.toBeInTheDocument();
    expect(screen.getByText("Embedded")).toBeInTheDocument();
  });

  it("places sidebar, sub navigation and aside around the content", () => {
    render(
      <AppShell
        topBar={<TopBar />}
        sidebar={
          <Sidebar aria-label="Primary">
            <SidebarItem href="#" icon={<i />}>
              Home
            </SidebarItem>
          </Sidebar>
        }
        subNav={
          <SubNav aria-label="Section">
            <SubNavTitle>Observability</SubNavTitle>
          </SubNav>
        }
        aside={
          <AsidePanel closeLabel="Close" title="Help">
            panel
          </AsidePanel>
        }
      >
        main
      </AppShell>,
    );
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Section" })).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });
});

describe("TopBar", () => {
  it("offers the 56px and 48px heights", () => {
    render(
      <>
        <TopBar data-testid="md" />
        <TopBar data-testid="sm" size="sm" />
      </>,
    );
    expect(screen.getByTestId("md")).toHaveClass("h-14");
    expect(screen.getByTestId("sm")).toHaveClass("h-12");
  });
});

describe("Sidebar", () => {
  it("marks the active item with aria-current and uses 32px items", () => {
    render(
      <Sidebar aria-label="Primary">
        <SidebarItem href="#a" icon={<i />} active>
          Observability
        </SidebarItem>
        <SidebarItem href="#b" icon={<i />}>
          Logs
        </SidebarItem>
      </Sidebar>,
    );
    expect(screen.getByRole("link", { name: "Observability" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Logs" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Logs" })).toHaveClass("h-8");
  });

  it("exposes its mode and keeps labels available to screen readers when collapsed", () => {
    render(
      <Sidebar aria-label="Primary" mode="collapsed">
        <SidebarItem href="#" icon={<i />}>
          Table Editor
        </SidebarItem>
      </Sidebar>,
    );
    expect(screen.getByRole("navigation", { name: "Primary" })).toHaveAttribute(
      "data-mode",
      "collapsed",
    );
    expect(screen.getByRole("link", { name: "Table Editor" })).toBeInTheDocument();
  });
});

describe("SubNav", () => {
  it("renders titled sections and the active item", () => {
    render(
      <SubNav aria-label="Section">
        <SubNavTitle>Observability</SubNavTitle>
        <SubNavSection title="General">
          <SubNavItem href="#" active>
            Overview
          </SubNavItem>
        </SubNavSection>
      </SubNav>,
    );
    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
  });
});

describe("PageHeader", () => {
  it("renders the page title as the level-one heading with actions", () => {
    render(
      <PageHeader
        title="Overview"
        badge={<span>BETA</span>}
        actions={<button type="button">Refresh</button>}
        description="Metrics"
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Overview" })).toBeInTheDocument();
    expect(screen.getByText("BETA")).toBeInTheDocument();
    expect(screen.getByText("Metrics")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Refresh" })).toBeInTheDocument();
  });

  it("supports the sm, md and lg title sizes", () => {
    render(
      <>
        <PageHeader title="s" size="sm" />
        <PageHeader title="m" />
        <PageHeader title="l" size="lg" />
      </>,
    );
    expect(screen.getByRole("heading", { name: "s" })).toHaveClass("text-base");
    expect(screen.getByRole("heading", { name: "m" })).toHaveClass("text-2xl");
    expect(screen.getByRole("heading", { name: "l" })).toHaveClass("text-3xl");
  });
});

describe("AsidePanel", () => {
  it("is a complementary region with a close button that fires onClose", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <AsidePanel closeLabel="Close panel" title="Help & Support" onClose={onClose}>
        content
      </AsidePanel>,
    );
    expect(screen.getByRole("complementary")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close panel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("omits the close button when no handler is given", () => {
    render(
      <AsidePanel closeLabel="Close" title="Help">
        content
      </AsidePanel>,
    );
    expect(screen.queryByRole("button", { name: "Close panel" })).not.toBeInTheDocument();
  });

  it("uses the supplied close label without passing it to the aside element", () => {
    render(
      <AsidePanel title="Ayuda" closeLabel="Cerrar panel" onClose={() => undefined}>
        contenido
      </AsidePanel>,
    );
    expect(screen.getByRole("button", { name: "Cerrar panel" })).toBeInTheDocument();
    expect(screen.getByRole("complementary")).not.toHaveAttribute("closeLabel");
  });
});

describe("PageContainer", () => {
  it("centers and constrains its content", () => {
    render(<PageContainer data-testid="c">x</PageContainer>);
    expect(screen.getByTestId("c")).toHaveClass("mx-auto", "max-w-6xl");
  });
});
