CREATE TABLE public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  current_tier integer NOT NULL DEFAULT 1 CHECK (current_tier >= 1 AND current_tier <= 5),
  completed_tiers jsonb NOT NULL DEFAULT '[]'::jsonb,
  last_accessed_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, lesson_id),
  CONSTRAINT lesson_progress_pkey PRIMARY KEY (id)
);

-- Trigger: updated_at 자동 업데이트
CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON lesson_progress
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Enable
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own progress"
  ON lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON lesson_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
  ON lesson_progress FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all progress"
  ON lesson_progress FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- Index (조회 성능 최적화)
CREATE INDEX idx_lesson_progress_user_lesson 
  ON lesson_progress(user_id, lesson_id);
CREATE INDEX idx_lesson_progress_lesson_id 
  ON lesson_progress(lesson_id);
