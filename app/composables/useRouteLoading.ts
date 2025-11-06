export const useRouteLoading = () =>
  useState<boolean>('route-loading', () => false)
