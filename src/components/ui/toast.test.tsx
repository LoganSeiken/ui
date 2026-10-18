import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { toast, Toaster } from "../../index.js";

describe("Toaster", () => {
  it("uses the supplied provider label for announcements", async () => {
    const user = userEvent.setup();
    render(<Toaster label="Notificación" closeLabel="Cerrar" />);

    toast({ title: "Registro guardado" });
    const announcement = await screen.findByRole("status");
    await waitFor(() => expect(announcement).toHaveTextContent("Notificación Registro guardado"));
    await user.click(screen.getByRole("button", { name: "Cerrar" }));
  });

  it("keeps the default provider label", async () => {
    const user = userEvent.setup();
    render(<Toaster />);

    toast({ title: "Saved" });
    const announcement = await screen.findByRole("status");
    await waitFor(() => expect(announcement).toHaveTextContent("Notification Saved"));
    await user.click(screen.getByRole("button", { name: "Close" }));
  });

  it("localizes the viewport label and retains the default hotkey substitution", () => {
    const { rerender } = render(<Toaster viewportLabel="Notificaciones ({hotkey})" />);
    expect(screen.getByRole("region", { name: "Notificaciones (F8)" })).toBeInTheDocument();

    rerender(<Toaster />);
    expect(screen.getByRole("region", { name: "Notifications (F8)" })).toBeInTheDocument();
  });
});
