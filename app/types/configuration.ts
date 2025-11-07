export type ConfigurationValue =
  | null
  | string
  | number
  | boolean
  | ConfigurationValue[]
  | Record<string, ConfigurationValue>

export type ConfigurationFlags = string[]

export type Configuration = {
  id: string
  configurationKey: string
  configurationValue: ConfigurationValue
  contextKey: string
  contextId?: string | null
  userId?: string | null
  workplaceId?: string | null
  flags?: ConfigurationFlags
  createdAt?: string | null
  updatedAt?: string | null
}

export type ConfigurationPayload = Partial<
  Pick<
    Configuration,
    | 'configurationKey'
    | 'configurationValue'
    | 'contextKey'
    | 'contextId'
    | 'userId'
    | 'workplaceId'
    | 'flags'
  >
>
