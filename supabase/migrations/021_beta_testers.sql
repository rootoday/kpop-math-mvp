-- Add beta tester flag to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_beta_tester BOOLEAN DEFAULT false;

-- Add beta tester metadata (optional but useful)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS beta_enrolled_at TIMESTAMPTZ;

-- Index for quick beta tester queries
CREATE INDEX IF NOT EXISTS idx_users_beta_tester 
ON public.users(is_beta_tester) 
WHERE is_beta_tester = true;

-- Update RLS: Only beta testers can access published lessons
DROP POLICY IF EXISTS "Public lessons are viewable" ON public.lessons;
CREATE POLICY "Beta testers can view published lessons" 
ON public.lessons FOR SELECT
USING (
  is_published = true 
  AND (
    SELECT is_beta_tester FROM public.users 
    WHERE id = auth.uid()
  ) = true
);

-- Admins can still view all lessons (existing policy should remain)
-- This is already covered by "Admins can manage all lessons" policy

-- Beta testers can track their own progress
DROP POLICY IF EXISTS "Users can view their own progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON lesson_progress;

CREATE POLICY "Beta testers can view own progress" 
ON lesson_progress FOR SELECT
USING (
  auth.uid() = user_id 
  AND (SELECT is_beta_tester FROM public.users WHERE id = auth.uid()) = true
);

CREATE POLICY "Beta testers can insert own progress" 
ON lesson_progress FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND (SELECT is_beta_tester FROM public.users WHERE id = auth.uid()) = true
);

CREATE POLICY "Beta testers can update own progress" 
ON lesson_progress FOR UPDATE
USING (
  auth.uid() = user_id 
  AND (SELECT is_beta_tester FROM public.users WHERE id = auth.uid()) = true
)
WITH CHECK (
  auth.uid() = user_id 
  AND (SELECT is_beta_tester FROM public.users WHERE id = auth.uid()) = true
);

CREATE POLICY "Beta testers can delete own progress" 
ON lesson_progress FOR DELETE
USING (
  auth.uid() = user_id 
  AND (SELECT is_beta_tester FROM public.users WHERE id = auth.uid()) = true
);
