// @ts-nocheck
import baseService from './baseService'

const adminBlocksEnabled =
  process.env.NUXT_PUBLIC_EDUCATION_ADMIN_BLOCKS !== 'false'

export default {
  registerCampus: async (doNotListCampus) => {
    await baseService.post('/admin/register-campus', {
      donotlistcampus: doNotListCampus,
    })
  },

  findAnnouncements: () =>
    baseService.get('/main/inc/ajax/admin.ajax.php?a=get_latest_news'),
  findVersion: () => baseService.get('/main/inc/ajax/admin.ajax.php?a=version'),
  findSupport: () =>
    baseService.get('/main/inc/ajax/admin.ajax.php?a=get_support'),
  findBlocks: async () => {
    if (!adminBlocksEnabled) {
      return {}
    }

    try {
      return await baseService.get('/admin/index')
    } catch (error) {
      console.warn(
        'Admin index endpoint unavailable, returning empty blocks',
        error,
      )

      return {}
    }
  },

  fetchThirdParties: async () => {
    const data = await baseService.get('/api/third_parties')
    return data['hydra:member'] || []
  },

  createThirdParty: async (payload) => {
    return await baseService.post('/api/third_parties', payload)
  },

  fetchExchanges: async (thirdPartyId = null) => {
    const query = thirdPartyId
      ? `?thirdParty=${encodeURIComponent(`/api/third_parties/${thirdPartyId}`)}`
      : ''
    const data = await baseService.get(
      `/api/third_party_data_exchanges${query}`,
    )
    return data['hydra:member'] || []
  },

  fetchExchangeUsers: async () => {
    const data = await baseService.get(
      '/api/third_party_data_exchange_users?pagination=false',
    )
    return data['hydra:member'] || []
  },

  fetchUsers: async () => {
    const data = await baseService.get('/api/users?pagination=false')
    return data['hydra:member'] || []
  },

  createExchange: (payload) =>
    baseService.post('/api/third_party_data_exchanges', payload),

  assignExchangeUsers: (userPayload) =>
    Promise.all(
      userPayload.map((p) =>
        baseService.post('/api/third_party_data_exchange_users', p),
      ),
    ),

  updateThirdParty: (id, payload) =>
    baseService.put(`/api/third_parties/${id}`, payload),

  deleteThirdParty: (idOrIri) =>
    baseService.delete(
      typeof idOrIri === 'string' && idOrIri.startsWith('/api/')
        ? idOrIri
        : `/api/third_parties/${idOrIri}`,
    ),

  updateExchange: (idOrIri, payload) =>
    baseService.put(
      idOrIri.startsWith('/api/')
        ? idOrIri
        : `/api/third_party_data_exchanges/${idOrIri}`,
      payload,
    ),

  deleteExchange: (idOrIri) =>
    baseService.delete(
      idOrIri.startsWith('/api/')
        ? idOrIri
        : `/api/third_party_data_exchanges/${idOrIri}`,
    ),
}
