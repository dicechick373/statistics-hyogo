export type GovType = 'prefecture' | 'city'

export type Field = {
  fieldTitle: string
  fieldId: string
  menuPrefecture?: []
  menuCity?: []
}

export type Menu = {
  menuTitle: string
  menuId: string
}

// export type CardInformation = {
//   cardTitle: string
//   cardId: string
//   chartComponent: 'TimeChart' | 'PyramidChart'
// }

export type CardConfig = {
  cardTitle: string
  cardId: string
  statsDataId: string
  cdCat01?: string[]
  series?: string[]
  chartType?: string[]
  yAxis?: string[]
  govType: 'prefecture' | 'city'
  chartComponent: 'TimeChart' | 'PyramidChart'
  isBreak: boolean
  annotation?: Document | undefined
}

export type CardContents = {
  cardTitle: string
  cardId: string
  chartComponent: 'TimeChart' | 'PyramidChart'
}
