import type { ComponentProps, ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.js";

const textLinkVariants = cva(
  "rounded-sm text-foreground underline-offset-4 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default: "font-medium hover:underline",
        muted: "text-sm underline",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type TextLinkProps = Omit<ComponentProps<"a">, "href"> &
  VariantProps<typeof textLinkVariants> & {
    href?: string;
    linkComponent?: ElementType;
  };

export function TextLink({
  variant,
  linkComponent: Link = "a",
  href,
  className,
  ...props
}: TextLinkProps) {
  return <Link {...props} href={href} className={cn(textLinkVariants({ variant }), className)} />;
}
