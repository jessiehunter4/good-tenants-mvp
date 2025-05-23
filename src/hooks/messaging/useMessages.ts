
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Message, MessageThread } from "@/types/messaging";

export const useMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeThread, setActiveThread] = useState<MessageThread | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async (threadId: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get the thread details
      const { data: threadData, error: threadError } = await (supabase as any)
        .from("message_threads")
        .select(`
          *,
          participants:thread_participants(
            *,
            user:users(email, role)
          )
        `)
        .eq("id", threadId)
        .single();
      
      if (threadError) throw threadError;
      setActiveThread(threadData as MessageThread);
      
      // Get messages for this thread
      const { data: messageData, error: messageError } = await (supabase as any)
        .from("messages")
        .select(`
          *,
          sender:users(email, role)
        `)
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });
      
      if (messageError) throw messageError;
      setMessages(messageData as Message[]);
      
      // Mark messages as read
      await (supabase as any)
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("thread_id", threadId)
        .neq("sender_id", user.id)
        .is("read_at", null);
        
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (threadId: string, content: string) => {
    if (!user || !content.trim()) return;
    
    try {
      const { data, error } = await (supabase as any)
        .from("messages")
        .insert({
          thread_id: threadId,
          sender_id: user.id,
          content: content.trim()
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state
      const newMessage = {
        ...data,
        sender: { email: user.email || "", role: user.role || "" }
      } as Message;
      
      setMessages(prev => [...prev, newMessage]);
      
      return newMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    messages,
    activeThread,
    loading,
    fetchMessages,
    sendMessage,
    setMessages,
    setActiveThread
  };
};
