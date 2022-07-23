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
export type EstatCardConfig = {
  cardTitle: string
  cardId: string
  statsDataId: string
  cdCat01?: string | string[]
  cdCat02?: string | string[]
  series?: string | string[]
  chartType?: string[] | string[]
  yAxis?: string | string[]
  governmentType: 'prefecture' | 'city'
  chartComponent: 'TimeChart' | 'PyramidChart'
  isBreak: boolean
  annotation?: Document | undefined
}

// export type CardConfig = {
//   cardTitle: string
//   cardId: string
//   chartType?: string[] | string[]
//   yAxis?: string | string[]
//   governmentType: 'prefecture' | 'city'
//   chartComponent: 'TimeChart' | 'PyramidChart'
//   isBreak: boolean
//   annotation?: Document | undefined
// }

// export type EstatTableHeader = {
//   text: string
//   value: string
//   width: string
// }

// export type EstatTableData = {
//   text: string
//   value: string
//   align: string
//   width: string
// }

// export type EstatSeries = {
//   name: string
//   cdCat01?: string
//   cdCat02?: string
//   type?: string
//   yAxis?: number
// }

// export type Times = {
//   yearInt?: number
//   yearStr?: string
//   yearName?: string
// }

// export type EstatRankChartData = {
//   category: CLASS
//   time: CLASS
//   value: VALUE[]
// }

// export type StateType = {
//   estatParams: EstatParams
//   series: Series[]
//   latestYear: Times
//   annotation: never[]
// }

// export type EstatSeries = {
//   id: string
//   code: string
//   name: string
//   type?: string
//   yAxis?: number
//   color?: string
//   data?: []
//   year?: number
//   man?: string
//   woman?: string
// }

// export type EstatTimes = {
//   yearInt?: number
//   yearStr?: string
//   yearName?: string
// }

// export type EstatTimeChartData = {
//   name: string
//   data: {
//     x: number
//     y: number
//     unit: string
//   }
//   // color: string
//   yAxis?: number
//   type?: string
// }

// export type EstatSource = {
//   estatName: string
//   estatUrl: string
// }

export type CardConfig = {
  cardTitle: string
  cardId: string
  statsDataId: string
  cdCat01?: string[]
  series?: string[]
  chartType?: string[]
  yAxis?: string[]
  governmentType: 'prefecture' | 'city'
  chartComponent: 'TimeChart' | 'PyramidChart'
  isBreak: boolean
  annotation?: Document | undefined
}

export type CardContents = {
  cardTitle: string
  cardId: string
  chartComponent: 'TimeChart' | 'PyramidChart'
}
