-- [DEFINITIVE RLS OPTIMIZATION] Performance + Security + Recursion Fix
-- Merges best practices: (SELECT auth.uid()) optimization, is_admin() helper, and action splitting.

-- 1. DROP ALL PREVIOUS POLICIES (Users)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Enable select for users and admins" ON public.users;
DROP POLICY IF EXISTS "Enable update for users and admins" ON public.users;
DROP POLICY IF EXISTS "Enable insert for owners only" ON public.users;

-- 2. DROP ALL PREVIOUS POLICIES (Lessons)
DROP POLICY IF EXISTS "Anyone can view lessons" ON public.lessons;
DROP POLICY IF EXISTS "Only admins can insert lessons" ON public.lessons;
DROP POLICY IF EXISTS "Only admins can update lessons" ON public.lessons;
DROP POLICY IF EXISTS "Admins can manage all lessons" ON public.lessons;
DROP POLICY IF EXISTS "Lessons are viewable by everyone" ON public.lessons;
DROP POLICY IF EXISTS "Admins can manage lessons" ON public.lessons;
DROP POLICY IF EXISTS "Admins can update lessons" ON public.lessons;
DROP POLICY IF EXISTS "Admins can delete lessons" ON public.lessons;

-- 3. DROP ALL PREVIOUS POLICIES (User Progress)
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Admins can view all progress" ON public.user_progress;
DROP POLICY IF EXISTS "Enable select for users and admins" ON public.user_progress;
DROP POLICY IF EXISTS "Enable manage for users" ON public.user_progress;
DROP POLICY IF EXISTS "Enable insert for users" ON public.user_progress;
DROP POLICY IF EXISTS "Enable update for users" ON public.user_progress;
DROP POLICY IF EXISTS "Enable delete for users" ON public.user_progress;


-- 4. RE-CREATE CLEAN, OPTIMIZED POLICIES

-- USERS Table
CREATE POLICY "Users and admins can view profiles"
  ON public.users FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id OR is_admin());

CREATE POLICY "Users and admins can update profiles"
  ON public.users FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id OR is_admin());

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

-- LESSONS Table
CREATE POLICY "Public lessons are viewable"
  ON public.lessons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert lessons"
  ON public.lessons FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update lessons"
  ON public.lessons FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete lessons"
  ON public.lessons FOR DELETE
  TO authenticated
  USING (is_admin());

-- USER_PROGRESS Table
CREATE POLICY "Users and admins can view progress"
  ON public.user_progress FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR is_admin());

CREATE POLICY "Users can manage own progress"
  ON public.user_progress FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own progress"
  ON public.user_progress FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);
