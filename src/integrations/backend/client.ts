import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { BACKEND_PUBLISHABLE_KEY, BACKEND_URL } from "./config";

// Export name kept as `supabase` so existing app code stays unchanged.
export const supabase = createClient<Database>(BACKEND_URL, BACKEND_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
