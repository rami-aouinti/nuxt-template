import { ref } from 'vue'

export function useQuery(_query: any, _variables?: any) {
  return {
    result: ref(null),
    loading: ref(false),
    error: ref(null),
    refetch: async () => ({ data: null }),
  }
}

export function useMutation(_mutation: any) {
  return {
    mutate: async (_vars?: any) => ({ data: null }),
    loading: ref(false),
    error: ref(null),
  }
}

export default { useQuery, useMutation }
