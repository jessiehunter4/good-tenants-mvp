
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageThread as ThreadType } from "@/types/messaging";
import { useMessaging } from "@/hooks/useMessaging";
import { format, isToday, isYesterday } from "date-fns";
import { cn } from "@/lib/utils";

interface ThreadListProps {
  onSelectThread?: (threadId: string) => void;
  activeThreadId?: string;
}

const ThreadList: React.FC<ThreadListProps> = ({ onSelectThread, activeThreadId }) => {
  const { threads, loading, fetchThreads } = useMessaging();
  
  useEffect(() => {
    fetchThreads();
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, "p");
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "MMM d");
    }
  };
  
  const getParticipantNames = (thread: ThreadType) => {
    if (!thread.participants || thread.participants.length === 0) {
      return "No participants";
    }
    
    const names = thread.participants.map(p => {
      const email = p.user?.email || "";
      return email.split("@")[0];
    });
    
    return names.join(", ");
  };
  
  const getThreadTypeLabel = (type: string) => {
    switch (type) {
      case 'showing': return 'Showing';
      case 'application': return 'Application';
      case 'transaction': return 'Transaction';
      default: return 'Message';
    }
  };
  
  if (loading && threads.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {threads.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No conversations yet
          </div>
        ) : (
          <div className="divide-y">
            {threads.map((thread) => (
              <div 
                key={thread.id}
                className={cn(
                  "p-3 hover:bg-muted/50 cursor-pointer",
                  activeThreadId === thread.id ? "bg-muted" : ""
                )}
                onClick={() => onSelectThread?.(thread.id)}
              >
                <div className="flex gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      {thread.thread_type.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-medium truncate">
                        {thread.title || getParticipantNames(thread)}
                      </h4>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {thread.updated_at && formatDate(thread.updated_at)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge variant="outline" className="h-5 text-xs px-1">
                        {getThreadTypeLabel(thread.thread_type)}
                      </Badge>
                      
                      {thread.unread_count ? (
                        <Badge className="h-5 w-5 text-xs p-0 flex items-center justify-center">
                          {thread.unread_count}
                        </Badge>
                      ) : null}
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {thread.last_message?.content || "No messages yet"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThreadList;
