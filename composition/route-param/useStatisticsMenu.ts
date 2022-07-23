import { reactive, toRefs } from '@nuxtjs/composition-api'
import { getContentfulMenuList } from '../utils/contentful'
import { useGovernmentType } from './useGovernmentType'
import { useStatisticsField } from './useStatisticsField'
import { IStatisticsMenuFields } from '~/types/contentful'

export type Menu = Pick<IStatisticsMenuFields, 'menuId' | 'menuTitle'>

interface State {
  menuList: Menu[]
  currentMenu: Menu
}

export const useStatisticsMenu = () => {
  // state
  const state = reactive<State>({
    menuList: null,
    currentMenu: null,
  })

  const { getGovernmentType } = useGovernmentType()
  const { getCurrentFieldAsync } = useStatisticsField()

  // setter
  const setMenuList = async () => {
    const contentfulMenuList = await getContentfulMenuList(
      getGovernmentType(),
      getCurrentFieldAsync().fieldId
    )
    state.menuList = contentfulMenuList
  }

  // getter
  const getMenuList = () => {
    return state.menuList
  }

  return {
    ...toRefs(state),
    setMenuList,
    getMenuList,
  }
}
