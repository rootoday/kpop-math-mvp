-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  xp_points INTEGER DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  completed_lessons UUID[] DEFAULT '{}',
  current_streak INTEGER DEFAULT 0,
  last_login_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons table with tier_content JSONB
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  math_concept TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  tier_content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Progress table (enhanced)
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  current_tier INTEGER DEFAULT 1 CHECK (current_tier BETWEEN 1 AND 5),
  score INTEGER DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  xp_earned INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  attempts INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds
  last_accessed TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Indexes for performance
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON public.user_progress(lesson_id);
CREATE INDEX idx_user_progress_status ON public.user_progress(status);
CREATE INDEX idx_lessons_difficulty ON public.lessons(difficulty);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Example tier_content JSONB structure
COMMENT ON COLUMN public.lessons.tier_content IS 
'Example structure:
{
  "tier1": {
    "title": "Meet NewJeans!",
    "text": "Let''s learn about combining like terms with NewJeans members",
    "imageUrl": "https://example.com/newjeans.jpg",
    "duration": 45
  },
  "tier2": {
    "title": "Understanding Like Terms",
    "steps": [
      {
        "stepNumber": 1,
        "text": "Hanni appears twice: H + H = 2H",
        "animation": "fade-in"
      },
      {
        "stepNumber": 2,
        "text": "Dani also appears twice: 3H + 2D + 3H + 2D",
        "animation": "color-highlight"
      },
      {
        "stepNumber": 3,
        "text": "Combining like terms: 6H + 4D",
        "animation": "merge"
      }
    ],
    "duration": 90
  },
  "tier3": {
    "questionText": "Which is simplified? 3H + 2D + 3H + 2D = ?",
    "questionType": "multiple_choice",
    "options": [
      { "id": "a", "text": "3H + 2D", "isCorrect": false },
      { "id": "b", "text": "6H + 4D", "isCorrect": true },
      { "id": "c", "text": "9H + 6D", "isCorrect": false },
      { "id": "d", "text": "5H + 3D", "isCorrect": false }
    ],
    "xpReward": 10,
    "hint": "Count all H terms together and all D terms together"
  },
  "tier4": {
    "questionText": "Simplify: 2x + 5y + 3x + y = ?",
    "questionType": "fill_in_blank",
    "correctAnswer": "5x + 6y",
    "acceptableAnswers": ["5x+6y", "6y+5x", "6y + 5x"],
    "inputType": "text",
    "xpReward": 15,
    "hint": "Combine x terms: 2x + 3x, then y terms: 5y + y"
  },
  "tier5": {
    "congratsText": "🎉 You completed this lesson!",
    "summaryText": "You learned how to combine like terms using NewJeans members as variables!",
    "totalXpReward": 50,
    "badgeEarned": null,
    "nextLessonId": null,
    "celebrationAnimation": "confetti"
  }
}';
