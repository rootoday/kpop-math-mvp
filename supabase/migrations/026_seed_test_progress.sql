-- [DATA BACKFILL] Seed completed lesson progress for existing users
-- Ensures test accounts have XP, streak, and progress data visible in Admin
-- Safe: uses ON CONFLICT DO NOTHING to protect existing data

-- Step 1: Insert completed progress for each user × lesson combination
-- Uses dynamic subqueries since IDs are auto-generated UUIDs
INSERT INTO public.user_progress (
  user_id, lesson_id, current_tier, score, xp_earned,
  status, attempts, time_spent, last_accessed, started_at, completed_at
)
SELECT
  u.id,
  l.id,
  5,                          -- completed all tiers
  80,                         -- score out of 100
  CASE
    WHEN l.title = 'Combining Like Terms with NewJeans' THEN 75   -- 10 + 15 + 50
    WHEN l.title = 'Geometry Basics with IVE' THEN 85             -- 10 + 15 + 60
    WHEN l.title = 'Linear Equations with LE SSERAFIM' THEN 115   -- 15 + 20 + 80
    ELSE 50  -- fallback for any other lessons
  END,
  'completed',
  1,                          -- 1 attempt
  120,                        -- 2 minutes spent
  NOW(),
  NOW() - INTERVAL '1 hour',
  NOW()
FROM public.users u
CROSS JOIN public.lessons l
WHERE l.title IN (
  'Combining Like Terms with NewJeans',
  'Geometry Basics with IVE',
  'Linear Equations with LE SSERAFIM'
)
ON CONFLICT (user_id, lesson_id) DO NOTHING;

-- Step 2: Backfill users.xp_points from user_progress totals
UPDATE public.users u
SET xp_points = sub.total_xp,
    updated_at = NOW()
FROM (
  SELECT user_id, SUM(xp_earned) AS total_xp
  FROM public.user_progress
  WHERE status = 'completed'
  GROUP BY user_id
) sub
WHERE u.id = sub.user_id
  AND sub.total_xp > 0;

-- Step 3: Set last_login_date and streak for MAU tracking
UPDATE public.users
SET last_login_date = NOW(),
    current_streak = 1,
    updated_at = NOW()
WHERE last_login_date IS NULL;
