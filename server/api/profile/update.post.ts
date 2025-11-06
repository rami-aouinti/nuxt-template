import type { AuthProfile } from '~/types/auth'
import { persistProfileState } from '../../utils/cache/profile'

const textDecoder = new TextDecoder()

function formatTextField(value: Uint8Array) {
  return textDecoder.decode(value)
}

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const token = (session as Record<string, unknown>).token
  if (typeof token !== 'string' || token.length === 0) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: {
        message:
          "Le jeton d'authentification est introuvable. Veuillez vous reconnecter.",
      },
    })
  }

  const multipart = await readMultipartFormData(event)
  const payload = new FormData()

  if (multipart && multipart.length > 0) {
    for (const part of multipart) {
      if (!part.name) continue

      if (part.filename) {
        const blob = new Blob([part.data], {
          type: part.type || 'application/octet-stream',
        })
        payload.append(part.name, blob, part.filename)
        continue
      }

      const text = formatTextField(part.data)
      if (part.name === 'birthday' && text.trim().length === 0) {
        continue
      }
      payload.append(part.name, text)
    }
  } else {
    const body = await readBody<Record<string, unknown>>(event)
    if (!body || Object.keys(body).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: {
          message: 'Aucune donnée fournie pour mettre à jour le profil.',
        },
      })
    }

    for (const [key, value] of Object.entries(body)) {
      if (value === undefined || value === null) {
        continue
      }
      const stringValue = String(value)
      if (key === 'birthday' && stringValue.trim().length === 0) {
        continue
      }
      payload.append(key, stringValue)
    }
  }

  if ([...payload.keys()].length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Veuillez modifier au moins un champ avant de sauvegarder.',
      },
    })
  }

  const response = await fetch('https://bro-world.org/api/v1/profile/update', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  })

  if (!response.ok) {
    let errorMessage = 'Échec de la mise à jour du profil.'
    try {
      const errorBody = (await response.json()) as Record<string, unknown>
      if (errorBody?.message && typeof errorBody.message === 'string') {
        errorMessage = errorBody.message
      }
    } catch (error) {
      if (error instanceof Error && error.message) {
        errorMessage = error.message
      }
    }

    throw createError({
      statusCode: response.status,
      statusMessage: response.statusText || 'Profile update failed',
      data: { message: errorMessage },
    })
  }

  const updatedProfile = (await response.json()) as AuthProfile

  const sessionPayload = { ...(session as Record<string, unknown>) }
  delete sessionPayload.id

  const sessionUser =
    sessionPayload.user && typeof sessionPayload.user === 'object'
      ? (sessionPayload.user as Record<string, unknown>)
      : {}

  const fallbackAvatar =
    typeof sessionUser.avatar_url === 'string'
      ? sessionUser.avatar_url
      : 'https://bro-world-space.com/img/person.png'

  sessionPayload.profile = updatedProfile
  sessionPayload.token = token
  sessionPayload.user = {
    ...sessionUser,
    login:
      typeof updatedProfile.username === 'string' &&
      updatedProfile.username.trim().length > 0
        ? updatedProfile.username
        : sessionUser.login,
    avatar_url:
      typeof updatedProfile.photo === 'string' &&
      updatedProfile.photo.trim().length > 0
        ? updatedProfile.photo
        : fallbackAvatar,
  }

  await setUserSession(event, sessionPayload as any)
  await persistProfileState(event, updatedProfile)

  return updatedProfile
})
