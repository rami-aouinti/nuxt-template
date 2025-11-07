export default defineNuxtRouteMiddleware(() => {
  const nuxtApp = useNuxtApp()
  const fallbackTranslate = (key: string): string => key
  const t =
    typeof nuxtApp.$i18n?.t === 'function'
      ? nuxtApp.$i18n.t.bind(nuxtApp.$i18n)
      : fallbackTranslate
  const { loggedIn, session } = useUserSession()
  const localePath = useLocalePath()

  const redirectToHome = () => navigateTo(localePath('/'))

  if (!loggedIn.value) {
    Notify.error(t('auth.loginRequired'))
    return redirectToHome()
  }

  const profile = session.value?.profile
  let roles: string[] = []

  if (profile && typeof profile === 'object') {
    const rawRoles = (profile as Record<string, unknown>).roles
    if (Array.isArray(rawRoles)) {
      roles = rawRoles
        .filter((role): role is string => typeof role === 'string' && role.trim().length > 0)
        .map((role) => role.trim())
    }
  }

  const hasAdminAccess = roles.some((role) =>
    role === 'ROLE_ADMIN' || role === 'ROLE_ROOT',
  )

  if (!hasAdminAccess) {
    Notify.error(t('auth.adminOnly'))
    return redirectToHome()
  }
})
