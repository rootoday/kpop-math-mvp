-- 024_fix_admin_update.sql

-- Ensure is_admin() exists and is SECURITY DEFINER to bypass RLS recursion/restrictions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- Ensure the Update Policy uses this function correctly
DROP POLICY IF EXISTS "Admins can update lessons" ON public.lessons;

CREATE POLICY "Admins can update lessons"
  ON public.lessons FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Also ensure Insert Policy is correct
DROP POLICY IF EXISTS "Admins can insert lessons" ON public.lessons;

CREATE POLICY "Admins can insert lessons"
  ON public.lessons FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());
