import {
  computed,
  // inject,
  reactive,
  // reactive,
  Ref,
  useAsync,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'
import { usePrefecture } from './resas-api/usePrefecture'
import { useCity } from './resas-api/useCity'
import { City } from '~/types/resas'
import { useStatisticsField } from '~/composition/route-param/useStatisticsField'
import {
  GovernmentType,
  useGovernmentType,
} from '~/composition/route-param/useGovernmentType'

type State = {
  governmentType: string
  code: string
  fieldId: string
  menuId: string
}

export const useChangeRouter = () => {
  // routeパラメータの取得
  const route = useRoute()
  const { governmentType, code, fieldId, menuId } = route.value.params

  // state
  const state = reactive<any>({
    governmentType,
    code,
    fieldId,
    menuId,
  })

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
    router.push(
      `/${state.governmentType}/${code}/${state.fieldId}/${state.menuId}`
    )
  }

  const { getFieldListAsync } = useStatisticsField()
  const fieldList = useAsync(() => getFieldListAsync())
  const { getCurrentGovernmentType } = useGovernmentType()

  // SideNavigationの初期値設定
  const generateSideNavigationLink = computed(() => {
    return function (fieldId: string) {
      const matchField = fieldList.value.find((f) => f.fieldId === fieldId)
      const initMenuId =
        getCurrentGovernmentType() === 'prefecture'
          ? matchField.initialMenuIdPref
          : matchField.initialMenuIdCity
      return `/${getCurrentGovernmentType()}/28000/${fieldId}/${initMenuId}`
    }
  })

  const { getCurrentPrefCodeString } = usePrefecture()
  const { getCurrentCityCode } = useCity()

  // 都道府県・市区町村タブのリンク設定
  const generateTabGovernmentTypeLink = computed(() => {
    return function (governmentType: GovernmentType) {
      const code =
        governmentType === 'prefecture'
          ? getCurrentPrefCodeString()
          : getCurrentCityCode()

      return `/${governmentType}/${code}/${state.fieldId}/${state.menuId}`
    }
  })

  return {
    changeRouterCity,
    changeRoute,
    changeRouterMenu,
    generateSideNavigationLink,
    generateTabGovernmentTypeLink,
  }
}
