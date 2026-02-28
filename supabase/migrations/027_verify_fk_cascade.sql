-- [DIAGNOSTIC] Verify FK + ON DELETE CASCADE between user_progress and lessons
-- This migration is a no-op (does not modify the schema).
-- Run these queries manually in Supabase SQL Editor to verify data integrity.

-- ----------------------------------------------------------------------------
-- 1. Verify FK constraint exists and has ON DELETE CASCADE
--    Expected: confdeltype = 'c' (CASCADE)
-- ----------------------------------------------------------------------------
-- SELECT conname, contype, confdeltype
-- FROM pg_constraint
-- WHERE conrelid = 'public.user_progress'::regclass
--   AND contype = 'f';

-- ----------------------------------------------------------------------------
-- 2. Find orphan rows in user_progress (lesson_id points to a deleted lesson)
--    Expected: 0 rows (FK CASCADE should prevent orphans)
-- ----------------------------------------------------------------------------
-- SELECT up.id, up.user_id, up.lesson_id, up.updated_at
-- FROM public.user_progress up
-- LEFT JOIN public.lessons l ON l.id = up.lesson_id
-- WHERE l.id IS NULL;

-- ----------------------------------------------------------------------------
-- 3. If orphans are found, clean them up with:
-- ----------------------------------------------------------------------------
-- DELETE FROM public.user_progress
-- WHERE lesson_id NOT IN (SELECT id FROM public.lessons);

-- Note: The FK (ON DELETE CASCADE) was defined in migration 001_initial_schema.sql.
-- If orphans exist, it means the FK was not applied to the actual DB (e.g. Supabase
-- project was reset or created before the migration ran). Run the cleanup above and
-- verify via query 2 again.
