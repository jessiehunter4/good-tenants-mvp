
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMessaging } from "@/hooks/useMessaging";
import { useAuth } from "@/contexts/AuthContext";

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00"
];

interface PropertyShowingSchedulerProps {
  listingId: string;
  onScheduled?: () => void;
}

const PropertyShowingScheduler: React.FC<PropertyShowingSchedulerProps> = ({ 
  listingId,
  onScheduled 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { createThread } = useMessaging();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleScheduleShowing = async () => {
    if (!date || !time || !user) {
      toast({
        title: "Missing information",
        description: "Please select a date, time and provide a message.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 1. Create a property showing record
      const { data: showingData, error: showingError } = await supabase
        .from("property_showings")
        .insert({
          listing_id: listingId,
          tenant_id: user.id,
          requested_date: format(date, "yyyy-MM-dd"),
          requested_time: time,
          message: message.trim() || null,
          status: "requested"
        })
        .select()
        .single();
        
      if (showingError) throw showingError;
      
      // 2. Create a message thread for this showing
      // We need to get the owner of this listing
      const { data: listingData, error: listingError } = await supabase
        .from("listings")
        .select("owner_id, address, city")
        .eq("id", listingId)
        .single();
        
      if (listingError) throw listingError;
      
      // Create the thread with both parties
      const threadId = await createThread({
        title: `Showing Request: ${listingData.address}, ${listingData.city}`,
        thread_type: "showing",
        listing_id: listingId,
        property_showing_id: showingData.id,
        participants: [{ 
          user_id: listingData.owner_id, 
          role: "landlord" // This might be agent or landlord depending on owner
        }],
        initial_message: `I'd like to schedule a showing for this property on ${format(date, "PPP")} at ${time}.\n\n${message}`
      });
      
      toast({
        title: "Showing requested",
        description: "The property owner has been notified of your showing request.",
      });
      
      if (onScheduled) {
        onScheduled();
      }
      
    } catch (error) {
      console.error("Error scheduling showing:", error);
      toast({
        title: "Error",
        description: "Failed to schedule showing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Preferred Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => 
                  date < new Date() || 
                  date > addDays(new Date(), 30)
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="time">Preferred Time</Label>
          <Select onValueChange={setTime}>
            <SelectTrigger id="time" className={cn(!time && "text-muted-foreground")}>
              <SelectValue placeholder="Select time">
                {time ? (
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {time}
                  </div>
                ) : (
                  "Select time"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Any specific requests or questions about the property?"
          className="min-h-[100px]"
        />
      </div>
      
      <Button 
        className="w-full" 
        onClick={handleScheduleShowing}
        disabled={!date || !time || isLoading}
      >
        {isLoading ? "Scheduling..." : "Schedule Showing"}
      </Button>
    </div>
  );
};

export default PropertyShowingScheduler;
