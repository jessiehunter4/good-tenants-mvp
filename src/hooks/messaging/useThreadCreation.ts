
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ThreadCreateParams } from "@/types/messaging";

export const useThreadCreation = () => {
  const { user } = useAuth();
  const { toast } = useToast();

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

  return {
    createThread
  };
};
