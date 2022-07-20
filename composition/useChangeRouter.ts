import {
  computed,
  inject,
  Ref,
  useAsync,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'
import { getInitMenuList, Menu } from '@/composition/utils/contentful'
import {
  convertCodeToGovType,
  convertPrefCodeNumberToString,
} from '@/composition/utils/formatResas'
import { GlobalState, StateKey } from './useGlobalState'
import { City } from '~/types/resas'

export const useChangeRouter = () => {
  // パスパラメータの取得
  const route = useRoute()
  const params = route.value.params
  const { govType, code, fieldId, menuId } = params

  // GlobalState
  const {
    currentGovType,
    currentCode,
    currentFieldId,
    currentMenuId,
    currentPref,
    currentCity,
    // setCurrentMenu,
  } = inject(StateKey) as GlobalState

  // 都道府県コード、市区町村コード
  const prefCode = convertPrefCodeNumberToString(currentPref.value.prefCode)
  const cityCode = currentCity.value.cityCode

  const router = useRouter()

  /**
   * 市区町村を変更した場合の処理
   * @param newCity - City
   */
  const changeRouterCity = computed(() => {
    return function (newCity: Ref<City>) {
      router.push(`/${govType}/${newCity.value.cityCode}/${fieldId}/${menuId}`)
    }
  })

  /**
   * 統計項目を変更した場合の処理
   * @param newMenu - Menu
   */
  const changeRouterMenu = computed(() => {
    return function (newMenu: Ref<Menu>) {
      // setCurrentMenu(newMenu)
      router.push(`/${govType}/${code}/${fieldId}/${newMenu.value.menuId}`)
    }
  })

  const changeRoute = (code: string): void => {
    const govType = convertCodeToGovType(code)
    router.push(
      `/${govType}/${code}/${currentFieldId.value}/${currentMenuId.value}`
    )
  }

  // 統計項目（Menu）の初期値設定
  const initMenuList = useAsync(() => getInitMenuList())
  const initMenu = (fieldId: string) => {
    const menu = initMenuList.value.find((f) => f.fieldId === fieldId)
    if (currentGovType.value === 'prefecture') {
      return menu.prefecture
    } else {
      return menu.city
    }
  }

  // SideNavigationのリンク設定
  const getSideNaviLink = computed(() => {
    return function (fieldId: string) {
      const path = `/${currentGovType.value}/${currentCode.value}/${fieldId}`
      const menuId = initMenu(fieldId).menuId
      // console.log(menuId)
      return `${path}/${menuId}`
    }
  })

  // 都道府県・市区町村タブのリンク設定
  const getGovTabLink = computed(() => {
    return function (govType: string) {
      const code = govType === 'city' ? cityCode : prefCode
      const menuId = initMenu(fieldId, govType).menuId
      return `/${govType}/${code}/${fieldId}/${menuId}`
    }
  })

  return {
    changeRouterCity,
    changeRoute,
    changeRouterMenu,
    getSideNaviLink,
    getGovTabLink,
  }
}
