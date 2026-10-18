import { Skeleton } from "../ui/skeleton.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table.js";

export type TableSkeletonProps = { columns: number; rows?: number; headers?: string[]; label?: string };

export function TableSkeleton({ columns, rows = 5, headers, label }: TableSkeletonProps) {
  return <div role="status"><span className="sr-only">{label ?? "Loading"}</span><Table aria-busy="true">
    {headers ? <TableHeader><TableRow>{Array.from({ length: columns }, (_, i) => <TableHead key={i}>{headers[i] ?? <Skeleton className="h-4 w-24" />}</TableHead>)}</TableRow></TableHeader> : null}
    <TableBody>{Array.from({ length: rows }, (_, row) => <TableRow key={row}>{Array.from({ length: columns }, (_, col) => <TableCell key={col}><Skeleton className={`h-4 ${["w-24", "w-40", "w-16"][col % 3]}`} /></TableCell>)}</TableRow>)}</TableBody>
  </Table></div>;
}
