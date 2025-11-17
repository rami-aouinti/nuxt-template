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

export interface Company {
  id: string
  name: string
  description?: string | null
  location: string
  contactEmail: string
  logo?: string | null
  siteUrl?: string | null
  medias?: CompanyMedia[]
  user?: string
  createdAt?: string
  updatedAt?: string
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
