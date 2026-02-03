-- [PERFORMANCE & CLEANUP] Consolidate RLS Policies
-- Resolves Supabase Advisor Warning: multiple_permissive_policies
-- Merges overlapping policies for the same roles and actions to reduce evaluation overhead

-- 1. CLEANUP: Drop all existing overlapping policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

DROP POLICY IF EXISTS "Anyone can view lessons" ON public.lessons;
DROP POLICY IF EXISTS "Only admins can insert lessons" ON public.lessons;
DROP POLICY IF EXISTS "Only admins can update lessons" ON public.lessons;
DROP POLICY IF EXISTS "Admins can manage all lessons" ON public.lessons;

DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Admins can view all progress" ON public.user_progress;

-- 2. USERS TABLE: Consolidated Policies
-- Combined: Personal access + Admin global access
CREATE POLICY "Enable select for users and admins"
  ON public.users FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = id 
    OR 
    (SELECT role FROM public.users WHERE id = (SELECT auth.uid())) = 'admin'
  );

CREATE POLICY "Enable update for users and admins"
  ON public.users FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.uid()) = id 
    OR 
    (SELECT role FROM public.users WHERE id = (SELECT auth.uid())) = 'admin'
  );

-- Profile creation is strictly for the owner (triggered by auth)
CREATE POLICY "Enable insert for owners only"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

-- 3. LESSONS TABLE: Simplified Policies
-- Everyone can view, but only admins can modify
CREATE POLICY "Lessons are viewable by everyone"
  ON public.lessons FOR SELECT
  TO authenticated
  USING (true);

-- Combine INSERT, UPDATE, DELETE for admins
CREATE POLICY "Admins can manage lessons"
  ON public.lessons FOR ALL
  TO authenticated
  USING ((SELECT role FROM public.users WHERE id = (SELECT auth.uid())) = 'admin')
  WITH CHECK ((SELECT role FROM public.users WHERE id = (SELECT auth.uid())) = 'admin');

-- 4. USER_PROGRESS TABLE: Consolidated Policies
-- Combined: Personal access + Admin global access
CREATE POLICY "Enable select for users and admins"
  ON public.user_progress FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = user_id 
    OR 
    (SELECT role FROM public.users WHERE id = (SELECT auth.uid())) = 'admin'
  );

CREATE POLICY "Enable manage for users"
  ON public.user_progress FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);
-- Note: If admins need to modify progress, add the admin check to 'Enable manage for users'
-- or leave as is to keep progress strictly personal.
