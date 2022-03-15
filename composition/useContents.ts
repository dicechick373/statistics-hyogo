import {
  computed,
  inject,
  reactive,
  toRefs,
  useRoute,
} from '@nuxtjs/composition-api'
import { GlobalState, StateKey } from './useGlobalState'
import contents from '~/assets/json/contentsSetting.json'

interface Field {
  fieldTitle: string
  fieldId: string
}

interface Menu {
  menuTitle: string
  menuId: string
}

// interface State {
//   fieldList: Field[]
//   menuList: Menu[]
// }

// Menuの初期値リスト
const initMenuList = () => {
  return contents.list.map((d) => {
    return {
      fieldId: d.fieldId,
      prefecture: d.menu.prefecture[0].menuId,
      city: d.menu.city[0].menuId,
    }
  })
}

interface State {
  currentMenu: Menu
}

export const useContents = () => {
  // パスパラメータの取得
  const route = useRoute()
  const params = route.value.params
  const { govType, code, fieldId, menuId } = params

  // 統計分野リスト
  const fieldList = computed(() => {
    return contents.list.map((d) => {
      return {
        fieldTitle: d.fieldTitle,
        fieldId: d.fieldId,
      }
    })
  })

  // 統計項目リスト
  const menuList = computed(() => {
    const menu = contents.list.filter((f) => f.fieldId === fieldId)[0].menu
    if (govType === 'prefecture') {
      return menu.prefecture.map((d) => {
        return {
          menuId: d.menuId,
          menuTitle: d.menuTitle,
        }
      })
    } else {
      return menu.city.map((d) => {
        return {
          menuId: d.menuId,
          menuTitle: d.menuTitle,
        }
      })
    }
  })

  // 選択中の統計項目
  const setCurrentMenu = (menu: Menu): void => {
    state.currentMenu = menu
  }

  const getMenu = (menuId: string): Menu => {
    return menuList.value.find((f) => f.menuId === menuId)
  }

  const state = reactive<State>({
    currentMenu: getMenu(menuId),
  })

  // 統計項目リンク SelectMenuで使用
  const menuLinks = computed(() => {
    return menuList.value.map((d) => {
      return {
        label: d.menuTitle,
        path: `/${govType}/${code}/${fieldId}/${d.menuId}/`,
      }
    })
  })

  const getInitMenuId = computed(() => {
    return function (fieldId: string) {
      return initMenuList().find((f) => f.fieldId === fieldId)
    }
  })

  // カードリスト
  const cardList = computed(() => {
    return menuList.value.filter((f) => f.menuId === menuId)[0].card
  })

  // 都道府県・市区町村
  const { currentPref, currentCity } = inject(StateKey) as GlobalState

  // MenuTitleの取得
  const getMenuTitle = computed(() => {
    return function (menuId: string) {
      const title = menuList.value.filter((f) => f.menuId === menuId)[0]
        .menuTitle
      return govType === 'prefecture'
        ? `${currentPref.value.prefName}の${title}`
        : `${currentCity.value.cityName}の${title}`
    }
  })

  // CardTitleの取得
  const getCardTitle = computed(() => {
    return function (cardId: string) {
      const title = cardList.value.filter((f) => f.cardId === cardId)[0]
        .cardTitle
      return govType === 'prefecture'
        ? `${currentPref.value.prefName}の${title}`
        : `${currentCity.value.cityName}の${title}`
    }
  })

  return {
    ...toRefs(state),
    fieldList,
    menuList,
    // getInitMenuTitles,
    cardList,
    // selectedMenu,
    setCurrentMenu,
    getCardTitle,
    getMenuTitle,
    getInitMenuId,
    menuLinks,
  }
}
