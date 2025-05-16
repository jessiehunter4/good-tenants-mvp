
import { supabase } from "@/integrations/supabase/client";
import { TenantProfile } from "@/types/profiles";
import { useToast } from "@/components/ui/use-toast";

/**
 * Filter tenants based on search query
 */
export const filterTenantsByQuery = (tenants: TenantProfile[], searchQuery: string): TenantProfile[] => {
  if (!searchQuery) return tenants;
  
  const query = searchQuery.toLowerCase();
  return tenants.filter(tenant => (
    tenant.user_email?.toLowerCase().includes(query) ||
    tenant.preferred_locations?.some(location => location.toLowerCase().includes(query)) ||
    (tenant.bio && tenant.bio.toLowerCase().includes(query))
  ));
};

/**
 * Send invitation to tenant
 */
export const sendInviteToTenant = async (
  tenantId: string, 
  userId: string, 
  listingId: string,
  triggerWebhook: (payload: any) => Promise<boolean>,
  toast: ReturnType<typeof useToast>
) => {
  try {
    // 1. Create invite record in the database
    const { data: invite, error } = await supabase
      .from("invites")
      .insert({
        tenant_id: tenantId,
        sender_id: userId,
        listing_id: listingId,
        message: "I'd like to invite you to view this property.",
        status: "pending"
      })
      .select('id')
      .single();

    if (error) throw error;
    
    // 2. Trigger Make.com webhook with required payload
    const webhookPayload = {
      tenant_id: tenantId,
      sender_id: userId,
      listing_id: listingId,
      timestamp: new Date().toISOString()
    };
    
    await triggerWebhook(webhookPayload);

    toast.toast({
      title: "Invitation sent!",
      description: "We'll notify the tenant right away.",
    });
    
    return true;
  } catch (error) {
    console.error("Error sending invitation:", error);
    toast.toast({
      title: "Error",
      description: "Failed to send invitation.",
      variant: "destructive",
    });
    return false;
  }
};
