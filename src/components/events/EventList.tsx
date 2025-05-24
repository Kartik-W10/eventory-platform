
import { format } from "date-fns";
import { Edit, Trash2, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Event } from "@/types/events";

interface EventListProps {
  events: Event[];
  isAdmin: boolean;
  onViewDetails: (event: Event) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  getRegistrationStatus?: (eventId: string) => string | null;
  isUserDisabled?: boolean;
}

export const EventList = ({ 
  events, 
  isAdmin, 
  onViewDetails, 
  onEdit, 
  onDelete,
  getRegistrationStatus,
  isUserDisabled = false
}: EventListProps) => {
  const renderRegistrationStatus = (eventId: string) => {
    if (!getRegistrationStatus) return null;
    
    const status = getRegistrationStatus(eventId);
    if (!status) return null;
    
    let badgeVariant = "outline";
    let badgeText = "Pending";
    
    switch (status) {
      case "pending":
        badgeVariant = "outline";
        badgeText = "Registration Pending";
        break;
      case "pending_verification":
        badgeVariant = "secondary";
        badgeText = "Payment Verification Pending";
        break;
      case "approved":
        badgeVariant = "default";
        badgeText = "Registered";
        break;
      case "rejected":
        badgeVariant = "destructive";
        badgeText = "Payment Rejected";
        break;
    }
    
    return (
      <Badge variant={badgeVariant as any} className="ml-2">
        {badgeText}
      </Badge>
    );
  };
  
  if (events.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No events found. Please try a different search or category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {isUserDisabled && (
        <div className="col-span-full mb-4 p-4 border rounded-md bg-yellow-50 text-yellow-800">
          <p>Your account is currently disabled. You can view events but cannot register for them.</p>
        </div>
      )}
      
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="mr-2">
                {event.category.replace("_", " ")}
              </Badge>
              {renderRegistrationStatus && renderRegistrationStatus(event.id)}
            </div>
            <CardTitle className="text-xl mt-2">{event.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2">
              <div className="flex items-start">
                <Calendar className="w-4 h-4 mr-2 mt-0.5" />
                <span>
                  {format(new Date(event.date), "MMMM d, yyyy")} • {event.time}
                </span>
              </div>
              <div className="flex items-start">
                <ExternalLink className="w-4 h-4 mr-2 mt-0.5" />
                <span>{event.location}</span>
              </div>
              <p className="mt-2 text-muted-foreground line-clamp-2">
                {event.description}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-3 border-t">
            <div>
              <span className="font-semibold">${event.price.toFixed(2)}</span>
            </div>
            <div className="flex space-x-2">
              {isAdmin && (
                <>
                  <Button variant="outline" size="sm" onClick={() => onEdit?.(event)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete?.(event.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button 
                onClick={() => onViewDetails(event)} 
                disabled={isUserDisabled}
              >
                {isUserDisabled ? "View Only" : "View Details"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
