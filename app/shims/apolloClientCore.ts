export * from '@apollo/client/core'

export class ApolloError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'ApolloError'
  }
}

export function isApolloError(error: unknown): error is ApolloError {
  return error instanceof ApolloError
}
