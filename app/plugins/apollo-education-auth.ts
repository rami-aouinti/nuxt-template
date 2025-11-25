export default defineNuxtPlugin((nuxtApp) => {
  const { session, loggedIn, ready } = useUserSession()

  nuxtApp.hook('apollo:auth', ({ client, token }) => {
    if (client !== 'default') return

    if (!ready.value || !loggedIn.value) {
      return
    }

    const sessionToken = (session.value as any) || {}
    const educationToken =
      sessionToken.educationToken ||
      null

    if (educationToken) {
      token.value = educationToken
    }
  })
})
