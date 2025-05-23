
import React, { useState, useEffect } from "react";
import { useMessaging } from "@/hooks/useMessaging";
import { usePropertyData } from "@/hooks/usePropertyData";
import { useAuth } from "@/contexts/AuthContext";
import { ThreadType, ParticipantRole } from "@/types/messaging";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface User {
  id: string;
  email: string;
  role: string;
}

interface NewThreadDialogProps {
  onThreadCreated?: (threadId: string) => void;
}

const NewThreadDialog: React.FC<NewThreadDialogProps> = ({ onThreadCreated }) => {
  const [open, setOpen] = useState(false);
  const { createThread } = useMessaging();
  const { listings } = usePropertyData();
  const { user } = useAuth();
  
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [threadType, setThreadType] = useState<ThreadType>("general");
  const [listingId, setListingId] = useState<string>("");
  const [recipients, setRecipients] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCreateThread = async () => {
    setIsLoading(true);
    
    try {
      const threadId = await createThread({
        title,
        thread_type: threadType,
        listing_id: listingId || undefined,
        participants: recipients.map(user => ({
          user_id: user.id,
          role: user.role as ParticipantRole
        })),
        initial_message: message
      });
      
      if (threadId) {
        setOpen(false);
        resetForm();
        if (onThreadCreated) onThreadCreated(threadId);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setTitle("");
    setMessage("");
    setThreadType("general");
    setListingId("");
    setRecipients([]);
    setSearchQuery("");
  };
  
  // Mock search for demo purposes - in a real app, this would call the Supabase API
  const searchUsers = async (query: string) => {
    // This is just a placeholder. In a real app, you'd search users from your database
    const mockUsers: User[] = [
      { id: "user-1", email: "tenant@example.com", role: "tenant" },
      { id: "user-2", email: "agent@example.com", role: "agent" },
      { id: "user-3", email: "landlord@example.com", role: "landlord" }
    ];
    
    return mockUsers.filter(u => 
      u.email.toLowerCase().includes(query.toLowerCase()) && 
      u.id !== user?.id
    );
  };
  
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300);
    
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);
  
  const addRecipient = (user: User) => {
    if (!recipients.find(r => r.id === user.id)) {
      setRecipients([...recipients, user]);
      setSearchQuery("");
    }
  };
  
  const removeRecipient = (userId: string) => {
    setRecipients(recipients.filter(r => r.id !== userId));
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" /> New Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Start a New Conversation</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="thread-type">Conversation Type</Label>
            <Select 
              value={threadType} 
              onValueChange={(value) => setThreadType(value as ThreadType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="showing">Property Showing</SelectItem>
                <SelectItem value="application">Application</SelectItem>
                <SelectItem value="transaction">Transaction</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(threadType === 'showing' || threadType === 'application' || threadType === 'transaction') && (
            <div>
              <Label htmlFor="property">Related Property</Label>
              <Select
                value={listingId}
                onValueChange={setListingId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {listings.map(listing => (
                    <SelectItem key={listing.id} value={listing.id}>
                      {listing.address}, {listing.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <Label htmlFor="title">Conversation Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Enter a title for this conversation"
            />
          </div>
          
          <div>
            <Label htmlFor="recipients">Recipients</Label>
            <div className="flex flex-wrap gap-1 mb-2">
              {recipients.map(recipient => (
                <Badge 
                  key={recipient.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {recipient.email}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeRecipient(recipient.id)} 
                  />
                </Badge>
              ))}
            </div>
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by email or name"
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border rounded-md shadow-md max-h-[200px] overflow-auto">
                  {searchResults.map(user => (
                    <div 
                      key={user.id}
                      className="p-2 hover:bg-muted cursor-pointer flex items-center justify-between"
                      onClick={() => addRecipient(user)}
                    >
                      <span>{user.email}</span>
                      <Badge>{user.role}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Write your first message"
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateThread} 
            disabled={!message || recipients.length === 0 || isLoading}
          >
            {isLoading ? "Creating..." : "Start Conversation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewThreadDialog;

// Import the necessary modules
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
