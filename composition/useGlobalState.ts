import {
  reactive,
  toRefs,
  InjectionKey,
  // useRoute,
} from '@nuxtjs/composition-api'
import {
  // convertCodeToGovType,
  getResasCityList,
  getResasPrefList,
} from '@/composition/utils/formatResas'
// import { Field } from 'contentful'
import { Dictionary } from 'router'
import {
  getContentfulMenu,
  // getContentfulMenuList,
  Menu,
} from './utils/contentful'
import { Pref, City } from '~/types/resas'

interface Field {
  fieldTitle: string
  fieldId: string
}

interface State {
  currentGovType: string
  currentCode: string
  currentField: Field
  currentMenuList: Menu[]
  currentMenu: Menu
  currentPref: Pref
  currentCity: City
  prefList: Pref[]
  cityList: City[]
}

export const useGlobalState = () => {
  // 初期値をセット
  const state = reactive<State>({
    currentGovType: 'prefecture',
    currentCode: '28000',
    currentField: { fieldId: '', fieldTitle: '' },
    currentMenuList: [],
    currentMenu: { menuId: '', menuTitle: '' },
    currentPref: { prefCode: 28, prefName: '兵庫県' },
    currentCity: {
      prefCode: 28,
      cityCode: '28100',
      cityName: '神戸市',
      bigCityFlag: '2',
    },
    prefList: getResasPrefList(),
    cityList: getResasCityList(28),
  })

  // 地方公共団体区分（都道府県／市区町村）のセット
  // const setCurrentGovType = (newCode: string): void => {
  //   state.currentGovType = convertCodeToGovType(newCode)
  // }

  // 選択中の統計分野（Field）のセット
  // const setCurrentField = (newField: Menu): void => {
  //   state.currentField = newField
  // }

  // 選択中の統計項目（Menu）のセット
  const setCurrentMenu = (newMenu: Menu): void => {
    state.currentMenu = newMenu
  }

  // stateの一括設定
  const setState = async (params: Dictionary<string>): Promise<void> => {
    const { menuId } = params
    // state.currentMenuList = await getContentfulMenuList(fieldId, govType)
    state.currentMenu = await getContentfulMenu(menuId)
  }

  // 都道府県リストの取得
  const getPrefList = (): Pref[] => {
    return state.prefList
  }

  // 選択中の都道府県の取得
  const getCurrentPref = (): Pref => {
    return state.currentPref
  }

  // 選択中の統計項目（Menu）の取得
  const getCurrentMenu = (): Menu => {
    return state.currentMenu
  }

  const getTitle = (title: string): string => {
    return state.currentGovType === 'prefecture'
      ? `${state.currentPref.prefName}の${title}`
      : `${state.currentCity.cityName}の${title}`
  }

  const getCurrentCityList = (kind: string): City[] => {
    return getResasCityList(state.currentPref.prefCode, kind)
  }

  return {
    ...toRefs(state),
    // setInitState,
    setCurrentMenu,
    getTitle,
    setState,
    getCurrentCityList,
    getPrefList,
    getCurrentMenu,
    getCurrentPref,
  }
}

export const StateKey: InjectionKey<GlobalState> = Symbol('State')
export type GlobalState = ReturnType<typeof useGlobalState>
export default useGlobalState
