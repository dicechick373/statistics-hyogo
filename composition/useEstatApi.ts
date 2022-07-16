import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { reactive, toRefs } from '@nuxtjs/composition-api'
import qs from 'qs'
import { EstatParams, EstatResponse } from '~/types/estat'

type State = {
  response: EstatResponse
  otherError: string
  isLoading: boolean
}

export const useEstatApi = (axios: NuxtAxiosInstance, params: EstatParams) => {
  const state = reactive<State>({
    response: null,
    otherError: null,
    isLoading: false,
  })

  const getData = async (): Promise<EstatResponse> => {
    const url = 'getStatsData'

    const api = axios.create({
      headers: {
        common: {
          Accept: 'application/json',
        },
        'Content-Type': 'application/json',
      },
      params: {
        appId: process.env.ESTAT_APPID,
      },
      paramsSerializer: (params: EstatParams) => {
        return qs.stringify(params, { arrayFormat: 'comma' })
      },
      withCredentials: true,
      data: {},
    })
    api.setBaseURL(`${process.env.SITE_URL}/json/`)

    api.interceptors.request.use((request) => {
      // console.log('Starting Request: ', request)
      return request
    })

    api.interceptors.response.use((response) => {
      // console.log('Response: ', response)
      return response
    })

    state.isLoading = true

    const res = await api.$get(url, { params })
    return res
  }

  return {
    ...toRefs(state),
    getData,
  }
}
