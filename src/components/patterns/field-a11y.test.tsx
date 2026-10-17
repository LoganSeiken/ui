import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Combobox } from "../ui/combobox.js";
import { Input } from "../ui/input.js";
import { Field } from "./field.js";

describe("Field accessibility wiring", () => {
  it("associates the error message with the control through aria-describedby", () => {
    render(
      <Field label="Email" htmlFor="email" error="Enter a valid email">
        <Input id="email" aria-invalid />
      </Field>,
    );
    const input = screen.getByLabelText("Email");
    const error = screen.getByRole("alert");
    expect(error).toHaveAttribute("id", "email-error");
    expect(input.getAttribute("aria-describedby")).toContain("email-error");
  });

  it("links both description and error and preserves an existing aria-describedby", () => {
    render(
      <Field label="Domain" htmlFor="domain" description="Without https" error="Invalid domain">
        <Input id="domain" aria-describedby="custom-hint" />
      </Field>,
    );
    const described = screen.getByLabelText("Domain").getAttribute("aria-describedby") ?? "";
    expect(described.split(" ")).toEqual(expect.arrayContaining(["custom-hint", "domain-description", "domain-error"]));
  });

  it("adds no aria-describedby when there is neither description nor error", () => {
    render(
      <Field label="Name" htmlFor="name">
        <Input id="name" />
      </Field>,
    );
    expect(screen.getByLabelText("Name")).not.toHaveAttribute("aria-describedby");
  });
});

describe("Combobox feedback", () => {
  it("shows a localized loading label and a search error message", () => {
    const { rerender } = render(<Combobox options={[]} loading loadingLabel="Buscando..." defaultOpen aria-label="Company" />);
    expect(screen.getByRole("status")).toHaveTextContent("Buscando...");
    rerender(<Combobox options={[]} errorText="No se pudo buscar" defaultOpen aria-label="Company" />);
    expect(screen.getByRole("alert")).toHaveTextContent("No se pudo buscar");
  });

  it("forwards aria-describedby to the trigger", () => {
    render(<Combobox options={[]} aria-label="Company" aria-describedby="company-error" />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-describedby", "company-error");
  });
});
