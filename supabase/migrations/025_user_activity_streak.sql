-- [FEATURE] Track user activity for streak calculation and MAU measurement
-- Updates last_login_date and current_streak on every user activity

CREATE OR REPLACE FUNCTION public.update_user_activity(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_login DATE;
  v_today DATE := CURRENT_DATE;
BEGIN
  -- Security: Only allow updating own activity
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Forbidden: cannot modify other user activity';
  END IF;

  SELECT last_login_date::DATE INTO v_last_login
  FROM public.users WHERE id = p_user_id;

  IF v_last_login IS NOT NULL AND v_last_login = v_today THEN
    -- Already recorded activity today, no streak change needed
    RETURN;
  ELSIF v_last_login IS NOT NULL AND v_last_login = v_today - INTERVAL '1 day' THEN
    -- Consecutive day: increment streak
    UPDATE public.users
    SET current_streak = current_streak + 1,
        last_login_date = NOW(),
        updated_at = NOW()
    WHERE id = p_user_id;
  ELSE
    -- First ever login or gap in activity: reset streak to 1
    UPDATE public.users
    SET current_streak = 1,
        last_login_date = NOW(),
        updated_at = NOW()
    WHERE id = p_user_id;
  END IF;
END;
$$;
