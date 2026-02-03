-- [FINAL PERFORMANCE TUNING] Eliminate RLS Policy Overlaps
-- Resolves Supabase Advisor Warning: multiple_permissive_policies
-- Specifically removes overlaps caused by 'FOR ALL' policies that include SELECT.

-- 1. LESSONS TABLE: Separate SELECT from Admin Management
DROP POLICY IF EXISTS "Admins can manage lessons" ON public.lessons;

-- Use FOR INSERT, UPDATE, DELETE instead of FOR ALL to avoid SELECT overlap
CREATE POLICY "Admins can manage lessons"
  ON public.lessons FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM public.users WHERE id = (SELECT auth.uid())) = 'admin');

CREATE POLICY "Admins can update lessons"
  ON public.lessons FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM public.users WHERE id = (SELECT auth.uid())) = 'admin')
  WITH CHECK ((SELECT role FROM public.users WHERE id = (SELECT auth.uid())) = 'admin');

CREATE POLICY "Admins can delete lessons"
  ON public.lessons FOR DELETE
  TO authenticated
  USING ((SELECT role FROM public.users WHERE id = (SELECT auth.uid())) = 'admin');

-- 2. USER_PROGRESS TABLE: Separate SELECT from User Management
DROP POLICY IF EXISTS "Enable manage for users" ON public.user_progress;

-- User management for INSERT, UPDATE, DELETE only
CREATE POLICY "Enable insert for users"
  ON public.user_progress FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Enable update for users"
  ON public.user_progress FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Enable delete for users"
  ON public.user_progress FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);
