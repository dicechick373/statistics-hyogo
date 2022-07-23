import { Entry, EntryCollection } from 'contentful'
import {
  IEstatCardConfigFields,
  IStatisticsFieldFields,
  IStatisticsMenuFields,
} from '@/types/contentful'
import client from '~/plugins/contentful'
import { CardConfig, Field, Menu } from '~/types/main'

/**
 * contentfulから統計分野一覧を取得する関数
 * @returns - Field[]
 */
export const getContentfulFieldListAsync = async (): Promise<
  IStatisticsFieldFields[]
> => {
  const entries: EntryCollection<IStatisticsFieldFields> =
    await client.getEntries({
      content_type: 'statisticsField',
    })
  return entries.items.map((d) => d.fields)
}

/**
 * 統計分野の初期値リスト
 * @returns - IStatisticsFieldFields[]
 */
export const generateFieldListAsync = async () => {
  const fieldList = await getContentfulFieldListAsync()
  return fieldList.map((d) => {
    return {
      fieldId: d.fieldId,
      fieldTitle: d.fieldTitle,
      iconPath: d.iconPath,
      initialMenuIdPref: d.menuPrefecture[0].fields.menuId,
      initialMenuIdCity: d.menuCity[0].fields.menuId,
    }
  })
}

/**
 * 統計分野を取得する関数
 * @param fieldId - string
 * @returns - Field
 */
export const getContentfulField = async (fieldId: string): Promise<Field> => {
  // contentfulからデータ取得
  const entries: EntryCollection<IStatisticsFieldFields> =
    await client.getEntries({
      content_type: 'statisticsField',
      'fields.fieldId': fieldId,
    })

  // getContentfulField

  return {
    fieldId: entries.items[0].fields.fieldId,
    fieldTitle: entries.items[0].fields.fieldTitle,
  }
}

/**
 * 統計分野、地方公共団体区分に合致する統計項目リストを取得する関数
 * @param fieldId - string
 * @param governmentType - string
 * @returns - Menu[]
 */
export const getContentfulMenuList = async (
  governmentType: string = 'prefecture',
  fieldId: string
): Promise<Menu[]> => {
  const entries: EntryCollection<IStatisticsFieldFields> =
    await client.getEntries({
      content_type: 'statisticsField',
      'fields.fieldId': fieldId,
    })

  if (governmentType === 'prefecture') {
    return entries.items
      .map((d) => d.fields)[0]
      .menuPrefecture.map((d: Entry<IStatisticsMenuFields>) => {
        return { menuId: d.fields.menuId, menuTitle: d.fields.menuTitle }
      })
  } else {
    return entries.items
      .map((d) => d.fields)[0]
      .menuCity.map((d: Entry<IStatisticsMenuFields>) => {
        return { menuId: d.fields.menuId, menuTitle: d.fields.menuTitle }
      })
  }
}

/**
 * 統計項目を取得する関数
 * @param menuId - string
 * @returns - Menu
 */
export const getContentfulMenu = async (menuId: string): Promise<Menu> => {
  // contentfulからデータ取得
  const entries: EntryCollection<IStatisticsMenuFields> =
    await client.getEntries({
      content_type: 'statisticsMenu',
      'fields.menuId': menuId,
    })

  return {
    menuId: entries.items[0].fields.menuId,
    menuTitle: entries.items[0].fields.menuTitle,
  }
}

/**
 * 統計分野、地方公共団体区分に合致するCardListを取得する関数
 * @param governmentType -string
 * @param menuId - string
 * @returns - Card[]
 */
export const getContentfulCardList = async (
  governmentType: string,
  menuId: string
): Promise<CardConfig[]> => {
  const entries: EntryCollection<IStatisticsMenuFields> =
    await client.getEntries({
      content_type: 'statisticsMenu',
      'fields.menuId': menuId,
    })

  const cards = (): IEstatCardConfigFields[] | undefined => {
    if (governmentType === 'prefecture') {
      return entries.items[0].fields.cardsPrefecture
    } else {
      return entries.items[0].fields.cardsCity
    }
  }

  return cards().map((d) => d.fields)
}

/**
 * estatの統計情報を取得する関数
 * @param cardId - string
 * @returns - Field[]
 */
export const getContentfulCard = async (
  cardId: string
): Promise<IEstatCardConfigFields> => {
  const entries = await client.getEntries({
    content_type: 'estatCardConfig',
    'fields.cardId': cardId,
  })
  // console.log(entries.items)
  // return entries.items.map((d) => d.fields)
  return entries.items[0].fields
}
