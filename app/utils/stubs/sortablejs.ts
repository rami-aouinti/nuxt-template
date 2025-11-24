export default class Sortable {
  static create(element: HTMLElement, _options: Record<string, unknown> = {}) {
    return new Sortable(element, _options)
  }

  constructor(
    private element: HTMLElement | null,
    private options: Record<string, unknown> = {},
  ) {}

  option() {
    return null
  }

  destroy() {}
}
