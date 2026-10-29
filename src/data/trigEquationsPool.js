/** Practice pool for College Trig: Solving Trigonometric Equations. LaTeX uses double-escaped backslashes. */

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

export const trigEquationsPracticePool = [
  // —— linear-isolate (5) ——
  card({
    id: 'te-01',
    topic: 'linear-isolate',
    prompt:
      'Solve $5\\sin x = 3\\sin x + \\sqrt{3}$ for $x$ in $[0, 2\\pi)$. Which solution set is correct?',
    choices: [
      '$\\dfrac{\\pi}{3},\\ \\dfrac{2\\pi}{3}$',
      '$\\dfrac{\\pi}{6},\\ \\dfrac{5\\pi}{6}$',
      '$\\dfrac{\\pi}{3}$ only',
      '$\\dfrac{\\pi}{4},\\ \\dfrac{3\\pi}{4}$',
    ],
    correct: '$\\dfrac{\\pi}{3},\\ \\dfrac{2\\pi}{3}$',
    rule: 'Isolating the Function',
    explanation:
      'Isolate to get $\\sin x=\\dfrac{\\sqrt{3}}{2}$. In $[0,2\\pi)$, sine is that value at $\\dfrac{\\pi}{3}$ and $\\dfrac{2\\pi}{3}$.',
    steps: [
      'Subtract $3\\sin x$: $2\\sin x=\\sqrt{3}$.',
      'Divide by $2$: $\\sin x=\\dfrac{\\sqrt{3}}{2}$.',
      'On the unit circle in $[0,2\\pi)$: $\\dfrac{\\pi}{3}$ (QI) and $\\dfrac{2\\pi}{3}$ (QII).',
    ],
  }),
  card({
    id: 'te-02',
    topic: 'linear-isolate',
    prompt:
      'After solving $\\sin x=\\dfrac{\\sqrt{3}}{2}$ on $[0,2\\pi)$, which form gives all real solutions?',
    choices: [
      '$x=\\dfrac{\\pi}{3}+2n\\pi$ or $x=\\dfrac{2\\pi}{3}+2n\\pi$, $n\\in\\mathbb{Z}$',
      '$x=\\dfrac{\\pi}{3}+n\\pi$, $n\\in\\mathbb{Z}$',
      '$x=\\dfrac{\\pi}{3}+2n\\pi$ only',
      '$x=\\dfrac{2\\pi}{3}+n\\pi$, $n\\in\\mathbb{Z}$',
    ],
    correct: '$x=\\dfrac{\\pi}{3}+2n\\pi$ or $x=\\dfrac{2\\pi}{3}+2n\\pi$, $n\\in\\mathbb{Z}$',
    rule: 'Isolating the Function',
    explanation:
      'Each solution in one period repeats every $2\\pi$, so add $+2n\\pi$ to both $\\dfrac{\\pi}{3}$ and $\\dfrac{2\\pi}{3}$.',
    steps: [
      'Find the base solutions in $[0,2\\pi)$: $\\dfrac{\\pi}{3},\\dfrac{2\\pi}{3}$.',
      'Sine (and the unit circle) repeats every $2\\pi$.',
      'Write the general solution with $+2n\\pi$ on each base angle.',
    ],
  }),
  card({
    id: 'te-03',
    topic: 'linear-isolate',
    prompt: 'Solve $2\\cos x = 1$ for $x$ in $[0, 2\\pi)$.',
    choices: [
      '$\\dfrac{\\pi}{3},\\ \\dfrac{5\\pi}{3}$',
      '$\\dfrac{\\pi}{6},\\ \\dfrac{11\\pi}{6}$',
      '$\\dfrac{\\pi}{3},\\ \\dfrac{2\\pi}{3}$',
      '$\\dfrac{\\pi}{4},\\ \\dfrac{7\\pi}{4}$',
    ],
    correct: '$\\dfrac{\\pi}{3},\\ \\dfrac{5\\pi}{3}$',
    rule: 'Isolating the Function',
    explanation:
      '$\\cos x=\\dfrac{1}{2}$ at $\\dfrac{\\pi}{3}$ (QI) and $\\dfrac{5\\pi}{3}$ (QIV) in $[0,2\\pi)$.',
    steps: [
      'Isolate: $\\cos x=\\dfrac{1}{2}$.',
      'Cosine is positive in QI and QIV.',
      'Solutions: $\\dfrac{\\pi}{3},\\dfrac{5\\pi}{3}$.',
    ],
  }),
  card({
    id: 'te-04',
    topic: 'linear-isolate',
    prompt:
      'Solve $3\\tan x - \\sqrt{3} = 0$ for $x$ in $[0, \\pi)$ (principal cycle for tangent).',
    choices: [
      '$\\dfrac{\\pi}{6}$',
      '$\\dfrac{\\pi}{3}$',
      '$\\dfrac{\\pi}{6},\\ \\dfrac{7\\pi}{6}$',
      '$\\dfrac{\\pi}{3},\\ \\dfrac{4\\pi}{3}$',
    ],
    correct: '$\\dfrac{\\pi}{6}$',
    rule: 'Isolating the Function',
    explanation:
      '$\\tan x=\\dfrac{\\sqrt{3}}{3}$ has one solution in $[0,\\pi)$: $\\dfrac{\\pi}{6}$.',
    steps: [
      'Isolate: $\\tan x=\\dfrac{\\sqrt{3}}{3}$.',
      'On $[0,\\pi)$, tangent hits that value at $\\dfrac{\\pi}{6}$.',
      'General form later adds $+n\\pi$.',
    ],
  }),
  card({
    id: 'te-05',
    topic: 'linear-isolate',
    prompt: 'Solve $\\sin x = -\\dfrac{1}{2}$ for $x$ in $[0, 2\\pi)$.',
    choices: [
      '$\\dfrac{7\\pi}{6},\\ \\dfrac{11\\pi}{6}$',
      '$\\dfrac{\\pi}{6},\\ \\dfrac{5\\pi}{6}$',
      '$\\dfrac{4\\pi}{3},\\ \\dfrac{5\\pi}{3}$',
      '$\\dfrac{7\\pi}{6}$ only',
    ],
    correct: '$\\dfrac{7\\pi}{6},\\ \\dfrac{11\\pi}{6}$',
    rule: 'Isolating the Function',
    explanation:
      'Sine is $-\\dfrac{1}{2}$ in QIII and QIV: $\\dfrac{7\\pi}{6}$ and $\\dfrac{11\\pi}{6}$.',
    steps: [
      'Reference angle for $\\dfrac{1}{2}$ is $\\dfrac{\\pi}{6}$.',
      'Negative sine: QIII and QIV.',
      'Solutions: $\\dfrac{7\\pi}{6},\\dfrac{11\\pi}{6}$.',
    ],
  }),

  // —— quadratic-factoring (5) ——
  card({
    id: 'te-06',
    topic: 'quadratic-factoring',
    prompt:
      'Solve $\\sin x\\tan x = \\sin x$ for $x$ in $[0, 2\\pi)$. Which complete solution set is correct?',
    choices: [
      '$0,\\ \\dfrac{\\pi}{4},\\ \\pi,\\ \\dfrac{5\\pi}{4}$',
      '$\\dfrac{\\pi}{4},\\ \\dfrac{5\\pi}{4}$',
      '$0,\\ \\pi$',
      '$\\dfrac{\\pi}{4},\\ \\dfrac{3\\pi}{4},\\ \\dfrac{5\\pi}{4},\\ \\dfrac{7\\pi}{4}$',
    ],
    correct: '$0,\\ \\dfrac{\\pi}{4},\\ \\pi,\\ \\dfrac{5\\pi}{4}$',
    rule: 'Quadratic Form & Factoring',
    explanation:
      'Factor $\\sin x(\\tan x-1)=0$. Then $\\sin x=0$ gives $0,\\pi$ and $\\tan x=1$ gives $\\dfrac{\\pi}{4},\\dfrac{5\\pi}{4}$. Dividing by $\\sin x$ loses $0$ and $\\pi$.',
    steps: [
      'Set the equation to zero: $\\sin x\\tan x-\\sin x=0$.',
      'Factor out the common term: $\\sin x(\\tan x-1)=0$.',
      'Set each factor to zero: $\\sin x=0$ and $\\tan x=1$.',
      'Find the angles on the unit circle: $0,\\pi$ and $\\dfrac{\\pi}{4},\\dfrac{5\\pi}{4}$.',
    ],
  }),
  card({
    id: 'te-07',
    topic: 'quadratic-factoring',
    prompt:
      'A student divides both sides of $\\sin x\\tan x=\\sin x$ by $\\sin x$ and gets $\\tan x=1$. What went wrong?',
    choices: [
      'Dividing by $\\sin x$ discards the solutions where $\\sin x=0$.',
      'Nothing — $\\tan x=1$ is the complete solution.',
      'They should have divided by $\\tan x$ instead.',
      'Tangent is undefined, so the equation has no solutions.',
    ],
    correct: 'Dividing by $\\sin x$ discards the solutions where $\\sin x=0$.',
    rule: 'Quadratic Form & Factoring',
    explanation:
      'You cannot divide by an expression that might be zero. Factoring keeps $\\sin x=0$ as a valid branch.',
    steps: [
      'If $\\sin x=0$, the original equation is true ($0=0$).',
      'Dividing by $\\sin x$ assumes $\\sin x\\neq 0$ and drops those angles.',
      'Always move terms and factor instead of dividing by a trig function.',
    ],
  }),
  card({
    id: 'te-08',
    topic: 'quadratic-factoring',
    prompt: 'Solve $4\\cos^2 x - 3 = 0$ for $x$ in $[0, 2\\pi)$.',
    choices: [
      '$\\dfrac{\\pi}{6},\\ \\dfrac{5\\pi}{6},\\ \\dfrac{7\\pi}{6},\\ \\dfrac{11\\pi}{6}$',
      '$\\dfrac{\\pi}{3},\\ \\dfrac{2\\pi}{3},\\ \\dfrac{4\\pi}{3},\\ \\dfrac{5\\pi}{3}$',
      '$\\dfrac{\\pi}{6},\\ \\dfrac{11\\pi}{6}$',
      '$\\dfrac{\\pi}{3},\\ \\dfrac{5\\pi}{3}$',
    ],
    correct: '$\\dfrac{\\pi}{6},\\ \\dfrac{5\\pi}{6},\\ \\dfrac{7\\pi}{6},\\ \\dfrac{11\\pi}{6}$',
    rule: 'Quadratic Form & Factoring',
    explanation:
      '$\\cos^2 x=\\dfrac{3}{4}$ so $\\cos x=\\pm\\dfrac{\\sqrt{3}}{2}$. That yields four angles in $[0,2\\pi)$.',
    steps: [
      'Isolate: $\\cos^2 x=\\dfrac{3}{4}$.',
      'Take square roots with $\\pm$: $\\cos x=\\pm\\dfrac{\\sqrt{3}}{2}$.',
      'Four solutions: $\\dfrac{\\pi}{6},\\dfrac{5\\pi}{6},\\dfrac{7\\pi}{6},\\dfrac{11\\pi}{6}$.',
    ],
  }),
  card({
    id: 'te-09',
    topic: 'quadratic-factoring',
    prompt: 'Solve $2\\sin^2 x - \\sin x = 0$ for $x$ in $[0, 2\\pi)$.',
    choices: [
      '$0,\\ \\dfrac{\\pi}{6},\\ \\pi,\\ \\dfrac{5\\pi}{6}$',
      '$0,\\ \\pi$',
      '$\\dfrac{\\pi}{6},\\ \\dfrac{5\\pi}{6}$',
      '$\\dfrac{\\pi}{2},\\ \\dfrac{3\\pi}{2}$',
    ],
    correct: '$0,\\ \\dfrac{\\pi}{6},\\ \\pi,\\ \\dfrac{5\\pi}{6}$',
    rule: 'Quadratic Form & Factoring',
    explanation:
      'Factor $\\sin x(2\\sin x-1)=0$. Then $\\sin x=0$ or $\\sin x=\\dfrac{1}{2}$.',
    steps: [
      'Factor: $\\sin x(2\\sin x-1)=0$.',
      'Solve $\\sin x=0$: $0,\\pi$.',
      'Solve $\\sin x=\\dfrac{1}{2}$: $\\dfrac{\\pi}{6},\\dfrac{5\\pi}{6}$.',
    ],
  }),
  card({
    id: 'te-10',
    topic: 'quadratic-factoring',
    prompt: 'Solve $\\tan^2 x - 1 = 0$ for $x$ in $[0, 2\\pi)$, excluding where $\\tan x$ is undefined.',
    choices: [
      '$\\dfrac{\\pi}{4},\\ \\dfrac{3\\pi}{4},\\ \\dfrac{5\\pi}{4},\\ \\dfrac{7\\pi}{4}$',
      '$\\dfrac{\\pi}{4},\\ \\dfrac{5\\pi}{4}$',
      '$\\dfrac{\\pi}{3},\\ \\dfrac{2\\pi}{3},\\ \\dfrac{4\\pi}{3},\\ \\dfrac{5\\pi}{3}$',
      '$0,\\ \\pi$',
    ],
    correct: '$\\dfrac{\\pi}{4},\\ \\dfrac{3\\pi}{4},\\ \\dfrac{5\\pi}{4},\\ \\dfrac{7\\pi}{4}$',
    rule: 'Quadratic Form & Factoring',
    explanation:
      '$\\tan x=\\pm 1$ gives four solutions in $[0,2\pi)$ (avoiding odd multiples of $\\dfrac{\\pi}{2}$).',
    steps: [
      'Factor or take roots: $\\tan x=\\pm 1$.',
      '$\\tan x=1$: $\\dfrac{\\pi}{4},\\dfrac{5\\pi}{4}$.',
      '$\\tan x=-1$: $\\dfrac{3\\pi}{4},\\dfrac{7\\pi}{4}$.',
    ],
  }),

  // —— identities-equations (5) ——
  card({
    id: 'te-11',
    topic: 'identities-equations',
    prompt: 'Solve $\\sin 2x - \\sin x = 0$ for $x$ in $[0, 2\\pi)$.',
    choices: [
      '$0,\\ \\dfrac{\\pi}{3},\\ \\pi,\\ \\dfrac{5\\pi}{3}$',
      '$0,\\ \\pi$',
      '$\\dfrac{\\pi}{3},\\ \\dfrac{5\\pi}{3}$',
      '$0,\\ \\dfrac{\\pi}{2},\\ \\pi,\\ \\dfrac{3\\pi}{2}$',
    ],
    correct: '$0,\\ \\dfrac{\\pi}{3},\\ \\pi,\\ \\dfrac{5\\pi}{3}$',
    rule: 'Using Identities to Solve',
    explanation:
      'Replace $\\sin 2x$ with $2\\sin x\\cos x$, factor $\\sin x(2\\cos x-1)=0$, then solve both factors.',
    steps: [
      'Substitute $\\sin 2x=2\\sin x\\cos x$: $2\\sin x\\cos x-\\sin x=0$.',
      'Factor: $\\sin x(2\\cos x-1)=0$.',
      'Solve $\\sin x=0$: $0,\\pi$.',
      'Solve $\\cos x=\\dfrac{1}{2}$: $\\dfrac{\\pi}{3},\\dfrac{5\\pi}{3}$.',
    ],
  }),
  card({
    id: 'te-12',
    topic: 'identities-equations',
    prompt:
      'To solve $\\sin 2x - \\sin x = 0$, which first move correctly resolves the angle mismatch?',
    choices: [
      'Replace $\\sin 2x$ with $2\\sin x\\cos x$.',
      'Divide both sides by $\\sin x$.',
      'Replace $\\sin x$ with $\\sin 2x$.',
      'Square both sides.',
    ],
    correct: 'Replace $\\sin 2x$ with $2\\sin x\\cos x$.',
    rule: 'Using Identities to Solve',
    explanation:
      'The angles $2x$ and $x$ do not match until a double-angle identity rewrites everything in terms of $x$.',
    steps: [
      'Notice the equation mixes $\\sin 2x$ and $\\sin x$.',
      'Use $\\sin 2x=2\\sin x\\cos x$ to match angles.',
      'Then factor and solve without dividing away $\\sin x=0$.',
    ],
  }),
  card({
    id: 'te-13',
    topic: 'identities-equations',
    prompt: 'Solve $\\cos 2x = \\cos x$ for $x$ in $[0, 2\\pi)$.',
    choices: [
      '$0,\\ \\dfrac{2\\pi}{3},\\ \\dfrac{4\\pi}{3}$',
      '$0,\\ \\pi$',
      '$\\dfrac{\\pi}{3},\\ \\dfrac{5\\pi}{3}$',
      '$0,\\ \\dfrac{\\pi}{2},\\ \\pi,\\ \\dfrac{3\\pi}{2}$',
    ],
    correct: '$0,\\ \\dfrac{2\\pi}{3},\\ \\dfrac{4\\pi}{3}$',
    rule: 'Using Identities to Solve',
    explanation:
      'Use $\\cos 2x=2\\cos^2 x-1$: $2\\cos^2 x-\\cos x-1=0$ factors as $(2\\cos x+1)(\\cos x-1)=0$.',
    steps: [
      'Rewrite $\\cos 2x=2\\cos^2 x-1$.',
      'Bring to one side: $2\\cos^2 x-\\cos x-1=0$.',
      'Factor: $(2\\cos x+1)(\\cos x-1)=0$.',
      'Solve: $\\cos x=1\\Rightarrow 0$; $\\cos x=-\\dfrac{1}{2}\\Rightarrow \\dfrac{2\\pi}{3},\\dfrac{4\\pi}{3}$.',
    ],
  }),
  card({
    id: 'te-14',
    topic: 'identities-equations',
    prompt: 'Solve $\\sin^2 x = \\cos^2 x$ for $x$ in $[0, 2\\pi)$.',
    choices: [
      '$\\dfrac{\\pi}{4},\\ \\dfrac{3\\pi}{4},\\ \\dfrac{5\\pi}{4},\\ \\dfrac{7\\pi}{4}$',
      '$\\dfrac{\\pi}{4},\\ \\dfrac{5\\pi}{4}$',
      '$0,\\ \\dfrac{\\pi}{2},\\ \\pi,\\ \\dfrac{3\\pi}{2}$',
      '$\\dfrac{\\pi}{6},\\ \\dfrac{5\\pi}{6},\\ \\dfrac{7\\pi}{6},\\ \\dfrac{11\\pi}{6}$',
    ],
    correct: '$\\dfrac{\\pi}{4},\\ \\dfrac{3\\pi}{4},\\ \\dfrac{5\\pi}{4},\\ \\dfrac{7\\pi}{4}$',
    rule: 'Using Identities to Solve',
    explanation:
      'Rearrange to $\\sin^2 x-\\cos^2 x=0$ or divide carefully after checking zeros: equivalent to $\\tan^2 x=1$ away from undefined points, giving four odd multiples of $\\dfrac{\\pi}{4}$.',
    steps: [
      'Rewrite as $\\cos 2x=0$ using $\\cos 2x=\\cos^2 x-\\sin^2 x=-(\\sin^2 x-\\cos^2 x)$.',
      'From $\\sin^2 x-\\cos^2 x=0$, get $-\\cos 2x=0$ so $\\cos 2x=0$.',
      'Then $2x=\\dfrac{\\pi}{2}+n\\pi$ → $x=\\dfrac{\\pi}{4}+\\dfrac{n\\pi}{2}$ for the four solutions in $[0,2\\pi)$.',
    ],
  }),
  card({
    id: 'te-15',
    topic: 'identities-equations',
    prompt: 'Solve $2\\sin x\\cos x = \\sqrt{3}\\sin x$ for $x$ in $[0, 2\\pi)$.',
    choices: [
      '$0,\\ \\dfrac{\\pi}{6},\\ \\pi,\\ \\dfrac{11\\pi}{6}$',
      '$\\dfrac{\\pi}{6},\\ \\dfrac{11\\pi}{6}$',
      '$0,\\ \\pi$',
      '$\\dfrac{\\pi}{3},\\ \\dfrac{2\\pi}{3}$',
    ],
    correct: '$0,\\ \\dfrac{\\pi}{6},\\ \\pi,\\ \\dfrac{11\\pi}{6}$',
    rule: 'Using Identities to Solve',
    explanation:
      'Bring to zero and factor: $\\sin x(2\\cos x-\\sqrt{3})=0$. Do not divide by $\\sin x$.',
    steps: [
      'Move all terms: $2\\sin x\\cos x-\\sqrt{3}\\sin x=0$.',
      'Factor: $\\sin x(2\\cos x-\\sqrt{3})=0$.',
      'Solve $\\sin x=0$: $0,\\pi$.',
      'Solve $\\cos x=\\dfrac{\\sqrt{3}}{2}$: $\\dfrac{\\pi}{6},\\dfrac{11\\pi}{6}$.',
    ],
  }),
]
