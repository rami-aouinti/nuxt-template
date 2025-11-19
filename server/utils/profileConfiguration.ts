import type { H3Event } from 'h3'
import type { AuthProfile } from '~/types/auth'
import type { Configuration } from '~/types/configuration'
import { configurationRequest } from './configurationApi'

const DEFAULT_CONFIGURATION_FLAGS = ['USER']

const defaultPluginConfiguration = () => ({
  plugins: [
    {
      id: '0',
      color: 'setting',
      icon: 'mdi-settings',
      title: 'Settings',
      content: 'Setting',
    },
    {
      id: '1',
      color: 'shop',
      icon: 'mdi-calendar-check',
      title: 'Shop',
      content: 'Shop',
    },
    {
      id: '2',
      color: 'gallery',
      icon: 'mdi-youtube-play',
      title: 'Gallery',
      content: 'Gallery',
    },
    {
      id: '3',
      color: 'school',
      icon: 'mdi-school',
      title: 'School',
      content: 'School',
    },
  ],
})

const defaultSiteDesignConfiguration = () => ({
  site: {
    'theme-primary': '#E91E63',
    'theme-rounded': 'sm',
    'theme-shadow': 'none',
    'color-scheme': 'dark',
  },
})

const REQUIRED_CONFIGURATION_DEFINITIONS = [
  {
    key: 'plugins',
    contextKey: 'user',
    buildValue: defaultPluginConfiguration,
  },
  {
    key: 'email.notification',
    contextKey: 'notification',
    buildValue: () => true,
  },
  {
    key: 'push.notification',
    contextKey: 'notification',
    buildValue: () => false,
  },
  {
    key: 'site.design',
    contextKey: 'design',
    buildValue: defaultSiteDesignConfiguration,
  },
] as const

type ProfileRecord = AuthProfile & Record<string, unknown>

type StringCandidate = string | null | undefined

function normalizeString(value: StringCandidate) {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function resolveFromRecord(record: Record<string, unknown> | null | undefined, keys: string[]) {
  if (!record) {
    return null
  }

  for (const key of keys) {
    const value = record[key]
    const normalized = normalizeString(value as StringCandidate)
    if (normalized) {
      return normalized
    }
  }

  return null
}

function resolveUserId(profile: ProfileRecord | null | undefined) {
  if (!profile) {
    return null
  }

  return (
    resolveFromRecord(profile, ['userId', 'user_id']) ||
    resolveFromRecord(profile as Record<string, unknown>, ['id']) ||
    resolveFromRecord(profile.user as Record<string, unknown>, ['id']) ||
    null
  )
}

function resolveContextId(profile: ProfileRecord | null | undefined) {
  if (!profile) {
    return null
  }

  return (
    resolveFromRecord(profile, ['contextId', 'context_id']) ||
    resolveFromRecord(profile, ['userId', 'user_id']) ||
    resolveFromRecord(profile, ['id']) ||
    null
  )
}

function resolveWorkplaceId(profile: ProfileRecord | null | undefined) {
  if (!profile) {
    return null
  }

  const direct = resolveFromRecord(profile, ['workplaceId', 'workplace_id'])
  if (direct) {
    return direct
  }

  const workplace = profile.workplace
  if (workplace && typeof workplace === 'object') {
    return resolveFromRecord(workplace as Record<string, unknown>, ['id'])
  }

  return null
}

export async function ensureDefaultProfileConfigurations(
  event: H3Event,
  profile: ProfileRecord | null | undefined,
) {
  if (!profile) {
    return
  }

  const userId = resolveUserId(profile)
  const contextId = resolveContextId(profile)
  const workplaceId = resolveWorkplaceId(profile)

  if (!userId || !contextId) {
    return
  }

  let existingConfigurations: Configuration[] = []
  try {
    existingConfigurations = await configurationRequest<Configuration[]>(
      event,
      '/platform/configuration',
      {
        method: 'GET',
      },
    )
  } catch (error) {
    console.error('Failed to fetch profile configurations', error)
    return
  }

  const existingKeys = new Set(
    existingConfigurations
      .map((configuration) => configuration.configurationKey)
      .filter((key): key is string => typeof key === 'string' && key.length > 0),
  )

  for (const definition of REQUIRED_CONFIGURATION_DEFINITIONS) {
    if (existingKeys.has(definition.key)) {
      continue
    }

    const body: Record<string, unknown> = {
      configurationKey: definition.key,
      contextKey: definition.contextKey,
      contextId,
      userId,
      configurationValue: definition.buildValue(),
      flags: DEFAULT_CONFIGURATION_FLAGS,
    }

    if (workplaceId) {
      body.workplaceId = workplaceId
    }

    try {
      await configurationRequest<Configuration>(event, '/platform/configuration', {
        method: 'POST',
        body,
      })
    } catch (error) {
      console.error(
        `Failed to create missing configuration "${definition.key}"`,
        error,
      )
    }
  }
}
