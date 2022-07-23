import { reactive, toRefs } from '@nuxtjs/composition-api'
// import { getContentfulMenuList } from './utils/contentful'
// import { useGovernmentType } from './useGovernmentType'
import { IStatisticsMenuFields } from '~/types/contentful'

export type Menu = Pick<IStatisticsMenuFields, 'menuId' | 'menuTitle'>

interface State {
  menuList: Menu[]
  currentMenu: Menu
}

export const useField = () => {
  // state
  const state = reactive<State>({
    menuList: null,
    currentMenu: null,
  })

  // const { governmentType } = useGovernmentType()
  // const { currntField } = useField()

  // setter
  // const setMenuList = async () => {
  //   const contentfulMenuList = await getContentfulMenuList()
  //   state.menuList = contentfulMenuList
  // }

  // // getter
  // const getMenuList = () => {
  //   return state.menuList
  // }

  return {
    ...toRefs(state),
    // setMenuList,
    // getMenuList,
  }
}
