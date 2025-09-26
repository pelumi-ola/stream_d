import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 5 }) {
  return (
    <Table>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={i}>
            <TableCell className="hidden md:table-cell">
              <Skeleton className="md:h-20 md:w-32 rounded-lg" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 md:w-48" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 md:w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-20 rounded-md" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
