export default class Sortable {
  static create(element: HTMLElement, _options: Record<string, unknown> = {}) {
    return new Sortable(element, _options)
  }

  constructor(_element: HTMLElement | null, _options: Record<string, unknown> = {}) {}

  option() {
    return null
  }

  destroy() {}
}
