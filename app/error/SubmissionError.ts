export default class SubmissionError extends Error {
  errors: Record<string, unknown>

  constructor(errors: Record<string, unknown>) {
    const fallbackMessage =
      errors && typeof errors === 'object' && '_error' in errors
        ? String((errors as { _error?: unknown })._error ?? 'Submission failed')
        : 'Submission failed'

    super(fallbackMessage)
    this.name = 'SubmissionError'
    this.errors = errors
  }
}
