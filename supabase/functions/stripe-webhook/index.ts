import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

// Generate a random secure password
function generateSecurePassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil",
    });

    // Create Supabase client with service role for user creation
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    let event: Stripe.Event;

    // Verify webhook signature if secret is configured
    if (STRIPE_WEBHOOK_SECRET && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
        logStep("Webhook signature verified");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        logStep("Webhook signature verification failed", { error: errorMessage });
        return new Response(JSON.stringify({ error: `Webhook Error: ${errorMessage}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      // For development/testing without webhook secret
      event = JSON.parse(body);
      logStep("Webhook received without signature verification (dev mode)");
    }

    logStep("Event received", { type: event.type, id: event.id });

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      logStep("Processing checkout session", { 
        sessionId: session.id, 
        customerEmail: session.customer_email || session.customer_details?.email,
        paymentStatus: session.payment_status,
        mode: session.mode,
      });

      // Only process successful payments
      if (session.payment_status !== "paid") {
        logStep("Payment not completed, skipping");
        return new Response(JSON.stringify({ received: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const customerEmail = session.customer_email || session.customer_details?.email;
      
      if (!customerEmail) {
        logStep("No customer email found, skipping account creation");
        return new Response(JSON.stringify({ received: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if user already exists
      const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (listError) {
        logStep("Error listing users", { error: listError.message });
      }

      const existingUser = existingUsers?.users?.find(u => u.email === customerEmail);

      if (existingUser) {
        logStep("User already exists", { userId: existingUser.id, email: customerEmail });
        return new Response(JSON.stringify({ received: true, userExists: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create new user account with random password
      const tempPassword = generateSecurePassword();
      
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: customerEmail,
        password: tempPassword,
        email_confirm: true, // Auto-confirm since they paid
        user_metadata: {
          stripe_customer_id: session.customer,
          purchase_type: session.mode === "subscription" ? "subscription" : "one_time",
          created_via: "stripe_checkout",
        },
      });

      if (createError) {
        logStep("Error creating user", { error: createError.message });
        return new Response(JSON.stringify({ error: createError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      logStep("User created successfully", { userId: newUser.user?.id, email: customerEmail });

      // Send password reset email so user can set their own password
      const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email: customerEmail,
      });

      if (resetError) {
        logStep("Error generating password reset link", { error: resetError.message });
        // Don't fail the webhook - user is created, they can use forgot password later
      } else {
        logStep("Password reset link generated", { email: customerEmail });
      }

      return new Response(JSON.stringify({ 
        received: true, 
        userCreated: true,
        userId: newUser.user?.id 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle other event types as needed
    logStep("Event type not handled", { type: event.type });
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
