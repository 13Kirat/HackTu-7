import type { TimelineEvent } from "@/types";

export function ShipmentTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="space-y-0">
      {events.map((event, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`h-3 w-3 rounded-full shrink-0 mt-1 ${i === events.length - 1 ? "bg-primary ring-4 ring-primary/20" : "bg-muted-foreground/30"}`} />
            {i < events.length - 1 && <div className="w-px flex-1 bg-border min-h-[2rem]" />}
          </div>
          <div className="pb-6">
            <p className="font-medium text-sm">{event.status}</p>
            <p className="text-xs text-muted-foreground">{event.date}</p>
            {event.location && <p className="text-xs text-muted-foreground">{event.location}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
