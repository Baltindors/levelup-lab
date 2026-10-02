export const mockData = {
  grades: [
    {
      id: 'grade-5',
      name: '5th Grade',
      theme: 'theme-grade-5',
      blurb: 'Fractions, ecosystems, and language skills with a playful vibe.',
      subjects: [
        {
          id: 'fractions-decimals',
          name: 'Math — Fractions & Decimals',
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
      ],
    },
    {
      id: 'college-trig',
      name: 'College Trigonometry',
      theme: 'theme-college-trig',
      blurb: 'Unit circle fluency, identities, and polar thinking for college-ready trig.',
      subjects: [
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
