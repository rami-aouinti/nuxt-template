import type { FetchOptions } from 'ofetch'

type RequestOptions = FetchOptions<'json'>

type RequestBody = NonNullable<RequestOptions['body']> | FormData

type ResumeSectionHandler<T> = {
  list: () => Promise<T[]>
  create: (payload: RequestBody) => Promise<T>
  update: (id: string, payload: RequestBody) => Promise<T>
  delete: (id: string) => Promise<void>
}

type ResumeSectionFactory = <T = Record<string, unknown>>(
  path: string,
) => ResumeSectionHandler<T>

type RequestFn = <T>(path: string, options?: RequestOptions) => Promise<T>

const API_BASE_PATH = '/api/job/v1'

function createRequest(): RequestFn {
  return async function request<T>(path: string, options: RequestOptions = {}) {
    const url = `${API_BASE_PATH}${path}`
    return await $fetch<T>(url, options)
  }
}

function createResumeSection(request: RequestFn): ResumeSectionFactory {
  return function resumeSection<T = Record<string, unknown>>(path: string) {
    return {
      list: () => request<T[]>(path),
      create: (payload: RequestBody) =>
        request<T>(path, { method: 'POST', body: payload }),
      update: (id: string, payload: RequestBody) =>
        request<T>(`${path}/${encodeURIComponent(id)}`, {
          method: 'PATCH',
          body: payload,
        }),
      delete: (id: string) =>
        request<undefined>(`${path}/${encodeURIComponent(id)}`, {
          method: 'DELETE',
        }),
    }
  }
}

