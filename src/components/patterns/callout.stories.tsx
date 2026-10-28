import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../ui/button.js";
import { Callout } from "./callout.js";

const meta = {
  title: "patterns/Callout",
  component: Callout,
  args: { title: "Give your agent everything it needs" },
} satisfies Meta<typeof Callout>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithAction: Story = {
  args: {
    action: (
      <Button variant="outline" size="sm">
        Copy prompt
      </Button>
    ),
  },
};
export const WithDescription: Story = {
  args: { description: "Changes are visible to customers after you publish." },
};
export const Success: Story = { args: { variant: "success", title: "Changes saved" } };
export const Warning: Story = { args: { variant: "warning", title: "Review required" } };
export const Danger: Story = { args: { variant: "danger", title: "Unable to save" } };
