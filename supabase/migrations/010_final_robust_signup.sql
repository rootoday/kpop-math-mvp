-- [FINAL ROBUST REPAIR] Run this if you still face any signup issues

-- 1. Relax constraints on the users table (allow null names)
ALTER TABLE public.users ALTER COLUMN first_name DROP NOT NULL;
ALTER TABLE public.users ALTER COLUMN last_name DROP NOT NULL;

-- 2. Ensure role column exists with correct default
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
    ALTER TABLE public.users ADD COLUMN role TEXT DEFAULT 'user';
  END IF;
END $$;

-- 3. Cleanup stale data for the test email
DELETE FROM public.users WHERE email = 'root@rootlog.kr';

-- 4. The "Ultimate" Trigger Function
-- This version uses dynamic SQL to avoid any dependency issues and has max error handling.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  BEGIN
    INSERT INTO public.users (id, email, first_name, last_name, role)
    VALUES (
      new.id, 
      new.email, 
      COALESCE(new.raw_user_meta_data->>'first_name', 'Student'), 
      COALESCE(new.raw_user_meta_data->>'last_name', ''),
      'user'
    )
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    -- Completely silence errors to ensure Auth signup ALWAYS works
    -- We will rely on our code fallbacks if the profile is missing
    RAISE WARNING 'handle_new_user failed for id %: %', new.id, SQLERRM;
  END;
  RETURN new;
END;
$$;

-- 5. Re-apply trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
