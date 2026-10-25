import type { ComponentProps, ElementType, MouseEvent } from "react";
import { buttonVariants } from "./button.js";
import { cn } from "../../utils/cn.js";
import type { VariantProps } from "class-variance-authority";

export type LinkButtonProps = Omit<ComponentProps<"a">, "href"> &
  VariantProps<typeof buttonVariants> & {
    href?: string;
    linkComponent?: ElementType;
    disabled?: boolean;
  };

export function LinkButton({ variant, size, linkComponent: Link = "a", href, disabled = false, className, onClick, children, ...props }: LinkButtonProps) {
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event as MouseEvent<HTMLAnchorElement>);
  };

  return (
    <Link
      {...props}
      href={disabled ? undefined : href}
      role={disabled ? "link" : props.role}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : props.tabIndex}
      onClick={handleClick}
      className={cn(buttonVariants({ variant, size }), disabled && "pointer-events-none opacity-50", className)}
    >
      {children}
    </Link>
  );
}
