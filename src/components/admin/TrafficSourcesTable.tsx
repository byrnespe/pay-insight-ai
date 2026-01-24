import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrafficSource {
  source: string;
  visits: number;
  conversions: number;
  rate: string;
}

interface TrafficSourcesTableProps {
  sources: TrafficSource[];
}

export function TrafficSourcesTable({ sources }: TrafficSourcesTableProps) {
  if (sources.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Traffic Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No traffic data available yet. Events will appear here once users start interacting with the app.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Traffic Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Visits</TableHead>
              <TableHead className="text-right">Conversions</TableHead>
              <TableHead className="text-right">Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.map((source) => (
              <TableRow key={source.source}>
                <TableCell className="font-medium">{source.source}</TableCell>
                <TableCell className="text-right">{source.visits.toLocaleString()}</TableCell>
                <TableCell className="text-right">{source.conversions.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <span className={parseFloat(source.rate) > 5 ? "text-green-600 dark:text-green-400" : ""}>
                    {source.rate}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
