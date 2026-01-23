-- Salary Timeline table for tracking compensation history
CREATE TABLE public.salary_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  base_salary INTEGER NOT NULL,
  bonus INTEGER DEFAULT 0,
  equity_value INTEGER DEFAULT 0,
  job_title TEXT NOT NULL,
  company TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.salary_timeline ENABLE ROW LEVEL SECURITY;

-- RLS policies for salary_timeline
CREATE POLICY "Users can view own timeline entries"
  ON public.salary_timeline FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own timeline entries"
  ON public.salary_timeline FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own timeline entries"
  ON public.salary_timeline FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own timeline entries"
  ON public.salary_timeline FOR DELETE
  USING (auth.uid() = user_id);

-- Anonymous Salaries table for community salary sharing
CREATE TABLE public.anonymous_salaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_id UUID, -- nullable for anonymity
  job_title TEXT NOT NULL,
  industry TEXT NOT NULL,
  location TEXT NOT NULL,
  years_experience INTEGER NOT NULL,
  base_salary INTEGER NOT NULL,
  bonus INTEGER DEFAULT 0,
  equity_value INTEGER DEFAULT 0,
  company_size TEXT CHECK (company_size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.anonymous_salaries ENABLE ROW LEVEL SECURITY;

-- Public read access for browsing
CREATE POLICY "Anyone can view salaries"
  ON public.anonymous_salaries FOR SELECT
  USING (true);

-- Only authenticated users can contribute
CREATE POLICY "Authenticated users can insert salaries"
  ON public.anonymous_salaries FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Referrals table for tracking referral codes and conversions
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referred_email TEXT,
  referred_user_id UUID,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'converted', 'rewarded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  converted_at TIMESTAMPTZ,
  rewarded_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Users can view their own referrals
CREATE POLICY "Users can view own referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id);

-- Users can create referrals
CREATE POLICY "Users can create referrals"
  ON public.referrals FOR INSERT
  WITH CHECK (auth.uid() = referrer_id);

-- Users can update their own referrals (for status changes via edge function)
CREATE POLICY "Users can update own referrals"
  ON public.referrals FOR UPDATE
  USING (auth.uid() = referrer_id);

-- Referral Rewards table for tracking earned rewards
CREATE TABLE public.referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('free_month')),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  applied BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

-- Users can view their own rewards
CREATE POLICY "Users can view own rewards"
  ON public.referral_rewards FOR SELECT
  USING (auth.uid() = user_id);

-- Salary contribution tracking (for limited preview access)
CREATE TABLE public.salary_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  contribution_id UUID NOT NULL REFERENCES public.anonymous_salaries(id) ON DELETE CASCADE,
  contributed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, contribution_id)
);

-- Enable RLS
ALTER TABLE public.salary_contributions ENABLE ROW LEVEL SECURITY;

-- Users can view their own contributions
CREATE POLICY "Users can view own contributions"
  ON public.salary_contributions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own contributions
CREATE POLICY "Users can insert own contributions"
  ON public.salary_contributions FOR INSERT
  WITH CHECK (auth.uid() = user_id);