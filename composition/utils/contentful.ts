import { Entry, EntryCollection } from 'contentful'
import {
  // IEstatCardConfigFields,
  IStatisticsFieldFields,
  IStatisticsMenuFields,
} from '@/types/contentful'
import client from '~/plugins/contentful'

type Field = {
  fieldTitle: string
  fieldId: string
  menuPrefecture: []
  menuCity: []
}

type Menu = {
  menuTitle: string
  menuId: string
}

type GovType = 'prefecture' | 'city'

type Card = {
  cardTitle: string
  cardTitleId: string
}

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
export const getMenuListAll = async () => {
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
 * 都道府県のMenuList一覧を取得する関数
 * @returns - Menu[]
 */
export const getMenuListPrefecture = async (
  fieldId: string
): Promise<Menu[]> => {
  const fieldList = await getFieldList()
  return fieldList
    .find((f) => f.fieldId === fieldId)
    .menuPrefecture.map((d: Entry<IStatisticsMenuFields>) => {
      return { menuId: d.fields.menuId, menuTitle: d.fields.menuTitle }
    })
}

/**
 * 市区町村のMenuList一覧を取得する関数
 * @returns - Menu[]
 */
export const getMenuListCity = async (fieldId: string): Promise<Menu[]> => {
  const fieldList = await getFieldList()
  return fieldList
    .find((f) => f.fieldId === fieldId)
    .menuCity.map((d: Entry<IStatisticsMenuFields>) => {
      return { menuId: d.fields.menuId, menuTitle: d.fields.menuTitle }
    })
}

/**
 * 統計分野、地方公共団体区分に合致する統計項目リストを取得する関数
 * @returns - Menu[]
 */
export const getMenuList = async (
  fieldId: string,
  govType: GovType
): Promise<Menu[]> => {
  if (govType === 'prefecture') {
    return await getMenuListPrefecture(fieldId)
  } else {
    return await getMenuListCity(fieldId)
  }
}

/**
 * 地方公共団体区分に合致する統計項目の初期値リストを取得する関数
 * @returns - Menu[]
 */
export const getInitialMenu = async (govType: GovType): Promise<Menu[]> => {
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
export const getInitialMenuList = async (): Promise<Menu[]> => {
  const [prefecture, city] = await Promise.all([
    getInitialMenu('prefecture'),
    getInitialMenu('city'),
  ])

  return prefecture.concat(city)
}

/**
 * 統計項目に合致するCard情報を取得する関数
 * @param menuId - string
 * @returns - IStatisticsMenuFields
 */
const getCardListAll = async (menuId: string) => {
  const entries: EntryCollection<IStatisticsMenuFields> =
    await client.getEntries({
      content_type: 'statisticsMenu',
      'fields.menuId': menuId,
    })
  return entries.items.map((d) => d.fields)[0]
}

/**
 * 都道府県のCard一覧を取得する関数
 * @param menuId - string
 * @returns - Card[]
 */
const getCardListPrefecture = async (menuId: string): Promise<Card[]> => {
  const cardList = await getCardListAll(menuId)
  return cardList.cardsPrefecture.map((d) => {
    return {
      cardTitle: d.fields.cardTitle,
      cardTitleId: d.fields.cardTitleId,
    }
  })
}

/**
 * 市区町村のCard一覧を取得する関数
 * @param menuId - string
 * @returns - Card[]
 */
const getCardListCity = async (menuId: string): Promise<Card[]> => {
  const cardList = await getCardListAll(menuId)
  return cardList.cardsCity.map((d) => {
    return {
      cardTitle: d.fields.cardTitle,
      cardTitleId: d.fields.cardTitleId,
    }
  })
}

/**
 * 統計分野、地方公共団体区分に合致するCardListを取得する関数
 * @returns - Card[]
 */
export const getCardList = async (menuId: string, govType: string) => {
  if (govType === 'prefecture') {
    return await getCardListPrefecture(menuId)
  } else {
    return await getCardListCity(menuId)
  }
}

/**
 * estatの統計情報を取得する関数
 * @returns - Field[]
 */
export const getEstatCard = async (cardTitleId: string) => {
  // console.log(cardTitleId)
  const entries = await client.getEntries({
    content_type: 'estatCardConfig',
    'fields.cardTitleId': cardTitleId,
  })
  return entries.items.map((d) => d.fields)
}
