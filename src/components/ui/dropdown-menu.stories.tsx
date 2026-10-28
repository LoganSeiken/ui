import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemDescription,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu.js";

const meta = {
  title: "ui/DropdownMenu",
  component: DropdownMenu,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DropdownMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const UserMenu: Story = {
  render: () => (
    <div className="flex h-96 justify-center p-6">
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">User menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>user@example.com</DropdownMenuLabel>
          <DropdownMenuItem>Account</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup value="system">
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Timezone</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>UTC</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};
export const WithDescriptions: Story = {
  render: () => (
    <div className="flex h-72 justify-center p-6">
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild>
          <Button>Deploy a new function</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>
            <span>
              Via Editor
              <DropdownMenuItemDescription>
                Write and deploy in the browser
              </DropdownMenuItemDescription>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>
              Via CLI
              <DropdownMenuItemDescription>
                Write locally, deploy with the CLI
              </DropdownMenuItemDescription>
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};
