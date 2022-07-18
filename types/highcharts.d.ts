export type HighchartsTimeChartSeries = {
  name: string
  data?: {
    x: number
    y: number
    unit: string
  }[]
  color?: string
  type?: string
  yAxis?: number
}

export type HighchartsPyramidChartSeries = {
  name: string
  data: number[]
  color?: string
}[]

export type HighchartsRankChartSeries = {
  name: string
  year: number
  data: {
    prefCode?: string
    prefName?: string
    cityCode?: string
    cityName?: string
    value: number
    unit: string
  }
  joinBy: string[]
  states: object
}
