export function useConfirm() {
  function require(config: {
    message?: string
    accept?: () => void
    reject?: () => void
  }) {
    const ok =
      typeof window !== 'undefined'
        ? window.confirm(config.message || 'Are you sure?')
        : true
    if (ok) {
      config.accept?.()
    } else {
      config.reject?.()
    }
  }
  return { require }
}
