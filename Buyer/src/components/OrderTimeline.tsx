import { OrderEvent } from '@/types';
import { Check, Circle } from 'lucide-react';

interface OrderTimelineProps {
  events: OrderEvent[];
}

export default function OrderTimeline({ events }: OrderTimelineProps) {
  return (
    <div className="space-y-0">
      {events.map((event, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
              event.completed
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}>
              {event.completed ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            </div>
            {i < events.length - 1 && (
              <div className={`w-0.5 h-12 ${event.completed ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
          <div className="pb-8">
            <p className={`text-sm font-medium ${event.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
              {event.status}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
            {event.date && <p className="text-xs text-muted-foreground">{event.date}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
