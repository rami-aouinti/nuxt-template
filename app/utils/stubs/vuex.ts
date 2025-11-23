import { reactive } from 'vue'

type GetterMap = Record<string, (state: any) => any>

type StoreShape = {
  state: any
  getters: GetterMap
  commit: (type?: string, payload?: any) => void
  dispatch: (type?: string, payload?: any) => Promise<any>
  replaceState: (state: any) => void
  subscribe: (handler: () => void) => () => void
}

const sharedStore: StoreShape = {
  state: reactive({}),
  getters: {},
  commit: () => {},
  dispatch: async () => undefined,
  replaceState: (state) => {
    sharedStore.state = reactive(state)
  },
  subscribe: () => () => {},
}

export function createStore(
  options: { state?: any; getters?: GetterMap } = {},
) {
  const baseState =
    typeof options.state === 'function' ? options.state() : options.state
  if (baseState) {
    sharedStore.state = reactive(baseState)
  }
  sharedStore.getters = options.getters || {}
  return sharedStore
}

export function useStore() {
  return sharedStore
}

function normalizeMap(map: any) {
  if (Array.isArray(map)) {
    return map.map((key) => ({ key, val: key }))
  }
  return Object.keys(map || {}).map((key) => ({ key, val: map[key] }))
}

function buildMapping(map: any, factory: (val: any) => any) {
  const res: Record<string, any> = {}
  normalizeMap(map).forEach(({ key, val }) => {
    res[key] = factory(val)
  })
  return res
}

export function mapActions(map: any) {
  return buildMapping(
    map,
    (val) =>
      (...args: any[]) =>
        sharedStore.dispatch(val, ...args),
  )
}

export function mapMutations(map: any) {
  return buildMapping(
    map,
    (val) =>
      (...args: any[]) =>
        sharedStore.commit(val, ...args),
  )
}

export function mapGetters(map: any) {
  return buildMapping(
    map,
    (val) => () => sharedStore.getters[val]?.(sharedStore.state),
  )
}

export function mapState(map: any) {
  return buildMapping(map, (val) => () => (sharedStore.state as any)?.[val])
}

export default {
  createStore,
  useStore,
  mapActions,
  mapGetters,
  mapMutations,
  mapState,
}
