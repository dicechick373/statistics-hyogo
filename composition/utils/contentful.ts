import { Entry, EntryCollection } from 'contentful'
import {
  IEstatCardConfigFields,
  IStatisticsFieldFields,
  IStatisticsMenuFields,
} from '@/types/contentful'
import client from '~/plugins/contentful'
import { Card, Field, Menu } from '~/types/main'

/**
 * contentfulから統計分野一覧を取得する関数
 * @returns - Field[]
 */
export const getFieldList = async (): Promise<Field[]> => {
  const entries: EntryCollection<IStatisticsFieldFields> =
    await client.getEntries({
      content_type: 'statisticsField',
    })
  return entries.items.map((d) => d.fields)
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

  return {
    fieldId: entries.items[0].fields.fieldId,
    fieldTitle: entries.items[0].fields.fieldTitle,
  }
}

/**
 * 統計分野の初期値リスト
 * @returns - IStatisticsFieldFields[]
 */
export const getInitMenuList = async () => {
  // contentfulからデータ取得
  const entries: EntryCollection<IStatisticsFieldFields> =
    await client.getEntries({
      content_type: 'statisticsField',
    })

  return entries.items.map((d) => {
    // 統計項目の初期値を取得
    const getInitMenu = (g: keyof IStatisticsFieldFields): Menu[] => {
      return d.fields[g].map((d: Entry<IStatisticsMenuFields>) => {
        return {
          menuId: d.fields.menuId,
          menuTitle: d.fields.menuTitle,
        }
      })
    }

    // 都道府県、市区町村それぞれの初期値を返す
    return {
      fieldId: d.fields.fieldId,
      fieldTitle: d.fields.fieldTitle,
      prefecture: getInitMenu('menuPrefecture')[0],
      city: getInitMenu('menuPrefecture')[0],
    }
  })
}

/**
 * 統計分野、地方公共団体区分に合致する統計項目リストを取得する関数
 * @param fieldId - string
 * @param govType - string
 * @returns - Menu[]
 */
export const getContentfulMenuList = async (
  govType: string,
  fieldId: string
): Promise<Menu[]> => {
  const entries: EntryCollection<IStatisticsFieldFields> =
    await client.getEntries({
      content_type: 'statisticsField',
      'fields.fieldId': fieldId,
    })

  if (govType === 'prefecture') {
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
 * @param govType -string
 * @param menuId - string
 * @returns - Card[]
 */
export const getContentfulCardList = async (
  govType: string,
  menuId: string
): Promise<Card[]> => {
  const entries: EntryCollection<IStatisticsMenuFields> =
    await client.getEntries({
      content_type: 'statisticsMenu',
      'fields.menuId': menuId,
    })

  const cards = () => {
    if (govType === 'prefecture') {
      return entries.items[0].fields.cardsPrefecture
    } else {
      return entries.items[0].fields.cardsCity
    }
  }

  return cards().map((d) => {
    return {
      cardId: d.fields.cardId,
      cardTitle: d.fields.cardTitle,
      chartComponent: d.fields.chartComponent,
    }
  })
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
