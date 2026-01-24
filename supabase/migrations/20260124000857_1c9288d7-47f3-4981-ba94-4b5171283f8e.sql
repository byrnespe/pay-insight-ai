-- Remove the contributor_id column from anonymous_salaries to ensure true anonymity
-- Contributions are already tracked via the salary_contributions table
ALTER TABLE public.anonymous_salaries DROP COLUMN IF EXISTS contributor_id;