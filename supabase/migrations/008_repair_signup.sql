-- [REPAIR SCRIPT] Run this in Supabase SQL Editor to fix signup issues

-- 1. Ensure the 'role' column exists (it might be missing if 005 was skipped)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
    ALTER TABLE public.users ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
  END IF;
END $$;

-- 2. Clean up any "orphaned" users in public.users that don't exist in auth.users
-- This handles the case where a previous signup attempt left stale data.
DELETE FROM public.users 
WHERE id NOT IN (SELECT id FROM auth.users);

-- 3. Also clear the specific email if it exists in public.users but the ID is different
-- Replace 'root@rootlog.kr' if you are testing with a different email
DELETE FROM public.users WHERE email = 'root@rootlog.kr';

-- 4. Re-create the trigger function with more robustness and explicit search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'first_name', ''), 
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name;
  RETURN new;
END;
$$;

-- 5. Re-apply the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
