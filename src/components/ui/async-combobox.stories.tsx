import type { Meta, StoryObj } from "@storybook/react-vite";
import { AsyncCombobox } from "./async-combobox.js";

const countries = [{ value: "co", label: "Colombia" }, { value: "pe", label: "Peru" }, { value: "mx", label: "Mexico" }];
const meta = { title: "ui/AsyncCombobox", component: AsyncCombobox, parameters: { layout: "padded" }, decorators: [(Story) => <div className="min-h-80 max-w-md"><Story /></div>], args: { fetcher: async (query) => countries.filter((option) => option.label.toLowerCase().includes(query.toLowerCase())), placeholder: "Search countries", searchPlaceholder: "Search…", emptyText: "No countries found", loadingLabel: "Loading", allowCreate: true, createLabel: (query: string) => `Create ${query}` } } satisfies Meta<typeof AsyncCombobox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Open: Story = { args: { defaultOpen: true } };
export const WithSelection: Story = { args: { defaultValue: "co", selectedOption: countries[0] } };
