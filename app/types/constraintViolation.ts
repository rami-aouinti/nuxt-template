import type { HydraContext } from './hydra'

export interface ConstraintViolationItem {
  propertyPath: string
  message: string
  readonly detail?: string
}

export interface ConstraintViolation {
  status: number
  violations: ConstraintViolationItem[]
  readonly type?: string
  readonly title?: string | null
  readonly instance?: string | null
}

export interface ConstraintViolationJsonld extends ConstraintViolation {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
  readonly description?: string
}
