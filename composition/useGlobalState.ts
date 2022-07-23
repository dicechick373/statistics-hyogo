import {
  reactive,
  toRefs,
  InjectionKey,
  // useRoute,
} from '@nuxtjs/composition-api'
// import { Field } from 'contentful'
import { Dictionary } from 'router'
import {
  getContentfulField,
  getContentfulMenu,
  getContentfulMenuList,
  Menu,
} from './utils/contentful'
import {
  // convertCodeToGovType,
  getResasCityList,
  getResasPrefList,
} from '~/composition/resas-api/formatResas'
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
  isRank: boolean
}

export const useGlobalState = () => {
  // 初期値をセット
  const state = reactive<State>({
    currentGovType: 'prefecture',
    currentCode: '28000',
    currentField: { fieldId: '', fieldTitle: '' },
    currentMenuList: [],
    currentMenu: { menuId: null, menuTitle: null },
    currentPref: { prefCode: 28, prefName: '兵庫県' },
    currentCity: {
      prefCode: 28,
      cityCode: '28100',
      cityName: '神戸市',
      bigCityFlag: '2',
    },
    prefList: getResasPrefList(),
    cityList: getResasCityList(28),
    isRank: false,
  })

  // 地方公共団体区分（都道府県／市区町村）のセット
  // const setCurrentGovType = (newCode: string): void => {
  //   state.currentGovType = convertCodeToGovType(newCode)
  // }

  // 選択中の統計分野（Field）のセット
  // const setCurrentFieldAsync = (newField: Menu): void => {
  //   state.currentField = newField
  // }

  // 選択中の統計項目（Menu）のセット
  // const setCurrentMenu = (newMenu: Menu): void => {
  //   state.currentMenu = newMenu
  // }

  // stateの一括設定
  const setState = async (params: Dictionary<string>): Promise<void> => {
    const { governmentType, fieldId, menuId } = params
    state.currentGovType = governmentType
    state.currentField = await getContentfulField(fieldId)
    state.currentMenuList = await getContentfulMenuList(governmentType, fieldId)
    state.currentMenu = await getContentfulMenu(menuId)
  }

  // 地方公共団体区分の取得
  const getCurrentGovType = (): string => {
    return state.currentGovType
  }

  // 都道府県リストの取得
  const getPrefList = (): Pref[] => {
    return state.prefList
  }

  // 選択中の都道府県の取得
  const getCurrentPref = (): Pref => {
    return state.currentPref
  }

  // 市区町村リストの取得
  const getCurrentCityList = (kind: string): City[] => {
    return getResasCityList(state.currentPref.prefCode, kind)
  }

  // 選択中の都道府県の取得
  const getCurrentCity = (): City => {
    return state.currentCity
  }

  // currentMenuListの取得
  const getCurrentMenuList = (): Menu[] => {
    return state.currentMenuList
  }

  // currentMenuの取得
  const getCurrentMenu = (): Menu => {
    return state.currentMenu
  }

  // isRankの取得
  const getIsRank = (): Menu => {
    return state.isRank
  }

  // isRankの設定
  const setIsRank = (newVal: boolean): Menu => {
    state.isRank = newVal
  }

  const getTitle = (title: string): string => {
    return state.currentGovType === 'prefecture'
      ? `${state.currentPref.prefName}の${title}`
      : `${state.currentCity.cityName}の${title}`
  }

  return {
    ...toRefs(state),
    // setInitState,
    // setCurrentMenu,
    getTitle,
    setState,
    getIsRank,
    setIsRank,
    getCurrentGovType,
    getCurrentMenuList,
    getCurrentCityList,
    getPrefList,
    getCurrentMenu,
    getCurrentPref,
    getCurrentCity,
  }
}

export const StateKey: InjectionKey<GlobalState> = Symbol('State')
export type GlobalState = ReturnType<typeof useGlobalState>
export default useGlobalState
