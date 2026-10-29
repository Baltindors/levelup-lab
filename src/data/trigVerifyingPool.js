/** Practice pool for College Trig: Verifying Trigonometric Identities. LaTeX uses double-escaped backslashes. */

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

export const trigVerifyingPracticePool = [
  // —— strategy-sincos (5) ——
  card({
    id: 'tv-01',
    topic: 'strategy-sincos',
    prompt:
      'Rewrite $\\csc x \\tan x$ entirely in sine and cosine. Which expression is correct?',
    choices: [
      '$\\dfrac{1}{\\sin x}\\cdot\\dfrac{\\sin x}{\\cos x}$',
      '$\\dfrac{1}{\\cos x}\\cdot\\dfrac{\\cos x}{\\sin x}$',
      '$\\sin x\\cdot\\dfrac{\\sin x}{\\cos x}$',
      '$\\dfrac{1}{\\sin x}\\cdot\\dfrac{\\cos x}{\\sin x}$',
    ],
    correct: '$\\dfrac{1}{\\sin x}\\cdot\\dfrac{\\sin x}{\\cos x}$',
    rule: 'Change to Sines and Cosines',
    explanation:
      '$\\csc x=\\dfrac{1}{\\sin x}$ and $\\tan x=\\dfrac{\\sin x}{\\cos x}$, so the product is $\\dfrac{1}{\\sin x}\\cdot\\dfrac{\\sin x}{\\cos x}$.',
    steps: [
      'Replace reciprocal and quotient forms: $\\csc x=\\dfrac{1}{\\sin x}$ and $\\tan x=\\dfrac{\\sin x}{\\cos x}$.',
      'Multiply: $\\dfrac{1}{\\sin x}\\cdot\\dfrac{\\sin x}{\\cos x}$.',
      'The $\\sin x$ factors cancel, leaving $\\dfrac{1}{\\cos x}=\\sec x$.',
    ],
  }),
  card({
    id: 'tv-02',
    topic: 'strategy-sincos',
    prompt:
      'After rewriting $\\sec x \\cot x$ in sine and cosine, which simplified form do you get before renaming?',
    choices: [
      '$\\dfrac{1}{\\sin x}$',
      '$\\dfrac{1}{\\cos x}$',
      '$\\sin x$',
      '$\\cos x$',
    ],
    correct: '$\\dfrac{1}{\\sin x}$',
    rule: 'Change to Sines and Cosines',
    explanation:
      '$\\sec x\\cot x=\\dfrac{1}{\\cos x}\\cdot\\dfrac{\\cos x}{\\sin x}=\\dfrac{1}{\\sin x}$.',
    steps: [
      'Write $\\sec x=\\dfrac{1}{\\cos x}$ and $\\cot x=\\dfrac{\\cos x}{\\sin x}$.',
      'Multiply: $\\dfrac{1}{\\cos x}\\cdot\\dfrac{\\cos x}{\\sin x}$.',
      'Cancel $\\cos x$ to get $\\dfrac{1}{\\sin x}$, which is $\\csc x$.',
    ],
  }),
  card({
    id: 'tv-03',
    topic: 'strategy-sincos',
    prompt:
      'Convert $\\dfrac{\\tan x}{\\sec x}$ to sine and cosine. What is the correct first rewrite?',
    choices: [
      '$\\dfrac{\\left(\\dfrac{\\sin x}{\\cos x}\\right)}{\\left(\\dfrac{1}{\\cos x}\\right)}$',
      '$\\dfrac{\\left(\\dfrac{\\cos x}{\\sin x}\\right)}{\\left(\\dfrac{1}{\\sin x}\\right)}$',
      '$\\dfrac{\\sin x}{\\cos x}\\cdot\\dfrac{1}{\\cos x}$',
      '$\\sin x\\cdot\\cos x$',
    ],
    correct: '$\\dfrac{\\left(\\dfrac{\\sin x}{\\cos x}\\right)}{\\left(\\dfrac{1}{\\cos x}\\right)}$',
    rule: 'Change to Sines and Cosines',
    explanation:
      '$\\tan x=\\dfrac{\\sin x}{\\cos x}$ and $\\sec x=\\dfrac{1}{\\cos x}$, so the quotient is those two fractions stacked.',
    steps: [
      'Replace $\\tan x$ with $\\dfrac{\\sin x}{\\cos x}$ and $\\sec x$ with $\\dfrac{1}{\\cos x}$.',
      'Dividing by a fraction multiplies by its reciprocal: $\\dfrac{\\sin x}{\\cos x}\\cdot\\cos x=\\sin x$.',
      'So $\\dfrac{\\tan x}{\\sec x}=\\sin x$.',
    ],
  }),
  card({
    id: 'tv-04',
    topic: 'strategy-sincos',
    prompt:
      'Which expression is the sine/cosine form of $\\cot x \\sin x$?',
    choices: [
      '$\\dfrac{\\cos x}{\\sin x}\\cdot\\sin x$',
      '$\\dfrac{\\sin x}{\\cos x}\\cdot\\sin x$',
      '$\\dfrac{1}{\\sin x}\\cdot\\sin x$',
      '$\\dfrac{\\cos x}{\\sin x}\\cdot\\cos x$',
    ],
    correct: '$\\dfrac{\\cos x}{\\sin x}\\cdot\\sin x$',
    rule: 'Change to Sines and Cosines',
    explanation:
      '$\\cot x=\\dfrac{\\cos x}{\\sin x}$, so $\\cot x\\sin x=\\dfrac{\\cos x}{\\sin x}\\cdot\\sin x$, which cancels to $\\cos x$.',
    steps: [
      'Use the quotient identity $\\cot x=\\dfrac{\\cos x}{\\sin x}$.',
      'Multiply by $\\sin x$: $\\dfrac{\\cos x}{\\sin x}\\cdot\\sin x$.',
      'Cancel $\\sin x$ to leave $\\cos x$.',
    ],
  }),
  card({
    id: 'tv-05',
    topic: 'strategy-sincos',
    prompt:
      'To verify $\\csc x \\tan x = \\sec x$, after converting and canceling, what remains on the left before the final rename?',
    choices: [
      '$\\dfrac{1}{\\cos x}$',
      '$\\dfrac{1}{\\sin x}$',
      '$\\sin x$',
      '$\\dfrac{\\sin x}{\\cos x}$',
    ],
    correct: '$\\dfrac{1}{\\cos x}$',
    rule: 'Change to Sines and Cosines',
    explanation:
      'After $\\dfrac{1}{\\sin x}\\cdot\\dfrac{\\sin x}{\\cos x}$, the $\\sin x$ cancels and $\\dfrac{1}{\\cos x}$ remains.',
    steps: [
      'Start from $\\dfrac{1}{\\sin x}\\cdot\\dfrac{\\sin x}{\\cos x}$.',
      'Cancel the common $\\sin x$ factor.',
      'What remains is $\\dfrac{1}{\\cos x}$, which equals $\\sec x$.',
    ],
  }),

  // —— strategy-factor (5) ——
  card({
    id: 'tv-06',
    topic: 'strategy-factor',
    prompt:
      'Factor the left side of $\\sin x - \\sin x \\cos^2 x$. Which form is correct?',
    choices: [
      '$\\sin x(1 - \\cos^2 x)$',
      '$\\sin x(1 - \\sin^2 x)$',
      '$\\cos x(1 - \\sin^2 x)$',
      '$\\sin x(\\cos^2 x - 1)$',
    ],
    correct: '$\\sin x(1 - \\cos^2 x)$',
    rule: 'Factoring and Pythagorean Substitution',
    explanation:
      'Both terms share $\\sin x$, so factor: $\\sin x(1-\\cos^2 x)$.',
    steps: [
      'Notice $\\sin x$ is common to both terms on the left.',
      'Factor: $\\sin x(1-\\cos^2 x)$.',
      'Apply $1-\\cos^2 x=\\sin^2 x$, then multiply to get $\\sin^3 x$.',
    ],
  }),
  card({
    id: 'tv-07',
    topic: 'strategy-factor',
    prompt:
      'After factoring $\\sin x - \\sin x \\cos^2 x$ as $\\sin x(1-\\cos^2 x)$, which Pythagorean substitution applies?',
    choices: [
      '$1 - \\cos^2 x = \\sin^2 x$',
      '$1 - \\cos^2 x = \\cos^2 x$',
      '$1 - \\sin^2 x = \\sin^2 x$',
      '$1 + \\cos^2 x = \\sin^2 x$',
    ],
    correct: '$1 - \\cos^2 x = \\sin^2 x$',
    rule: 'Factoring and Pythagorean Substitution',
    explanation:
      'Rearrange $\\sin^2 x+\\cos^2 x=1$ to get $1-\\cos^2 x=\\sin^2 x$.',
    steps: [
      'Recall $\\sin^2 x+\\cos^2 x=1$.',
      'Subtract $\\cos^2 x$ from both sides: $1-\\cos^2 x=\\sin^2 x$.',
      'Substitute into $\\sin x(1-\\cos^2 x)$ to get $\\sin x\\cdot\\sin^2 x=\\sin^3 x$.',
    ],
  }),
  card({
    id: 'tv-08',
    topic: 'strategy-factor',
    prompt:
      'Factor $\\cos x + \\cos x \\tan^2 x$. Which expression is correct?',
    choices: [
      '$\\cos x(1 + \\tan^2 x)$',
      '$\\cos x(1 - \\tan^2 x)$',
      '$\\tan x(1 + \\cos^2 x)$',
      '$\\cos x(\\tan^2 x - 1)$',
    ],
    correct: '$\\cos x(1 + \\tan^2 x)$',
    rule: 'Factoring and Pythagorean Substitution',
    explanation:
      'Factor out $\\cos x$: $\\cos x(1+\\tan^2 x)$. Then $1+\\tan^2 x=\\sec^2 x$.',
    steps: [
      'Both terms share $\\cos x$.',
      'Factor: $\\cos x(1+\\tan^2 x)$.',
      'Use $1+\\tan^2 x=\\sec^2 x$ to continue simplifying if needed.',
    ],
  }),
  card({
    id: 'tv-09',
    topic: 'strategy-factor',
    prompt:
      'Which Pythagorean form lets you replace $1+\\tan^2 x$ inside $\\cos x(1+\\tan^2 x)$?',
    choices: [
      '$1 + \\tan^2 x = \\sec^2 x$',
      '$1 + \\tan^2 x = \\csc^2 x$',
      '$1 + \\tan^2 x = \\sin^2 x$',
      '$1 + \\tan^2 x = \\cos^2 x$',
    ],
    correct: '$1 + \\tan^2 x = \\sec^2 x$',
    rule: 'Factoring and Pythagorean Substitution',
    explanation:
      'The Pythagorean identity for tangent and secant is $1+\\tan^2 x=\\sec^2 x$.',
    steps: [
      'Start from the factored form $\\cos x(1+\\tan^2 x)$.',
      'Replace $1+\\tan^2 x$ with $\\sec^2 x$.',
      'Then $\\cos x\\cdot\\sec^2 x=\\cos x\\cdot\\dfrac{1}{\\cos^2 x}=\\dfrac{1}{\\cos x}=\\sec x$.',
    ],
  }),
  card({
    id: 'tv-10',
    topic: 'strategy-factor',
    prompt:
      'To verify $\\sin x - \\sin x \\cos^2 x = \\sin^3 x$, what is the correct next line after factoring?',
    choices: [
      '$\\sin x \\cdot \\sin^2 x$',
      '$\\sin x \\cdot \\cos^2 x$',
      '$\\cos x \\cdot \\sin^2 x$',
      '$\\sin x \\cdot (1 + \\cos^2 x)$',
    ],
    correct: '$\\sin x \\cdot \\sin^2 x$',
    rule: 'Factoring and Pythagorean Substitution',
    explanation:
      'After $\\sin x(1-\\cos^2 x)$ and $1-\\cos^2 x=\\sin^2 x$, you get $\\sin x\\cdot\\sin^2 x=\\sin^3 x$.',
    steps: [
      'Factor the left side: $\\sin x(1-\\cos^2 x)$.',
      'Substitute $1-\\cos^2 x=\\sin^2 x$.',
      'Multiply: $\\sin x\\cdot\\sin^2 x=\\sin^3 x$, matching the right side.',
    ],
  }),

  // —— strategy-fractions (5) ——
  card({
    id: 'tv-11',
    topic: 'strategy-fractions',
    prompt:
      'To combine $\\dfrac{\\sin x}{1+\\cos x}+\\dfrac{1+\\cos x}{\\sin x}$, what is the LCD?',
    choices: [
      '$\\sin x(1+\\cos x)$',
      '$\\sin x$',
      '$1+\\cos x$',
      '$\\sin x + (1+\\cos x)$',
    ],
    correct: '$\\sin x(1+\\cos x)$',
    rule: 'Combining Fractional Expressions',
    explanation:
      'The denominators are $\\sin x$ and $1+\\cos x$, so the LCD is their product $\\sin x(1+\\cos x)$.',
    steps: [
      'Identify the two denominators: $\\sin x$ and $1+\\cos x$.',
      'The LCD is the product $\\sin x(1+\\cos x)$.',
      'Rewrite each fraction with that LCD before adding numerators.',
    ],
  }),
  card({
    id: 'tv-12',
    topic: 'strategy-fractions',
    prompt:
      'After writing both fractions over $\\sin x(1+\\cos x)$, which numerator do you obtain?',
    choices: [
      '$\\sin^2 x + (1+\\cos x)^2$',
      '$\\sin x + (1+\\cos x)$',
      '$\\sin^2 x(1+\\cos x)$',
      '$2\\sin x(1+\\cos x)$',
    ],
    correct: '$\\sin^2 x + (1+\\cos x)^2$',
    rule: 'Combining Fractional Expressions',
    explanation:
      'First fraction contributes $\\sin^2 x$; second contributes $(1+\\cos x)^2$.',
    steps: [
      'Multiply the first fraction by $\\dfrac{\\sin x}{\\sin x}$: numerator becomes $\\sin^2 x$.',
      'Multiply the second by $\\dfrac{1+\\cos x}{1+\\cos x}$: numerator becomes $(1+\\cos x)^2$.',
      'Add numerators: $\\sin^2 x+(1+\\cos x)^2$.',
    ],
  }),
  card({
    id: 'tv-13',
    topic: 'strategy-fractions',
    prompt:
      'Expand $\\sin^2 x+(1+\\cos x)^2$ and simplify with a Pythagorean identity. What does the numerator become?',
    choices: [
      '$2 + 2\\cos x$',
      '$2 - 2\\cos x$',
      '$1 + \\cos^2 x$',
      '$2\\sin^2 x$',
    ],
    correct: '$2 + 2\\cos x$',
    rule: 'Combining Fractional Expressions',
    explanation:
      '$(1+\\cos x)^2=1+2\\cos x+\\cos^2 x$, so with $\\sin^2 x$ you get $1+2\\cos x+(\\sin^2 x+\\cos^2 x)=2+2\\cos x$.',
    steps: [
      'Expand $(1+\\cos x)^2=1+2\\cos x+\\cos^2 x$.',
      'Add $\\sin^2 x$: $\\sin^2 x+1+2\\cos x+\\cos^2 x$.',
      'Use $\\sin^2 x+\\cos^2 x=1$ to get $1+1+2\\cos x=2+2\\cos x$.',
    ],
  }),
  card({
    id: 'tv-14',
    topic: 'strategy-fractions',
    prompt:
      'After the numerator simplifies to $2+2\\cos x$ over $\\sin x(1+\\cos x)$, what is the best next algebraic move?',
    choices: [
      'Factor $2(1+\\cos x)$ from the numerator, then cancel $(1+\\cos x)$.',
      'Cancel $\\sin x$ from numerator and denominator immediately.',
      'Replace $2+2\\cos x$ with $\\sin^2 x$.',
      'Multiply numerator and denominator by $\\sin x$ again.',
    ],
    correct: 'Factor $2(1+\\cos x)$ from the numerator, then cancel $(1+\\cos x)$.',
    rule: 'Combining Fractional Expressions',
    explanation:
      'Factor $2(1+\\cos x)$, cancel with the matching factor in the LCD, and leave $\\dfrac{2}{\\sin x}=2\\csc x$.',
    steps: [
      'Write the numerator as $2(1+\\cos x)$.',
      'Cancel the common $(1+\\cos x)$ with the LCD factor (where defined).',
      'Remain $\\dfrac{2}{\\sin x}=2\\csc x$.',
    ],
  }),
  card({
    id: 'tv-15',
    topic: 'strategy-fractions',
    prompt:
      'What is the LCD for $\\dfrac{\\cos x}{\\sin x}+\\dfrac{\\sin x}{1-\\cos x}$?',
    choices: [
      '$\\sin x(1-\\cos x)$',
      '$\\sin x(1+\\cos x)$',
      '$1-\\cos^2 x$',
      '$\\sin x - \\cos x$',
    ],
    correct: '$\\sin x(1-\\cos x)$',
    rule: 'Combining Fractional Expressions',
    explanation:
      'Denominators $\\sin x$ and $1-\\cos x$ give LCD $\\sin x(1-\\cos x)$.',
    steps: [
      'List the denominators: $\\sin x$ and $1-\\cos x$.',
      'Form the product LCD $\\sin x(1-\\cos x)$.',
      'Rewrite each fraction over that LCD before combining.',
    ],
  }),
]
