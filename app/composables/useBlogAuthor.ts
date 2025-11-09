import type { BlogPostUser } from '~/types/blog'

function resolveString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

export function useBlogAuthor() {
  function getAuthorName(user: BlogPostUser): string {
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

  function getAuthorProfileLink(user: BlogPostUser): string | null {
    const username = resolveString(user.username).trim()
    return username.length ? `/profile/${encodeURIComponent(username)}` : null
  }

  function getAuthorAvatar(user: BlogPostUser): string | undefined {
    const photo = resolveString(user.photo).trim()
    return photo.length ? photo : undefined
  }

  return {
    getAuthorName,
    getAuthorProfileLink,
    getAuthorAvatar,
  }
}
