-- Add is_published column to lessons table
ALTER TABLE public.lessons 
ADD COLUMN is_published BOOLEAN DEFAULT false;

-- Update RLS if necessary? 
-- Current RLS:
-- "Public lessons are viewable" -> USING (true)
-- We might want to change this later to USING (is_published = true OR is_admin())
-- But for now, I will just add the column.
