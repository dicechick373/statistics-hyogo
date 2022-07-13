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

export type Card = {
  cardTitle: string
  cardId: string
  chartComponent: 'TimeChart' | 'PyramidChart'
}
