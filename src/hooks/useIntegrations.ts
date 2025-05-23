
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Integration, IntegrationRequest, IntegrationUsage, IntegrationAuditLog } from "@/types/integrations";

export const useIntegrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [integrationRequests, setIntegrationRequests] = useState<IntegrationRequest[]>([]);
  const [usageStats, setUsageStats] = useState<IntegrationUsage[]>([]);
  const [auditLogs, setAuditLogs] = useState<IntegrationAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from("integrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error("Error fetching integrations:", error);
      toast({
        title: "Error",
        description: "Failed to load integrations",
        variant: "destructive",
      });
    }
  };

  const fetchIntegrationRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("integration_requests")
        .select(`
          *,
          user:requested_by(email, role)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIntegrationRequests(data || []);
    } catch (error) {
      console.error("Error fetching integration requests:", error);
      toast({
        title: "Error",
        description: "Failed to load integration requests",
        variant: "destructive",
      });
    }
  };

  const fetchUsageStats = async () => {
    try {
      const { data, error } = await supabase
        .from("integration_usage")
        .select("*")
        .order("date", { ascending: false })
        .limit(100);

      if (error) throw error;
      setUsageStats(data || []);
    } catch (error) {
      console.error("Error fetching usage stats:", error);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("integration_audit_log")
        .select(`
          *,
          user:performed_by(email)
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    }
  };

  const updateIntegrationStatus = async (integrationId: string, status: Integration['status']) => {
    try {
      const { error } = await supabase
        .from("integrations")
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", integrationId);

      if (error) throw error;

      // Log the action
      await supabase
        .from("integration_audit_log")
        .insert({
          integration_id: integrationId,
          action: `status_changed_to_${status}`,
          performed_by: (await supabase.auth.getUser()).data.user?.id,
          details: { new_status: status }
        });

      toast({
        title: "Success",
        description: "Integration status updated successfully",
      });

      fetchIntegrations();
      fetchAuditLogs();
    } catch (error) {
      console.error("Error updating integration status:", error);
      toast({
        title: "Error",
        description: "Failed to update integration status",
        variant: "destructive",
      });
    }
  };

  const updateRequestStatus = async (requestId: string, status: IntegrationRequest['status'], adminNotes?: string) => {
    try {
      const { error } = await supabase
        .from("integration_requests")
        .update({ 
          status,
          admin_notes: adminNotes,
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Request status updated successfully",
      });

      fetchIntegrationRequests();
    } catch (error) {
      console.error("Error updating request status:", error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    }
  };

  const testIntegration = async (integrationId: string) => {
    try {
      // Update test status to pending
      await supabase
        .from("integrations")
        .update({ 
          test_result: 'pending',
          last_tested_at: new Date().toISOString()
        })
        .eq("id", integrationId);

      // Log the test action
      await supabase
        .from("integration_audit_log")
        .insert({
          integration_id: integrationId,
          action: 'test_initiated',
          performed_by: (await supabase.auth.getUser()).data.user?.id,
          details: { test_type: 'manual' }
        });

      toast({
        title: "Test Initiated",
        description: "Integration test has been started",
      });

      fetchIntegrations();
      fetchAuditLogs();
    } catch (error) {
      console.error("Error testing integration:", error);
      toast({
        title: "Error",
        description: "Failed to test integration",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchIntegrations(),
        fetchIntegrationRequests(),
        fetchUsageStats(),
        fetchAuditLogs()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    integrations,
    integrationRequests,
    usageStats,
    auditLogs,
    loading,
    updateIntegrationStatus,
    updateRequestStatus,
    testIntegration,
    refreshData: async () => {
      await Promise.all([
        fetchIntegrations(),
        fetchIntegrationRequests(),
        fetchUsageStats(),
        fetchAuditLogs()
      ]);
    }
  };
};
