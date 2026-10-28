import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../ui/button.js";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card.js";

const meta = { title: "patterns/Card", component: Card } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Composed: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>With header, content and footer.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm">Card content.</CardContent>
      <CardFooter>
        <Button size="sm">Action</Button>
      </CardFooter>
    </Card>
  ),
};
export const Dashed: Story = {
  render: () => (
    <Card variant="dashed" className="w-80">
      <CardContent className="text-sm text-muted-foreground">Dashed card.</CardContent>
    </Card>
  ),
};
