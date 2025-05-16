
/**
 * Trigger a Make.com webhook with the provided payload
 */
export const triggerWebhook = async (payload: any) => {
  try {
    const webhookUrl = "https://hook.make.com/example-webhook-id";
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      mode: "no-cors", // Handle CORS issues
    });
    
    console.log("Webhook triggered successfully");
    return true;
  } catch (error) {
    console.error("Error triggering webhook:", error);
    return false;
  }
};
