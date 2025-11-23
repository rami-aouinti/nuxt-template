export type AxiosResponse<T = any> = { data: T }

async function resolved<T = any>(data?: T): Promise<AxiosResponse<T>> {
  return { data: data as T }
}

const axiosStub = {
  get: resolved,
  post: resolved,
  put: resolved,
  delete: resolved,
  request: resolved,
  create() {
    return this
  },
}

export default axiosStub
