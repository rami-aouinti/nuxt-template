export default defineNuxtPlugin((nuxtApp) => {
  const loading = useRouteLoading()
  let isHydrating = true

  const setLoading = (value: boolean) => {
    if (isHydrating && value) {
      return
    }

    loading.value = value
  }

  nuxtApp.hook('app:mounted', () => {
    isHydrating = false
  })

  nuxtApp.hook('page:start', () => {
    setLoading(true)
  })

  nuxtApp.hook('page:finish', () => {
    setLoading(false)
  })

  nuxtApp.hook('page:error', () => {
    setLoading(false)
  })

  nuxtApp.hook('page:loading:start', () => {
    setLoading(true)
  })

  nuxtApp.hook('page:loading:end', () => {
    setLoading(false)
  })

  nuxtApp.hook('page:loading:error', () => {
    setLoading(false)
  })
})
