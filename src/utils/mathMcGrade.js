/**
 * Grade a multiple-choice math drill answer.
 * @param {{ correctAnswer: string }} question
 * @param {{ selectedId?: string }} studentAnswers
 */
export function gradeMcAnswer(question, studentAnswers) {
  const selectedId = studentAnswers?.selectedId
  const correct = Boolean(selectedId) && selectedId === question?.correctAnswer
  return { correct, selectedId, expected: question?.correctAnswer ?? null }
}
