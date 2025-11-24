export default class UppyStub {
  constructor(private options: Record<string, unknown> = {}) {}
  use() {
    return this
  }
  on() {
    return this
  }
  close() {}
}
