import {
  computed,
  inject,
  Ref,
  useAsync,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'
import { getInitMenuList } from '@/composition/utils/contentful'
import {
  convertCodeToGovType,
  convertPrefCodeToCode,
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
  } = inject(StateKey) as GlobalState

  // 都道府県コード、市区町村コード
  const prefCode = convertPrefCodeToCode(currentPref.value.prefCode)
  const cityCode = currentCity.value.cityCode

  const router = useRouter()

  const changeRouterCity = computed(() => {
    return function (newCity: Ref<City>) {
      router.push(`/${govType}/${newCity.value.cityCode}/${fieldId}/${menuId}`)
    }
  })

  const changeRouteByMenu = (menuId: string): void => {
    router.push(`/${govType}/${code}/${currentFieldId.value}/${menuId}`)
  }

  const changeRoute = (code: string): void => {
    const govType = convertCodeToGovType(code)
    router.push(
      `/${govType}/${code}/${currentFieldId.value}/${currentMenuId.value}`
    )
  }

  // 統計項目（Menu）の初期値設定
  const initMenuList = useAsync(() => getInitMenuList())
  const initMenu = (fieldId: string, govType: string) => {
    const menu = initMenuList.value.find((f) => f.fieldId === fieldId)
    if (govType === 'prefecture') {
      return menu.prefecture
    } else {
      return menu.city
    }
  }

  // SideNavigationのリンク設定
  const getSideNaviLink = computed(() => {
    return function (fieldId: string) {
      const path = `/${currentGovType.value}/${currentCode.value}/${fieldId}`
      const menuId = initMenu(fieldId, govType).menuId
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
    changeRouteByMenu,
    getSideNaviLink,
    getGovTabLink,
  }
}
