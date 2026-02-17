-- [SECURITY FIX] Add caller validation to increment_user_xp
-- Prevents users from giving arbitrary XP to themselves or others

CREATE OR REPLACE FUNCTION public.increment_user_xp(user_id UUID, xp_amount INTEGER)
RETURNS void 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Security: Only allow incrementing own XP
  IF user_id != auth.uid() THEN
    RAISE EXCEPTION 'Forbidden: cannot modify other user XP';
  END IF;

  -- Security: Prevent negative or excessive XP increments
  IF xp_amount <= 0 OR xp_amount > 1000 THEN
    RAISE EXCEPTION 'Invalid XP amount: must be between 1 and 1000';
  END IF;

  UPDATE public.users
  SET xp_points = xp_points + xp_amount,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$;
