import type { Meta, StoryObj } from "@storybook/react-vite";
import { Combobox } from "./combobox.js";

const options = [
  { value: "us", label: "United States", description: "North America" },
  { value: "pe", label: "Peru", description: "South America" },
  { value: "ca", label: "Canada" },
  { value: "co", label: "Colombia", description: "South America" },
  { value: "mx", label: "Mexico", description: "North America", disabled: true }
];
const many = Array.from({ length: 200 }, (_, i) => ({ value: `c${i}`, label: `Company ${String(i + 1).padStart(3, "0")}` }));

const meta = {
  title: "ui/Combobox",
  component: Combobox,
  parameters: { layout: "padded" },
  decorators: [(Story) => <div className="min-h-80 max-w-md"><Story /></div>],
  args: { options, placeholder: "Choose a country", searchPlaceholder: "Search countries", emptyText: "No countries found", loadingLabel: "Loading" }
} satisfies Meta<typeof Combobox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: "pe" } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "ca" } };
export const Invalid: Story = { args: { "aria-invalid": true } };
export const Open: Story = { args: { defaultOpen: true } };
export const OpenWithValue: Story = { args: { defaultOpen: true, defaultValue: "pe" } };
export const OpenClearable: Story = { args: { defaultOpen: true, defaultValue: "ca", clearLabel: "No country" } };
export const OpenEmpty: Story = { args: { defaultOpen: true, options: [], emptyText: "No countries found" } };
export const OpenLoading: Story = { args: { defaultOpen: true, options: [], loading: true } };
export const OpenManyOptions: Story = { args: { defaultOpen: true, options: many, placeholder: "Choose a company" } };
