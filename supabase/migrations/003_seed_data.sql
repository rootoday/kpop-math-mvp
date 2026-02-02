-- Seed data for the first lesson: NewJeans - Polynomial Simplification

INSERT INTO public.lessons (
  title,
  artist,
  math_concept,
  difficulty,
  tier_content
) VALUES (
  'Combining Like Terms with NewJeans',
  'NewJeans',
  'Polynomial Simplification - Like Terms',
  'beginner',
  '{
    "tier1": {
      "title": "Meet NewJeans!",
      "text": "NewJeans has 5 amazing members! Let''s use them to learn about combining like terms in algebra. Imagine Hanni appears 3 times and Dani appears 2 times. What if we could group them together?",
      "imageUrl": "/images/newjeans-group.jpg",
      "duration": 45
    },
    "tier2": {
      "title": "Understanding Like Terms",
      "steps": [
        {
          "stepNumber": 1,
          "text": "Hanni appears twice in our expression: H + H = 2H",
          "animation": "fade-in"
        },
        {
          "stepNumber": 2,
          "text": "Let''s look at the full expression: 3H + 2D + 3H + 2D",
          "animation": "color-highlight"
        },
        {
          "stepNumber": 3,
          "text": "Combining like terms: (3H + 3H) + (2D + 2D) = 6H + 4D",
          "animation": "merge"
        }
      ],
      "duration": 90
    },
    "tier3": {
      "questionText": "Which expression is the simplified form of: 3H + 2D + 3H + 2D = ?",
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
      "questionText": "Now try it yourself! Simplify: 2x + 5y + 3x + y = ?",
      "questionType": "fill_in_blank",
      "correctAnswer": "5x + 6y",
      "acceptableAnswers": ["5x+6y", "6y+5x", "6y + 5x", "5x + 6y"],
      "inputType": "text",
      "xpReward": 15,
      "hint": "Combine x terms: 2x + 3x = 5x, then y terms: 5y + y = 6y"
    },
    "tier5": {
      "congratsText": "🎉 You completed this lesson!",
      "summaryText": "Amazing work! You learned how to combine like terms using NewJeans members as variables. This is a fundamental skill in algebra!",
      "totalXpReward": 50,
      "badgeEarned": null,
      "nextLessonId": null,
      "celebrationAnimation": "confetti"
    }
  }'::jsonb
);
