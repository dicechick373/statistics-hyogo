export type HighchartsTimeChartSeries = {
  name: string
  data?: {
    x: number
    y: number
    unit: string
  }
  color?: string
  type?: string
  yAxis?: number
}

export type HighchartsPyramidChartSeries = {
  name: string
  data: number[]
  color?: string
}[]
