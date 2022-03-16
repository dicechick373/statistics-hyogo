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
  fieldId: string
  govType: GovType
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
 * @returns - IStatisticsFieldFields[]
 */
const getMenuListAll = async () => {
  const entries: EntryCollection<IStatisticsMenuFields> =
    await client.getEntries({
      content_type: 'statisticsMenu',
    })
  const menuList = entries.items.map(
    (d: Entry<IStatisticsMenuFields>) => d.fields
  )
  return menuList
}

/**
 * 統計分野、地方公共団体区分に合致する統計項目リストを取得する関数
 * @returns - Menu[]
 */
export const getMenuList = async (
  fieldId: string,
  govType: GovType
): Promise<Menu[]> => {
  const menuList = await getMenuListAll()

  return menuList
    .filter((f) => f.fieldId === fieldId)
    .filter((f) => f.govType.includes(govType))
    .map((d) => {
      return {
        menuId: d.menuId,
        menuTitle: d.menuTitle,
        fieldId: d.fieldId,
        govType,
      }
    })
}

/**
 * 地方公共団体区分に合致する統計項目の初期値リストを取得する関数
 * @returns - Menu[]
 */
export const getInitialMenuList = async (govType: GovType): Promise<Menu[]> => {
  const menuList = await getMenuListAll()

  return menuList
    .filter((f) => f.govType.includes(govType))
    .filter((f) => f.initialMenu === true)
    .map((d) => {
      return {
        menuId: d.menuId,
        menuTitle: d.menuTitle,
        fieldId: d.fieldId,
        govType,
      }
    })
}

/**
 * 統計項目の初期値リストを取得する関数（都道府県＋市区町村）
 * @returns - Menu[]
 */
// export const getInitialMenuList = async (): Promise<Menu[]> => {
//   const [prefecture, city] = await Promise.all([
//     getInitialMenu('prefecture'),
//     getInitialMenu('city'),
//   ])

//   return prefecture.concat(city)
// }
