
import { supabase } from "@/integrations/supabase/client";
import { triggerWebhook } from "@/utils/webhooks";

/**
 * Create an invitation record in the database
 */
export const createInviteRecord = async (
  tenantId: string,
  senderId: string,
  listingId: string,
  message: string = "I'd like to invite you to view this property."
) => {
  const { data: invite, error } = await supabase
    .from("invites")
    .insert({
      tenant_id: tenantId,
      sender_id: senderId,
      listing_id: listingId,
      message,
      status: "pending"
    })
    .select('id')
    .single();

  if (error) throw error;
  return invite;
};

/**
 * Send invitation to tenant
 */
export const sendInviteToTenant = async (
  tenantId: string, 
  userId: string, 
  listingId: string,
  toast: (props: { title: string; description: string; variant?: "default" | "destructive" }) => void
) => {
  try {
    // 1. Create invite record in the database
    await createInviteRecord(tenantId, userId, listingId);
    
    // 2. Trigger Make.com webhook with required payload
    const webhookPayload = {
      tenant_id: tenantId,
      sender_id: userId,
      listing_id: listingId,
      timestamp: new Date().toISOString()
    };
    
    await triggerWebhook(webhookPayload);

    toast({
      title: "Invitation sent!",
      description: "We'll notify the tenant right away.",
    });
    
    return true;
  } catch (error) {
    console.error("Error sending invitation:", error);
    toast({
      title: "Error",
      description: "Failed to send invitation.",
      variant: "destructive",
    });
    return false;
  }
};
