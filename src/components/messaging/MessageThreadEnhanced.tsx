import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useMessaging } from "@/hooks/useMessaging";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import ConversationActions from "./ConversationActions";
import ShowingRequestCard from "./ShowingRequestCard";
import { usePropertyShowings } from "@/hooks/usePropertyShowings";

interface MessageThreadEnhancedProps {
  threadId: string;
}

const MessageThreadEnhanced: React.FC<MessageThreadEnhancedProps> = ({ threadId }) => {
  const { user, getUserRole } = useAuth();
  const { messages, activeThread, loading, fetchMessages, sendMessage, subscribeToThread } = useMessaging();
  const { showings, updateShowingStatus } = usePropertyShowings();
  const [messageText, setMessageText] = useState("");
  const [userRole, setUserRole] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    fetchMessages(threadId);
    
    // Get user role - getUserRole() returns a string directly, not a Promise
    const role = getUserRole();
    if (role) setUserRole(role);
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToThread(threadId, (newMessage) => {
      // This will be called whenever a new message is received
    });
    
    return () => {
      unsubscribe();
    };
  }, [threadId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    await sendMessage(threadId, messageText);
    setMessageText("");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const getInitials = (email: string) => {
    return email?.substring(0, 2).toUpperCase() || "?";
  };

  const handleShowingResponse = (showingId: string, action: 'confirm' | 'reschedule' | 'cancel') => {
    switch (action) {
      case 'confirm':
        updateShowingStatus(showingId, 'confirmed');
        break;
      case 'cancel':
        updateShowingStatus(showingId, 'cancelled');
        break;
      case 'reschedule':
        // In a real app, you'd open a reschedule dialog
        updateShowingStatus(showingId, 'rescheduled');
        break;
    }
  };
  
  if (loading && !activeThread) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading conversation...</p>
        </div>
      </Card>
    );
  }

  // Filter showings related to this thread
  const threadShowings = showings.filter(showing => 
    activeThread?.property_showing_id === showing.id ||
    activeThread?.listing_id === showing.listing_id
  );
  
  return (
    <Card className="w-full h-[700px] flex flex-col">
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">{activeThread?.title || "Conversation"}</h3>
          </div>
          <div className="flex -space-x-2">
            {activeThread?.participants?.slice(0, 3).map((participant) => (
              <Avatar key={participant.id} className="border-2 border-background w-8 h-8">
                <AvatarFallback className="text-xs">
                  {getInitials(participant.user?.email || "")}
                </AvatarFallback>
              </Avatar>
            ))}
            {(activeThread?.participants?.length || 0) > 3 && (
              <Avatar className="border-2 border-background w-8 h-8">
                <AvatarFallback className="text-xs bg-muted">
                  +{(activeThread?.participants?.length || 0) - 3}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Conversation Actions */}
      <ConversationActions 
        threadId={threadId}
        threadType={activeThread?.thread_type || 'general'}
        listingId={activeThread?.listing_id || undefined}
        userRole={userRole}
      />
      
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollRef}>
          {messages.length === 0 && threadShowings.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {/* Show property showing cards for showing threads */}
              {threadShowings.map((showing) => (
                <ShowingRequestCard
                  key={showing.id}
                  showing={showing}
                  onRespond={handleShowingResponse}
                  userRole={userRole}
                />
              ))}

              {/* Messages */}
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.sender_id === user?.id ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="text-xs">
                        {getInitials(message.sender?.email || "")}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className={`
                        rounded-lg px-3 py-2
                        ${message.sender_id === user?.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'}
                      `}>
                        {message.content}
                      </div>
                      <div className={`text-xs text-muted-foreground mt-1 ${message.sender_id === user?.id ? 'text-right' : ''}`}>
                        {format(new Date(message.created_at), 'p')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-2 border-t">
        <div className="flex w-full gap-2">
          <Textarea
            className="min-h-[60px] flex-grow"
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button 
            className="h-[60px] w-12"
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MessageThreadEnhanced;
