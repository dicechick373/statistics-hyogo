import {
  computed,
  inject,
  Ref,
  useAsync,
  useRoute,
  useRouter,
  watch,
} from '@nuxtjs/composition-api'
// import { useContents } from '@/composition/useContents'
import { getInitialMenuList } from '@/composition/utils/contentful'
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

  // inject
  const {
    currentGovType,
    currentCode,
    currentFieldId,
    currentMenuId,
    currentPref,
    currentCity,
  } = inject(StateKey) as GlobalState

  // console.log({ currentGovType, currentCode, currentPref, currentCity })

  watch(currentGovType, () => {
    // console.log({ currentGovType })
  })

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

  // SideNavigationのリンク設定
  const initialMenuList = useAsync(() => getInitialMenuList(govType))
  const getSideNaviLink = computed(() => {
    return function (fieldId: string) {
      const initialMenu = initialMenuList.value.find(
        (f) => f.fieldId === fieldId
      )

      const path = `/${currentGovType.value}/${currentCode.value}/${fieldId}`
      return `${path}/${initialMenu?.menuId}`
    }
  })

  const prefCode = convertPrefCodeToCode(currentPref.value.prefCode)
  const cityCode = currentCity.value.cityCode

  // 都道府県・市区町村タブのpath設定
  const getGovTabLink = computed(() => {
    return function (govType: string) {
      return govType === 'prefecture'
        ? `/prefecture/${prefCode}/${fieldId}/${menuId}`
        : `/city/${cityCode}/${fieldId}/${menuId}`
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
