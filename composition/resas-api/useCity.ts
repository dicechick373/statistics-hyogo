import {
  inject,
  reactive,
  ref,
  toRefs,
  // useRoute,
  // watch,
} from '@nuxtjs/composition-api'
import { GlobalState, StateKey } from '../useGlobalState'
import * as Resas from './formatResas'
import { City } from '~/types/resas'

interface State {
  currentCity: City
  cityList: City[]
}

export const useCity = () => {
  // GlobalStateの設定
  const { currentCode } = inject(StateKey) as GlobalState
  const prefCode = ref<number>(Resas.convertCodeToPrefCode(currentCode.value))

  // state
  const state = reactive<State>({
    currentCity: Resas.getCity(currentCode.value),
    cityList: Resas.getResasCityList(prefCode.value),
  })

  // watch(currentCode, () => change())
  // const setCityState = () => {
  //   const prefCode = Resas.convertCodeToPrefCode(currentCode.value)
  //   state.cityList = Resas.getResasCityList(prefCode)
  //   state.currentCity = Resas.getCity(currentCode.value)
  // }

  const setCurrentCity = (newCity: City): void => {
    state.currentCity = newCity
  }

  // getter
  const getCityList = (
    bigCityKind: 'all' | 'join' | 'break' = 'all'
  ): City[] => {
    switch (bigCityKind) {
      case 'all':
        return state.cityList
      case 'join':
        return state.cityList.filter((f) => f.bigCityFlag !== '1')
      case 'break':
        return state.cityList.filter((f) => f.bigCityFlag !== '2')
    }
  }
  const getCity = (code: string): City => {
    return state.cityList.find((f) => f.cityCode === code) ?? state.cityList[0]
  }

  const getCurrentCity = (): City => {
    return state.currentCity
  }

  const getCurrentCityCode = (): string => {
    return state.currentCity.cityCode
  }

  return {
    ...toRefs(state),
    setCurrentCity,
    getCityList,
    getCity,
    getCurrentCity,
    // setCityState,
    getCurrentCityCode,
  }
}
