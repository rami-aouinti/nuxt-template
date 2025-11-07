export default defineNuxtRouteMiddleware(() => {
  const { t } = useI18n()
  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    Notify.error(t('auth.loginRequired'))
    return navigateTo('/')
  }
})
