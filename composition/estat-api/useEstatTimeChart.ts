import {
  computed,
  inject,
  reactive,
  toRefs,
  useContext,
  // useRoute,
} from '@nuxtjs/composition-api'

import { GlobalState, StateKey } from '~/composition/useGlobalState'
import { usePrefecture } from '~/composition/resas-api/usePrefecture'
// import { convertPrefCodeNumberToString } from '~/composition/resas-api/formatResas'
import { useEstatApi } from '~/composition/estat-api/useEstatApi'
import { useCity } from '~/composition/resas-api/useCity'
import { EstatParams, EstatResponse } from '~/types/estat-api'
// import { EstatCardConfig } from '~/types/main'
import { IEstatCardConfigFields } from '~/types/contentful'

interface State {
  params: EstatParams
  response: EstatResponse
}

export const useEstatTimeChart = (config: IEstatCardConfigFields) => {
  // state
  const state = reactive<State>({
    params: null,
    response: null,
  })

  // console.log(config)

  // GlobalState
  const { currentGovType, currentCode, isRank } = inject(
    StateKey
  ) as GlobalState

  // cdAreaを取得
  const { getPrefCodeList } = usePrefecture()
  const { getCityCodeList } = useCity()
  const cdArea = computed(() => {
    return isRank.value === false
      ? currentCode.value
      : currentGovType.value === 'prefecture'
      ? getPrefCodeList()
      : getCityCodeList()
  })

  // estatパラメータのセット
  const estatParams = computed((): EstatParams => {
    return {
      statsDataId: config.estatParams.statsDataId,
      cdCat01: config.estatParams.cdCat01,
      cdArea: cdArea.value,
    }
  })

  // console.log(estatParams)

  // estat-APIからデータ取得
  const { $axios } = useContext()
  const test = async () => {
    return await useEstatApi($axios, estatParams.value).getData()
  }
  // const kk =
  // console.log(test())

  // const { get } = usePrefecture()
  // const { getCityCodeList } = useCity()

  // const cardTitle = computed(() => {
  //   return config.cardTitle.replace('都道府県の', '')
  // })
  // console.log(cardTitle.value)

  return {
    ...toRefs(state),
    test,
  }
}
