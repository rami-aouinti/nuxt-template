class UppyStub {
  private handlers: Record<string, Array<(...args: any[]) => void>> = {}

  use() {
    return this
  }

  on(event: string, handler: (...args: any[]) => void) {
    if (!this.handlers[event]) this.handlers[event] = []
    this.handlers[event].push(handler)
    return this
  }

  off(event: string, handler: (...args: any[]) => void) {
    this.handlers[event] = (this.handlers[event] || []).filter(
      (fn) => fn !== handler,
    )
    return this
  }

  close() {
    return this
  }

  setOptions() {
    return this
  }

  addFile() {
    return Promise.resolve()
  }

  upload() {
    ;(this.handlers['complete'] || []).forEach((fn) =>
      fn({ successful: [], failed: [] }),
    )
    return Promise.resolve({ successful: [], failed: [] })
  }

  getFiles() {
    return []
  }

  removeFile() {
    return this
  }
}

export default UppyStub
