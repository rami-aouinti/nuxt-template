export interface ProfilePlugin {
  key: string
  name: string
  subTitle?: string | null
  description?: string | null
  logo?: string | null
  icon?: string | null
  installed: boolean
  link?: string | null
  pricing?: string | null
  action?: string | null
  active: boolean
  id?: string | null
}
