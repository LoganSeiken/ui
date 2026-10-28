import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { cn } from "../../utils/cn.js";
import { Input, type InputProps } from "../ui/input.js";

export type SearchInputProps = InputProps & { trailing?: ReactNode };

export function SearchInput({ className, trailing, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        {...props}
        className={cn("pl-9", trailing ? "pr-14" : undefined, className)}
      />
      {trailing ? (
        <span className="absolute top-1/2 right-3 -translate-y-1/2">{trailing}</span>
      ) : null}
    </div>
  );
}
