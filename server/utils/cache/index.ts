import Redis from 'ioredis'
import type { RedisOptions } from 'ioredis'
import { useRuntimeConfig } from '#imports'

interface RedisState {
  client?: Redis
  promise?: Promise<Redis | null>
}

type CacheState = typeof globalThis & { __redisState?: RedisState }

const globalState = globalThis as CacheState

function getState(): RedisState {
  if (!globalState.__redisState) {
    globalState.__redisState = {}
  }
  return globalState.__redisState
}

function createRedisClient(url: string) {
  const options: RedisOptions = { lazyConnect: true }
  if (url.startsWith('rediss://')) {
    options.tls = {}
  }
  return new Redis(url, options)
}

async function connectRedisClient(client: Redis, state: RedisState) {
  try {
    await client.connect()
    client.on('error', (error) => {
      console.error('[redis] connection error', error)
      state.client = undefined
    })
    state.client = client
    return client
  } catch (error) {
    console.error('[redis] failed to connect', error)
    client.disconnect()
    return null
  }
}

export async function useRedisClient(): Promise<Redis | null> {
  const state = getState()

  if (state.client) {
    return state.client
  }

  if (state.promise) {
    return state.promise
  }

  const config = useRuntimeConfig()
  const url = config.redis?.url

  if (!url) {
    return null
  }

  const client = createRedisClient(url)

  state.promise = connectRedisClient(client, state).finally(() => {
    state.promise = undefined
  })

  return state.promise
}

export interface CacheSetOptions {
  ttl?: number
}

export async function cacheSet<T>(
  key: string,
  value: T,
  options: CacheSetOptions = {},
) {
  const redis = await useRedisClient()
  if (!redis) {
    return false
  }

  try {
    const payload = JSON.stringify(value)
    if (options.ttl && options.ttl > 0) {
      await redis.set(key, payload, 'EX', options.ttl)
    } else {
      await redis.set(key, payload)
    }
    return true
  } catch (error) {
    console.error('[redis] set error', error)
    return false
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = await useRedisClient()
  if (!redis) {
    return null
  }

  try {
    const payload = await redis.get(key)
    if (!payload) {
      return null
    }
    return JSON.parse(payload) as T
  } catch (error) {
    console.error('[redis] get error', error)
    return null
  }
}

export async function cacheDelete(key: string) {
  const redis = await useRedisClient()
  if (!redis) {
    return false
  }

  try {
    await redis.del(key)
    return true
  } catch (error) {
    console.error('[redis] delete error', error)
    return false
  }
}