export function useJobPlatformApi() {
  const request = createRequest()
  const resumeSection = createResumeSection(request)

  return {
    applicants: {
      list: <T = Record<string, unknown>>() => request<T>('/applicants'),
      create: <T = Record<string, unknown>>(payload: RequestBody) =>
        request<T>('/applicants', { method: 'POST', body: payload }),
      get: <T = Record<string, unknown>>(id: string) =>
        request<T>(`/applicants/${encodeURIComponent(id)}`),
      update: <T = Record<string, unknown>>(id: string, payload: RequestBody) =>
        request<T>(`/applicants/${encodeURIComponent(id)}`, {
          method: 'PUT',
          body: payload,
        }),
      delete: (id: string) =>
        request<undefined>(`/applicants/${encodeURIComponent(id)}`, {
          method: 'DELETE',
        }),
    },
    currentApplicant: {
      list: <T = Record<string, unknown>[]>() =>
        request<T>('/profile/applicant'),
      create: <T = Record<string, unknown>>(payload: RequestBody) =>
        request<T>('/applicant', { method: 'POST', body: payload }),
      get: <T = Record<string, unknown>>(id: string) =>
        request<T>(`/applicant/${encodeURIComponent(id)}`),
      update: <T = Record<string, unknown>>(id: string, payload: RequestBody) =>
        request<T>(`/applicant/${encodeURIComponent(id)}`, {
          method: 'PUT',
          body: payload,
        }),
    },
    applications: {
      list: <T = Record<string, unknown>>() => request<T>('/application'),
      create: <T = Record<string, unknown>>(
        jobId: string,
        applicantId: string,
      ) =>
        request<T>(
          `/application/${encodeURIComponent(jobId)}/${encodeURIComponent(applicantId)}`,
          { method: 'POST' },
        ),
      updateStatus: <T = Record<string, unknown>>(
        status: string,
        applicationId: string,
      ) =>
        request<T>(
          `/applications/${encodeURIComponent(status)}/${encodeURIComponent(applicationId)}`,
          { method: 'POST' },
        ),
      profileList: <T = Record<string, unknown>>() =>
        request<T>('/profile/application'),
    },
    companies: {
      create: <T = Record<string, unknown>>(payload: RequestBody) =>
        request<T>('/company', { method: 'POST', body: payload }),
      list: <T = Record<string, unknown>>() => request<T>('/company'),
      get: <T = Record<string, unknown>>(companyId: string) =>
        request<T>(`/company/${encodeURIComponent(companyId)}`),
      update: <T = Record<string, unknown>>(
        companyId: string,
        payload: RequestBody,
      ) =>
        request<T>(`/company/${encodeURIComponent(companyId)}`, {
          method: 'PUT',
          body: payload,
        }),
      profileList: <T = Record<string, unknown>>() =>
        request<T>('/profile/company'),
      legacy: {
        list: <T = Record<string, unknown>>() => request<T>('/companies'),
        create: <T = Record<string, unknown>>(payload: RequestBody) =>
          request<T>('/companies', { method: 'POST', body: payload }),
        get: <T = Record<string, unknown>>(id: string) =>
          request<T>(`/companies/${encodeURIComponent(id)}`),
        update: <T = Record<string, unknown>>(
          id: string,
          payload: RequestBody,
        ) =>
          request<T>(`/companies/${encodeURIComponent(id)}`, {
            method: 'PUT',
            body: payload,
          }),
        delete: (id: string) =>
          request<undefined>(`/companies/${encodeURIComponent(id)}`, {
            method: 'DELETE',
          }),
      },
    },
    jobs: {
      create: <T = Record<string, unknown>>(payload: RequestBody) =>
        request<T>('/job', { method: 'POST', body: payload }),
      list: <T = Record<string, unknown>>() => request<T>('/job'),
      get: <T = Record<string, unknown>>(jobId: string) =>
        request<T>(`/job/${encodeURIComponent(jobId)}`),
      update: <T = Record<string, unknown>>(
        jobId: string,
        payload: RequestBody,
      ) =>
        request<T>(`/job/${encodeURIComponent(jobId)}`, {
          method: 'PUT',
          body: payload,
        }),
      profileList: <T = Record<string, unknown>>() =>
        request<T>('/profile/job'),
      requests: <T = Record<string, unknown>>() => request<T>('/requests/job'),
      resource: {
        list: <T = Record<string, unknown>>() => request<T>('/jobs'),
        get: <T = Record<string, unknown>>(id: string) =>
          request<T>(`/jobs/${encodeURIComponent(id)}`),
        create: <T = Record<string, unknown>>(payload: RequestBody) =>
          request<T>('/jobs', { method: 'POST', body: payload }),
        update: <T = Record<string, unknown>>(
          id: string,
          payload: RequestBody,
        ) =>
          request<T>(`/jobs/${encodeURIComponent(id)}`, {
            method: 'PUT',
            body: payload,
          }),
        delete: <T = Record<string, unknown>>(id: string) =>
          request<T>(`/jobs/${encodeURIComponent(id)}`, { method: 'DELETE' }),
      },
    },
    jobApplications: {
      create: <T = Record<string, unknown>>(payload: RequestBody) =>
        request<T>('/jobs_applications', { method: 'POST', body: payload }),
      list: <T = Record<string, unknown>>() => request<T>('/jobs_applications'),
      get: <T = Record<string, unknown>>(id: string) =>
        request<T>(`/jobs_applications/${encodeURIComponent(id)}`),
      listByApplicant: <T = Record<string, unknown>>(applicantId: string) =>
        request<T>(
          `/jobs_applications/filter-by-applicant/${encodeURIComponent(applicantId)}`,
        ),
      listByJob: <T = Record<string, unknown>>(jobId: string) =>
        request<T>(
          `/jobs_applications/filter-by-job/${encodeURIComponent(jobId)}`,
        ),
      delete: (id: string) =>
        request<undefined>(`/jobs_applications/${encodeURIComponent(id)}`, {
          method: 'DELETE',
        }),
    },
    resume: {
      overview: <T = Record<string, unknown>>() =>
        request<T>('/profile/resume'),
      generate: () => request('/resume/generate'),
      education: resumeSection('/resume/education'),
      experience: resumeSection('/resume/experience'),
      language: resumeSection('/resume/language'),
      skill: resumeSection('/resume/skill'),
      hobby: resumeSection('/resume/hobby'),
      project: resumeSection('/resume/project'),
      reference: resumeSection('/resume/reference'),
    },
  }
}
