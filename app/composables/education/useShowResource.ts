import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import isEmpty from 'lodash/isEmpty'
import toInteger from 'lodash/toInteger'
import { useStore } from 'vuex'
import { useNotification } from '~/composables/notification'
import { formatDateTime } from '~/utils/dates'

interface UseShowResourceOptions {
  namespace: string
  servicePrefix: string
}

export function useShowResource({
  namespace,
  servicePrefix,
}: UseShowResourceOptions) {
  const route = useRoute()
  const router = useRouter()
  const store = useStore()
  const notification = useNotification()

  const isLoading = computed(() => store.state[namespace]?.isLoading ?? false)
  const error = computed(() => store.state[namespace]?.error)
  const deleteError = computed(() => store.state[namespace]?.deleteError)

  const rawId = computed(() => {
    const id = route.params.id || route.query.id || ''
    return decodeURIComponent(String(id))
  })

  const findItem = (id: string) =>
    store.getters[`${namespace}/find`]
      ? store.getters[`${namespace}/find`](id)
      : null

  const item = computed(() => {
    const found = findItem(rawId.value)

    if (isEmpty(found)) {
      const folderParams: Record<string, any> = { ...route.query }
      delete folderParams.id
      router
        .push({
          name: `${servicePrefix}List`,
          query: folderParams,
        })
        .catch(() => {})
    }

    return found
  })

  const retrieve = (params: Record<string, any>) =>
    store.dispatch(`${namespace}/loadWithQuery`, params)

  const reset = () => store.dispatch(`${namespace}/resetShow`)

  const deleteItem = (payload: any) =>
    store.dispatch(`${namespace}/del`, payload)

  const del = async () => {
    await deleteItem(item.value)
    const folderParams: Record<string, any> = { ...route.query, id: '' }
    router
      .push({
        name: `${servicePrefix}List`,
        query: folderParams,
      })
      .catch(() => {})
  }

  const editHandler = () => {
    const folderParams: Record<string, any> = { ...route.query }
    if (!isEmpty(item.value)) {
      folderParams.id = item.value['@id']
    }

    router
      .push({
        name: `${servicePrefix}Update`,
        params: { id: item.value['@id'] },
        query: folderParams,
      })
      .catch(() => {})
  }

  const goBack = () => router.go(-1)

  const list = () => {
    router.push({ name: `${servicePrefix}List` }).catch(() => {})
  }

  const loadItem = () => {
    let id: any = route.params.id
    if (isEmpty(id)) {
      id = route.query.id
    }

    const cid = toInteger(route.query.cid as string)
    const sid = toInteger(route.query.sid as string)
    const gid = toInteger(route.query.gid as string)

    retrieve({ id: decodeURIComponent(String(id)), cid, sid, gid })
  }

  onMounted(loadItem)
  onBeforeUnmount(reset)

  watch(error, (message) => {
    if (message) notification.showErrorNotification(message)
  })

  watch(deleteError, (message) => {
    if (message) notification.showErrorNotification(message)
  })

  return {
    formatDateTime,
    rawId,
    item,
    isLoading,
    goBack,
    list,
    del,
    editHandler,
    loadItem,
  }
}
