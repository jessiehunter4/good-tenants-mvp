
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Message } from "@/types/messaging";

export const useRealtimeSubscription = () => {
  const { user } = useAuth();

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
    subscribeToThread
  };
};
