export const mockData = {
  grades: [
    {
      id: 'grade-5',
      name: '6th Grade',
      theme: 'theme-grade-5',
      cardTitle: '6TH GRADE: SHINOBI ACADEMY',
      rankBadge: 'GENIN RANK • LEVEL 1',
      cta: 'Enter Dojo',
      blurb: 'Train in math jutsu, master the scrolls, and level up your rank.',
      hud: { rank: 'Genin', chakra: 120, chakraMax: 200 },
      victoryTitle: 'MISSION ACCOMPLISHED',
      phaseLabels: {
        explore: 'Dojo Sandbox / Practice Kata',
        practice: '10-Chakra Trial',
      },
      subjects: [
        {
          id: 'fractions-decimals',
          name: 'Math — Fractions & Decimals',
          missionTitle: 'Scroll I: Fractions & Decimals Jutsu',
          difficulty: 'B-Rank Mission',
          status: 'Scroll Unlocked',
          description: 'Compare fractions, convert decimals, and solve everyday number problems.',
          exercises: [
            {
              id: 'fraction-pizza-slices',
              title: 'Pizza Slice Fractions',
              exerciseType: 'multiple-choice',
              content: 'Choose the fraction that matches the shaded pizza slices.',
              question: 'A pizza is cut into 8 equal slices. 3 slices are eaten. What fraction of the pizza is left?',
              options: [
                { id: 'a', label: '3/8' },
                { id: 'b', label: '5/8' },
                { id: 'c', label: '1/2' },
                { id: 'd', label: '8/3' },
              ],
              correctOptionId: 'b',
            },
          ],
        },
        {
          id: 'ecosystems',
          name: 'Science — Ecosystems',
          missionTitle: 'Scroll II: Ecosystems',
          difficulty: 'C-Rank Mission',
          status: 'Scroll Unlocked',
          description: 'Food webs, habitats, and how living things depend on each other.',
          exercises: [
            {
              id: 'food-web-flashcards',
              title: 'Food Web Flashcards',
              exerciseType: 'flashcard',
              content: 'Flip cards to match producers, consumers, and decomposers.',
              front: 'What do we call an organism that makes its own food using sunlight?',
              back: 'A producer (for example, a green plant or algae).',
            },
          ],
        },
        {
          id: 'language-arts',
          name: 'Language Arts',
          missionTitle: 'Scroll III: Language Arts Seals',
          difficulty: 'C-Rank Mission',
          status: 'Scroll Unlocked',
          description: 'Grammar, vocabulary, and short reading passages.',
          exercises: [
            {
              id: 'figurative-language-quiz',
              title: 'Figurative Language Quiz',
              exerciseType: 'multiple-choice',
              content: 'Identify similes, metaphors, and idioms in short sentences.',
              question: 'Which sentence contains a simile?',
              options: [
                { id: 'a', label: 'The classroom was a zoo.' },
                { id: 'b', label: 'She ran as fast as lightning.' },
                { id: 'c', label: 'Break a leg before the play!' },
                { id: 'd', label: 'Time flies when you are having fun.' },
              ],
              correctOptionId: 'b',
            },
          ],
        },
        {
          id: 'spelling-jutsu',
          name: 'Language Arts — Spelling',
          missionTitle: 'Scroll IV: Spelling Jutsu',
          difficulty: 'B-Rank Mission',
          status: 'Scroll Unlocked',
          description: 'Hear the word, match the seal, and spell it until the streak holds.',
          exercises: [
            {
              id: 'weekly-spelling-jutsu',
              title: 'Weekly Spelling Jutsu',
              exerciseType: 'spelling-jutsu',
              content: 'Study the scrolls, match each seal, then spell the word from audio alone.',
              words: [
                { id: 'ancient', word: 'ancient', definition: 'very old' },
                { id: 'courage', word: 'courage', definition: 'bravery when something is frightening' },
                { id: 'journey', word: 'journey', definition: 'a long trip from one place to another' },
                { id: 'mystery', word: 'mystery', definition: 'something that is hard to explain' },
                { id: 'whisper', word: 'whisper', definition: 'to speak very softly' },
                { id: 'glacier', word: 'glacier', definition: 'a large, slow-moving mass of ice' },
                { id: 'shelter', word: 'shelter', definition: 'a place that gives protection' },
                { id: 'rhythm', word: 'rhythm', definition: 'a strong, regular pattern of sounds or beats' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'college-trig',
      name: 'College Trigonometry',
      theme: 'theme-college-trig',
      blurb: 'Unit circle fluency, identities, and polar thinking for college-ready trig.',
      subjects: [
        {
          id: 'graphing-trig',
          name: 'Graphing Trigonometric Functions',
          description: 'Transform and graph sine, cosine, tangent, and reciprocal functions.',
          exercises: [
            {
              id: 'trig-explorer',
              title: 'Trigonometric Function Grapher & Step-by-Step Solver',
              exerciseType: 'trig-grapher',
              content:
                'Graph y = A f(B(x - C)) + D and walk through the analysis steps.',
              presets: [
                '2tan(2x)+3',
                '-3sin(2x-pi)+1',
                'cos(x-pi/2)-1',
                '2csc(x)+1',
              ],
              practicePool: [
                {
                  id: 'tg-01',
                  equation: '-3sin(2x-pi)+1',
                  prompt: 'Find amplitude/stretch, period, phase shift, and midline.',
                },
                {
                  id: 'tg-02',
                  equation: '2cos(3x)+1',
                  prompt: 'Find amplitude/stretch, period, phase shift, and midline.',
                },
                {
                  id: 'tg-03',
                  equation: 'cos(x-pi/2)-1',
                  prompt: 'Find amplitude/stretch, period, phase shift, and midline.',
                },
                {
                  id: 'tg-04',
                  equation: '2tan(2x)+3',
                  prompt: 'Find vertical stretch, period, phase shift, and midline.',
                },
                {
                  id: 'tg-05',
                  equation: '2csc(x)+1',
                  prompt: 'Find vertical stretch, period, phase shift, and midline.',
                },
                {
                  id: 'tg-06',
                  equation: '4sin(x)+2',
                  prompt: 'Find amplitude/stretch, period, phase shift, and midline.',
                },
                {
                  id: 'tg-07',
                  equation: '-2cos(2(x-pi/4))+1',
                  prompt: 'Find amplitude/stretch, period, phase shift, and midline.',
                },
                {
                  id: 'tg-08',
                  equation: '3sin(2x+pi)-1',
                  prompt: 'Find amplitude/stretch, period, phase shift, and midline.',
                },
                {
                  id: 'tg-09',
                  equation: 'sec(2x)',
                  prompt: 'Find vertical stretch, period, phase shift, and midline.',
                },
                {
                  id: 'tg-10',
                  equation: 'cot(x-pi/2)',
                  prompt: 'Find vertical stretch, period, phase shift, and midline.',
                },
                {
                  id: 'tg-11',
                  equation: '-sin(4x)+3',
                  prompt: 'Find amplitude/stretch, period, phase shift, and midline.',
                },
                {
                  id: 'tg-12',
                  equation: '5cos(x+pi/3)-2',
                  prompt: 'Find amplitude/stretch, period, phase shift, and midline.',
                },
                {
                  id: 'tg-13',
                  equation: 'tan(3x-pi)+1',
                  prompt: 'Find vertical stretch, period, phase shift, and midline.',
                },
                {
                  id: 'tg-14',
                  equation: '-4csc(2x)+2',
                  prompt: 'Find vertical stretch, period, phase shift, and midline.',
                },
                {
                  id: 'tg-15',
                  equation: '2sin(pi*x)',
                  prompt: 'Find amplitude/stretch, period, phase shift, and midline.',
                },
                {
                  id: 'tg-16',
                  equation: 'cos(2(x+pi/6))-3',
                  prompt: 'Find amplitude/stretch, period, phase shift, and midline.',
                },
              ],
            },
          ],
        },
        {
          id: 'unit-circle-radians',
          name: 'Unit Circle & Radians',
          description: 'Convert degrees and radians and locate standard angles on the unit circle.',
          exercises: [
            {
              id: 'unit-circle-explorer',
              title: 'Unit Circle Explorer',
              exerciseType: 'graph-interactive',
              content:
                'Explore angles on the unit circle and read off sine and cosine. Interactive graph coming soon.',
            },
          ],
        },
        {
          id: 'trig-identities',
          name: 'Trigonometric Identities',
          description: 'Pythagorean, reciprocal, and angle-addition identities.',
          exercises: [
            {
              id: 'identity-drill',
              title: 'Identity Drill',
              exerciseType: 'flashcard',
              content: 'Recall core trig identities from flashcards.',
              front: 'What is the Pythagorean identity relating sin θ and cos θ?',
              back: 'sin²θ + cos²θ = 1',
            },
          ],
        },
        {
          id: 'vectors-polar',
          name: 'Vectors & Polar Coordinates',
          description: 'Convert between rectangular and polar form and work with vector components.',
          exercises: [
            {
              id: 'polar-conversion-check',
              title: 'Polar Conversion Check',
              exerciseType: 'multiple-choice',
              content: 'Select the correct polar form for a given rectangular point.',
              question: 'Convert the point (0, 2) from rectangular to polar form (r, θ), with θ in radians.',
              options: [
                { id: 'a', label: '(2, 0)' },
                { id: 'b', label: '(2, π/2)' },
                { id: 'c', label: '(2, π)' },
                { id: 'd', label: '(√2, π/4)' },
              ],
              correctOptionId: 'b',
            },
          ],
        },
      ],
    },
  ],
}

export function getGrade(gradeId) {
  return mockData.grades.find((grade) => grade.id === gradeId) ?? null
}

export function getSubject(gradeId, subjectId) {
  const grade = getGrade(gradeId)
  return grade?.subjects.find((subject) => subject.id === subjectId) ?? null
}

export function getExercise(gradeId, subjectId, exerciseId) {
  const subject = getSubject(gradeId, subjectId)
  return subject?.exercises.find((exercise) => exercise.id === exerciseId) ?? null
}

export function getNextExercise(gradeId, subjectId, exerciseId) {
  const subject = getSubject(gradeId, subjectId)
  if (!subject) return null

  const index = subject.exercises.findIndex((exercise) => exercise.id === exerciseId)
  if (index < 0 || index >= subject.exercises.length - 1) return null

  return subject.exercises[index + 1]
}
