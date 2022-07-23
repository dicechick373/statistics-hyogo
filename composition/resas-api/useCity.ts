import { reactive, toRefs } from '@nuxtjs/composition-api'
import { getResasCityList } from './formatResas'
import { City } from '~/types/resas'

interface State {
  currentCity: City
  cityList: City[]
}

export const useCity = () => {
  // state
  const state = reactive<State>({
    currentCity: {
      prefCode: 28,
      cityCode: '28100',
      cityName: '神戸市',
      bigCityFlag: '2',
    },
    cityList: getResasCityList(28),
  })

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
    getCurrentCityCode,
  }
}
