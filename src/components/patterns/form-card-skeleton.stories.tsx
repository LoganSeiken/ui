import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormCardSkeleton } from "./form-card-skeleton.js";

const meta = { title: "patterns/FormCardSkeleton", component: FormCardSkeleton, args: { label: "Loading form" } } satisfies Meta<typeof FormCardSkeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TwoSections: Story = { args: { sections: 2, fields: 6 } };
