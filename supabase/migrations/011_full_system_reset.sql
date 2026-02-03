-- [FULL SYSTEM RESET] run this in Supabase SQL Editor

-- 1. Ensure Table Structure & Role Column
DO $$ 
BEGIN 
  -- Users table check
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    CREATE TABLE public.users (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT UNIQUE NOT NULL,
      first_name TEXT,
      last_name TEXT,
      xp_points INTEGER DEFAULT 0,
      badges TEXT[] DEFAULT '{}',
      completed_lessons UUID[] DEFAULT '{}',
      current_streak INTEGER DEFAULT 0,
      last_login_date TIMESTAMPTZ,
      role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  ELSE
    -- Add role column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
      ALTER TABLE public.users ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
    END IF;
    -- Make names nullable for resilience
    ALTER TABLE public.users ALTER COLUMN first_name DROP NOT NULL;
    ALTER TABLE public.users ALTER COLUMN last_name DROP NOT NULL;
  END IF;
END $$;

-- 2. Clean up any orphaned data
DELETE FROM public.users WHERE id NOT IN (SELECT id FROM auth.users);

-- 3. Robust Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
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
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user failed for id %: %', new.id, SQLERRM;
  END;
  RETURN new;
END;
$$;

-- 4. Re-apply Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Helper Procedure for Promotion
-- Run this later: UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';
