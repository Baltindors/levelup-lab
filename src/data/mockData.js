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
              content: 'Choose the fraction that matches the shaded pizza slices. (Placeholder exercise.)',
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
              content: 'Flip cards to match producers, consumers, and decomposers. (Placeholder exercise.)',
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
              content: 'Identify similes, metaphors, and idioms in short sentences. (Placeholder exercise.)',
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
              content: 'Explore angles on the unit circle and read off sine and cosine. (Placeholder exercise.)',
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
              content: 'Recall core trig identities from flashcards. (Placeholder exercise.)',
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
              content: 'Select the correct polar form for a given rectangular point. (Placeholder exercise.)',
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
