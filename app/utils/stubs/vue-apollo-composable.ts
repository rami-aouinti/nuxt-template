import { ref } from 'vue'

function createOperation() {
  const result = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const execute = async () => ({ result: result.value })
  return { result, loading, error, onResult: () => {}, onError: () => {}, refetch: execute, mutate: execute }
}

export const useQuery = createOperation
export const useMutation = createOperation
export const useSubscription = createOperation

export default {
  useQuery,
  useMutation,
  useSubscription,
}
