-- NewJeans Lesson: Fractions (분수)
INSERT INTO public.lessons (title, artist, math_concept, difficulty, tier_content, is_published)
VALUES (
  'Fractions with NewJeans',
  'NewJeans',
  'Understanding Fractions',
  'beginner',
  '{
    "tier1": {
      "tier": 1,
      "title": "NewJeans Fraction Party",
      "shortDescription": "Introduction to fractions using NewJeans",
      "learningObjective": "Understand what fractions represent in everyday life",
      "estimatedMinutes": 5,
      "text": "NewJeans has 5 members: Minji, Hanni, Danielle, Haerin, and Hyein. If 2 out of 5 members are singing the chorus, that''s a fraction — 2/5! Let''s explore how fractions work using the group.",
      "imageUrl": "/images/newjeans-fractions.jpg",
      "duration": 40
    },
    "tier2": {
      "tier": 2,
      "title": "Breaking Down Fractions",
      "shortDescription": "Step-by-step fraction basics",
      "learningObjective": "Identify numerator, denominator, and simplify fractions",
      "estimatedMinutes": 10,
      "steps": [
        {
          "stepNumber": 1,
          "text": "A fraction has two parts: the numerator (top) tells how many, and the denominator (bottom) tells the total. If 3 out of 5 NewJeans members are dancing, we write 3/5.",
          "animation": "fade-in"
        },
        {
          "stepNumber": 2,
          "text": "Equivalent fractions: 2/4 is the same as 1/2. Imagine splitting NewJeans into 2 equal teams — each team is 1/2 of the group!",
          "animation": "scale-in"
        },
        {
          "stepNumber": 3,
          "text": "Adding fractions with the same denominator: 1/5 + 2/5 = 3/5. One member plus two members out of five!",
          "animation": "slide-up"
        },
        {
          "stepNumber": 4,
          "text": "Simplifying: 4/8 = 1/2. Divide both top and bottom by the same number (4). Always look for the Greatest Common Factor!",
          "animation": "fade-in"
        }
      ],
      "duration": 80
    },
    "tier3": {
      "tier": 3,
      "title": "Fraction Quiz",
      "shortDescription": "Multiple choice fraction questions",
      "learningObjective": "Correctly identify and simplify fractions",
      "estimatedMinutes": 5,
      "questionText": "NewJeans released 10 songs. Hanni sang lead vocals on 4 of them. What fraction of songs did Hanni lead, simplified?",
      "questionType": "multiple_choice",
      "options": [
        { "id": "a", "text": "4/10", "isCorrect": false },
        { "id": "b", "text": "2/5", "isCorrect": true },
        { "id": "c", "text": "1/3", "isCorrect": false },
        { "id": "d", "text": "2/10", "isCorrect": false }
      ],
      "xpReward": 15,
      "hint": "Divide both 4 and 10 by their Greatest Common Factor (2)"
    },
    "tier4": {
      "tier": 4,
      "title": "Fraction Challenge",
      "shortDescription": "Fill in the blank fraction problem",
      "learningObjective": "Add fractions with the same denominator",
      "estimatedMinutes": 8,
      "questionText": "At a fan meeting, 1/6 of fans wore Minji merch and 3/6 wore Hanni merch. What fraction of fans wore either Minji or Hanni merch? (simplify your answer)",
      "questionType": "fill_in_blank",
      "correctAnswer": "2/3",
      "acceptableAnswers": ["2/3", "4/6"],
      "inputType": "text",
      "xpReward": 20,
      "hint": "First add: 1/6 + 3/6 = 4/6, then simplify by dividing both by 2"
    },
    "tier5": {
      "tier": 5,
      "title": "Fraction Complete",
      "shortDescription": "Summary and celebration",
      "learningObjective": "Review fraction fundamentals",
      "estimatedMinutes": 2,
      "congratsText": "Fraction Master with NewJeans!",
      "summaryText": "You learned how to read, add, and simplify fractions using NewJeans as your guide. Numerator over denominator — you''ve got this!",
      "totalXpReward": 60,
      "badgeEarned": "fraction_star",
      "nextLessonId": null,
      "celebrationAnimation": "confetti"
    }
  }'::jsonb,
  true
);

