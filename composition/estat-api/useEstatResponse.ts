import {
  computed,
  inject,
  reactive,
  toRefs,
  useContext,
  useRoute,
} from '@nuxtjs/composition-api'

import { GlobalState, StateKey } from '~/composition/useGlobalState'
import { usePrefecture } from '~/composition/resas-api/usePrefecture'
import { convertPrefCodeNumberToString } from '~/composition/resas-api/formatResas'
import { useEstatApi } from '~/composition/estat-api/useEstatApi'
import { useCity } from '~/composition/resas-api/useCity'
import { EstatParams, EstatResponse } from '~/types/estat-api'
import { CardConfig } from '~/types/main'

interface State {
  estatResponse: EstatResponse
}

export const useEstatResponse = (cardConfig: CardConfig) => {
  // state
  const state = reactive<State>({
    estatResponse: null,
  })

  // routeパラメータの取得
  const { governmentType, code } = useRoute().value.params

  // GlobalState
  const { isRank } = inject(StateKey) as GlobalState

  // cdAreaを取得
  const { prefList } = usePrefecture()
  const { cityList } = useCity()
  const cdArea = computed(() => {
    // console.log()
    return isRank.value === false
      ? code
      : governmentType === 'prefecture'
      ? prefList.value.map((d) => convertPrefCodeNumberToString(d.prefCode))
      : cityList.value.map((d) => d.cityCode)
  })

  // estatパラメータのセット
  const estatParams = computed((): EstatParams => {
    return {
      statsDataId: cardConfig.statsDataId,
      cdCat01: cardConfig.cdCat01,
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
  }
}
