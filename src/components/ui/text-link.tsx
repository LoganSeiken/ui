import type { ComponentProps, ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.js";

const textLinkVariants = cva("text-foreground", {
  variants: {
    variant: {
      default: "font-medium hover:underline",
      muted: "text-sm underline"
    }
  },
  defaultVariants: { variant: "default" }
});

export type TextLinkProps = Omit<ComponentProps<"a">, "href"> &
  VariantProps<typeof textLinkVariants> & {
    href?: string;
    linkComponent?: ElementType;
  };

export function TextLink({ variant, linkComponent: Link = "a", href, className, ...props }: TextLinkProps) {
  return <Link {...props} href={href} className={cn(textLinkVariants({ variant }), className)} />;
}
