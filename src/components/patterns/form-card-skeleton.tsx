import { FormCard, FormSection } from "./form-card.js";
import { Skeleton } from "../ui/skeleton.js";

export type FormCardSkeletonProps = { sections?: number; fields?: number; label?: string };

/** Loading shape for forms, keeping the same responsive field grid as FormSection. */
export function FormCardSkeleton({ sections = 1, fields = 4, label = "Loading" }: FormCardSkeletonProps) {
  return (
    <div role="status" aria-label={label}>
      <FormCard aria-hidden="true">
        {Array.from({ length: sections }, (_, section) => (
          <FormSection key={section} columns={2}>
            {Array.from({ length: fields }, (_, field) => (
              <div key={field} className="grid gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </FormSection>
        ))}
      </FormCard>
    </div>
  );
}
