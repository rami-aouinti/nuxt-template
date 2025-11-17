export interface TemplatePalette {
  primary?: string
  accent?: string
  paper?: string
  text?: string
}

export interface TemplatePhoto {
  show?: boolean
  position?: string
  widthMm?: number
  heightMm?: number
  rounded?: boolean
}

export interface TemplatePhotoShadow {
  enabled?: boolean
  elevation?: number
  color?: string
  custom?: boolean
}

export interface TemplateSidebar {
  enabled?: boolean
  widthMm?: number
  background?: string
  text?: string
  borderColor?: string
}

export interface TemplateCornerDecoration {
  type?: string
  anchor?: string
  color?: string
  color2?: string
  sizeMm?: number
  offsetMmX?: number
  offsetMmY?: number
  rotateDeg?: number
  enabled?: boolean
}

export interface TemplateVerticalBar {
  show?: boolean
  side?: string
  color?: string
  widthMm?: number
  offsetMm?: number
}

export interface TemplateSkillsOptions {
  chipVariant?: string
  chipColor?: string
  chipDensity?: string
  editable?: boolean
  draggable?: boolean
}

export interface TemplateLanguagesOptions {
  variant?: string
  maxLevel?: number
  showNote?: boolean
  sizePx?: number
  accent?: string
}

export interface Template {
  id: string
  key: string
  label: string
  isDefault?: boolean | null
  fontFamily: string
  baseSize: string
  previewImg?: string | null
  palette: TemplatePalette
  photo: TemplatePhoto
  photoShadow?: TemplatePhotoShadow | null
  layout: string
  sidebar?: TemplateSidebar | null
  corner?: TemplateCornerDecoration | null
  vbar?: TemplateVerticalBar | null
  skills?: TemplateSkillsOptions | null
  languages?: TemplateLanguagesOptions | null
  category: string
  template: string
  src: string
  downloads: number
  views: number
  createdAt?: string
  updatedAt?: string
}

export interface Media {
  id: string
  path: string
  reference?: Reference | null
  project?: Project | null
  createdAt?: string
  updatedAt?: string
}

export interface Project {
  id: string
  name: string
  description: string
  medias?: Media[]
  gitLink?: string | null
  reference?: Reference | null
  skills?: Skill[]
  createdAt?: string
  updatedAt?: string
}

export interface Skill {
  id: string
  name: string
  type: string
  level: number
  user: string
  projects?: Project[]
  createdAt?: string
  updatedAt?: string
}

export interface Reference {
  id: string
  title: string
  company: string
  description: string
  startedAt: string
  endedAt?: string | null
  medias: Media[]
  user: string
  projects?: Project[]
  createdAt?: string
  updatedAt?: string
}

export interface ResumeLanguage {
  id: string
  name: string
  level: number
  user: string
  flag: string
  createdAt?: string
  updatedAt?: string
}

export interface Formation {
  id: string
  name: string
  school: string
  gradeLevel?: number | null
  description: string
  startedAt: string
  endedAt?: string | null
  user: string
  createdAt?: string
  updatedAt?: string
}

export interface Hobby {
  id: string
  name: string
  user: string
  icon: string
  createdAt?: string
  updatedAt?: string
}

export interface Experience {
  id: string
  title: string
  description: string
  company: string
  startedAt: string
  endedAt?: string | null
  user: string
  createdAt?: string
  updatedAt?: string
}
