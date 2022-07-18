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
  data: HighchartsRankChartData[]
  joinBy?: string[]
  states?: object
}

export type HighchartsRankChartData = {
  prefCode?: string
  prefName?: string
  cityCode?: string
  cityName?: string
  value: number
  unit: string
}
