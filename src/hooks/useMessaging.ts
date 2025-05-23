
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Message, MessageThread, ThreadCreateParams, ThreadParticipant } from "@/types/messaging";

export const useMessaging = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeThread, setActiveThread] = useState<MessageThread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch all threads for the current user
  const fetchThreads = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Note: We use 'any' type temporarily here since our Database type doesn't include the new tables yet
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
  
  // Fetch messages for a specific thread
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
  
  // Send a new message
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
  
  // Create a new thread with initial participants
  const createThread = async (params: ThreadCreateParams) => {
    if (!user) return null;
    
    try {
      // First create the thread
      const { data: threadData, error: threadError } = await (supabase as any)
        .from("message_threads")
        .insert({
          title: params.title || null,
          thread_type: params.thread_type || "general",
          listing_id: params.listing_id || null,
          property_showing_id: params.property_showing_id || null
        })
        .select()
        .single();
      
      if (threadError) throw threadError;
      
      // Add participants including the current user if not already in the list
      const hasCurrentUser = params.participants.some(p => p.user_id === user.id);
      
      const participantsToAdd = [
        ...(hasCurrentUser ? [] : [{ user_id: user.id, role: user.role || "tenant" }]),
        ...params.participants
      ];
      
      const { error: participantError } = await (supabase as any)
        .from("thread_participants")
        .insert(
          participantsToAdd.map(p => ({
            thread_id: threadData.id,
            user_id: p.user_id,
            role: p.role
          }))
        );
      
      if (participantError) throw participantError;
      
      // Add initial message if provided
      if (params.initial_message) {
        await sendMessage(threadData.id, params.initial_message);
      }
      
      // Fetch the newly created thread with all data
      await fetchThreads();
      
      return threadData.id;
    } catch (error) {
      console.error("Error creating message thread:", error);
      toast({
        title: "Error",
        description: "Failed to create conversation.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  // Subscribe to real-time updates for the active thread
  const subscribeToThread = (threadId: string, onNewMessage: (message: Message) => void) => {
    const channel = supabase
      .channel(`thread-${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.${threadId}`
        },
        async (payload) => {
          const newMessage = payload.new as unknown as Message;
          
          // If the message is not from the current user, mark it as read
          if (newMessage.sender_id !== user?.id) {
            await (supabase as any)
              .from("messages")
              .update({ read_at: new Date().toISOString() })
              .eq("id", newMessage.id);
          }
          
          // Get sender information
          const { data: senderData } = await supabase
            .from("users")
            .select("email, role")
            .eq("id", newMessage.sender_id)
            .single();
            
          const messageWithSender = {
            ...newMessage,
            sender: senderData
          } as Message;
          
          onNewMessage(messageWithSender);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    threads,
    messages,
    activeThread,
    loading,
    fetchThreads,
    fetchMessages,
    sendMessage,
    createThread,
    subscribeToThread
  };
};
