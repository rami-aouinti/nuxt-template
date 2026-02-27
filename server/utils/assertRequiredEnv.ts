interface RequiredEnv {
  key: string
  aliases?: string[]
}

function hasValue(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

export function assertRequiredEnv(entries: RequiredEnv[]): void {
  const missing = entries.filter((entry) => {
    const keys = [entry.key, ...(entry.aliases || [])]
    return !keys.some((key) => hasValue(process.env[key]))
  })

  if (missing.length === 0) {
    return
  }

  const details = missing
    .map(({ key, aliases = [] }) => {
      return `- ${key}${aliases.length ? ` (aliases: ${aliases.join(', ')})` : ''}`
    })
    .join('\n')

  throw new Error(
    `Missing required environment variables:\n${details}\nPlease define these variables before starting Nuxt.`,
  )
}
