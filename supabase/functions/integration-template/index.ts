
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid authentication');
    }

    // Parse request body
    const requestBody: IntegrationRequest = await req.json();
    const { action, data, config } = requestBody;

    console.log(`Integration request from user ${user.id}: ${action}`);

    // Record usage start time
    const startTime = Date.now();
    let response: IntegrationResponse;

    // Handle different integration actions
    switch (action) {
      case 'test_connection':
        response = await testConnection(config);
        break;
      case 'verify_license':
        response = await verifyLicense(data, config);
        break;
      case 'sync_data':
        response = await syncData(data, config);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Log usage statistics
    await logUsageStats(supabase, user.id, action, response.success, responseTime);

    // Log audit trail
    await logAuditTrail(supabase, user.id, action, {
      success: response.success,
      response_time: responseTime,
      data_size: JSON.stringify(response.data || {}).length
    });

    return new Response(
      JSON.stringify({
        ...response,
        usage: {
          requests: 1,
          response_time: responseTime
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.success ? 200 : 400
      }
    );

  } catch (error) {
    console.error('Integration error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

async function testConnection(config?: Record<string, any>): Promise<IntegrationResponse> {
  // Simulate API connection test
  console.log('Testing connection with config:', config);
  
  // Add actual API connection logic here
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
  
  return {
    success: true,
    data: {
      status: 'connected',
      timestamp: new Date().toISOString()
    }
  };
}

async function verifyLicense(data: any, config?: Record<string, any>): Promise<IntegrationResponse> {
  console.log('Verifying license:', data);
  
  // Add actual license verification logic here
  const { license_number, state } = data;
  
  if (!license_number || !state) {
    return {
      success: false,
      error: 'License number and state are required'
    };
  }
  
  // Simulate API call to license verification service
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    data: {
      license_number,
      state,
      status: 'active',
      expiration_date: '2025-12-31',
      verified_at: new Date().toISOString()
    }
  };
}

async function syncData(data: any, config?: Record<string, any>): Promise<IntegrationResponse> {
  console.log('Syncing data:', data);
  
  // Add actual data sync logic here
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    success: true,
    data: {
      synced_records: 25,
      sync_timestamp: new Date().toISOString()
    }
  };
}

async function logUsageStats(
  supabase: any,
  userId: string,
  endpoint: string,
  success: boolean,
  responseTime: number
) {
  const integrationId = 'template-integration-id'; // This should be dynamic based on the integration
  
  try {
    await supabase
      .from('integration_usage')
      .insert({
        integration_id: integrationId,
        user_id: userId,
        endpoint,
        request_count: 1,
        success_count: success ? 1 : 0,
        error_count: success ? 0 : 1,
        avg_response_time: responseTime,
        date: new Date().toISOString().split('T')[0]
      });
  } catch (error) {
    console.error('Failed to log usage stats:', error);
  }
}

async function logAuditTrail(
  supabase: any,
  userId: string,
  action: string,
  details: Record<string, any>
) {
  const integrationId = 'template-integration-id'; // This should be dynamic based on the integration
  
  try {
    await supabase
      .from('integration_audit_log')
      .insert({
        integration_id: integrationId,
        action,
        performed_by: userId,
        details
      });
  } catch (error) {
    console.error('Failed to log audit trail:', error);
  }
}
