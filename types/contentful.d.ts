// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT MODIFY IT.

import { Asset, Entry } from 'contentful'
import { Document } from '@contentful/rich-text-types'

export interface IBlogPostFields {
  /** Title */
  title?: string | undefined

  /** CoverArt */
  coverArt?: Asset | undefined

  /** ArticleBody */
  articleBody?: string | undefined

  /** Slug */
  slug?: string | undefined
}

/** ブログ記事 */

export interface IBlogPost extends Entry<IBlogPostFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'blogPost'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface IColorsFields {
  /** colorTitle */
  colorTitle: string

  /** colorId */
  colorId: string

  /** colorList */
  colorList: string[]
}

/** 色設定 */

export interface IColors extends Entry<IColorsFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'colors'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface IEstatCardConfigFields {
  /** cardTitle */
  cardTitle: string

  /** cardId */
  cardId: string

  /** statisticsField */
  statisticsField: IStatisticsField[]

  /** governmentType */
  governmentType: 'prefecture' | 'city'

  /** statsDataId */
  statsDataId: string

  /** cdCat01 */
  cdCat01?: string[] | undefined

  /** series */
  series?: string[] | undefined

  /** chartType */
  chartType?: string[] | undefined

  /** yAxis */
  yAxis?: string[] | undefined

  /** estatParams */
  estatParams: Record<string, any>

  /** highchartsSeries */
  highchartsSeries: Record<string, any>

  /** chartComponent */
  chartComponent: 'TimeChart' | 'PyramidChart'

  /** isBreak */
  isBreak: boolean

  /** toggleSeries */
  toggleSeries?: Record<string, any> | undefined

  /** annotation */
  annotation?: Document | undefined
}

/** estatから取得する統計 */

export interface IEstatCardConfig extends Entry<IEstatCardConfigFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'estatCardConfig'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface IGovernmentTypeFields {
  /** governmentId */
  governmentId?: string | undefined

  /** governmentTitle */
  governmentTitle?: string | undefined
}

/** 自治体種別 */

export interface IGovernmentType extends Entry<IGovernmentTypeFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'governmentType'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface IKenminkyokuFields {
  /** name */
  name?: string | undefined

  /** address */
  address?: string | undefined

  /** postCode */
  postCode?: string | undefined

  /** phoneNumber */
  phoneNumber?: string | undefined

  /** latitude */
  latitude?: string | undefined

  /** longitude */
  longitude?: string | undefined
}

/** 県民局 */

export interface IKenminkyoku extends Entry<IKenminkyokuFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'kenminkyoku'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface IStatisticsFieldFields {
  /** fieldId */
  fieldId: string

  /** iconPath */
  iconPath?: string | undefined

  /** fieldTitle */
  fieldTitle: string

  /** menuPrefecture */
  menuPrefecture: IStatisticsMenu[]

  /** menuCity */
  menuCity: IStatisticsMenu[]
}

/** 統計分野 */

export interface IStatisticsField extends Entry<IStatisticsFieldFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'statisticsField'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface IStatisticsMenuFields {
  /** menuId */
  menuId: string

  /** menuTitle */
  menuTitle: string

  /** fieldId */
  fieldId:
    | 'landweather'
    | 'population'
    | 'laborwage'
    | 'agriculture'
    | 'miningindustry'
    | 'commercial'
    | 'economy'
    | 'construction'
    | 'energy'
    | 'tourism'
    | 'educationsports'
    | 'administrativefinancial'
    | 'safetyenvironment'
    | 'socialsecurity'
    | 'international'

  /** cardsPrefecture */
  cardsPrefecture?: Entry<{ [fieldId: string]: unknown }>[] | undefined

  /** cardsCity */
  cardsCity?: Entry<{ [fieldId: string]: unknown }>[] | undefined
}

/** 統計項目 */

export interface IStatisticsMenu extends Entry<IStatisticsMenuFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'statisticsMenu'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export type CONTENT_TYPE =
  | 'blogPost'
  | 'colors'
  | 'estatCardConfig'
  | 'governmentType'
  | 'kenminkyoku'
  | 'statisticsField'
  | 'statisticsMenu'

export type LOCALE_CODE = 'en-US'

export type CONTENTFUL_DEFAULT_LOCALE_CODE = 'en-US'
