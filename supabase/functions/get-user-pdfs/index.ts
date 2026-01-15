import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { isProProduct, isOneTimeProduct } from "../_shared/stripe-config.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function verifyPremium(email: string, stripe: Stripe): Promise<boolean> {
  const customers = await stripe.customers.list({ email, limit: 1 });
  if (customers.data.length === 0) return false;

  const customerId = customers.data[0].id;

  // Check for Pro subscriptions
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 10,
  });

  for (const sub of subscriptions.data) {
    const productId = sub.items.data[0]?.price?.product;
    if (isProProduct(productId as string)) return true;
  }

  // Check for one-time purchases
  const sessions = await stripe.checkout.sessions.list({
    customer: customerId,
    status: "complete",
    limit: 100,
  });

  for (const session of sessions.data) {
    if (session.mode === "payment") {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      for (const item of lineItems.data) {
        if (item.price?.id) {
          const price = await stripe.prices.retrieve(item.price.id);
          if (isOneTimeProduct(price.product as string)) return true;
        }
      }
    }
  }

  return false;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !userData.user?.email) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify premium status
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const isPremium = await verifyPremium(userData.user.email, stripe);
    if (!isPremium) {
      return new Response(
        JSON.stringify({ error: "Premium subscription required", pdfs: [], hasAccess: false }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // List files in user's folder
    const userFolder = `${userData.user.id}/`;
    const { data: files, error: listError } = await supabaseAdmin
      .storage
      .from("salary-reports")
      .list(userData.user.id, {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (listError) {
      console.error("Error listing files:", listError);
      return new Response(
        JSON.stringify({ error: "Failed to list files" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate signed URLs for each file
    const pdfsWithUrls = await Promise.all(
      (files || []).map(async (file) => {
        const filePath = `${userData.user.id}/${file.name}`;
        const { data: signedUrl } = await supabaseAdmin
          .storage
          .from("salary-reports")
          .createSignedUrl(filePath, 3600); // 1 hour expiry

        // Extract job title and timestamp from filename
        // Format: {timestamp}-{job-title}.html
        const nameParts = file.name.replace(".html", "").split("-");
        const timestamp = parseInt(nameParts[0]);
        const jobTitle = nameParts.slice(1).join(" ").replace(/-/g, " ");

        return {
          name: file.name,
          path: filePath,
          url: signedUrl?.signedUrl || null,
          jobTitle: jobTitle || "Salary Report",
          createdAt: timestamp ? new Date(timestamp).toISOString() : file.created_at,
          size: file.metadata?.size || 0,
        };
      })
    );

    return new Response(
      JSON.stringify({ pdfs: pdfsWithUrls, hasAccess: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("get-user-pdfs error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
