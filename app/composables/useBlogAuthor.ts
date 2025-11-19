import { computed } from 'vue'

import type { BlogPostUser } from '~/types/blog'

function resolveString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

export function useBlogAuthor() {
  const { session } = useAppUserSession()

  const currentProfileId = computed(() => {
    const id =
      (session.value?.profile as { id?: string | null } | undefined)?.id ??
      (session.value?.user as { id?: string | null } | undefined)?.id ??
      null

    return typeof id === 'string' ? id : ''
  })

  const currentUsername = computed(() => {
    const username =
      (session.value?.profile as { username?: string | null } | undefined)
        ?.username ??
      (session.value?.user as { login?: string | null } | undefined)?.login ??
      null

    return typeof username === 'string' ? username : ''
  })

  function getAuthorName(user?: BlogPostUser | null): string {
    if (!user) {
      return ''
    }

    const firstName = resolveString(user.firstName).trim()
    const lastName = resolveString(user.lastName).trim()

    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    }

    if (firstName) {
      return firstName
    }

    const username = resolveString(user.username).trim()
    return username.length ? username : ''
  }

  function getAuthorProfileLink(user?: BlogPostUser | null): string | null {
    if (!user) {
      return null
    }

    const isCurrentUser = (() => {
      const userId = resolveString((user as { id?: string | null }).id).trim()
      const username = resolveString(user.username).trim()

      if (currentProfileId.value && userId) {
        return currentProfileId.value === userId
      }

      if (currentUsername.value && username) {
        return (
          currentUsername.value.toLowerCase() === username.toLowerCase()
        )
      }

      return false
    })()

    if (isCurrentUser) {
      return '/profile'
    }

    const username = resolveString(user.username).trim()
    return username.length ? `/account/${encodeURIComponent(username)}` : null
  }

  function getAuthorAvatar(user?: BlogPostUser | null): string | undefined {
    if (!user) {
      return undefined
    }

    const photo = resolveString(user.photo).trim()
    return photo.length ? photo : undefined
  }

  return {
    getAuthorName,
    getAuthorProfileLink,
    getAuthorAvatar,
  }
}
