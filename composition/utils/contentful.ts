import { Entry, EntryCollection } from 'contentful'
import {
  IStatisticsFieldFields,
  IStatisticsMenuFields,
} from '@/types/contentful'
import client from '~/plugins/contentful'

type Field = {
  fieldTitle: string
  fieldId: string
}

type Menu = {
  menuTitle: string
  menuId: string
  initialMenu: boolean
}

type GovType = 'prefecture' | 'city'

/**
 * contentfulから統計分野（statisticsField）の一覧を取得する関数
 * @returns - Field[]
 */
export const getFieldList = async (): Promise<Field[]> => {
  const entries: EntryCollection<IStatisticsFieldFields> =
    await client.getEntries({
      content_type: 'statisticsField',
    })
  return entries.items.map((d: Entry<IStatisticsFieldFields>) => d.fields)
}

/**
 * contentfulから統計項目（statisticsMenu）の一覧を取得する関数
 * @returns - Menu[]
 */
export const getMenuList = async (
  fieldId: string,
  govType: GovType
): Promise<Menu[]> => {
  const entries: EntryCollection<IStatisticsMenuFields> =
    await client.getEntries({
      content_type: 'statisticsMenu',
    })
  const menuList = entries.items.map(
    (d: Entry<IStatisticsMenuFields>) => d.fields
  )
  return menuList
    .filter((f) => f.fieldId === fieldId)
    .filter((f) => f.govType.includes(govType))
    .map((d) => {
      return {
        menuId: d.menuId,
        menuTitle: d.menuTitle,
        initialMenu: d.initialMenu,
      }
    })
}

/**
 * contentfulから統計項目（statisticsMenu）の初期値を取得する関数
 * @returns - Menu
 */
export const getInitialMenu = async (
  fieldId: string,
  govType: GovType
): Promise<Menu> => {
  const menuList = await getMenuList(fieldId, govType)
  return menuList.find((f) => f.initialMenu === true) ?? menuList[0]
}
