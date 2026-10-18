import type { ComponentProps, ElementType, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn.js";

export type ListItemProps = Omit<ComponentProps<"div">, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  trailing?: ReactNode;
  interactive?: boolean;
  href?: string;
  linkComponent?: ElementType;
};

export function ListItem({ title, description, icon, trailing, interactive = false, href, linkComponent, className, ...props }: ListItemProps) {
  const isInteractive = interactive || Boolean(href);
  const content = <>
      {icon ? <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">{icon}</span> : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-foreground">{title}</span>
        {description ? <span className="truncate text-sm text-muted-foreground">{description}</span> : null}
      </div>
      {trailing}
      {isInteractive ? <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" /> : null}
    </>;
  const rootClassName = cn(
    "flex items-center gap-3 px-4 py-3",
    isInteractive && "cursor-pointer transition-colors duration-(--ui-duration-fast) hover:bg-surface-subtle",
    className
  );

  if (href) {
    const LinkComponent = linkComponent ?? "a";
    return <LinkComponent {...props} href={href} className={cn(rootClassName, "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring")}>{content}</LinkComponent>;
  }

  return (
    <div {...props} className={rootClassName}>
      {content}
    </div>
  );
}
