import { computed } from 'vue'
import type { FetchOptions } from 'ofetch'
import { camelizeKeys } from '~/utils/casing'
import type { Camelize } from '~/utils/casing'

const normalizeBaseUrl = (value: string | undefined, fallback: string) =>
  (value || fallback).replace(/\/+$/, '')

type RequestOptions = FetchOptions<'json'>

type RequestBody = NonNullable<RequestOptions['body']> | FormData

type RequestFn = <T>(
  path: string,
  options?: RequestOptions,
) => Promise<Camelize<T>>

const encode = (value: string | number) => encodeURIComponent(String(value))

export function useEducationApi() {
  const config = useRuntimeConfig()
  const { session } = useAppUserSession()
  const requestHeaders = useServerAuthRequestHeaders()
  const { locale } = useI18n()

  const baseUrl = computed(() =>
    normalizeBaseUrl(
      config.public.educationApiBaseUrl,
      'https://education.bro-world.org',
    ),
  )
  const proxyBaseUrl = computed(() =>
    normalizeBaseUrl(config.public.educationApiProxyBaseUrl, '/api/education'),
  )

  const authHeaders = computed(() => {
    const token = session.value?.token

    return token ? { Authorization: `Bearer ${token}` } : {}
  })

  const headers = computed(() => ({
    ...(requestHeaders ?? {}),
    ...authHeaders.value,
    'Accept-Language': locale.value,
  }))

  const jsonLdHeaders = computed(() => ({
    ...headers.value,
    Accept: 'application/ld+json',
    'Content-Type': 'application/ld+json',
  }))

  const withBase = (path: string) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${proxyBaseUrl.value}${normalizedPath}`
  }

  const withResourceBase = (path: string) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${baseUrl.value}${normalizedPath}`
  }

  const request: RequestFn = async <T>(
    path: string,
    options: RequestOptions = {},
  ) => {
    const mergedHeaders = {
      ...headers.value,
      ...(options.headers as Record<string, string> | undefined),
    }

    const response = await $fetch<T>(withBase(path), {
      ...options,
      headers: mergedHeaders,
    })

    return camelizeKeys(response)
  }

  const educationApi = {
    raw: request,
    accessUrls: {
      list: <T>() => request<T>('/access_urls'),
      create: <T>(payload: RequestBody) =>
        request<T>('/access_urls', { method: 'POST', body: payload }),
      get: <T>(id: string | number) => request<T>(`/access_urls/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/access_urls/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/access_urls/${encode(id)}`, { method: 'DELETE' }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/access_urls/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
      forUser: <T>(userId: string | number) =>
        request<T>(`/users/${encode(userId)}/access_urls`),
    },
    accessUrlRelColorThemes: {
      list: <T>() => request<T>('/access_url_rel_color_themes'),
      create: <T>(payload: RequestBody) =>
        request<T>('/access_url_rel_color_themes', {
          method: 'POST',
          body: payload,
        }),
    },
    accessUrlRelUsers: {
      list: <T>() => request<T>('/access_url_rel_users'),
      create: <T>(payload: RequestBody) =>
        request<T>('/access_url_rel_users', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/access_url_rel_users/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/access_url_rel_users/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/access_url_rel_users/${encode(id)}`, {
          method: 'DELETE',
        }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/access_url_rel_users/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    attendances: {
      list: <T>() => request<T>('/attendances'),
      create: <T>(payload: RequestBody) =>
        request<T>('/attendances', { method: 'POST', body: payload }),
      get: <T>(id: string | number) => request<T>(`/attendances/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/attendances/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/attendances/${encode(id)}`, { method: 'DELETE' }),
      addCalendar: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/attendances/${encode(id)}/calendars`, {
          method: 'POST',
          body: payload,
        }),
      softDelete: <T>(id: string | number) =>
        request<T>(`/attendances/${encode(id)}/soft_delete`, { method: 'PUT' }),
      toggleVisibility: <T>(id: string | number) =>
        request<T>(`/attendances/${encode(id)}/toggle_visibility`, {
          method: 'PUT',
        }),
    },
    attendanceCalendars: {
      list: <T>() => request<T>('/c_attendance_calendars'),
      create: <T>(payload: RequestBody) =>
        request<T>('/c_attendance_calendars', {
          method: 'POST',
          body: payload,
        }),
      get: <T>(id: string | number) =>
        request<T>(`/c_attendance_calendars/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/c_attendance_calendars/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/c_attendance_calendars/${encode(id)}`, {
          method: 'DELETE',
        }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/c_attendance_calendars/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    blogs: {
      list: <T>() => request<T>('/c_blogs'),
      create: <T>(payload: RequestBody) =>
        request<T>('/c_blogs', { method: 'POST', body: payload }),
      get: <T>(id: string | number) => request<T>(`/c_blogs/${encode(id)}`),
      delete: (id: string | number) =>
        request<undefined>(`/c_blogs/${encode(id)}`, { method: 'DELETE' }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/c_blogs/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
      toggleVisibility: <T>(id: string | number) =>
        request<T>(`/c_blogs/${encode(id)}/toggle_visibility`, {
          method: 'PUT',
        }),
    },
    blogAttachments: {
      list: <T>() => request<T>('/c_blog_attachments'),
      create: <T>(payload: RequestBody) =>
        request<T>('/c_blog_attachments', { method: 'POST', body: payload }),
      upload: <T>(payload: RequestBody) =>
        request<T>('/c_blog_attachments/upload', {
          method: 'POST',
          body: payload,
        }),
      get: <T>(id: string | number) =>
        request<T>(`/c_blog_attachments/${encode(id)}`),
    },
    blogComments: {
      list: <T>() => request<T>('/c_blog_comments'),
      create: <T>(payload: RequestBody) =>
        request<T>('/c_blog_comments', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/c_blog_comments/${encode(id)}`),
      delete: (id: string | number) =>
        request<undefined>(`/c_blog_comments/${encode(id)}`, {
          method: 'DELETE',
        }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/c_blog_comments/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    blogPosts: {
      list: <T>() => request<T>('/c_blog_posts'),
      create: <T>(payload: RequestBody) =>
        request<T>('/c_blog_posts', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/c_blog_posts/${encode(id)}`),
      delete: (id: string | number) =>
        request<undefined>(`/c_blog_posts/${encode(id)}`, { method: 'DELETE' }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/c_blog_posts/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    blogRatings: {
      list: <T>() => request<T>('/c_blog_ratings'),
      create: <T>(payload: RequestBody) =>
        request<T>('/c_blog_ratings', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/c_blog_ratings/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/c_blog_ratings/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/c_blog_ratings/${encode(id)}`, {
          method: 'DELETE',
        }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/c_blog_ratings/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    blogRelUsers: {
      list: <T>() => request<T>('/c_blog_rel_users'),
      create: <T>(payload: RequestBody) =>
        request<T>('/c_blog_rel_users', { method: 'POST', body: payload }),
      delete: (id: string | number) =>
        request<undefined>(`/c_blog_rel_users/${encode(id)}`, {
          method: 'DELETE',
        }),
    },
    blogTasks: {
      list: <T>() => request<T>('/c_blog_tasks'),
      create: <T>(payload: RequestBody) =>
        request<T>('/c_blog_tasks', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/c_blog_tasks/${encode(id)}`),
      delete: (id: string | number) =>
        request<undefined>(`/c_blog_tasks/${encode(id)}`, { method: 'DELETE' }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/c_blog_tasks/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    blogTaskRelUsers: {
      list: <T>() => request<T>('/c_blog_task_rel_users'),
      create: <T>(payload: RequestBody) =>
        request<T>('/c_blog_task_rel_users', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/c_blog_task_rel_users/${encode(id)}`),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/c_blog_task_rel_users/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    calendarEvents: {
      list: <T>() => request<T>('/c_calendar_events'),
      create: <T>(payload: RequestBody) =>
        request<T>('/c_calendar_events', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/c_calendar_events/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/c_calendar_events/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/c_calendar_events/${encode(id)}`, {
          method: 'DELETE',
        }),
    },
    dropboxFiles: {
      upload: <T>(payload: RequestBody) =>
        request<T>('/c_dropbox_files/upload', {
          method: 'POST',
          body: payload,
        }),
    },
    studentPublications: {
      list: <T>() => request<T>('/c_student_publications'),
      create: <T>(payload: RequestBody) =>
        request<T>('/c_student_publications', {
          method: 'POST',
          body: payload,
        }),
      upload: <T>(payload: RequestBody) =>
        request<T>('/c_student_publications/upload', {
          method: 'POST',
          body: payload,
        }),
      get: <T>(id: string | number) =>
        request<T>(`/c_student_publications/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/c_student_publications/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/c_student_publications/${encode(id)}`, {
          method: 'DELETE',
        }),
    },
    studentPublicationAssignments: {
      get: <T>(id: string | number) =>
        request<T>(`/c_student_publication_assignments/${encode(id)}`),
    },
    studentPublicationComments: {
      list: <T>() => request<T>('/c_student_publication_comments'),
      upload: <T>(payload: RequestBody) =>
        request<T>('/c_student_publication_comments/upload', {
          method: 'POST',
          body: payload,
        }),
    },
    studentPublicationCorrections: {
      upload: <T>(payload: RequestBody) =>
        request<T>('/c_student_publication_corrections/upload', {
          method: 'POST',
          body: payload,
        }),
    },
    studentPublicationRelDocuments: {
      list: <T>() => request<T>('/c_student_publication_rel_documents'),
      create: <T>(payload: RequestBody) =>
        request<T>('/c_student_publication_rel_documents', {
          method: 'POST',
          body: payload,
        }),
      get: <T>(id: string | number) =>
        request<T>(`/c_student_publication_rel_documents/${encode(id)}`),
      delete: (id: string | number) =>
        request<undefined>(
          `/c_student_publication_rel_documents/${encode(id)}`,
          {
            method: 'DELETE',
          },
        ),
    },
    studentPublicationRelUsers: {
      list: <T>() => request<T>('/c_student_publication_rel_users'),
      create: <T>(payload: RequestBody) =>
        request<T>('/c_student_publication_rel_users', {
          method: 'POST',
          body: payload,
        }),
      get: <T>(id: string | number) =>
        request<T>(`/c_student_publication_rel_users/${encode(id)}`),
      delete: (id: string | number) =>
        request<undefined>(`/c_student_publication_rel_users/${encode(id)}`, {
          method: 'DELETE',
        }),
    },
    tools: {
      list: <T>() => request<T>('/c_tools'),
    },
    toolIntros: {
      list: <T>() => request<T>('/c_tool_intros'),
      create: <T>(payload: RequestBody) =>
        request<T>('/c_tool_intros', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/c_tool_intros/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/c_tool_intros/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/c_tool_intros/${encode(id)}`, {
          method: 'DELETE',
        }),
    },
    categorizedExerciseResults: {
      get: <T>(exerciseId: string | number) =>
        request<T>(`/categorized_exercise_results/${encode(exerciseId)}`),
    },
    colorThemes: {
      create: <T>(payload: RequestBody) =>
        request<T>('/color_themes', { method: 'POST', body: payload }),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/color_themes/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
    },
    conferenceActivities: {
      callback: <T>(payload: RequestBody) =>
        request<T>('/videoconference/callback', {
          method: 'POST',
          body: payload,
        }),
    },
    courses: {
      list: <T>() => request<T>('/courses'),
      create: <T>(payload: RequestBody) =>
        request<T>('/courses', { method: 'POST', body: payload }),
      get: <T>(id: string | number) => request<T>(`/courses/${encode(id)}`),
      stats: <T>(id: string | number, metric: string) =>
        request<T>(`/courses/${encode(id)}/stats/${encode(metric)}`),
      publicList: <T>() => request<T>('/public_courses'),
    },
    courseCategories: {
      list: <T>() => request<T>('/course_categories'),
      create: <T>(payload: RequestBody) =>
        request<T>('/course_categories', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/course_categories/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/course_categories/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/course_categories/${encode(id)}`, {
          method: 'DELETE',
        }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/course_categories/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
      forCourse: <T>(courseId: string | number) =>
        request<T>(`/courses/${encode(courseId)}/categories`),
    },
    courseRelUsers: {
      list: <T>() => request<T>('/course_rel_users'),
      create: <T>(payload: RequestBody) =>
        request<T>('/course_rel_users', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/course_rel_users/${encode(id)}`),
    },
    documents: {
      list: <T>() => request<T>('/documents'),
      create: <T>(payload: RequestBody) =>
        request<T>('/documents', { method: 'POST', body: payload }),
      downloadSelected: <T>(payload: RequestBody) =>
        request<T>('/documents/download-selected', {
          method: 'POST',
          body: payload,
        }),
      get: <T>(id: string | number) => request<T>(`/documents/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/documents/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/documents/${encode(id)}`, { method: 'DELETE' }),
      learningPathUsage: <T>(id: string | number) =>
        request<T>(`/documents/${encode(id)}/lp-usage`),
      move: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/documents/${encode(id)}/move`, {
          method: 'PUT',
          body: payload,
        }),
      replaceFile: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/documents/${encode(id)}/replace`, {
          method: 'POST',
          body: payload,
        }),
      toggleVisibility: <T>(id: string | number) =>
        request<T>(`/documents/${encode(id)}/toggle_visibility`, {
          method: 'PUT',
        }),
    },
    extraFields: {
      list: <T>() => request<T>('/extra_fields'),
      create: <T>(payload: RequestBody) =>
        request<T>('/extra_fields', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/extra_fields/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/extra_fields/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
    },
    extraFieldValues: {
      list: <T>() => request<T>('/extra_field_valuess'),
      create: <T>(payload: RequestBody) =>
        request<T>('/extra_field_valuess', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/extra_field_valuess/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/extra_field_valuess/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
    },
    glossaries: {
      list: <T>() => request<T>('/glossaries'),
      create: <T>(payload: RequestBody) =>
        request<T>('/glossaries', { method: 'POST', body: payload }),
      export: <T>(payload: RequestBody) =>
        request<T>('/glossaries/export', { method: 'POST', body: payload }),
      exportToDocuments: <T>(payload: RequestBody) =>
        request<T>('/glossaries/export_to_documents', {
          method: 'POST',
          body: payload,
        }),
      import: <T>(payload: RequestBody) =>
        request<T>('/glossaries/import', { method: 'POST', body: payload }),
      get: <T>(id: string | number) => request<T>(`/glossaries/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/glossaries/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/glossaries/${encode(id)}`, { method: 'DELETE' }),
    },
    gradebookCategories: {
      list: <T>() => request<T>('/gradebook_categories'),
      create: <T>(payload: RequestBody) =>
        request<T>('/gradebook_categories', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/gradebook_categories/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/gradebook_categories/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/gradebook_categories/${encode(id)}`, {
          method: 'DELETE',
        }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/gradebook_categories/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    groups: {
      list: <T>() => request<T>('/groups'),
      get: <T>(id: string | number) => request<T>(`/groups/${encode(id)}`),
    },
    illustrations: {
      list: <T>() => request<T>('/illustrations'),
      create: <T>(payload: RequestBody) =>
        request<T>('/illustrations', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/illustrations/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/illustrations/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/illustrations/${encode(id)}`, {
          method: 'DELETE',
        }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/illustrations/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    languages: {
      list: <T>() => request<T>('/languages'),
      create: <T>(payload: RequestBody) =>
        request<T>('/languages', { method: 'POST', body: payload }),
      get: <T>(id: string | number) => request<T>(`/languages/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/languages/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/languages/${encode(id)}`, { method: 'DELETE' }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/languages/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    learningPaths: {
      list: <T>() => request<T>('/learning_paths'),
      reorder: <T>(payload: RequestBody) =>
        request<T>('/learning_paths/reorder', {
          method: 'POST',
          body: payload,
        }),
      get: <T>(id: string | number) =>
        request<T>(`/learning_paths/${encode(id)}`),
    },
    learningPathCategories: {
      list: <T>() => request<T>('/learning_path_categories'),
      get: <T>(id: string | number) =>
        request<T>(`/learning_path_categories/${encode(id)}`),
    },
    legals: {
      list: <T>() => request<T>('/legals'),
      create: <T>(payload: RequestBody) =>
        request<T>('/legals', { method: 'POST', body: payload }),
      get: <T>(id: string | number) => request<T>(`/legals/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/legals/${encode(id)}`, { method: 'PUT', body: payload }),
      delete: (id: string | number) =>
        request<undefined>(`/legals/${encode(id)}`, { method: 'DELETE' }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/legals/${encode(id)}`, { method: 'PATCH', body: payload }),
    },
    links: {
      list: <T>() => request<T>('/links'),
      create: <T>(payload: RequestBody) =>
        request<T>('/links', { method: 'POST', body: payload }),
      get: <T>(id: string | number) => request<T>(`/links/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/links/${encode(id)}`, { method: 'PUT', body: payload }),
      delete: (id: string | number) =>
        request<undefined>(`/links/${encode(id)}`, { method: 'DELETE' }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/links/${encode(id)}`, { method: 'PATCH', body: payload }),
      check: <T>(id: string | number) =>
        request<T>(`/links/${encode(id)}/check`),
      details: <T>(id: string | number) =>
        request<T>(`/links/${encode(id)}/details`),
      move: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/links/${encode(id)}/move`, {
          method: 'PUT',
          body: payload,
        }),
      toggleVisibility: <T>(id: string | number) =>
        request<T>(`/links/${encode(id)}/toggle_visibility`, { method: 'PUT' }),
      uploadImage: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/links/${encode(id)}/upload-image`, {
          method: 'POST',
          body: payload,
        }),
    },
    linkCategories: {
      list: <T>() => request<T>('/link_categories'),
      create: <T>(payload: RequestBody) =>
        request<T>('/link_categories', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/link_categories/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/link_categories/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/link_categories/${encode(id)}`, {
          method: 'DELETE',
        }),
      toggleVisibility: <T>(id: string | number) =>
        request<T>(`/link_categories/${encode(id)}/toggle_visibility`, {
          method: 'PUT',
        }),
    },
    authentication: {
      login: <T>(payload: RequestBody) =>
        request<T>('/authentication_token', { method: 'POST', body: payload }),
    },
    messages: {
      list: <T>() => request<T>('/messages'),
      create: <T>(payload: RequestBody) =>
        request<T>('/messages', { method: 'POST', body: payload }),
      listByGroup: <T>() => request<T>('/messages/by-group/list'),
      get: <T>(id: string | number) => request<T>(`/messages/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/messages/${encode(id)}`, { method: 'PUT', body: payload }),
      delete: (id: string | number) =>
        request<undefined>(`/messages/${encode(id)}`, { method: 'DELETE' }),
    },
    messageAttachments: {
      get: <T>(id: string | number) =>
        request<T>(`/message_attachments/${encode(id)}`),
    },
    messageRelUsers: {
      get: <T>(id: string | number) =>
        request<T>(`/message_rel_users/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/message_rel_users/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/message_rel_users/${encode(id)}`, {
          method: 'DELETE',
        }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/message_rel_users/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    messageTags: {
      list: <T>() => request<T>('/message_tags'),
      create: <T>(payload: RequestBody) =>
        request<T>('/message_tags', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/message_tags/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/message_tags/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/message_tags/${encode(id)}`, { method: 'DELETE' }),
    },
    pages: {
      list: <T>() => request<T>('/pages'),
      create: <T>(payload: RequestBody) =>
        request<T>('/pages', { method: 'POST', body: payload }),
      get: <T>(id: string | number) => request<T>(`/pages/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/pages/${encode(id)}`, { method: 'PUT', body: payload }),
      delete: (id: string | number) =>
        request<undefined>(`/pages/${encode(id)}`, { method: 'DELETE' }),
    },
    pageCategories: {
      list: <T>() => request<T>('/page_categories'),
      create: <T>(payload: RequestBody) =>
        request<T>('/page_categories', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/page_categories/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/page_categories/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/page_categories/${encode(id)}`, {
          method: 'DELETE',
        }),
    },
    pageLayouts: {
      list: <T>() => request<T>('/page_layouts'),
      create: <T>(payload: RequestBody) =>
        request<T>('/page_layouts', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/page_layouts/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/page_layouts/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/page_layouts/${encode(id)}`, { method: 'DELETE' }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/page_layouts/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    pageLayoutTemplates: {
      list: <T>() => request<T>('/page_layout_templates'),
      create: <T>(payload: RequestBody) =>
        request<T>('/page_layout_templates', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/page_layout_templates/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/page_layout_templates/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/page_layout_templates/${encode(id)}`, {
          method: 'DELETE',
        }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/page_layout_templates/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    personalFiles: {
      list: <T>() => request<T>('/personal_files'),
      create: <T>(payload: RequestBody) =>
        request<T>('/personal_files', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/personal_files/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/personal_files/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/personal_files/${encode(id)}`, {
          method: 'DELETE',
        }),
    },
    pushSubscriptions: {
      list: <T>() => request<T>('/push_subscriptions'),
      create: <T>(payload: RequestBody) =>
        request<T>('/push_subscriptions', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/push_subscriptions/${encode(id)}`),
      delete: (id: string | number) =>
        request<undefined>(`/push_subscriptions/${encode(id)}`, {
          method: 'DELETE',
        }),
    },
    resourceFiles: {
      list: <T>() => request<T>('/resource_files'),
      create: <T>(payload: RequestBody) =>
        request<T>('/resource_files', { method: 'POST', body: payload }),
      addVariant: <T>(payload: RequestBody) =>
        request<T>('/resource_files/add_variant', {
          method: 'POST',
          body: payload,
        }),
      get: <T>(id: string | number) =>
        request<T>(`/resource_files/${encode(id)}`),
    },
    resourceLinks: {
      list: <T>() => request<T>('/resource_links'),
      create: <T>(payload: RequestBody) =>
        request<T>('/resource_links', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/resource_links/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/resource_links/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/resource_links/${encode(id)}`, {
          method: 'DELETE',
        }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/resource_links/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    resourceNodes: {
      list: <T>() => request<T>('/resource_nodes'),
      get: <T>(id: string | number) =>
        request<T>(`/resource_nodes/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/resource_nodes/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/resource_nodes/${encode(id)}`, {
          method: 'DELETE',
        }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/resource_nodes/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    sessions: {
      advancedCreate: <T>(payload: RequestBody) =>
        request<T>('/advanced/create-session-with-courses-and-users', {
          method: 'POST',
          body: payload,
        }),
      list: <T>() => request<T>('/sessions'),
      create: <T>(payload: RequestBody) =>
        request<T>('/sessions', { method: 'POST', body: payload }),
      get: <T>(id: string | number) => request<T>(`/sessions/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/sessions/${encode(id)}`, { method: 'PUT', body: payload }),
      delete: (id: string | number) =>
        request<undefined>(`/sessions/${encode(id)}`, { method: 'DELETE' }),
      subscriptions: {
        current: <T>(userId: string | number) =>
          request<T>(`/users/${encode(userId)}/session_subscriptions/current`),
        past: <T>(userId: string | number) =>
          request<T>(`/users/${encode(userId)}/session_subscriptions/past`),
        upcoming: <T>(userId: string | number) =>
          request<T>(`/users/${encode(userId)}/session_subscriptions/upcoming`),
      },
    },
    sessionCategories: {
      list: <T>() => request<T>('/session_categories'),
      create: <T>(payload: RequestBody) =>
        request<T>('/session_categories', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/session_categories/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/session_categories/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/session_categories/${encode(id)}`, {
          method: 'DELETE',
        }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/session_categories/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    sessionRelCourses: {
      list: <T>() => request<T>('/session_rel_courses'),
      create: <T>(payload: RequestBody) =>
        request<T>('/session_rel_courses', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/session_rel_courses/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/session_rel_courses/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/session_rel_courses/${encode(id)}`, {
          method: 'DELETE',
        }),
    },
    sessionRelCourseRelUsers: {
      list: <T>() => request<T>('/session_rel_course_rel_users'),
      create: <T>(payload: RequestBody) =>
        request<T>('/session_rel_course_rel_users', {
          method: 'POST',
          body: payload,
        }),
      get: <T>(id: string | number) =>
        request<T>(`/session_rel_course_rel_users/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/session_rel_course_rel_users/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/session_rel_course_rel_users/${encode(id)}`, {
          method: 'DELETE',
        }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/session_rel_course_rel_users/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    sessionRelUsers: {
      list: <T>() => request<T>('/session_rel_users'),
      create: <T>(payload: RequestBody) =>
        request<T>('/session_rel_users', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/session_rel_users/${encode(id)}`),
    },
    skills: {
      list: <T>() => request<T>('/skills'),
      create: <T>(payload: RequestBody) =>
        request<T>('/skills', { method: 'POST', body: payload }),
      tree: <T>() => request<T>('/skills/tree'),
      get: <T>(id: string | number) => request<T>(`/skills/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/skills/${encode(id)}`, { method: 'PUT', body: payload }),
      delete: (id: string | number) =>
        request<undefined>(`/skills/${encode(id)}`, { method: 'DELETE' }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/skills/${encode(id)}`, { method: 'PATCH', body: payload }),
    },
    skillProfiles: {
      list: <T>() => request<T>('/skill_profiles'),
      create: <T>(payload: RequestBody) =>
        request<T>('/skill_profiles', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/skill_profiles/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/skill_profiles/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/skill_profiles/${encode(id)}`, {
          method: 'DELETE',
        }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/skill_profiles/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    skillRelUsers: {
      create: <T>(payload: RequestBody) =>
        request<T>('/skill_rel_users', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/skill_rel_users/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/skill_rel_users/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/skill_rel_users/${encode(id)}`, {
          method: 'DELETE',
        }),
    },
    socialPosts: {
      list: <T>() => request<T>('/social_posts'),
      create: <T>(payload: RequestBody) =>
        request<T>('/social_posts', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/social_posts/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/social_posts/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/social_posts/${encode(id)}`, { method: 'DELETE' }),
      attachments: <T>(id: string | number) =>
        request<T>(`/social_posts/${encode(id)}/attachments`),
      dislike: <T>(id: string | number) =>
        request<T>(`/social_posts/${encode(id)}/dislike`, { method: 'POST' }),
      like: <T>(id: string | number) =>
        request<T>(`/social_posts/${encode(id)}/like`, { method: 'POST' }),
    },
    socialPostAttachments: {
      list: <T>() => request<T>('/social_post_attachments'),
      create: <T>(payload: RequestBody) =>
        request<T>('/social_post_attachments', {
          method: 'POST',
          body: payload,
        }),
      get: <T>(id: string | number) =>
        request<T>(`/social_post_attachments/${encode(id)}`),
    },
    thirdParties: {
      list: <T>() => request<T>('/third_parties'),
      create: <T>(payload: RequestBody) =>
        request<T>('/third_parties', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/third_parties/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/third_parties/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/third_parties/${encode(id)}`, {
          method: 'DELETE',
        }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/third_parties/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    thirdPartyDataExchanges: {
      list: <T>() => request<T>('/third_party_data_exchanges'),
      create: <T>(payload: RequestBody) =>
        request<T>('/third_party_data_exchanges', {
          method: 'POST',
          body: payload,
        }),
      get: <T>(id: string | number) =>
        request<T>(`/third_party_data_exchanges/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/third_party_data_exchanges/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/third_party_data_exchanges/${encode(id)}`, {
          method: 'DELETE',
        }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/third_party_data_exchanges/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    thirdPartyDataExchangeUsers: {
      list: <T>() => request<T>('/third_party_data_exchange_users'),
      create: <T>(payload: RequestBody) =>
        request<T>('/third_party_data_exchange_users', {
          method: 'POST',
          body: payload,
        }),
      get: <T>(id: string | number) =>
        request<T>(`/third_party_data_exchange_users/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/third_party_data_exchange_users/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/third_party_data_exchange_users/${encode(id)}`, {
          method: 'DELETE',
        }),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/third_party_data_exchange_users/${encode(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
    },
    trackEAttempts: {
      list: <T>() => request<T>('/track_e_attempts'),
      get: <T>(id: string | number) =>
        request<T>(`/track_e_attempts/${encode(id)}`),
    },
    trackEAttemptQualifies: {
      list: <T>() => request<T>('/track_e_attempt_qualifies'),
      get: <T>(id: string | number) =>
        request<T>(`/track_e_attempt_qualifies/${encode(id)}`),
    },
    trackEExercises: {
      list: <T>() => request<T>('/track_e_exercises'),
      get: <T>(exerciseId: string | number) =>
        request<T>(`/track_e_exercises/${encode(exerciseId)}`),
    },
    users: {
      createForAccessUrl: <T>(
        accessUrlId: string | number,
        payload: RequestBody,
      ) =>
        request<T>(`/access_urls/${encode(accessUrlId)}/user`, {
          method: 'POST',
          body: payload,
        }),
      list: <T>() => request<T>('/users'),
      create: <T>(payload: RequestBody) =>
        request<T>('/users', { method: 'POST', body: payload }),
      get: <T>(id: string | number) => request<T>(`/users/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/users/${encode(id)}`, { method: 'PUT', body: payload }),
      delete: (id: string | number) =>
        request<undefined>(`/users/${encode(id)}`, { method: 'DELETE' }),
      courseStats: <T>(
        id: string | number,
        courseId: string | number,
        metric: string,
      ) =>
        request<T>(
          `/users/${encode(id)}/courses/${encode(courseId)}/stats/${encode(metric)}`,
        ),
      skills: <T>(id: string | number) =>
        request<T>(`/users/${encode(id)}/skills`),
    },
    userRelCourseVotes: {
      list: <T>() => request<T>('/user_rel_course_votes'),
      create: <T>(payload: RequestBody) =>
        request<T>('/user_rel_course_votes', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/user_rel_course_votes/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/user_rel_course_votes/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/user_rel_course_votes/${encode(id)}`, {
          method: 'DELETE',
        }),
    },
    userRelUsers: {
      list: <T>() => request<T>('/user_rel_users'),
      create: <T>(payload: RequestBody) =>
        request<T>('/user_rel_users', { method: 'POST', body: payload }),
      get: <T>(id: string | number) =>
        request<T>(`/user_rel_users/${encode(id)}`),
      replace: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/user_rel_users/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/user_rel_users/${encode(id)}`, {
          method: 'DELETE',
        }),
    },
    usergroups: {
      mine: <T>() => request<T>('/usergroup/list/my'),
      newest: <T>() => request<T>('/usergroup/list/newest'),
      popular: <T>() => request<T>('/usergroup/list/popular'),
      get: <T>(id: string | number) => request<T>(`/usergroup/${encode(id)}`),
      create: <T>(payload: RequestBody) =>
        request<T>('/usergroups', { method: 'POST', body: payload }),
      search: <T>() => request<T>('/usergroups/search'),
      update: <T>(id: string | number, payload: RequestBody) =>
        request<T>(`/usergroups/${encode(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string | number) =>
        request<undefined>(`/usergroups/${encode(id)}`, { method: 'DELETE' }),
      members: <T>(id: string | number) =>
        request<T>(`/usergroups/${encode(id)}/members`),
    },
  }

  return {
    baseUrl,
    proxyBaseUrl,
    authHeaders,
    headers,
    jsonLdHeaders,
    withBase,
    withResourceBase,
    request,
    ...educationApi,
    api: educationApi,
  }
}
