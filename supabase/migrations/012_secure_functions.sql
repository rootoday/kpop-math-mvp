-- [SECURITY FIX] Set search_path for database functions
-- Prevents Search Path Hijacking (Supabase Advisor Warning: function_search_path_mutable)

-- 1. Fix update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 2. Fix increment_user_xp
CREATE OR REPLACE FUNCTION public.increment_user_xp(user_id UUID, xp_amount INTEGER)
RETURNS void 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET xp_points = xp_points + xp_amount,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$;
