import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AccountMenuFormItem } from "./account-menu-form-item.js";
import { DropdownMenu, DropdownMenuContent } from "../ui/dropdown-menu.js";

describe("AccountMenuFormItem", () => {
  it("shows pending feedback and keeps the menu open while the action is running", async () => {
    const user = userEvent.setup();
    let resolveAction!: () => void;
    const action = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveAction = resolve;
        }),
    );
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuContent>
          <AccountMenuFormItem action={action} label="Sign out" pendingLabel="Signing out…" />
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const item = screen.getByRole("menuitem", { name: "Sign out" });
    await user.click(item);
    expect(action).toHaveBeenCalledOnce();
    expect(screen.getByRole("menuitem", { name: "Signing out…" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.getByRole("menuitem", { name: "Signing out…" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("menu")).toBeVisible();

    resolveAction();
    expect(await screen.findByRole("menuitem", { name: "Sign out" })).not.toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});
