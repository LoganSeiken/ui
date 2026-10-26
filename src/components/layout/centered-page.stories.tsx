import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../ui/button.js";
import { CardContent } from "../patterns/card.js";
import { CenteredPage } from "./centered-page.js";

const meta = { title: "layout/CenteredPage", component: CenteredPage, parameters: { layout: "fullscreen" } } satisfies Meta<typeof CenteredPage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: <CardContent>Focused content</CardContent> } };
export const WithCorner: Story = { args: { corner: <Button type="button" size="sm">Language</Button>, children: <CardContent>Focused content</CardContent> } };
