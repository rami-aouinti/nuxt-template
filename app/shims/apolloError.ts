import type { GraphQLError } from 'graphql'

export class ApolloError extends Error {
  graphQLErrors?: readonly GraphQLError[]
  networkError?: Error
  clientErrors?: readonly Error[]
  extraInfo?: unknown

  constructor(options: {
    graphQLErrors?: readonly GraphQLError[]
    networkError?: Error
    clientErrors?: readonly Error[]
    errorMessage?: string
    extraInfo?: unknown
  }) {
    super(options.errorMessage || options.networkError?.message || '')
    this.name = 'ApolloError'
    this.graphQLErrors = options.graphQLErrors
    this.networkError = options.networkError
    this.clientErrors = options.clientErrors
    this.extraInfo = options.extraInfo
  }
}

export function isApolloError(error: unknown): error is ApolloError {
  return error instanceof ApolloError
}
