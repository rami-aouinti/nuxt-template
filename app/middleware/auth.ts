export default defineNuxtRouteMiddleware(() => {
  const nuxtApp = useNuxtApp()
  const fallbackTranslate = (key: string): string => key
  const t =
    typeof nuxtApp.$i18n?.t === 'function'
      ? nuxtApp.$i18n.t.bind(nuxtApp.$i18n)
      : fallbackTranslate
  const { loggedIn } = useUserSession()
  const localePath = useLocalePath()

  if (!loggedIn.value) {
    Notify.error(t('auth.loginRequired'))
    return navigateTo(localePath('/'))
  }
})
