SPEC.md
# K-POP Math MVP - Project Specification

## 프로젝트 개요
K-pop 아이돌을 주제로 한 대수학(다항식) 교육 플랫폼
- 5단계 Tier 학습 구조 (Hook → Concept → Practice → Deep → Wrap-up)
- NewJeans 중심 초기 콘텐츠
- 게임화: XP, 배지, 스트릭

## Tech Stack
- Frontend: React 18 + TypeScript + Tailwind CSS
- Backend: Supabase (PostgreSQL + Auth)
- Deployment: Vercel
- AI: Claude API (콘텐츠 생성)
- TTS: ElevenLabs API (음성)

## 데이터 모델

### Users
- email (unique)
- firstName, lastName
- xpPoints (default 0)
- badges: string[]
- completedLessons: lesson_id[]
- currentStreak (days)
- createdAt

### Lessons
- id, title, artist
- mathConcept (string)
- difficulty (beginner/intermediate/advanced)
- tierContent: {
    tier1: { title, text, imageUrl },
    tier2: { ... 3단계 },
    tier3: { questionText, options[], correct },
    tier4: { questionText, inputType },
    tier5: { congratsText, xpReward }
  }

### UserProgress
- userId, lessonId
- currentTier (1-5)
- score (0-100)
- xpEarned
- status (not_started/in_progress/completed)
- startedAt, completedAt

## 페이지 구조

1. **Landing** (public)
   - Hero: "Learn Math with Your Favorite K-pop Stars"
   - 3 Feature Cards: Learn Through Music | Interactive | Earn Badges
   - CTA: "Start Learning Free"

2. **Sign Up / Login** (public)
   - Email + Password + Name fields
   - Form validation
   - Redirect to Dashboard on success

3. **Dashboard** (logged-in)
   - User stats: XP, Lessons (3/50), Streak, Badges
   - Lessons Grid: 12개 카드
   - Each card: title, artist, difficulty, status, button

4. **Lesson Page** (logged-in)
   - Header: Back btn, Title, Progress (Tier 1/5)
   - Tier 1-5 Content (조건부)
   - Navigation: Next/Previous buttons
   - Sidebar: Lesson outline

5. **Admin** (optional phase 2)
   - Form: "Generate Lesson Script"
   - Input: concept + artist
   - Output: 5-tier script from Claude API

## 색상 팔레트
- Primary: #9B59B6 (K-pop Purple)
- Secondary: #E60031 (K-pop Red)
- Accent: #1DB954 (Music Green)
- Background: #F5F5F5
- Text: #1A1A1A

## 첫 번째 Lesson: NewJeans - Polynomial Simplification

### Tier 1 (Hook - 45초)
- Image: NewJeans 5명 사진
- Overlay text: "Hanni (3) + Dani (2)"
- Question: "What if we could group them?"

### Tier 2 (Concept - 90초, 3 steps)
- Step 1: "Hanni appears twice" → H + H = 2H
- Step 2: "Dani also appears twice" → 3H + 2D + 3H + 2D (color animation)
- Step 3: "Combining like terms!" → 6H + 4D

### Tier 3 (Practice - Multiple Choice)
- Q: "Which is simplified? 3H + 2D + 3H + 2D = ?"
- Options: 3H+2D, 6H+4D ✓, 9H+6D, others
- Correct answer +10 XP

### Tier 4 (Deep - Fill in Blank)
- Q: "Simplify: 2x + 5y + 3x + y = ?"
- Input field (text)
- Correct: "5x + 6y" → +15 XP

### Tier 5 (Wrap-up - Celebration)
- Confetti animation
- "🎉 You completed this lesson!"
- Score: 90/100 | Time: 7:45 | XP: +50
- Badge check (if completed 3 lessons → "Rookie Mathematician")

## 성공 기준
- ✅ Landing page loads < 2s
- ✅ Authentication works
- ✅ Dashboard shows user stats
- ✅ Lesson Tier 1-5 interactive
- ✅ XP award on correct answer
- ✅ Mobile responsive (all pages)
- ✅ Badge system working
