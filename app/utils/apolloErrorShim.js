export class ApolloError extends Error {}
export const isApolloError = (error) => error instanceof ApolloError
