-- Add stripe_customer_id to profiles for reliable Stripe customer lookup
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);