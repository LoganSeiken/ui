import type { Meta, StoryObj } from "@storybook/react-vite";
import { MessageBubble, MessageThread, SystemEventRow } from "./message-thread.js";

const meta = { title: "patterns/MessageThread", component: MessageThread, parameters: { layout: "padded" }, args: { ariaLabel: "Message thread" }, render: () => <MessageThread ariaLabel="Message thread"><MessageBubble direction="inbound" author="Customer" timestamp="10:02" body={"Hello!\nDo you open on Sundays?"} /><SystemEventRow timestamp="10:03">Agent took over</SystemEventRow><MessageBubble direction="outbound" author="Agent" timestamp="10:04" deliveryStatus="Delivered" body="A person will be with you shortly." /></MessageThread> } satisfies Meta<typeof MessageThread>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Conversation: Story = {};
