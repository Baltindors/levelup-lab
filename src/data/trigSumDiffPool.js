/** Practice pool for College Trig: Sum and Difference Formulas. LaTeX uses double-escaped backslashes. */

const OPTION_IDS = ['a', 'b', 'c', 'd']

function card({ id, topic, prompt, choices, correct, rule, explanation, steps }) {
  if (choices.length !== 4) throw new Error(`${id} needs 4 choices`)
  const correctIndex = choices.indexOf(correct)
  if (correctIndex < 0) throw new Error(`${id} missing correct choice`)
  if (new Set(choices).size !== 4) throw new Error(`${id} has duplicate choices`)

  return {
    id,
    topic,
    question: prompt,
    options: choices.map((label, index) => ({ id: OPTION_IDS[index], label })),
    correctAnswer: OPTION_IDS[correctIndex],
    rule,
    explanation,
    steps,
  }
}

export const trigSumDiffPracticePool = [
  // —— exact-value-angles (5) ——
  card({
    id: 'sd-01',
    topic: 'exact-value-angles',
    prompt: 'Find the exact value of $\\sin 15^\\circ$.',
    choices: [
      '$\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}$',
      '$\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}$',
      '$\\dfrac{\\sqrt{2}-\\sqrt{6}}{4}$',
      '$\\dfrac{1}{2}$',
    ],
    correct: '$\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}$',
    rule: 'Angle Decomposition',
    explanation:
      '$\\sin 15^\\circ=\\sin(45^\\circ-30^\\circ)=\\sin 45^\\circ\\cos 30^\\circ-\\cos 45^\\circ\\sin 30^\\circ=\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}$.',
    steps: [
      'Write $15^\\circ$ as $45^\\circ-30^\\circ$.',
      'Apply $\\sin(\\alpha-\\beta)=\\sin\\alpha\\cos\\beta-\\cos\\alpha\\sin\\beta$.',
      'Substitute $\\sin 45^\\circ=\\dfrac{\\sqrt{2}}{2}$, $\\cos 30^\\circ=\\dfrac{\\sqrt{3}}{2}$, $\\cos 45^\\circ=\\dfrac{\\sqrt{2}}{2}$, $\\sin 30^\\circ=\\dfrac{1}{2}$.',
      'Simplify to $\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}$.',
    ],
  }),
  card({
    id: 'sd-02',
    topic: 'exact-value-angles',
    prompt: 'Find the exact value of $\\cos 75^\\circ$.',
    choices: [
      '$\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}$',
      '$\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}$',
      '$\\dfrac{\\sqrt{2}}{2}$',
      '$-\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}$',
    ],
    correct: '$\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}$',
    rule: 'Angle Decomposition',
    explanation:
      '$\\cos 75^\\circ=\\cos(45^\\circ+30^\\circ)=\\cos 45^\\circ\\cos 30^\\circ-\\sin 45^\\circ\\sin 30^\\circ=\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}$.',
    steps: [
      'Write $75^\\circ$ as $45^\\circ+30^\\circ$.',
      'Apply $\\cos(\\alpha+\\beta)=\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta$.',
      'Substitute the standard unit-circle values.',
      'Simplify to $\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}$.',
    ],
  }),
  card({
    id: 'sd-03',
    topic: 'exact-value-angles',
    prompt:
      'Which single cosine equals $\\cos 70^\\circ\\cos 40^\\circ + \\sin 70^\\circ\\sin 40^\\circ$?',
    choices: [
      '$\\cos 30^\\circ$',
      '$\\cos 110^\\circ$',
      '$\\sin 30^\\circ$',
      '$\\cos 70^\\circ$',
    ],
    correct: '$\\cos 30^\\circ$',
    rule: 'Angle Decomposition',
    explanation:
      'The pattern $\\cos A\\cos B+\\sin A\\sin B$ is $\\cos(A-B)$, so $\\cos(70^\\circ-40^\\circ)=\\cos 30^\\circ$.',
    steps: [
      'Recognize $\\cos A\\cos B+\\sin A\\sin B=\\cos(A-B)$.',
      'Here $A=70^\\circ$ and $B=40^\\circ$.',
      'So the expression equals $\\cos(70^\\circ-40^\\circ)=\\cos 30^\\circ$.',
    ],
  }),
  card({
    id: 'sd-04',
    topic: 'exact-value-angles',
    prompt: 'Find the exact value of $\\sin\\dfrac{5\\pi}{12}$.',
    choices: [
      '$\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}$',
      '$\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}$',
      '$\\dfrac{\\sqrt{3}}{2}$',
      '$\\dfrac{\\sqrt{2}}{2}$',
    ],
    correct: '$\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}$',
    rule: 'Angle Decomposition',
    explanation:
      '$\\dfrac{5\\pi}{12}=\\dfrac{\\pi}{6}+\\dfrac{\\pi}{4}$, so $\\sin\\dfrac{5\\pi}{12}=\\sin\\dfrac{\\pi}{6}\\cos\\dfrac{\\pi}{4}+\\cos\\dfrac{\\pi}{6}\\sin\\dfrac{\\pi}{4}=\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}$.',
    steps: [
      'Split $\\dfrac{5\\pi}{12}=\\dfrac{\\pi}{6}+\\dfrac{\\pi}{4}$.',
      'Apply $\\sin(\\alpha+\\beta)=\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta$.',
      'Substitute $\\sin\\dfrac{\\pi}{6}=\\dfrac{1}{2}$, $\\cos\\dfrac{\\pi}{6}=\\dfrac{\\sqrt{3}}{2}$, and the $45^\\circ$ values.',
      'Simplify to $\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}$.',
    ],
  }),
  card({
    id: 'sd-05',
    topic: 'exact-value-angles',
    prompt: 'Find the exact value of $\\tan 15^\\circ$.',
    choices: [
      '$2-\\sqrt{3}$',
      '$2+\\sqrt{3}$',
      '$\\sqrt{3}-2$',
      '$\\dfrac{\\sqrt{3}}{3}$',
    ],
    correct: '$2-\\sqrt{3}$',
    rule: 'Angle Decomposition',
    explanation:
      '$\\tan 15^\\circ=\\tan(45^\\circ-30^\\circ)=\\dfrac{1-\\dfrac{1}{\\sqrt{3}}}{1+1\\cdot\\dfrac{1}{\\sqrt{3}}}=2-\\sqrt{3}$ after rationalizing.',
    steps: [
      'Write $15^\\circ$ as $45^\\circ-30^\\circ$.',
      'Apply $\\tan(\\alpha-\\beta)=\\dfrac{\\tan\\alpha-\\tan\\beta}{1+\\tan\\alpha\\tan\\beta}$.',
      'Use $\\tan 45^\\circ=1$ and $\\tan 30^\\circ=\\dfrac{1}{\\sqrt{3}}$.',
      'Simplify and rationalize to get $2-\\sqrt{3}$.',
    ],
  }),

  // —— two-triangles (5) ——
  card({
    id: 'sd-06',
    topic: 'two-triangles',
    prompt:
      'Given $\\sin\\alpha=\\dfrac{4}{5}$ in Quadrant II and $\\sin\\beta=\\dfrac{1}{2}$ in Quadrant I, find $\\cos(\\alpha+\\beta)$.',
    choices: [
      '$\\dfrac{-3\\sqrt{3}-4}{10}$',
      '$\\dfrac{3\\sqrt{3}-4}{10}$',
      '$\\dfrac{-3\\sqrt{3}+4}{10}$',
      '$\\dfrac{3\\sqrt{3}+4}{10}$',
    ],
    correct: '$\\dfrac{-3\\sqrt{3}-4}{10}$',
    rule: 'Two-Triangle Problem',
    explanation:
      '$\\cos\\alpha=-\\dfrac{3}{5}$, $\\cos\\beta=\\dfrac{\\sqrt{3}}{2}$, so $\\cos(\\alpha+\\beta)=(-\\tfrac{3}{5})(\\tfrac{\\sqrt{3}}{2})-(\\tfrac{4}{5})(\\tfrac{1}{2})=\\dfrac{-3\\sqrt{3}-4}{10}$.',
    steps: [
      'Find missing sides with $x^2+y^2=r^2$ and apply quadrant signs: $\\cos\\alpha=-\\dfrac{3}{5}$, $\\cos\\beta=\\dfrac{\\sqrt{3}}{2}$.',
      'State the needed ratios: $\\cos\\alpha=-\\dfrac{3}{5}$, $\\sin\\alpha=\\dfrac{4}{5}$, $\\cos\\beta=\\dfrac{\\sqrt{3}}{2}$, $\\sin\\beta=\\dfrac{1}{2}$.',
      'Use $\\cos(\\alpha+\\beta)=\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta$.',
      'Substitute the fractions and simplify to $\\dfrac{-3\\sqrt{3}-4}{10}$.',
    ],
  }),
  card({
    id: 'sd-07',
    topic: 'two-triangles',
    prompt:
      'If $\\sin\\alpha=\\dfrac{4}{5}$ (Quadrant II), what is $\\cos\\alpha$?',
    choices: [
      '$-\\dfrac{3}{5}$',
      '$\\dfrac{3}{5}$',
      '$-\\dfrac{4}{5}$',
      '$\\dfrac{5}{3}$',
    ],
    correct: '$-\\dfrac{3}{5}$',
    rule: 'Two-Triangle Problem',
    explanation:
      'With opposite $4$ and hypotenuse $5$, adjacent is $3$. Quadrant II makes cosine negative: $\\cos\\alpha=-\\dfrac{3}{5}$.',
    steps: [
      'From $\\sin\\alpha=\\dfrac{4}{5}$, use $x^2+4^2=5^2$ so $|x|=3$.',
      'Quadrant II has negative $x$.',
      'Therefore $\\cos\\alpha=-\\dfrac{3}{5}$.',
    ],
  }),
  card({
    id: 'sd-08',
    topic: 'two-triangles',
    prompt:
      'Given $\\cos\\alpha=-\\dfrac{3}{5}$ and $\\sin\\beta=\\dfrac{5}{13}$ with $\\beta$ in Quadrant I, which value of $\\cos\\beta$ is correct?',
    choices: [
      '$\\dfrac{12}{13}$',
      '$-\\dfrac{12}{13}$',
      '$\\dfrac{5}{12}$',
      '$\\dfrac{13}{5}$',
    ],
    correct: '$\\dfrac{12}{13}$',
    rule: 'Two-Triangle Problem',
    explanation:
      'From $\\sin\\beta=\\dfrac{5}{13}$, adjacent is $12$. Quadrant I keeps cosine positive: $\\cos\\beta=\\dfrac{12}{13}$.',
    steps: [
      'Solve $x^2+5^2=13^2$ to get $|x|=12$.',
      'Quadrant I means both sine and cosine are positive.',
      'So $\\cos\\beta=\\dfrac{12}{13}$.',
    ],
  }),
  card({
    id: 'sd-09',
    topic: 'two-triangles',
    prompt:
      'Given $\\sin\\alpha=\\dfrac{3}{5}$ (QI) and $\\cos\\beta=\\dfrac{5}{13}$ (QI), find $\\sin(\\alpha+\\beta)$.',
    choices: [
      '$\\dfrac{56}{65}$',
      '$\\dfrac{16}{65}$',
      '$\\dfrac{33}{65}$',
      '$\\dfrac{63}{65}$',
    ],
    correct: '$\\dfrac{56}{65}$',
    rule: 'Two-Triangle Problem',
    explanation:
      '$\\cos\\alpha=\\dfrac{4}{5}$, $\\sin\\beta=\\dfrac{12}{13}$, so $\\sin(\\alpha+\\beta)=\\dfrac{3}{5}\\cdot\\dfrac{5}{13}+\\dfrac{4}{5}\\cdot\\dfrac{12}{13}=\\dfrac{56}{65}$.',
    steps: [
      'Find $\\cos\\alpha=\\dfrac{4}{5}$ and $\\sin\\beta=\\dfrac{12}{13}$ (both QI, positive).',
      'Use $\\sin(\\alpha+\\beta)=\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta$.',
      'Substitute: $\\dfrac{3}{5}\\cdot\\dfrac{5}{13}+\\dfrac{4}{5}\\cdot\\dfrac{12}{13}$.',
      'Simplify to $\\dfrac{56}{65}$.',
    ],
  }),
  card({
    id: 'sd-10',
    topic: 'two-triangles',
    prompt:
      'Given $\\tan\\alpha=\\dfrac{3}{4}$ (QI) and $\\tan\\beta=\\dfrac{5}{12}$ (QI), find $\\tan(\\alpha+\\beta)$.',
    choices: [
      '$\\dfrac{56}{33}$',
      '$\\dfrac{16}{63}$',
      '$\\dfrac{8}{7}$',
      '$\\dfrac{63}{16}$',
    ],
    correct: '$\\dfrac{56}{33}$',
    rule: 'Two-Triangle Problem',
    explanation:
      '$\\tan(\\alpha+\\beta)=\\dfrac{\\tan\\alpha+\\tan\\beta}{1-\\tan\\alpha\\tan\\beta}=\\dfrac{\\tfrac{3}{4}+\\tfrac{5}{12}}{1-\\tfrac{3}{4}\\cdot\\tfrac{5}{12}}=\\dfrac{\\tfrac{14}{12}}{\\tfrac{33}{48}}=\\dfrac{56}{33}$.',
    steps: [
      'Apply $\\tan(\\alpha+\\beta)=\\dfrac{\\tan\\alpha+\\tan\\beta}{1-\\tan\\alpha\\tan\\beta}$.',
      'Numerator: $\\dfrac{3}{4}+\\dfrac{5}{12}=\\dfrac{14}{12}$.',
      'Denominator: $1-\\dfrac{15}{48}=\\dfrac{33}{48}$.',
      'Divide: $\\dfrac{14}{12}\\cdot\\dfrac{48}{33}=\\dfrac{56}{33}$.',
    ],
  }),

  // —— simplify-expression (5) ——
  card({
    id: 'sd-11',
    topic: 'simplify-expression',
    prompt: 'Simplify $\\sin\\left(x+\\dfrac{\\pi}{2}\\right)$.',
    choices: ['$\\cos x$', '$-\\cos x$', '$\\sin x$', '$-\\sin x$'],
    correct: '$\\cos x$',
    rule: 'Sum and Difference Identities',
    explanation:
      '$\\sin\\left(x+\\dfrac{\\pi}{2}\\right)=\\sin x\\cos\\dfrac{\\pi}{2}+\\cos x\\sin\\dfrac{\\pi}{2}=\\cos x$.',
    steps: [
      'Expand with $\\sin(x+\\tfrac{\\pi}{2})=\\sin x\\cos\\tfrac{\\pi}{2}+\\cos x\\sin\\tfrac{\\pi}{2}$.',
      'Use $\\cos\\tfrac{\\pi}{2}=0$ and $\\sin\\tfrac{\\pi}{2}=1$.',
      'The expression simplifies to $\\cos x$.',
    ],
  }),
  card({
    id: 'sd-12',
    topic: 'simplify-expression',
    prompt: 'Simplify $\\tan(x+\\pi)$.',
    choices: ['$\\tan x$', '$-\\tan x$', '$\\cot x$', '$0$'],
    correct: '$\\tan x$',
    rule: 'Sum and Difference Identities',
    explanation:
      '$\\tan(x+\\pi)=\\dfrac{\\tan x+\\tan\\pi}{1-\\tan x\\tan\\pi}$ and $\\tan\\pi=0$, so the result is $\\tan x$.',
    steps: [
      'Write $\\dfrac{\\tan x+\\tan\\pi}{1-\\tan x\\tan\\pi}$.',
      'Replace $\\tan\\pi$ with $0$.',
      'Simplify to $\\tan x$.',
    ],
  }),
  card({
    id: 'sd-13',
    topic: 'simplify-expression',
    prompt: 'Simplify $\\cos\\left(x-\\dfrac{\\pi}{2}\\right)$.',
    choices: ['$\\sin x$', '$-\\sin x$', '$\\cos x$', '$-\\cos x$'],
    correct: '$\\sin x$',
    rule: 'Sum and Difference Identities',
    explanation:
      '$\\cos\\left(x-\\tfrac{\\pi}{2}\\right)=\\cos x\\cos\\tfrac{\\pi}{2}+\\sin x\\sin\\tfrac{\\pi}{2}=\\sin x$.',
    steps: [
      'Expand with the cosine difference formula.',
      'Use $\\cos\\tfrac{\\pi}{2}=0$ and $\\sin\\tfrac{\\pi}{2}=1$.',
      'Remain $\\sin x$.',
    ],
  }),
  card({
    id: 'sd-14',
    topic: 'simplify-expression',
    prompt: 'Simplify $\\sin(\\pi - x)$.',
    choices: ['$\\sin x$', '$-\\sin x$', '$\\cos x$', '$-\\cos x$'],
    correct: '$\\sin x$',
    rule: 'Sum and Difference Identities',
    explanation:
      '$\\sin(\\pi-x)=\\sin\\pi\\cos x-\\cos\\pi\\sin x=0\\cdot\\cos x-(-1)\\sin x=\\sin x$.',
    steps: [
      'Expand $\\sin(\\pi-x)=\\sin\\pi\\cos x-\\cos\\pi\\sin x$.',
      'Use $\\sin\\pi=0$ and $\\cos\\pi=-1$.',
      'Simplify to $\\sin x$.',
    ],
  }),
  card({
    id: 'sd-15',
    topic: 'simplify-expression',
    prompt: 'Simplify $\\cos(x+\\pi)$.',
    choices: ['$-\\cos x$', '$\\cos x$', '$-\\sin x$', '$\\sin x$'],
    correct: '$-\\cos x$',
    rule: 'Sum and Difference Identities',
    explanation:
      '$\\cos(x+\\pi)=\\cos x\\cos\\pi-\\sin x\\sin\\pi=\\cos x(-1)-\\sin x(0)=-\\cos x$.',
    steps: [
      'Expand with $\\cos(x+\\pi)=\\cos x\\cos\\pi-\\sin x\\sin\\pi$.',
      'Use $\\cos\\pi=-1$ and $\\sin\\pi=0$.',
      'Simplify to $-\\cos x$.',
    ],
  }),
]
