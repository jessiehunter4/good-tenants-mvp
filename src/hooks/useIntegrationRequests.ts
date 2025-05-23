
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface IntegrationRequestData {
  integration_name: string;
  provider_name: string;
  business_justification: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export const useIntegrationRequests = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createIntegrationRequest = async (requestData: IntegrationRequestData) => {
    try {
      setLoading(true);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("integration_requests")
        .insert({
          ...requestData,
          requested_by: user.user.id
        });

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: "Your integration request has been submitted for review.",
      });

      return true;
    } catch (error) {
      console.error("Error creating integration request:", error);
      toast({
        title: "Error",
        description: "Failed to submit integration request",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createIntegrationRequest,
    loading
  };
};
