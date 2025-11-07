export default defineNuxtPlugin((nuxtApp) => {
  const loading = useRouteLoading()

  nuxtApp.hook('page:start', () => {
    loading.value = true
  })

  nuxtApp.hook('page:finish', () => {
    loading.value = false
  })

  nuxtApp.hook('page:error', () => {
    loading.value = false
  })

  nuxtApp.hook('page:loading:start', () => {
    loading.value = true
  })

  nuxtApp.hook('page:loading:end', () => {
    loading.value = false
  })

  nuxtApp.hook('page:loading:error', () => {
    loading.value = false
  })
})
