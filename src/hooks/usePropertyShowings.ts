
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface PropertyShowing {
  id: string;
  listing_id: string;
  tenant_id: string;
  requested_date: string;
  requested_time: string;
  actual_date?: string;
  actual_time?: string;
  status: 'requested' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  message?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  listing?: {
    address: string;
    city: string;
    state: string;
  };
  tenant?: {
    email: string;
  };
}

export const usePropertyShowings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showings, setShowings] = useState<PropertyShowing[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchShowings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await (supabase as any)
        .from('property_showings')
        .select(`
          *,
          listing:listings(address, city, state),
          tenant:users(email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setShowings(data || []);
    } catch (error) {
      console.error('Error fetching showings:', error);
      toast({
        title: "Error",
        description: "Failed to load property showings.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateShowingStatus = async (showingId: string, status: string, notes?: string) => {
    try {
      const { error } = await (supabase as any)
        .from('property_showings')
        .update({ 
          status,
          notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', showingId);

      if (error) throw error;

      toast({
        title: "Showing updated",
        description: `Showing status changed to ${status}.`,
      });

      // Refresh the list
      fetchShowings();
    } catch (error) {
      console.error('Error updating showing:', error);
      toast({
        title: "Error",
        description: "Failed to update showing status.",
        variant: "destructive"
      });
    }
  };

  const rescheduleShowing = async (
    showingId: string, 
    newDate: string, 
    newTime: string
  ) => {
    try {
      const { error } = await (supabase as any)
        .from('property_showings')
        .update({
          actual_date: newDate,
          actual_time: newTime,
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', showingId);

      if (error) throw error;

      toast({
        title: "Showing rescheduled",
        description: "The showing has been rescheduled successfully.",
      });

      fetchShowings();
    } catch (error) {
      console.error('Error rescheduling showing:', error);
      toast({
        title: "Error",
        description: "Failed to reschedule showing.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchShowings();
  }, [user]);

  return {
    showings,
    loading,
    fetchShowings,
    updateShowingStatus,
    rescheduleShowing
  };
};
