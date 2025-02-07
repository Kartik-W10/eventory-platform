
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/events";

interface EventListProps {
  events: Event[];
  isAdmin: boolean;
  onViewDetails: (event: Event) => void;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;  // Changed this line to expect string
}

export const EventList = ({ events, isAdmin, onViewDetails, onEdit, onDelete }: EventListProps) => {
  return (
    <div className="grid gap-8">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{event.title}</h2>
            {isAdmin && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(event)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(event.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2 text-secondary" />
              {format(new Date(event.date), "MMMM d, yyyy")}
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2 text-secondary" />
              {event.time}
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2 text-secondary" />
              {event.location}
            </div>
          </div>
          <p className="text-gray-600 mb-4">{event.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">
              ${event.price.toFixed(2)}
            </span>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => onViewDetails(event)}>
                View Details
              </Button>
              <Button onClick={() => onViewDetails(event)}>
                Register Now
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

