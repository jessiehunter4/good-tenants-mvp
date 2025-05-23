
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { MessageThread } from "@/types/messaging";

export const useThreads = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchThreads = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data: threadData, error: threadError } = await (supabase as any)
        .from("message_threads")
        .select(`
          *,
          participants:thread_participants(*)
        `)
        .order("updated_at", { ascending: false });
      
      if (threadError) throw threadError;
      
      // For each thread, fetch the last message
      const threadsWithLastMessage = await Promise.all(
        threadData.map(async (thread: any) => {
          const { data: lastMessageData } = await (supabase as any)
            .from("messages")
            .select("*")
            .eq("thread_id", thread.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();
            
          // Count unread messages
          const { count: unreadCount } = await (supabase as any)
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("thread_id", thread.id)
            .is("read_at", null)
            .neq("sender_id", user.id);
            
          return {
            ...thread,
            last_message: lastMessageData || null,
            unread_count: unreadCount || 0
          } as MessageThread;
        })
      );
      
      setThreads(threadsWithLastMessage);
    } catch (error) {
      console.error("Error fetching message threads:", error);
      toast({
        title: "Error",
        description: "Failed to load message threads.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    threads,
    loading,
    fetchThreads,
    setThreads
  };
};
