export default function useVuelidate() {
  return {
    value: {},
    $validate: async () => true,
    $reset: () => {},
    $error: false,
    $errors: [],
  }
}

export const useVuelidate = () => useVuelidate()
