import { useRuntimeConfig } from '#imports'
import type { H3Event } from 'h3'

import { broWorldRequest } from '../broWorldApi'
import { broWorldBlogProfileRequest } from '../broWorldBlogProfileApi'
import { fetchProfileEvents } from './profile-events'
import { fetchProfilePlugins } from './profile-plugins'
import { fetchProfilePosts } from './profile-posts'

const PROFILE_POSTS_WARMUP_PAGE = 1
const PROFILE_POSTS_WARMUP_LIMIT = 10

function toPositiveNumber(value: unknown) {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0
}

async function warmup(event: H3Event) {
  const config = useRuntimeConfig(event)
  const redisConfig = config.redis || {}

  const tasks: Promise<unknown>[] = []

  if (toPositiveNumber(redisConfig.profileEventsTtl)) {
    tasks.push(
      fetchProfileEvents(event, () =>
        broWorldRequest(event, '/profile/events', {
          method: 'GET',
        }),
      ),
    )
  }

  if (toPositiveNumber(redisConfig.profilePostsTtl)) {
    tasks.push(
      fetchProfilePosts(
        event,
        PROFILE_POSTS_WARMUP_PAGE,
        PROFILE_POSTS_WARMUP_LIMIT,
        () =>
          broWorldBlogProfileRequest(event, '/profile/post', {
            params: {
              page: PROFILE_POSTS_WARMUP_PAGE,
              limit: PROFILE_POSTS_WARMUP_LIMIT,
            },
          }),
      ),
    )
  }

  if (toPositiveNumber(redisConfig.profilePluginsTtl)) {
    tasks.push(
      fetchProfilePlugins(event, () =>
        broWorldRequest(event, '/profile/plugins'),
      ),
    )
  }

  if (!tasks.length) {
    return
  }

  await Promise.allSettled(tasks)
}

export function scheduleProfileCacheWarmup(event: H3Event) {
  const runner = () =>
    warmup(event).catch((error) => {
      console.error('[profile-cache] warmup failed', error)
    })

  if (typeof setImmediate === 'function') {
    setImmediate(runner)
    return
  }

  queueMicrotask(runner)
}
