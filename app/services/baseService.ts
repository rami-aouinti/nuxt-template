// @ts-nocheck
import api from '../config/api'

export default {
  /**
   * @param {string} iri
   * @param {Object} [params]
   * @returns {Promise<any>}
   */
  async get(iri, params = {}) {
    return await $fetch(iri, {
      params,
    })
  },

  /**
   * @param {string} endpoint
   * @param {Object} searchParams
   * @returns {Promise<{totalItems: number, items: Object[], nextPageParams: {page: number, itemsPerPage: number}|null}>}
   */
  async getCollection(endpoint, searchParams = {}) {
    const data = await $fetch(endpoint, {
      params: searchParams,
    })

    let nextPageParams = null
    if (data['hydra:view'] && data['hydra:view']['hydra:next']) {
      const queryString = data['hydra:view']['hydra:next'].split('?')[1]

      nextPageParams = Object.fromEntries(new URLSearchParams(queryString))
    }

    return {
      totalItems: data['hydra:totalItems'] || data.totalItems,
      items: data['hydra:member'],
      nextPageParams,
    }
  },

  /**
   * @param {string} endpoint
   * @param {Object} [params={}]
   * @param {boolean} [addContentType=false]
   * @param {Object} [additionalHeaders={}]
   * @param {Object} [options={}]
   * @returns {Promise<Object>}
   */
  async post(
    endpoint,
    params = {},
    addContentType = false,
    additionalHeaders = {},
    options = {},
  ) {
    const headers = {}

    if (addContentType) {
      headers['Content-Type'] = 'application/json'
    }

    return await $fetch(endpoint, params, {
      method: 'POST',
      headers: { ...headers, ...additionalHeaders },
      ...options,
    })
  },

  /**
   * @param {string} iri
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async put(iri, params) {
    return await $fetch(iri, params, {
      method: 'PUT',
    })
  },

  /**
   * @param {string} endpoint
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async postForm(endpoint, params) {
    const { data } = await api.postForm(endpoint, params)

    return data
  },

  /**
   * @param {string} iri
   * @returns {Promise<void>}
   */
  async delete(iri) {
    await api.delete(iri)
  },
}
