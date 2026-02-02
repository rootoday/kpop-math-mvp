-- Lesson 2: Geometry Basics with IVE
INSERT INTO public.lessons (title, artist, math_concept, difficulty, tier_content)
VALUES (
  'Geometry Basics with IVE',
  'IVE',
  'Points, Lines, and Angles',
  'beginner',
  '{
    "tier1": {
      "title": "Welcome to IVE Island!",
      "text": "Let''s explore geometry with Wonyoung and the IVE members. We will learn about points, lines, and angles while preparing for their NEXT concert!",
      "imageUrl": "https://example.com/ive.jpg",
      "duration": 45
    },
    "tier2": {
      "title": "Point and Line Dance",
      "steps": [
        {
          "stepNumber": 1,
          "text": "A Point is a specific location. Imagine Wonyoung standing at center stage.",
          "animation": "point-appear"
        },
        {
          "stepNumber": 2,
          "text": "A Line connects two points. Imagine the laser lights connecting the members!",
          "animation": "line-draw"
        },
        {
          "stepNumber": 3,
          "text": "An Angle is formed where two lines meet. Watch how their arms form 90-degree angles in the choreography!",
          "animation": "angle-reveal"
        }
      ],
      "duration": 90
    },
    "tier3": {
      "questionText": "What is formed when two lines meet at a common point?",
      "questionType": "multiple_choice",
      "options": [
        { "id": "a", "text": "A Square", "isCorrect": false },
        { "id": "b", "text": "An Angle", "isCorrect": true },
        { "id": "c", "text": "A Circle", "isCorrect": false },
        { "id": "d", "text": "A Triangle", "isCorrect": false }
      ],
      "xpReward": 15,
      "hint": "Think about the shape made by two dance lines meeting."
    },
    "tier4": {
      "questionText": "How many degrees are in a Right Angle?",
      "questionType": "fill_in_blank",
      "correctAnswer": "90",
      "acceptableAnswers": ["90", "90 degrees", "ninety"],
      "inputType": "text",
      "xpReward": 20,
      "hint": "It''s the corner of a square."
    },
    "tier5": {
      "congratsText": "🌟 Geometry Master with IVE!",
      "summaryText": "You mastered the basics of points, lines, and angles. You''re ready for the big stage!",
      "totalXpReward": 60,
      "badgeEarned": "geometry_star",
      "nextLessonId": null,
      "celebrationAnimation": "stars"
    }
  }'::jsonb
);

-- Lesson 3: Linear Equations with LE SSERAFIM
INSERT INTO public.lessons (title, artist, math_concept, difficulty, tier_content)
VALUES (
  'Linear Equations with LE SSERAFIM',
  'LE SSERAFIM',
  'Solving for X',
  'intermediate',
  '{
    "tier1": {
      "title": "UNFORGIVEN Math Challenge",
      "text": "Join LE SSERAFIM to solve linear equations. We need to find the missing value (X) to complete the Unforgiven code!",
      "imageUrl": "https://example.com/lesserafim.jpg",
      "duration": 50
    },
    "tier2": {
      "title": "Balancing the Equation",
      "steps": [
        {
          "stepNumber": 1,
          "text": "Equations are like a scale. Whatever you do to one side, you must do to the other.",
          "animation": "balance-scale"
        },
        {
          "stepNumber": 2,
          "text": "If 2x = 10, we divide both sides by 2 to isolate X.",
          "animation": "divide-logic"
        },
        {
          "stepNumber": 3,
          "text": "X = 5! The balance is restored.",
          "animation": "success-glow"
        }
      ],
      "duration": 100
    },
    "tier3": {
      "questionText": "Solve for X: x + 7 = 15",
      "questionType": "multiple_choice",
      "options": [
        { "id": "a", "text": "X = 22", "isCorrect": false },
        { "id": "b", "text": "X = 8", "isCorrect": true },
        { "id": "c", "text": "X = 7", "isCorrect": false },
        { "id": "d", "text": "X = 15", "isCorrect": false }
      ],
      "xpReward": 20,
      "hint": "Subtract 7 from both sides."
    },
    "tier4": {
      "questionText": "Solve for X: 3x = 12",
      "questionType": "fill_in_blank",
      "correctAnswer": "4",
      "acceptableAnswers": ["4", "x=4", "x = 4"],
      "inputType": "text",
      "xpReward": 25,
      "hint": "Divide 12 by 3."
    },
    "tier5": {
      "congratsText": "🔥 LE SSERAFIM Equation Hero!",
      "summaryText": "You conquered linear equations! You are UNFORGIVEN at math.",
      "totalXpReward": 80,
      "badgeEarned": "equation_hero",
      "nextLessonId": null,
      "celebrationAnimation": "fire"
    }
  }'::jsonb
);
