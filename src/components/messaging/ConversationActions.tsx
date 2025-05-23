
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Users, Settings } from "lucide-react";
import PropertyShowingScheduler from "./PropertyShowingScheduler";
import DocumentUploadArea from "./DocumentUploadArea";

interface ConversationActionsProps {
  threadId: string;
  threadType: string;
  listingId?: string;
  userRole: string;
}

const ConversationActions: React.FC<ConversationActionsProps> = ({
  threadId,
  threadType,
  listingId,
  userRole
}) => {
  const [showingDialogOpen, setShowingDialogOpen] = useState(false);
  const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-2 p-3 border-t bg-muted/30">
      <Badge variant="outline" className="text-xs">
        {threadType === 'showing' ? 'Property Showing' : 
         threadType === 'application' ? 'Application' : 
         threadType === 'transaction' ? 'Transaction' : 'General'}
      </Badge>

      {/* Schedule Showing Action */}
      {userRole === 'tenant' && listingId && (
        <Dialog open={showingDialogOpen} onOpenChange={setShowingDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Calendar className="h-3 w-3 mr-1" />
              Schedule Showing
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Property Showing</DialogTitle>
            </DialogHeader>
            <PropertyShowingScheduler 
              listingId={listingId}
              onScheduled={() => setShowingDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Document Upload Action */}
      {userRole === 'tenant' && (
        <Dialog open={documentsDialogOpen} onOpenChange={setDocumentsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <FileText className="h-3 w-3 mr-1" />
              Upload Documents
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Application Documents</DialogTitle>
            </DialogHeader>
            <DocumentUploadArea 
              documents={[]} 
              onDocumentUploaded={() => {
                // Refresh documents
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Invite Participants Action */}
      <Button size="sm" variant="outline">
        <Users className="h-3 w-3 mr-1" />
        Add Participants
      </Button>

      {/* Thread Settings */}
      <Button size="sm" variant="outline">
        <Settings className="h-3 w-3 mr-1" />
        Settings
      </Button>
    </div>
  );
};

export default ConversationActions;
