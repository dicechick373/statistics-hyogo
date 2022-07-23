import {
  computed,
  inject,
  // reactive,
  Ref,
  useAsync,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'
import { generateFieldListAsync, Menu } from '@/composition/utils/contentful'
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
  const { governmentType, code, fieldId, menuId } = params

  // const state = reactive<any>({
  //   governmentType,
  //   code,
  //   fieldId,
  //   menuId,
  // })

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
      router.push(
        `/${governmentType}/${newCity.value.cityCode}/${fieldId}/${menuId}`
      )
    }
  })

  /**
   * 統計項目を変更した場合の処理
   * @param newMenu - Menu
   */
  const changeRouterMenu = computed(() => {
    return function (newMenu: Ref<Menu>) {
      // setCurrentMenu(newMenu)
      router.push(
        `/${governmentType}/${code}/${fieldId}/${newMenu.value.menuId}`
      )
    }
  })

  const changeRoute = (code: string): void => {
    const governmentType = convertCodeToGovType(code)
    router.push(
      `/${governmentType}/${code}/${currentFieldId.value}/${currentMenuId.value}`
    )
  }

  // 統計項目（Menu）の初期値設定
  const initMenuList = useAsync(() => generateFieldListAsync())
  // console.log(generateFieldListAsync())
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
      return `${path}/${menuId}`
    }
  })

  // 都道府県・市区町村タブのリンク設定
  const getGovTabLink = computed(() => {
    return function (governmentType: string) {
      const code = governmentType === 'city' ? cityCode : prefCode
      const menuId = initMenu(fieldId, governmentType).menuId
      return `/${governmentType}/${code}/${fieldId}/${menuId}`
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
