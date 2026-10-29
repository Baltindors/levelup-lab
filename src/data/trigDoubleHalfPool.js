/** Practice pool for College Trig: Double-Angle, Power-Reducing, Half-Angle. LaTeX uses double-escaped backslashes. */

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

export const trigDoubleHalfPracticePool = [
  // —— double-angle-eval (5) ——
  card({
    id: 'dh-01',
    topic: 'double-angle-eval',
    prompt:
      'If $\\sin\\theta=\\dfrac{4}{5}$ and $\\theta$ is in Quadrant II, find $\\sin 2\\theta$.',
    choices: [
      '$-\\dfrac{24}{25}$',
      '$\\dfrac{24}{25}$',
      '$-\\dfrac{7}{25}$',
      '$\\dfrac{7}{25}$',
    ],
    correct: '$-\\dfrac{24}{25}$',
    rule: 'Double-Angle Formulas',
    explanation:
      '$\\cos\\theta=-\\dfrac{3}{5}$, so $\\sin 2\\theta=2\\sin\\theta\\cos\\theta=2\\cdot\\dfrac{4}{5}\\cdot\\left(-\\dfrac{3}{5}\\right)=-\\dfrac{24}{25}$.',
    steps: [
      'Find the missing side: $x^2+16=25$ gives $|x|=3$. Quadrant II makes $x$ negative, so $\\cos\\theta=-\\dfrac{3}{5}$.',
      'Apply $\\sin 2\\theta=2\\sin\\theta\\cos\\theta$.',
      'Substitute: $2\\cdot\\dfrac{4}{5}\\cdot\\left(-\\dfrac{3}{5}\\right)=-\\dfrac{24}{25}$.',
    ],
  }),
  card({
    id: 'dh-02',
    topic: 'double-angle-eval',
    prompt:
      'If $\\sin\\theta=\\dfrac{4}{5}$ and $\\theta$ is in Quadrant II, find $\\cos 2\\theta$.',
    choices: [
      '$-\\dfrac{7}{25}$',
      '$\\dfrac{7}{25}$',
      '$-\\dfrac{24}{25}$',
      '$\\dfrac{24}{25}$',
    ],
    correct: '$-\\dfrac{7}{25}$',
    rule: 'Double-Angle Formulas',
    explanation:
      'With $\\cos\\theta=-\\dfrac{3}{5}$, $\\cos 2\\theta=\\cos^2\\theta-\\sin^2\\theta=\\dfrac{9}{25}-\\dfrac{16}{25}=-\\dfrac{7}{25}$.',
    steps: [
      'Establish $\\cos\\theta=-\\dfrac{3}{5}$ from the Pythagorean theorem and Quadrant II.',
      'Use $\\cos 2\\theta=\\cos^2\\theta-\\sin^2\\theta$.',
      'Compute $\\dfrac{9}{25}-\\dfrac{16}{25}=-\\dfrac{7}{25}$.',
    ],
  }),
  card({
    id: 'dh-03',
    topic: 'double-angle-eval',
    prompt:
      'If $\\sin\\theta=\\dfrac{4}{5}$ and $\\theta$ is in Quadrant II, find $\\tan 2\\theta$.',
    choices: [
      '$\\dfrac{24}{7}$',
      '$-\\dfrac{24}{7}$',
      '$\\dfrac{7}{24}$',
      '$-\\dfrac{7}{24}$',
    ],
    correct: '$\\dfrac{24}{7}$',
    rule: 'Double-Angle Formulas',
    explanation:
      '$\\tan\\theta=-\\dfrac{4}{3}$, so $\\tan 2\\theta=\\dfrac{2\\tan\\theta}{1-\\tan^2\\theta}=\\dfrac{24}{7}$.',
    steps: [
      'Form $\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}=-\\dfrac{4}{3}$.',
      'Apply $\\tan 2\\theta=\\dfrac{2\\tan\\theta}{1-\\tan^2\\theta}$.',
      'Substitute and simplify to $\\dfrac{24}{7}$.',
    ],
  }),
  card({
    id: 'dh-04',
    topic: 'double-angle-eval',
    prompt:
      'If $\\cos\\theta=\\dfrac{5}{13}$ and $\\theta$ is in Quadrant IV, find $\\sin 2\\theta$.',
    choices: [
      '$-\\dfrac{120}{169}$',
      '$\\dfrac{120}{169}$',
      '$-\\dfrac{119}{169}$',
      '$\\dfrac{119}{169}$',
    ],
    correct: '$-\\dfrac{120}{169}$',
    rule: 'Double-Angle Formulas',
    explanation:
      'Quadrant IV makes sine negative: $\\sin\\theta=-\\dfrac{12}{13}$. Then $\\sin 2\\theta=2\\sin\\theta\\cos\\theta=-\\dfrac{120}{169}$.',
    steps: [
      'From $\\cos\\theta=\\dfrac{5}{13}$, get $|\\sin\\theta|=\\dfrac{12}{13}$. Quadrant IV → $\\sin\\theta=-\\dfrac{12}{13}$.',
      'Apply $\\sin 2\\theta=2\\sin\\theta\\cos\\theta$.',
      'Substitute to get $-\\dfrac{120}{169}$.',
    ],
  }),
  card({
    id: 'dh-05',
    topic: 'double-angle-eval',
    prompt:
      'If $\\tan\\theta=\\dfrac{3}{4}$ and $\\theta$ is in Quadrant I, find $\\cos 2\\theta$.',
    choices: [
      '$\\dfrac{7}{25}$',
      '$-\\dfrac{7}{25}$',
      '$\\dfrac{24}{25}$',
      '$-\\dfrac{24}{25}$',
    ],
    correct: '$\\dfrac{7}{25}$',
    rule: 'Double-Angle Formulas',
    explanation:
      '$\\sin\\theta=\\dfrac{3}{5}$, $\\cos\\theta=\\dfrac{4}{5}$, so $\\cos 2\\theta=\\dfrac{16}{25}-\\dfrac{9}{25}=\\dfrac{7}{25}$.',
    steps: [
      'Build the triangle from $\\tan\\theta=\\dfrac{3}{4}$: opposite $3$, adjacent $4$, hypotenuse $5$.',
      'In QI: $\\sin\\theta=\\dfrac{3}{5}$, $\\cos\\theta=\\dfrac{4}{5}$.',
      'Use $\\cos 2\\theta=\\cos^2\\theta-\\sin^2\\theta=\\dfrac{7}{25}$.',
    ],
  }),

  // —— power-reducing (5) ——
  card({
    id: 'dh-06',
    topic: 'power-reducing',
    prompt: 'Which expression is equivalent to $6\\cos^2\\theta$?',
    choices: [
      '$3 + 3\\cos 2\\theta$',
      '$3 - 3\\cos 2\\theta$',
      '$6 + 6\\cos 2\\theta$',
      '$3 + 3\\sin 2\\theta$',
    ],
    correct: '$3 + 3\\cos 2\\theta$',
    rule: 'Power-Reducing Formulas',
    explanation:
      '$\\cos^2\\theta=\\dfrac{1+\\cos 2\\theta}{2}$, so $6\\cos^2\\theta=6\\cdot\\dfrac{1+\\cos 2\\theta}{2}=3+3\\cos 2\\theta$.',
    steps: [
      'Recall $\\cos^2\\theta=\\dfrac{1+\\cos 2\\theta}{2}$.',
      'Substitute: $6\\cdot\\dfrac{1+\\cos 2\\theta}{2}$.',
      'Simplify to $3+3\\cos 2\\theta$.',
    ],
  }),
  card({
    id: 'dh-07',
    topic: 'power-reducing',
    prompt: 'Which expression is equivalent to $4\\sin^2\\theta$?',
    choices: [
      '$2 - 2\\cos 2\\theta$',
      '$2 + 2\\cos 2\\theta$',
      '$4 - 4\\cos 2\\theta$',
      '$2 - 2\\sin 2\\theta$',
    ],
    correct: '$2 - 2\\cos 2\\theta$',
    rule: 'Power-Reducing Formulas',
    explanation:
      '$\\sin^2\\theta=\\dfrac{1-\\cos 2\\theta}{2}$, so $4\\sin^2\\theta=4\\cdot\\dfrac{1-\\cos 2\\theta}{2}=2-2\\cos 2\\theta$.',
    steps: [
      'Recall $\\sin^2\\theta=\\dfrac{1-\\cos 2\\theta}{2}$.',
      'Substitute into $4\\sin^2\\theta$.',
      'Simplify to $2-2\\cos 2\\theta$.',
    ],
  }),
  card({
    id: 'dh-08',
    topic: 'power-reducing',
    prompt: 'Power-reduce $\\cos^2\\theta$. Which form is correct?',
    choices: [
      '$\\dfrac{1+\\cos 2\\theta}{2}$',
      '$\\dfrac{1-\\cos 2\\theta}{2}$',
      '$\\dfrac{1+\\sin 2\\theta}{2}$',
      '$1+\\cos 2\\theta$',
    ],
    correct: '$\\dfrac{1+\\cos 2\\theta}{2}$',
    rule: 'Power-Reducing Formulas',
    explanation:
      'The power-reducing identity for cosine squared is $\\cos^2\\theta=\\dfrac{1+\\cos 2\\theta}{2}$.',
    steps: [
      'Start from the double-angle identity $\\cos 2\\theta=2\\cos^2\\theta-1$.',
      'Solve for $\\cos^2\\theta$: $\\cos^2\\theta=\\dfrac{1+\\cos 2\\theta}{2}$.',
      'This trades a square for a double angle.',
    ],
  }),
  card({
    id: 'dh-09',
    topic: 'power-reducing',
    prompt: 'Which expression is equivalent to $8\\sin^2\\theta\\cos^2\\theta$?',
    choices: [
      '$1 - \\cos 4\\theta$',
      '$2 + 2\\cos 4\\theta$',
      '$4 - 4\\cos 2\\theta$',
      '$2 - 2\\cos 2\\theta$',
    ],
    correct: '$1 - \\cos 4\\theta$',
    rule: 'Power-Reducing Formulas',
    explanation:
      '$8\\sin^2\\theta\\cos^2\\theta=2(2\\sin\\theta\\cos\\theta)^2=2\\sin^2 2\\theta=2\\cdot\\dfrac{1-\\cos 4\\theta}{2}=1-\\cos 4\\theta$.',
    steps: [
      'Rewrite $8\\sin^2\\theta\\cos^2\\theta=2(2\\sin\\theta\\cos\\theta)^2=2\\sin^2 2\\theta$.',
      'Power-reduce: $\\sin^2 2\\theta=\\dfrac{1-\\cos 4\\theta}{2}$.',
      'Then $2\\cdot\\dfrac{1-\\cos 4\\theta}{2}=1-\\cos 4\\theta$.',
    ],
  }),
  card({
    id: 'dh-10',
    topic: 'power-reducing',
    prompt: 'Which expression is equivalent to $\\sin^2\\theta$?',
    choices: [
      '$\\dfrac{1-\\cos 2\\theta}{2}$',
      '$\\dfrac{1+\\cos 2\\theta}{2}$',
      '$\\dfrac{1-\\sin 2\\theta}{2}$',
      '$1-\\cos 2\\theta$',
    ],
    correct: '$\\dfrac{1-\\cos 2\\theta}{2}$',
    rule: 'Power-Reducing Formulas',
    explanation:
      'The power-reducing identity for sine squared is $\\sin^2\\theta=\\dfrac{1-\\cos 2\\theta}{2}$.',
    steps: [
      'Start from $\\cos 2\\theta=1-2\\sin^2\\theta$.',
      'Solve for $\\sin^2\\theta$: $\\sin^2\\theta=\\dfrac{1-\\cos 2\\theta}{2}$.',
      'Use this form whenever a squared sine blocks solving or graphing.',
    ],
  }),

  // —— half-angle-eval (5) ——
  card({
    id: 'dh-11',
    topic: 'half-angle-eval',
    prompt: 'Find the exact value of $\\cos 105^\\circ$.',
    choices: [
      '$-\\dfrac{\\sqrt{2-\\sqrt{3}}}{2}$',
      '$\\dfrac{\\sqrt{2-\\sqrt{3}}}{2}$',
      '$-\\dfrac{\\sqrt{2+\\sqrt{3}}}{2}$',
      '$\\dfrac{\\sqrt{2+\\sqrt{3}}}{2}$',
    ],
    correct: '$-\\dfrac{\\sqrt{2-\\sqrt{3}}}{2}$',
    rule: 'Half-Angle Formulas',
    explanation:
      '$105^\\circ$ is in Quadrant II, so cosine is negative. $\\cos 105^\\circ=-\\sqrt{\\dfrac{1+\\cos 210^\\circ}{2}}=-\\dfrac{\\sqrt{2-\\sqrt{3}}}{2}$.',
    steps: [
      'Identify that $105^\\circ$ is in Quadrant II, so cosine will be negative.',
      'Rewrite as $\\cos\\left(\\dfrac{210^\\circ}{2}\\right)$.',
      'Apply the formula: $-\\sqrt{\\dfrac{1+\\cos 210^\\circ}{2}}$.',
      'Substitute $\\cos 210^\\circ=-\\dfrac{\\sqrt{3}}{2}$ and simplify to $-\\dfrac{\\sqrt{2-\\sqrt{3}}}{2}$.',
    ],
  }),
  card({
    id: 'dh-12',
    topic: 'half-angle-eval',
    prompt: 'Find the exact value of $\\sin 22.5^\\circ$.',
    choices: [
      '$\\dfrac{\\sqrt{2-\\sqrt{2}}}{2}$',
      '$-\\dfrac{\\sqrt{2-\\sqrt{2}}}{2}$',
      '$\\dfrac{\\sqrt{2+\\sqrt{2}}}{2}$',
      '$\\dfrac{\\sqrt{2}}{2}$',
    ],
    correct: '$\\dfrac{\\sqrt{2-\\sqrt{2}}}{2}$',
    rule: 'Half-Angle Formulas',
    explanation:
      '$22.5^\\circ$ is in QI, so sine is positive. $\\sin 22.5^\\circ=\\sqrt{\\dfrac{1-\\cos 45^\\circ}{2}}=\\dfrac{\\sqrt{2-\\sqrt{2}}}{2}$.',
    steps: [
      'Note $22.5^\\circ=\\dfrac{45^\\circ}{2}$ lies in Quadrant I, so sine is positive.',
      'Apply $\\sin\\dfrac{\\alpha}{2}=\\sqrt{\\dfrac{1-\\cos\\alpha}{2}}$ with $\\alpha=45^\\circ$.',
      'Substitute $\\cos 45^\\circ=\\dfrac{\\sqrt{2}}{2}$ and simplify to $\\dfrac{\\sqrt{2-\\sqrt{2}}}{2}$.',
    ],
  }),
  card({
    id: 'dh-13',
    topic: 'half-angle-eval',
    prompt:
      'When evaluating $\\cos 105^\\circ$ with a half-angle formula, which sign must you choose?',
    choices: [
      'Negative, because $105^\\circ$ is in Quadrant II where cosine is negative.',
      'Positive, because the half-angle formula always uses a plus.',
      'Both signs, because $\\pm$ means two answers.',
      'Negative, because $210^\\circ$ is in Quadrant III.',
    ],
    correct: 'Negative, because $105^\\circ$ is in Quadrant II where cosine is negative.',
    rule: 'Half-Angle Formulas',
    explanation:
      'The $\\pm$ is chosen from the quadrant of the half-angle $\\dfrac{\\alpha}{2}=105^\\circ$, not from the full angle alone.',
    steps: [
      'Locate the half-angle $105^\\circ$: Quadrant II.',
      'Cosine is negative in Quadrant II.',
      'Therefore select the negative root: $-\\sqrt{\\dfrac{1+\\cos 210^\\circ}{2}}$.',
    ],
  }),
  card({
    id: 'dh-14',
    topic: 'half-angle-eval',
    prompt: 'Find the exact value of $\\cos 22.5^\\circ$.',
    choices: [
      '$\\dfrac{\\sqrt{2+\\sqrt{2}}}{2}$',
      '$-\\dfrac{\\sqrt{2+\\sqrt{2}}}{2}$',
      '$\\dfrac{\\sqrt{2-\\sqrt{2}}}{2}$',
      '$\\dfrac{\\sqrt{2}}{2}$',
    ],
    correct: '$\\dfrac{\\sqrt{2+\\sqrt{2}}}{2}$',
    rule: 'Half-Angle Formulas',
    explanation:
      '$22.5^\\circ$ is in QI, so cosine is positive. $\\cos 22.5^\\circ=\\sqrt{\\dfrac{1+\\cos 45^\\circ}{2}}=\\dfrac{\\sqrt{2+\\sqrt{2}}}{2}$.',
    steps: [
      'Half-angle $22.5^\\circ$ is in Quadrant I → positive cosine.',
      'Apply $\\cos\\dfrac{\\alpha}{2}=\\sqrt{\\dfrac{1+\\cos\\alpha}{2}}$ with $\\alpha=45^\\circ$.',
      'Substitute and simplify to $\\dfrac{\\sqrt{2+\\sqrt{2}}}{2}$.',
    ],
  }),
  card({
    id: 'dh-15',
    topic: 'half-angle-eval',
    prompt: 'Find the exact value of $\\sin 105^\\circ$.',
    choices: [
      '$\\dfrac{\\sqrt{2+\\sqrt{3}}}{2}$',
      '$-\\dfrac{\\sqrt{2+\\sqrt{3}}}{2}$',
      '$\\dfrac{\\sqrt{2-\\sqrt{3}}}{2}$',
      '$-\\dfrac{\\sqrt{2-\\sqrt{3}}}{2}$',
    ],
    correct: '$\\dfrac{\\sqrt{2+\\sqrt{3}}}{2}$',
    rule: 'Half-Angle Formulas',
    explanation:
      '$105^\\circ$ is in QII where sine is positive. $\\sin 105^\\circ=\\sqrt{\\dfrac{1-\\cos 210^\\circ}{2}}=\\dfrac{\\sqrt{2+\\sqrt{3}}}{2}$.',
    steps: [
      'Half-angle $105^\\circ$ is in Quadrant II → sine is positive.',
      'Apply $\\sin\\dfrac{\\alpha}{2}=\\sqrt{\\dfrac{1-\\cos\\alpha}{2}}$ with $\\alpha=210^\\circ$.',
      'Use $\\cos 210^\\circ=-\\dfrac{\\sqrt{3}}{2}$ and simplify to $\\dfrac{\\sqrt{2+\\sqrt{3}}}{2}$.',
    ],
  }),
]
