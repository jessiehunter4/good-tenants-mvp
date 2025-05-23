
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface IntegrationRequest {
  action: string;
  data?: any;
  config?: Record<string, any>;
}

interface IntegrationResponse {
  success: boolean;
  data?: any;
  error?: string;
  usage?: {
    requests: number;
    response_time: number;
  };
}

export const useIntegrationClient = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const callIntegration = async (
    integrationName: string,
    request: IntegrationRequest
  ): Promise<IntegrationResponse | null> => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke(
        integrationName,
        {
          body: request,
        }
      );

      if (error) throw error;

      if (!data.success) {
        toast({
          title: "Integration Error",
          description: data.error || "Unknown error occurred",
          variant: "destructive",
        });
        return data;
      }

      toast({
        title: "Integration Success",
        description: `Action ${request.action} completed successfully`,
      });

      return data;
    } catch (error) {
      console.error("Integration call failed:", error);
      toast({
        title: "Integration Failed",
        description: "Failed to call integration service",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (integrationName: string, config?: Record<string, any>) => {
    return callIntegration(integrationName, {
      action: "test_connection",
      config,
    });
  };

  const verifyLicense = async (
    integrationName: string,
    licenseData: { license_number: string; state: string }
  ) => {
    return callIntegration(integrationName, {
      action: "verify_license",
      data: licenseData,
    });
  };

  const syncData = async (integrationName: string, syncData: any) => {
    return callIntegration(integrationName, {
      action: "sync_data",
      data: syncData,
    });
  };

  return {
    loading,
    callIntegration,
    testConnection,
    verifyLicense,
    syncData,
  };
};
