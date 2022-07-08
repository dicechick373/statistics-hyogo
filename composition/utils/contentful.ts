import { Entry, EntryCollection } from 'contentful'
import {
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
export const getMenuList = async (
  fieldId: string,
  govType: string
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
export const getMenu = async (menuId: string): Promise<Menu[]> => {
  // contentfulからデータ取得
  const entries: EntryCollection<IStatisticsMenuFields> =
    await client.getEntries({
      content_type: 'statisticsMenu',
      'fields.menuId': menuId,
    })

  return entries.items.map((d) => {
    return {
      menuId: d.fields.menuId,
      menuTitle: d.fields.menuTitle,
    }
  })
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
 * @param menuId - string
 * @param govType - string
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
