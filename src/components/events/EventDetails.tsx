
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/events";

interface EventDetailsProps {
  event: Event;
  onRegister: (event: Event) => void;
  onClose: () => void;
}

export const EventDetails = ({ event, onRegister, onClose }: EventDetailsProps) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">{event.description}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold">Date & Time</h4>
          <p>{format(new Date(event.date), "MMMM d, yyyy")} at {event.time}</p>
        </div>
        <div>
          <h4 className="font-semibold">Location</h4>
          <p>{event.location}</p>
        </div>
        <div>
          <h4 className="font-semibold">Category</h4>
          <p>{event.category}</p>
        </div>
        <div>
          <h4 className="font-semibold">Price</h4>
          <p>${event.price.toFixed(2)}</p>
        </div>
        {event.google_meet_link && (
          <div className="col-span-2">
            <h4 className="font-semibold">Google Meet Link</h4>
            <a
              href={event.google_meet_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              Join Meeting
            </a>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button onClick={() => onRegister(event)}>Register Now</Button>
      </div>
    </div>
  );
};

