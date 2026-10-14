import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemDescription,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "../../index.js";

describe("Select", () => {
  function Sample({ onValueChange }: { onValueChange?: (v: string) => void }) {
    return (
      <Select defaultValue="all" onValueChange={onValueChange}>
        <SelectTrigger aria-label="Status"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  it("opens, lists options and reports the chosen value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Sample onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox", { name: "Status" });
    expect(trigger).toHaveTextContent("All");
    await user.click(trigger);
    await user.click(await screen.findByRole("option", { name: "Active" }));
    expect(onValueChange).toHaveBeenCalledWith("active");
    expect(trigger).toHaveTextContent("Active");
  });

  it("can be disabled and supports the compact height", () => {
    render(
      <Select disabled>
        <SelectTrigger aria-label="Locked" size="sm"><SelectValue placeholder="Pick" /></SelectTrigger>
        <SelectContent><SelectItem value="a">A</SelectItem></SelectContent>
      </Select>
    );
    const trigger = screen.getByRole("combobox", { name: "Locked" });
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveClass("h-8");
  });
});

describe("Tabs", () => {
  it("shows the panel of the selected tab and switches on click", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">All</TabsTrigger>
          <TabsTrigger value="b">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
        <TabsContent value="b">Panel B</TabsContent>
      </Tabs>
    );
    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Panel A")).toBeVisible();
    await user.click(screen.getByRole("tab", { name: "Security" }));
    expect(screen.getByText("Panel B")).toBeVisible();
    expect(screen.queryByText("Panel A")).not.toBeInTheDocument();
  });

  it("links every selected tab to an existing panel", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList variant="cards">
          <TabsTrigger value="a">Framework</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel</TabsContent>
      </Tabs>
    );
    const controls = screen.getByRole("tab", { name: "Framework" }).getAttribute("aria-controls");
    expect(controls && document.getElementById(controls)).toBeTruthy();
  });
});

describe("DropdownMenu", () => {
  it("opens from the trigger, lists items and closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button>Menu</Button></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>user@example.com</DropdownMenuLabel>
          <DropdownMenuItem>
            <span>Via CLI<DropdownMenuItemDescription>Deploy locally</DropdownMenuItemDescription></span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    await user.click(screen.getByRole("button", { name: "Menu" }));
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Via CLI/ })).toBeInTheDocument();
    expect(screen.getByText("Deploy locally")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("selects a radio item and exposes the checked state", async () => {
    const user = userEvent.setup();
    function Sample() {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button>Theme</Button></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="light">
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: "Theme" }));
    expect(await screen.findByRole("menuitemradio", { name: "Light" })).toBeChecked();
    expect(screen.getByRole("menuitemradio", { name: "Dark" })).not.toBeChecked();
  });

  it("renders a submenu trigger that announces its popup", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button>More</Button></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Timezone</DropdownMenuSubTrigger>
            <DropdownMenuSubContent><DropdownMenuItem>UTC</DropdownMenuItem></DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    await user.click(screen.getByRole("button", { name: "More" }));
    const sub = await screen.findByRole("menuitem", { name: "Timezone" });
    expect(sub).toHaveAttribute("aria-haspopup", "menu");
  });
});

describe("Popover", () => {
  it("opens on click and closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger asChild><Button>Org</Button></PopoverTrigger>
        <PopoverContent>Find organization</PopoverContent>
      </Popover>
    );
    await user.click(screen.getByRole("button", { name: "Org" }));
    expect(await screen.findByText("Find organization")).toBeVisible();
    await user.keyboard("{Escape}");
    expect(screen.queryByText("Find organization")).not.toBeInTheDocument();
  });
});

describe("Sheet", () => {
  function Sample() {
    return (
      <Sheet>
        <SheetTrigger asChild><Button>Connect</Button></SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Connect to your project</SheetTitle>
            <SheetDescription>Choose how</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  it("opens a dialog named by its title and closes with the close button", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: "Connect" }));
    const dialog = await screen.findByRole("dialog", { name: "Connect to your project" });
    expect(dialog).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: "Connect" }));
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("Tooltip", () => {
  it("shows its content on hover", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild><Button aria-label="Help">?</Button></TooltipTrigger>
          <TooltipContent>Helpful text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    await user.hover(screen.getByRole("button", { name: "Help" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Helpful text");
  });
});
