export function useVuelidate(_rules: any = {}, state: any = {}) {
  return {
    value: state,
    $errors: [],
    $dirty: false,
    $validate: async () => true,
    $reset: () => {},
    $touch: () => {},
  }
}

export default useVuelidate
