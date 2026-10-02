import { analyzeTrigEquation, formatNumberLatex, formatPiLatex, parseCoeff } from './trigSolver'

const EPS = 1e-6

function nearlyEqual(a, b, tol = EPS) {
  return Math.abs(a - b) <= tol || Math.abs(a - b) <= tol * Math.max(1, Math.abs(b))
}

function parseStudentNumber(raw) {
  if (raw == null) return { empty: true, value: 0 }
  const s = String(raw).trim()
  if (s === '') return { empty: true, value: 0 }
  try {
    return { empty: false, value: parseCoeff(s) }
  } catch {
    const n = Number(s)
    if (Number.isFinite(n)) return { empty: false, value: n }
    return { empty: false, value: NaN }
  }
}

/**
 * Grade student answers for a trig graphing drill card.
 * @returns {{ correct: boolean, expected: object, details: object }}
 */
export function gradeTrigDrillAnswers(equation, studentAnswers = {}) {
  const analysis = analyzeTrigEquation(equation)
  if (!analysis.ok) {
    return {
      correct: false,
      expected: null,
      details: { error: analysis.error },
    }
  }

  const ampLabel = analysis.amplitudeDefined ? 'Amplitude' : 'Vertical stretch'
  const expected = {
    amplitude: analysis.amplitude,
    amplitudeLabel: ampLabel,
    period: analysis.period,
    periodLatex: formatPiLatex(analysis.period),
    phaseDirection: analysis.phaseShift.direction,
    phaseMagnitude: analysis.phaseShift.magnitude,
    phaseMagnitudeLatex: formatPiLatex(analysis.phaseShift.magnitude),
    midline: analysis.midline,
    midlineLatex: formatNumberLatex(analysis.midline),
    C: analysis.C,
    factoredLatex: analysis.factoredLatex,
  }

  const amp = parseStudentNumber(studentAnswers.amplitude)
  const period = parseStudentNumber(studentAnswers.period)
  const phaseMag = parseStudentNumber(studentAnswers.phaseMagnitude)
  const midline = parseStudentNumber(studentAnswers.midline)
  const direction = String(studentAnswers.phaseDirection || 'none').toLowerCase()

  const ampOk = !amp.empty && Number.isFinite(amp.value) && nearlyEqual(amp.value, expected.amplitude)
  const periodOk =
    !period.empty && Number.isFinite(period.value) && nearlyEqual(period.value, expected.period, 1e-4)
  const midlineOk =
    !midline.empty && Number.isFinite(midline.value) && nearlyEqual(midline.value, expected.midline)

  let phaseOk = false
  if (Math.abs(expected.C) < 1e-9 || expected.phaseDirection === 'none') {
    // Zero phase shift: direction none and/or magnitude 0/empty
    const dirOk = direction === 'none' || direction === ''
    const magOk =
      phaseMag.empty ||
      (Number.isFinite(phaseMag.value) && nearlyEqual(phaseMag.value, 0))
    phaseOk = dirOk && magOk
  } else {
    phaseOk =
      direction === expected.phaseDirection &&
      !phaseMag.empty &&
      Number.isFinite(phaseMag.value) &&
      nearlyEqual(phaseMag.value, expected.phaseMagnitude, 1e-4)
  }

  const details = {
    amplitude: ampOk,
    period: periodOk,
    phase: phaseOk,
    midline: midlineOk,
  }

  return {
    correct: ampOk && periodOk && phaseOk && midlineOk,
    expected,
    details,
    analysis,
  }
}