-- NewJeans Lesson: Ratios & Proportions (비율)
INSERT INTO public.lessons (title, artist, math_concept, difficulty, tier_content, is_published)
VALUES (
  'Ratios & Proportions with NewJeans',
  'NewJeans',
  'Ratios and Proportions',
  'intermediate',
  '{
    "tier1": {
      "tier": 1,
      "title": "NewJeans by the Numbers",
      "shortDescription": "Introduction to ratios with NewJeans stats",
      "learningObjective": "Understand what ratios are and where they appear",
      "estimatedMinutes": 5,
      "text": "NewJeans'' music video for ''Ditto'' got 200 million views, while ''Hype Boy'' got 300 million. The ratio of Ditto to Hype Boy views is 200:300, or simplified, 2:3. Ratios compare quantities — let''s learn how!",
      "imageUrl": "/images/newjeans-ratios.jpg",
      "duration": 45
    },
    "tier2": {
      "tier": 2,
      "title": "Understanding Ratios and Proportions",
      "shortDescription": "Step-by-step ratio concepts",
      "learningObjective": "Write ratios, simplify them, and solve proportions",
      "estimatedMinutes": 12,
      "steps": [
        {
          "stepNumber": 1,
          "text": "A ratio compares two quantities. If there are 3 vocalists and 2 rappers in a group, the ratio is 3:2. You can also write it as 3/2.",
          "animation": "fade-in"
        },
        {
          "stepNumber": 2,
          "text": "Simplifying ratios works like fractions. 200:300 = 2:3 (divide both by 100). Always find the GCF!",
          "animation": "scale-in"
        },
        {
          "stepNumber": 3,
          "text": "A proportion says two ratios are equal: 2/3 = 4/6. Cross-multiply to check: 2 x 6 = 12 and 3 x 4 = 12. They match!",
          "animation": "slide-up"
        },
        {
          "stepNumber": 4,
          "text": "Solving proportions: If 2/3 = x/9, cross-multiply: 2 x 9 = 3 x x, so 18 = 3x, and x = 6.",
          "animation": "fade-in"
        }
      ],
      "duration": 100
    },
    "tier3": {
      "tier": 3,
      "title": "Ratio Quiz",
      "shortDescription": "Multiple choice ratio question",
      "learningObjective": "Identify equivalent ratios",
      "estimatedMinutes": 5,
      "questionText": "At a NewJeans concert, the ratio of lightsticks to banners is 5:2. If there are 200 banners, how many lightsticks are there?",
      "questionType": "multiple_choice",
      "options": [
        { "id": "a", "text": "400", "isCorrect": false },
        { "id": "b", "text": "500", "isCorrect": true },
        { "id": "c", "text": "250", "isCorrect": false },
        { "id": "d", "text": "1000", "isCorrect": false }
      ],
      "xpReward": 20,
      "hint": "Set up the proportion: 5/2 = x/200, then cross-multiply"
    },
    "tier4": {
      "tier": 4,
      "title": "Proportion Challenge",
      "shortDescription": "Solve a proportion problem",
      "learningObjective": "Cross-multiply to solve for an unknown",
      "estimatedMinutes": 8,
      "questionText": "NewJeans sells photo cards in a ratio of 3 Minji cards for every 7 packs. If a store has 21 Minji cards, how many packs were opened?",
      "questionType": "fill_in_blank",
      "correctAnswer": "49",
      "acceptableAnswers": ["49", "49 packs"],
      "inputType": "number",
      "xpReward": 25,
      "hint": "Set up 3/7 = 21/x, then cross-multiply: 3x = 7 x 21 = 147, so x = 49"
    },
    "tier5": {
      "tier": 5,
      "title": "Ratio Complete",
      "shortDescription": "Summary and celebration",
      "learningObjective": "Review ratio and proportion skills",
      "estimatedMinutes": 2,
      "congratsText": "Ratio Champion with NewJeans!",
      "summaryText": "You mastered ratios and proportions! You can now compare quantities, simplify ratios, and solve proportions using cross-multiplication.",
      "totalXpReward": 75,
      "badgeEarned": "ratio_champion",
      "nextLessonId": null,
      "celebrationAnimation": "confetti"
    }
  }'::jsonb,
  true
);
