import { reactive, toRefs } from '@nuxtjs/composition-api'
import { getResasCityList } from './formatResas'
import { City } from '~/types/resas'

interface State {
  isCity: boolean
  currentCity: City
  cityList: City[]
}

export const useCity = () => {
  // state
  const state = reactive<State>({
    isCity: true,
    currentCity: {
      prefCode: 28,
      cityCode: '28100',
      cityName: '神戸市',
      bigCityFlag: '2',
    },
    cityList: getResasCityList(28),
  })

  // codeに合致する都道府県を返す
  const getCity = (code: string): City => {
    return state.cityList.find((f) => f.cityCode === code) ?? state.cityList[0]
  }

  // const changeIsPref = (newBoolean: boolean) => {
  //   state.isCity = newBoolean
  // }

  return {
    ...toRefs(state),
    getCity,
    // changeIsPref,
  }
}

/**
 * codeから都道府県情報を返す関数
 * @param code -string('28000')
 * @returns - number(28)
 */
export const convertCodeToNumber = (code: string): number => {
  return +code.slice(0, 2)
}

/**
 * prefCode(number)をstringに変換する関数
 * @param code - number(28)
 * @returns - string('28000)
 */
export const convertCodeToString = (code: number): string => {
  return ('0000000000' + code).slice(-2) + '000'
}
