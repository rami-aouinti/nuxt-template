import type { App } from 'vue'
import { inject, reactive } from 'vue'

type GetterTree<S = any> = Record<
  string,
  (state: S, getters: any, rootState?: any, rootGetters?: any) => any
>
type MutationTree<S = any> = Record<string, (state: S, payload?: any) => void>
type ActionTree<S = any> = Record<
  string,
  (
    ctx: { state: S; rootState: any; getters: any; commit: any; dispatch: any },
    payload?: any,
  ) => any
>

type ModuleOptions = {
  state?: any
  getters?: GetterTree
  mutations?: MutationTree
  actions?: ActionTree
  namespaced?: boolean
}

type StoreOptions = {
  state?: any
  getters?: GetterTree
  mutations?: MutationTree
  actions?: ActionTree
  modules?: Record<string, ModuleOptions>
}

type Store = {
  state: any
  getters: any
  commit: (type: string, payload?: any) => void
  dispatch: (type: string, payload?: any) => Promise<any>
  install: (app: App) => void
}

const storeKey = Symbol('vuex-store')
let activeStore: Store | null = null

const normalizeState = (state: any) =>
  reactive(typeof state === 'function' ? state() : state || {})

const splitType = (type: string) => {
  const parts = type.split('/')
  return parts.length > 1
    ? { moduleName: parts.shift() as string, name: parts.join('/') }
    : { moduleName: '', name: type }
}

const registerGetters = (
  target: Record<string, any>,
  getterDefs: GetterTree | undefined,
  localState: any,
  rootState: any,
  rootGetters: any,
) => {
  Object.entries(getterDefs || {}).forEach(([key, getter]) => {
    Object.defineProperty(target, key, {
      get: () => getter(localState, target, rootState, rootGetters),
      enumerable: true,
    })
  })
}

export const createStore = (options: StoreOptions): Store => {
  const rootState = normalizeState(options.state)
  const modules: Record<
    string,
    ModuleOptions & {
      state: any
      getters: Record<string, any>
      mutations: MutationTree
      actions: ActionTree
    }
  > = {}

  const store: Store = {
    state: rootState,
    getters: {},
    commit: (type: string, payload?: any) => commit(type, payload),
    dispatch: async (type: string, payload?: any) => dispatch(type, payload),
    install: (app: App) => {
      app.provide(storeKey, store)
      app.config.globalProperties.$store = store
    },
  }

  activeStore = store

  Object.entries(options.modules || {}).forEach(([name, mod]) => {
    const moduleState = normalizeState(mod.state)
    rootState[name] = moduleState
    modules[name] = {
      ...mod,
      state: moduleState,
      getters: {},
      mutations: mod.mutations || {},
      actions: mod.actions || {},
      namespaced: mod.namespaced !== false,
    }
    registerGetters(
      modules[name].getters,
      mod.getters,
      moduleState,
      rootState,
      store.getters,
    )
  })

  registerGetters(
    store.getters,
    options.getters,
    rootState,
    rootState,
    store.getters,
  )

  Object.entries(modules).forEach(([name, mod]) => {
    Object.keys(mod.getters || {}).forEach((key) => {
      const getterKey = mod.namespaced !== false ? `${name}/${key}` : key
      Object.defineProperty(store.getters, getterKey, {
        get: () => mod.getters?.[key],
        enumerable: true,
      })
    })
  })

  const commit = (type: string, payload?: any) => {
    const { moduleName, name } = splitType(type)
    if (moduleName && modules[moduleName]?.mutations?.[name]) {
      modules[moduleName].mutations![name](modules[moduleName].state, payload)
      return
    }
    options.mutations?.[type]?.(rootState, payload)
  }

  const dispatch = async (type: string, payload?: any) => {
    const { moduleName, name } = splitType(type)
    const target = moduleName ? modules[moduleName] : null
    const handler =
      target?.actions?.[name] ??
      options.actions?.[name] ??
      options.actions?.[type]

    if (!handler) return Promise.resolve()

    const namespacedPrefix =
      moduleName && target?.namespaced !== false ? `${moduleName}/` : ''
    const ctx = {
      state: target ? target.state : rootState,
      rootState,
      getters: store.getters,
      commit: (t: string, p?: any) =>
        commit(namespacedPrefix ? `${namespacedPrefix}${t}` : t, p),
      dispatch: (t: string, p?: any) =>
        dispatch(namespacedPrefix ? `${namespacedPrefix}${t}` : t, p),
    }

    return await handler(ctx as any, payload)
  }

  return store
}

const resolveStore = (ctx?: any): Store | null =>
  ctx?.$store ?? inject(storeKey, null) ?? activeStore

export const useStore = () => resolveStore() as Store

const createMapper = (
  handler: (store: Store | null, key: string, arg?: any) => any,
  namespaceOrMap: any,
  map?: any,
) => {
  const hasNamespace = typeof namespaceOrMap === 'string'
  const entries = Object.entries(
    hasNamespace ? map || {} : namespaceOrMap || {},
  )
  const namespace = hasNamespace ? (namespaceOrMap as string) : ''

  return entries.reduce(
    (acc, [key, val]) => {
      const type = namespace ? `${namespace}/${val as string}` : (val as string)
      acc[key] = function mapper(this: any, payload?: any) {
        const store = resolveStore(this)
        return handler(store, type, payload)
      }
      return acc
    },
    {} as Record<string, any>,
  )
}

export const mapGetters = (namespaceOrMap: any, map?: any) => {
  return createMapper(
    (store, key) => store?.getters?.[key],
    namespaceOrMap,
    map,
  )
}

export const mapActions = (namespaceOrMap: any, map?: any) => {
  const handler = (store: Store | null, key: string, payload?: any) =>
    store?.dispatch(key, payload)
  return createMapper(handler, namespaceOrMap, map)
}

export const createLogger = () => ({})
