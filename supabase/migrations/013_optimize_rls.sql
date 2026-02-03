-- [PERFORMANCE OPTIMIZATION] Optimize RLS Policy Evaluation
-- Resolve Supabase Advisor Warning: auth_rls_initplan
-- Replaces auth.uid() with (select auth.uid()) to prevent per-row re-evaluation

-- 1. Drop existing policies to be updated
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

DROP POLICY IF EXISTS "Only admins can insert lessons" ON public.lessons;
DROP POLICY IF EXISTS "Only admins can update lessons" ON public.lessons;
DROP POLICY IF EXISTS "Admins can manage all lessons" ON public.lessons;

DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Admins can view all progress" ON public.user_progress;

-- 2. Re-create optimized User policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = (SELECT auth.uid())) = 'admin'
  );

CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING (
    (SELECT role FROM public.users WHERE id = (SELECT auth.uid())) = 'admin'
  );

-- 3. Re-create optimized Lesson policies
CREATE POLICY "Only admins can insert lessons"
  ON public.lessons FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update lessons"
  ON public.lessons FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all lessons" ON public.lessons
  FOR ALL USING (
    (SELECT role FROM public.users WHERE id = (SELECT auth.uid())) = 'admin'
  );

-- 4. Re-create optimized Progress policies
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own progress"
  ON public.user_progress FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admins can view all progress" ON public.user_progress
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = (SELECT auth.uid())) = 'admin'
  );
