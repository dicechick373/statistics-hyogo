import {
  computed,
  inject,
  reactive,
  toRefs,
  useContext,
  useRoute,
} from '@nuxtjs/composition-api'

import { GlobalState, StateKey } from './useGlobalState'
import { usePrefecture } from './usePrefecture'
import { convertPrefCodeNumberToString } from './utils/formatResas'
import { useEstatApi } from './useEstatApi'
import { useCity } from './useCity'
import { EstatParams, EstatResponse } from '~/types/estat-api'
import { EstatCardConfig } from '~/types/main'

interface State {
  config: EstatCardConfig
  params: EstatParams
  response: EstatResponse
}

export const useEstatTimeChart = () => {
  // state
  const state = reactive<State>({
    config: null,
    params: null,
    response: null,
  })

  const setConfig = (newConfig: EstatCardConfig) => {
    state.config = newConfig
  }

  // routeパラメータの取得
  const { govType, code } = useRoute().value.params

  // GlobalState
  const { isRank } = inject(StateKey) as GlobalState

  // cdAreaを取得
  const { prefList } = usePrefecture()
  const { cityList } = useCity()
  const cdArea = computed(() => {
    // console.log()
    return isRank.value === false
      ? code
      : govType === 'prefecture'
      ? prefList.value.map((d) => convertPrefCodeNumberToString(d.prefCode))
      : cityList.value.map((d) => d.cityCode)
  })

  // estatパラメータのセット
  const estatParams = computed((): EstatParams => {
    return {
      statsDataId: state.config.statsDataId,
      cdCat01: state.config.cdCat01,
      cdArea: cdArea.value,
    }
  })

  // estat-APIからデータ取得
  const { $axios } = useContext()
  const setEstatResponseAsync = async () => {
    state.estatResponse = await useEstatApi($axios, estatParams.value).getData()
  }

  return {
    ...toRefs(state),
    setEstatResponseAsync,
    setConfig,
  }
}
