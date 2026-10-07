import {
  algebraicExpressionsPracticePool,
  exponentsPracticePool,
  scientificNotationPracticePool,
} from './mathExam100526Pools'

export const mockData = {
  grades: [
    {
      id: 'grade-6',
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
          id: 'spelling-jutsu',
          name: 'Language Arts — Spelling',
          missionTitle: 'Scroll I: Spelling Jutsu',
          difficulty: 'B-Rank Mission',
          status: 'Scroll Unlocked',
          description: 'Hear the word, match the seal, and spell it until the streak holds.',
          exercises: [
            {
              id: 'custom-spelling-jutsu',
              title: 'CUSTOM SPELLING JUTSU',
              exerciseType: 'custom-spelling',
              badge: 'CUSTOM-SPELLING',
              description:
                'Forge your own secret scroll. Enter custom words and definitions, then master the jutsu.',
              words: [],
            },
            {
              id: 'weekly-spelling-jutsu',
              title: 'Weekly Spelling Jutsu',
              exerciseType: 'spelling-jutsu',
              badge: 'SPELLING-JUTSU',
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
            {
              id: 'weekly-spelling-100926',
              title: 'Weekly Spelling Jutsu — 10/09/26',
              subtitle: 'Unit 2: We Are Family',
              exerciseType: 'spelling-jutsu',
              badge: 'SPELLING-JUTSU',
              description:
                'Study the scrolls, match each seal, then spell the word from audio alone.',
              roots: [
                { root: 'pater/patri', meaning: 'father', origin: 'Latin' },
                { root: 'mater/matri', meaning: 'mother', origin: 'Latin' },
                { root: 'gen', meaning: 'birth, race, kind', origin: 'Greek' },
              ],
              words: [
                {
                  id: 'patriarch',
                  word: 'patriarch',
                  pos: 'n',
                  definition: 'a man who controls a family, group, or government',
                  sentence:
                    "My grandfather is our family's patriarch, so we always seek his approval regarding family matters.",
                  root: 'patri',
                },
                {
                  id: 'patriarchal',
                  word: 'patriarchal',
                  pos: 'adj',
                  definition:
                    'a characteristic of a system of society or government controlled by men',
                  sentence:
                    "Ancient Rome's patriarchal senate prohibited women from participating.",
                  root: 'patri',
                },
                {
                  id: 'patrician',
                  word: 'patrician',
                  pos: 'n',
                  definition: 'a person who is a member of the highest social class',
                  sentence:
                    'The patricians of Ancient Rome forbid their children to marry the lower-class plebeians.',
                  root: 'patri',
                },
                {
                  id: 'maternal',
                  word: 'maternal',
                  pos: 'adj',
                  definition: 'of or relating to a mother; motherly',
                  sentence:
                    "As soon as her cubs were born, the bear's maternal instincts made her fiercely protective of them.",
                  root: 'mater',
                },
                {
                  id: 'matron',
                  word: 'matron',
                  pos: 'n',
                  definition:
                    'an older married woman who usually has a high social position',
                  sentence:
                    'Maiden Boleyn dreamed of marrying King Henry VIII and becoming the most powerful matron of England.',
                  root: 'matron',
                },
                {
                  id: 'matriarchy',
                  word: 'matriarchy',
                  pos: 'n',
                  definition:
                    'a family, group, or government controlled by a woman or a group of women and/or females',
                  sentence:
                    'Elephant herds are a matriarchy, consisting of a head cow who leads the other female members of the herd.',
                  root: 'matri',
                },
                {
                  id: 'generate',
                  word: 'generate',
                  pos: 'v',
                  definition: 'to produce something or cause something to be produced',
                  sentence: 'Windmills are used to generate electricity.',
                  root: 'gen',
                },
                {
                  id: 'congenial',
                  word: 'congenial',
                  pos: 'adj',
                  definition: 'pleasant, enjoyable, or friendly',
                  sentence:
                    'My dad describes me as congenial because I can get along with just about anyone.',
                  root: 'gen',
                },
                {
                  id: 'generation',
                  word: 'generation',
                  pos: 'n',
                  definition: 'a group of people born and living during the same time',
                  sentence: 'We need to protect our natural resources for future generations.',
                  root: 'gen',
                },
                {
                  id: 'genetic',
                  word: 'genetic',
                  pos: 'adj',
                  definition:
                    'of, relating to, or involving genes, which is the part of a cell that controls or influences the appearance, growth, etc., of a living thing',
                  sentence: 'Your eye and hair color are genetic factors.',
                  root: 'gen',
                },
              ],
            },
          ],
        },
        {
          id: 'math-exam-100526',
          name: 'Scroll 2: Math Mastery (10/05 Exam)',
          missionTitle: 'Scroll 2: Math Mastery (10/05 Exam)',
          difficulty: 'A-Rank Mission',
          status: 'Scroll Unlocked',
          description:
            'Master integer exponents, scientific notation, and algebraic multiply/factor skills for the 10/05 exam.',
          exercises: [
            {
              id: 'exponents-laws',
              title: 'Laws of Integer Exponents',
              exerciseType: 'math-exponents',
              badge: 'EXPONENTS',
              description:
                'Explore product, quotient, power, and negative-exponent laws, then pass a 10-card trial.',
              practicePool: exponentsPracticePool,
            },
            {
              id: 'scientific-notation',
              title: 'Scientific Notation & Orders of Magnitude',
              exerciseType: 'math-scientific-notation',
              badge: 'SCI-NOTATION',
              description:
                'Slide decimals between large and microscopic scales, then drill convert, multiply, and add.',
              practicePool: scientificNotationPracticePool,
            },
            {
              id: 'algebraic-expressions',
              title: 'Algebraic Expressions (Multiply & Factor)',
              exerciseType: 'math-algebraic-expressions',
              badge: 'ALGEBRA',
              description:
                'Use the area model to distribute and factor (including negative GCFs), then prove mastery.',
              practicePool: algebraicExpressionsPracticePool,
            },
          ],
        },
        {
          id: 'earth-systems',
          name: 'Science - Earth Systems',
          missionTitle: 'Earth Systems & Cycles Master Scroll',
          difficulty: 'A-Rank Mission',
          status: 'Scroll Unlocked',
          description:
            'Master the Water Cycle, Rock Cycle, Atmosphere, Earth Layers, and Heat Transfer with interactive models and a 2-streak mastery trial.',
          exercises: [
            {
              id: 'earth-systems-mastery',
              title: 'Earth Systems & Cycles Master Scroll',
              exerciseType: 'science-earth-systems',
              badge: 'EARTH-SYSTEMS',
              description:
                'Master the Water Cycle, Rock Cycle, Atmosphere, Earth Layers, and Heat Transfer with interactive models and a 2-streak mastery trial.',
            },
          ],
        },
      ],
    },
    {
      id: 'college-trig',
      name: 'College Trigonometry',
      theme: 'theme-college-trig',
      blurb: 'Transform and graph trigonometric functions with step-by-step analysis.',
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
