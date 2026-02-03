-- [CRITICAL FIX] Resolve RLS Infinite Recursion
-- The previous optimization introduced a recursive loop on the 'users' table.
-- We solve this by using a SECURITY DEFINER function to check the admin role.

-- 1. Create a secure helper function to check admin status
-- This bypasses RLS for the internal check, preventing recursion.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$;

-- 2. Drop current problematic policies
DROP POLICY IF EXISTS "Enable select for users and admins" ON public.users;
DROP POLICY IF EXISTS "Enable update for users and admins" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

DROP POLICY IF EXISTS "Admins can manage lessons" ON public.lessons;
DROP POLICY IF EXISTS "Admins can update lessons" ON public.lessons;
DROP POLICY IF EXISTS "Admins can delete lessons" ON public.lessons;
DROP POLICY IF EXISTS "Only admins can insert lessons" ON public.lessons;

DROP POLICY IF EXISTS "Enable select for users and admins" ON public.user_progress;
DROP POLICY IF EXISTS "Admins can view all progress" ON public.user_progress;

-- 3. RE-CREATE POLICIES USING THE HELPER FUNCTION

-- USERS Table
CREATE POLICY "Enable select for users and admins"
  ON public.users FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id OR is_admin());

CREATE POLICY "Enable update for users and admins"
  ON public.users FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id OR is_admin());

-- LESSONS Table
CREATE POLICY "Admins can manage lessons"
  ON public.lessons FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- USER_PROGRESS Table
CREATE POLICY "Enable select for users and admins"
  ON public.user_progress FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR is_admin());
