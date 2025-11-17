export enum WorkType {
  REMOTE = 'Remote',
  HYBRID = 'Hybrid',
  ONSITE = 'Onsite',
}

export enum ContractType {
  FULLTIME = 'Fulltime',
  PARTTIME = 'Parttime',
}

export enum LanguageLevel {
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  FLUENT = 'fluent',
  NATIVE = 'native',
}

export enum ApplicationStatus {
  REQUEST = 'Request',
  PROGRESS = 'Progress',
  ACCEPT = 'Accept',
  DECLINED = 'Declined',
}

export interface CompanyMedia {
  id: string
  url: string
}

export interface ApiTimestamp {
  date: string
  timezone_type: number
  timezone: string
}

export interface CompanyUserProfile {
  id: string
  title?: string | null
  description?: string | null
  gender?: string | null
  photo?: string | null
  birthday?: string | null
  address?: string | null
  phone?: string | null
}

export interface CompanyUser {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  language?: string | null
  locale?: string | null
  timezone?: string | null
  enabled: boolean
  profile?: CompanyUserProfile | null
}

export interface Company {
  id: string
  name: string
  description?: string | null
  location: string
  contactEmail: string
  logo?: string | null
  siteUrl?: string | null
  medias?: CompanyMedia[] | null
  user?: string | CompanyUser | null
  createdAt?: string | ApiTimestamp | null
  updatedAt?: string | ApiTimestamp | null
}

export interface JobLanguage {
  id: number
  name: string
  level: LanguageLevel
}

export interface Job {
  id: string
  title: string
  description: string
  work?: string | null
  requiredSkills?: string[]
  experience?: string | null
  workType?: WorkType | null
  workLocation?: string | null
  salaryRange?: string | null
  languages?: JobLanguage[]
  contractType?: ContractType | null
  requirements?: string[] | null
  benefits?: string | null
  company?: Company | null
  user: string
  createdAt?: string
  updatedAt?: string
}

export interface Applicant {
  id: string
  firstName: string
  lastName: string
  contactEmail: string
  phone?: string | null
  resume?: string | null
  user: string
  createdAt?: string
  updatedAt?: string
}

export interface JobApplication {
  id: string
  applicant: Applicant
  job: Job
  status: ApplicationStatus
  createdAt?: string
  updatedAt?: string
}
