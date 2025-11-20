export interface CrmResource {
  '@id'?: string
  '@type'?: string
}

export interface CrmCountry extends CrmResource {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface CrmClientPreview extends CrmResource {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface CrmContactPreview extends CrmResource {
  id: number
  value: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface CrmContact extends CrmContactPreview {
  client: CrmClientPreview
}

export interface CrmContactType extends CrmResource {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface CrmClient extends CrmClientPreview {
  description: string
  labels: CrmLabel[]
  contacts: CrmContactPreview[]
}

export interface CrmAddress extends CrmResource {
  id: number
  country: CrmCountry
  city: string
  region: string
  district: string
  postCode: string
  street: string
  building: string
  apartment: string
  comment?: string
  client: CrmClientPreview
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface CrmProjectPreview extends CrmResource {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface CrmFile extends CrmResource {
  id: number
  contentUrl?: string
  size?: string
  mimeType?: string
  originalName?: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface CrmDocument extends CrmResource {
  id: number
  name: string
  client: CrmClientPreview & { projects?: CrmProjectPreview[] }
  projects: CrmProjectPreview[]
  files: CrmFile[]
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface CrmUserPreview extends CrmResource {
  id: number
  username?: string
  name: string
  email?: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface CrmTask extends CrmResource {
  id: number
  name: string
  project: CrmProjectPreview
  deadline: string
  assignee: CrmUserPreview
  timeEstimated: number
  timeSpent: number
  createdAt: string
  updatedAt: string
  isActive: boolean
  status?: CrmTaskStatus
}

export interface CrmTaskStatus extends CrmResource {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface CrmProjectStatus extends CrmResource {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface CrmProjectType extends CrmResource {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface CrmProject extends CrmProjectPreview {
  client: CrmClientPreview
  tasks: CrmTask[]
  documents: CrmDocument[]
  status?: CrmProjectStatus
  type?: CrmProjectType
}

export interface CrmGroup extends CrmResource {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface CrmHistory extends CrmResource {
  id: number
  action: string
  loggedAt: string
  objectClass: string
  version: number
  data: unknown[]
  username: string
}

export interface CrmLabel extends CrmResource {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface CrmLanguage extends CrmResource {
  id: number
  name: string
  code: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface CrmRole extends CrmResource {
  id: number
  name: string
  role: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface CrmModule extends CrmResource {
  id: number
  name: string
  roles: CrmRole[]
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface CrmPaginationView {
  '@id'?: string
  '@type'?: string
  first?: string
  last?: string
  next?: string
  previous?: string
}

export interface CrmIriTemplateMapping {
  '@type'?: string
  variable?: string
  property?: string
  required?: boolean
}

export interface CrmIriTemplate {
  '@type'?: string
  template?: string
  variableRepresentation?: string
  mapping?: CrmIriTemplateMapping[]
}

export interface CrmCollection<TItem> extends CrmResource {
  '@context'?: string
  totalItems: number
  member: TItem[]
  view?: CrmPaginationView
  search?: CrmIriTemplate
}

export type CrmCountryCollection = CrmCollection<CrmCountry>
export type CrmClientCollection = CrmCollection<CrmClient>
export type CrmContactCollection = CrmCollection<CrmContact>
export type CrmAddressCollection = CrmCollection<CrmAddress>
export type CrmContactTypeCollection = CrmCollection<CrmContactType>
export type CrmDocumentCollection = CrmCollection<CrmDocument>
export type CrmFileCollection = CrmCollection<CrmFile>
export type CrmGroupCollection = CrmCollection<CrmGroup>
export type CrmHistoryCollection = CrmCollection<CrmHistory>
export type CrmLabelCollection = CrmCollection<CrmLabel>
export type CrmLanguageCollection = CrmCollection<CrmLanguage>
export type CrmModuleCollection = CrmCollection<CrmModule>
export type CrmProjectCollection = CrmCollection<CrmProject>
export type CrmProjectStatusCollection = CrmCollection<CrmProjectStatus>
export type CrmProjectTypeCollection = CrmCollection<CrmProjectType>
export type CrmTaskCollection = CrmCollection<CrmTask>
export type CrmTaskStatusCollection = CrmCollection<CrmTaskStatus>
