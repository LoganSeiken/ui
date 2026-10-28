import { Button } from "./ui/button.js";
import { DemoCounter } from "./demo-counter.js";

export const DEMO_REVISION = "0.1.0";

export function SharedDemo({ appName }: { appName: string }) {
  return (
    <section
      data-testid="shared-demo"
      className="rounded-lg border-2 border-primary bg-surface p-6 text-surface-foreground"
    >
      <h2 className="text-xl font-semibold">Shared component · @loganseiken/ui</h2>
      <p className="text-muted-foreground">Consumed by: {appName}</p>
      <p className="text-muted-foreground">Revision: {DEMO_REVISION}</p>
      <div className="my-4 flex flex-wrap gap-3">
        <Button variant="primary">Primario</Button>
        <Button variant="outline">Contorno</Button>
        <Button variant="destructive">Destructivo</Button>
      </div>
      <DemoCounter />
    </section>
  );
}
