
import { useState } from "react";
import { Calendar, Clock, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Listing } from "@/types/listings";

interface PropertyShowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestShowing: (date: Date, time: string, message: string) => void;
  property: Listing | null;
}

const PropertyShowingModal = ({ 
  isOpen, 
  onClose, 
  onRequestShowing, 
  property 
}: PropertyShowingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both a date and time for your showing.",
        variant: "destructive",
      });
      return;
    }

    onRequestShowing(selectedDate, selectedTime, message);
    
    // Reset form
    setSelectedDate(undefined);
    setSelectedTime("");
    setMessage("");
    onClose();
    
    toast({
      title: "Showing Requested",
      description: "Your showing request has been sent to the property owner.",
    });
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2); // Allow bookings up to 2 months ahead

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Property Showing</DialogTitle>
          <DialogDescription>
            Schedule a showing for {property?.address}, {property?.city}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date Selection */}
          <div>
            <h4 className="font-medium mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Select Date
            </h4>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < minDate || date > maxDate}
              className="rounded-md border"
            />
          </div>

          {/* Time Selection */}
          <div>
            <h4 className="font-medium mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Select Time
            </h4>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div>
            <h4 className="font-medium mb-3 flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message (Optional)
            </h4>
            <Textarea
              placeholder="Any special requests or questions about the property..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Request Showing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyShowingModal;
