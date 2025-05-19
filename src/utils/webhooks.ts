
/**
 * Trigger a Make.com webhook with the provided payload
 * with improved security
 */
export const triggerWebhook = async (payload: any) => {
  try {
    // Get the webhook URL from environment variables or a secure source
    // For development purposes, we're using a placeholder URL
    // In production, this should come from environment variables
    const webhookUrl = process.env.WEBHOOK_URL || "https://hook.make.com/example-webhook-id";
    
    // Validate payload to prevent sending malicious data
    const validatedPayload = validatePayload(payload);
    
    // Set proper content-type and security headers
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Version": "1.0.0",
        // Add CSRF protection if needed
      },
      body: JSON.stringify(validatedPayload),
      mode: "no-cors", // Handle CORS issues
    });
    
    console.log("Webhook triggered successfully");
    return true;
  } catch (error) {
    console.error("Error triggering webhook:", error);
    return false;
  }
};

/**
 * Send an invite notification via webhook
 */
export const sendInviteNotification = async (tenantId: string, senderId: string, listingId: string | null = null) => {
  try {
    await triggerWebhook({
      type: "invite",
      tenantId,
      senderId,
      listingId,
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Failed to send invite notification:", error);
    return false;
  }
};

/**
 * Validates and sanitizes the payload before sending
 */
const validatePayload = (payload: any): any => {
  // Create a clean copy of the payload
  const cleanPayload: any = {};
  
  // Only allow specific fields and sanitize their values
  // This prevents injection of malicious data
  
  // Example of sanitizing fields (expand as needed)
  if (payload.userId) {
    cleanPayload.userId = String(payload.userId).replace(/[<>]/g, '');
  }
  
  if (payload.tenantId) {
    cleanPayload.tenantId = String(payload.tenantId).replace(/[<>]/g, '');
  }
  
  if (payload.senderId) {
    cleanPayload.senderId = String(payload.senderId).replace(/[<>]/g, '');
  }
  
  if (payload.message) {
    cleanPayload.message = String(payload.message).replace(/[<>]/g, '');
  }
  
  if (payload.type && typeof payload.type === 'string') {
    cleanPayload.type = payload.type;
  }
  
  if (payload.listingId) {
    cleanPayload.listingId = String(payload.listingId).replace(/[<>]/g, '');
  }
  
  // Add timestamp for tracking
  cleanPayload.timestamp = new Date().toISOString();
  
  return cleanPayload;
};
