import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventCountsProps {
  counts: Record<string, number>;
}

export function EventCounts({ counts }: EventCountsProps) {
  const sortedEvents = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  if (sortedEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Event Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No events tracked yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Event Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {sortedEvents.map(([event, count]) => (
            <Badge key={event} variant="secondary" className="text-sm py-1 px-3">
              {event.replace(/_/g, " ")}: {count.toLocaleString()}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
