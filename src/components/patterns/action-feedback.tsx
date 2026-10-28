import type { ReactNode } from "react";
import { Callout } from "./callout.js";

export type ActionFeedbackStatus = "idle" | "success" | "error" | "pending";

export type ActionFeedbackProps = {
  status: ActionFeedbackStatus;
  message?: ReactNode;
  pendingLabel: ReactNode;
  successTitle: ReactNode;
  errorTitle: ReactNode;
  className?: string;
};

/** Inline feedback that stays mounted while a form revalidates. */
export function ActionFeedback({
  status,
  message,
  pendingLabel,
  successTitle,
  errorTitle,
  className
}: ActionFeedbackProps) {
  if (status === "idle") return null;

  const variant = status === "error" ? "danger" : status === "success" ? "success" : "neutral";
  const title = status === "pending" ? pendingLabel : status === "success" ? successTitle : errorTitle;

  return (
    <Callout
      title={title}
      description={message}
      variant={variant}
      role={status === "error" ? "alert" : status === "success" ? "status" : undefined}
      aria-live={status === "pending" ? "polite" : undefined}
      className={className}
    />
  );
}
