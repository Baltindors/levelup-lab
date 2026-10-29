import {
  algebraicExpressionsPracticePool,
  exponentsPracticePool,
  scientificNotationPracticePool,
} from './mathExam100526Pools'
import {
  distributiveEquationsPracticePool,
  fractionEquationsPracticePool,
  likeTermsPracticePool,
} from './linearEquationsPools'
import { trigVerifyingPracticePool } from './trigVerifyingPool'
import { trigSumDiffPracticePool } from './trigSumDiffPool'
import { trigDoubleHalfPracticePool } from './trigDoubleHalfPool'
import { trigEquationsPracticePool } from './trigEquationsPool'

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
            {
              id: 'weekly-spelling-102126',
              title: 'Weekly Spelling Jutsu — 10/21/26',
              subtitle: 'Unit 3: Earth, Wind & Fire',
              description: 'Study the scrolls, match each seal, then spell the word from audio alone.',
              exerciseType: 'spelling-jutsu',
              roots: [
                { root: 'geo', meaning: 'earth', origin: 'Greek' },
                { root: 'aer', meaning: 'air, atmosphere', origin: 'Greek' },
                { root: 'pyr', meaning: 'heat, fire', origin: 'Greek' },
              ],
              words: [
                {
                  id: 'ws-102126-1',
                  word: 'geography',
                  pos: 'n',
                  definition:
                    'an area of study that deals with the location of countries, cities, rivers, mountains, lakes; the natural features (such as rivers, mountains, etc.) of a place',
                  sentence:
                    "The astronauts gazed at the beautiful mountains, lakes, and rivers that made up Earth's geography.",
                  root: 'geo',
                },
                {
                  id: 'ws-102126-2',
                  word: 'geode',
                  pos: 'n',
                  definition: 'a rock containing a cavity lined with crystals or other mineral matter',
                  sentence: 'I admired the deep purple crystals that sparkled inside the geode.',
                  root: 'geo',
                },
                {
                  id: 'ws-102126-3',
                  word: 'geothermal',
                  pos: 'adj',
                  definition: 'of, relating to, or using the natural heat produced inside the earth',
                  sentence:
                    'The geothermal energy from deep inside the earth can be used to generate electricity.',
                  root: 'geo',
                },
                {
                  id: 'ws-102126-4',
                  word: 'aerial',
                  pos: 'adj',
                  definition: 'performed in the air; performed by an airplane',
                  sentence: 'We were amazed by the aerial acrobatics of the circus performers.',
                  root: 'aer',
                },
                {
                  id: 'ws-102126-5',
                  word: 'aerodynamic',
                  pos: 'adj',
                  definition: 'of or having a shape that reduces the drag from air moving past',
                  sentence:
                    "An airplane's exterior must be aerodynamic in order to minimize resistance as it flies through the air.",
                  root: 'aer',
                },
                {
                  id: 'ws-102126-6',
                  word: 'aerobic',
                  pos: 'adj',
                  definition:
                    'strengthening the heart and lungs by making them work hard for several minutes or more; using oxygen',
                  sentence:
                    'Your breathing rate will increase when performing aerobic activities such as running or swimming.',
                  root: 'aer',
                },
                {
                  id: 'ws-102126-7',
                  word: 'aerate',
                  pos: 'v',
                  definition: 'to put air or a gas into something, such as soil or a liquid',
                  sentence:
                    'The bubbles created by the aquarium pump helps aerate the water, which provides more oxygen for the fish.',
                  root: 'aer',
                },
                {
                  id: 'ws-102126-8',
                  word: 'pyrotechnics',
                  pos: 'n',
                  definition: 'a bright display of fireworks',
                  sentence: "The show ended with pyrotechnics that lit up the night's sky for miles.",
                  root: 'pyr',
                },
                {
                  id: 'ws-102126-9',
                  word: 'pyromania',
                  pos: 'n',
                  definition: 'a mental disorder that makes people have a strong desire to set fires',
                  sentence: 'The fires were set by a mentally ill person suffering from pyromania.',
                  root: 'pyr',
                },
                {
                  id: 'ws-102126-10',
                  word: 'pyroclastic',
                  pos: 'adj',
                  definition: 'relating to or consisting of fragments of rock erupted by a volcano',
                  sentence:
                    'The pyroclastic flow of hot rock and gas traveled down the sides of the erupting volcano.',
                  root: 'pyr',
                },
              ],
            },
          ],
        },
        {
          id: 'fractions-decimals',
          name: 'Math — Fractions & Decimals',
          missionTitle: 'Rank C: Scroll of Four Operations',
          difficulty: 'C-Rank Mission',
          status: 'Scroll Unlocked',
          description:
            'Master addition, subtraction, multiplication, and division across like and unlike denominators.',
          exercises: [
            {
              id: 'scroll-fractions-mastery',
              title: 'Scroll of Four Operations: Fractions Mastery',
              missionRank: 'Rank C',
              exerciseType: 'math-fractions-basics',
              badge: 'FRACTIONS',
              description:
                'Master addition, subtraction, multiplication, and division across like and unlike denominators.',
            },
            {
              id: 'scroll-mixed-numbers',
              title: 'Scroll of Mixed Numbers & Regrouping',
              missionRank: 'Rank B',
              exerciseType: 'math-mixed-numbers',
              badge: 'MIXED NUMBERS',
              description:
                'Master mixed-to-improper transmutation, regrouping across whole numbers, and borrowing techniques.',
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
          id: 'linear-equations',
          name: 'Scroll 3: Multi-Step Linear Equations',
          missionTitle: 'Scroll 3: Multi-Step Linear Equations',
          difficulty: 'A-Rank Mission',
          status: 'Scroll Unlocked',
          description:
            'Combine like terms, distribute signed factors, and clear denominators to isolate the variable.',
          exercises: [
            {
              id: 'linear-eq-like-terms',
              title: 'Combining Like Terms & Variable Isolation',
              exerciseType: 'math-linear-eq-like-terms',
              badge: 'LIKE TERMS',
              description:
                'Collapse like terms, balance variables across the equals sign, and gather constants.',
              practicePool: likeTermsPracticePool,
            },
            {
              id: 'linear-eq-distributive',
              title: 'Shadow Distributive Property',
              exerciseType: 'math-linear-eq-distributive',
              badge: 'DISTRIBUTE',
              description:
                'Expand positive and negative factors, including the sign flip in -5(x - 2), then solve.',
              practicePool: distributiveEquationsPracticePool,
            },
            {
              id: 'linear-eq-fractions',
              title: 'Rational Coefficients & Denominator Clearing',
              exerciseType: 'math-linear-eq-fractions',
              badge: 'LCD CLEAR',
              description:
                'Scale by the LCD, keep both sides equivalent, and isolate the variable.',
              practicePool: fractionEquationsPracticePool,
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
      blurb:
        'Graph trigonometric functions and verify identities with step-by-step strategy sandboxes.',
      subjects: [
        {
          id: 'graphing-trig',
          name: 'Chapter 5: Graphing',
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
          id: 'analytic-trigonometry',
          name: 'Chapter 6: Analytic Trigonometry',
          description:
            'Verify identities and apply analytic strategies across Chapter 6 modules.',
          exercises: [
            {
              id: 'trig-verifying',
              title: 'Verifying Trigonometric Identities',
              exerciseType: 'math-trig-verifying',
              content:
                'Practice the core strategies for proving trig identities step by step.',
              practicePool: trigVerifyingPracticePool,
            },
            {
              id: 'trig-sum-diff',
              title: 'Sum and Difference Formulas',
              exerciseType: 'math-trig-sum-diff',
              content:
                'Decompose angles, solve two-triangle problems, and simplify with sum/difference identities.',
              practicePool: trigSumDiffPracticePool,
            },
            {
              id: 'trig-double-half',
              title: 'Double-Angle, Power-Reducing & Half-Angle Formulas',
              exerciseType: 'math-trig-double-half',
              content:
                'Build double angles from ratios, reduce powers, and choose half-angle signs by quadrant.',
              practicePool: trigDoubleHalfPracticePool,
            },
            {
              id: 'trig-equations',
              title: 'Solving Trigonometric Equations',
              exerciseType: 'math-trig-equations',
              content:
                'Isolate, factor without dividing away solutions, and use identities to match angles before solving.',
              practicePool: trigEquationsPracticePool,
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
