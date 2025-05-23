
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import PropertyShowingScheduler from "@/components/messaging/PropertyShowingScheduler";

interface ShowingRequestModalProps {
  listingId: string;
  trigger?: React.ReactNode;
}

const ShowingRequestModal: React.FC<ShowingRequestModalProps> = ({ 
  listingId,
  trigger 
}) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full">
            <Calendar className="mr-2 h-4 w-4" /> Schedule a Showing
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule a Property Showing</DialogTitle>
        </DialogHeader>
        <PropertyShowingScheduler 
          listingId={listingId}
          onScheduled={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ShowingRequestModal;
