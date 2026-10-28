import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef } from "react";
import { Button } from "./button.js";
import { Toaster, toast } from "./toast.js";
const meta = {
  title: "ui/Toast",
  component: Toaster,
  args: { label: "Notifications", closeLabel: "Close", viewportLabel: "Notifications ({hotkey})" },
} satisfies Meta<typeof Toaster>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <>
      <Button onClick={() => toast({ title: "Changes saved" })}>Show default</Button>
      <Toaster label="Notifications" closeLabel="Close" viewportLabel="Notifications ({hotkey})" />
    </>
  ),
};
export const Success: Story = {
  render: () => (
    <>
      <Button onClick={() => toast({ title: "Changes saved", variant: "success" })}>
        Show success
      </Button>
      <Toaster label="Notifications" closeLabel="Close" viewportLabel="Notifications ({hotkey})" />
    </>
  ),
};
export const Danger: Story = {
  render: () => (
    <>
      <Button onClick={() => toast({ title: "Unable to save", variant: "danger" })}>
        Show danger
      </Button>
      <Toaster label="Notifications" closeLabel="Close" viewportLabel="Notifications ({hotkey})" />
    </>
  ),
};
export const Warning: Story = {
  render: () => (
    <>
      <Button onClick={() => toast({ title: "Review required", variant: "warning" })}>
        Show warning
      </Button>
      <Toaster label="Notifications" closeLabel="Close" viewportLabel="Notifications ({hotkey})" />
    </>
  ),
};
export const StaticPreview: Story = {
  render: () => {
    function Preview() {
      const shown = useRef(false);
      useEffect(() => {
        if (!shown.current) {
          toast({
            title: "Changes saved",
            description: "Your settings are up to date.",
            duration: Infinity,
          });
          shown.current = true;
        }
      }, []);
      return (
        <>
          <div className="h-64" />
          <Toaster
            duration={Infinity}
            label="Notifications"
            closeLabel="Close"
            viewportLabel="Notifications ({hotkey})"
          />
        </>
      );
    }
    return <Preview />;
  },
};
