import { reactive, computed } from 'vue'

type State = Record<string, any>

type StoreOptions = {
  state?: State | (() => State)
  getters?: Record<string, (state: State, getters: Record<string, any>) => any>
  actions?: Record<string, (payload?: any) => any>
  mutations?: Record<string, (state: State, payload?: any) => any>
}

type Store = {
  state: State
  getters: Record<string, any>
  dispatch: (action: string, payload?: any) => any
  commit: (mutation: string, payload?: any) => any
}

let activeStore: Store | null = null

function createStore(options: StoreOptions = {}): Store {
  const rawState = typeof options.state === 'function' ? options.state() : options.state || {}
  const state = reactive(rawState)
  const getters: Record<string, any> = {}

  if (options.getters) {
    Object.entries(options.getters).forEach(([key, getter]) => {
      getters[key] = computed(() => getter(state, getters)).value
    })
  }

  const store: Store = {
    state,
    getters,
    dispatch(action, payload) {
      const handler = options.actions?.[action]
      if (handler) return handler.call(store, payload)
      console.warn(`[vuex stub] Unknown action: ${action}`)
      return undefined
    },
    commit(mutation, payload) {
      const handler = options.mutations?.[mutation]
      if (handler) return handler.call(store, state, payload)
      console.warn(`[vuex stub] Unknown mutation: ${mutation}`)
      return undefined
    },
  }

  activeStore = store
  return store
}

function useStore() {
  if (!activeStore) {
    activeStore = createStore()
  }
  return activeStore
}

function mapActions(actions: string[] | Record<string, string>) {
  const mapping = Array.isArray(actions)
    ? Object.fromEntries(actions.map((key) => [key, key]))
    : actions
  const store = useStore()
  return Object.fromEntries(
    Object.entries(mapping).map(([localKey, actionKey]) => [
      localKey,
      function mappedAction(this: any, payload?: any) {
        return store.dispatch(actionKey, payload)
      },
    ]),
  )
}

function mapGetters(getters: string[] | Record<string, string>) {
  const mapping = Array.isArray(getters)
    ? Object.fromEntries(getters.map((key) => [key, key]))
    : getters
  const store = useStore()
  return Object.fromEntries(
    Object.entries(mapping).map(([localKey, getterKey]) => [
      localKey,
      () => store.getters[getterKey],
    ]),
  )
}

export { createStore, useStore, mapActions, mapGetters }
export default { createStore, useStore, mapActions, mapGetters }
