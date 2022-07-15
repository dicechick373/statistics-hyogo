import { CLASS, EstatResponse, EstatSource, EstatTimes } from '~/types/estat'

export const convertPrefCodeToString = (prefCode: number): string => {
  return ('0000000000' + prefCode).slice(-2) + '000'
}

export const formatEstatTimeList = (response: EstatResponse): EstatTimes[] => {
  const value = response.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE
  return Array.from(new Set(value.map((d) => d['@time'])))
    .map((d) => {
      return {
        yearInt: parseInt(d.substr(0, 4)),
        yearStr: d,
        yearName: `${d.substr(0, 4)}年`,
      }
    })
    .sort((a, b) => {
      if (a.yearStr > b.yearStr) return -1
      if (a.yearStr < b.yearStr) return 1
      return 0
    })
}

export const formatEstatSource = (response: EstatResponse): EstatSource => {
  const TABLE_INF = response.GET_STATS_DATA.STATISTICAL_DATA.TABLE_INF
  return {
    estatName: `政府統計の総合窓口 e-Stat「${TABLE_INF.STAT_NAME.$}」`,
    estatUrl: `https://www.e-stat.go.jp/dbview?sid=${TABLE_INF['@id']}`,
  }
}

export const formatEstatTimeChartData = (response: EstatResponse) => {
  const CLASS_OBJ = response.GET_STATS_DATA.STATISTICAL_DATA.CLASS_INF.CLASS_OBJ
  const VALUE = response.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE

  const cat01: CLASS | CLASS[] = CLASS_OBJ.find(
    (f) => f['@id'] === 'cat01'
  ).CLASS

  // chartDataを生成する関数
  const formatChartData = (data: CLASS) => {
    return {
      code: data['@code'],
      name: data['@name'].replace(`${data['@code']}_`, ''),
      data: VALUE.filter((f) => f['@cat01'] === data['@code']).map((d) => {
        return {
          x: parseInt(d['@time'].substring(0, 4)),
          y: parseFloat(d.$),
          unit: d['@unit'],
        }
      }),
    }
  }

  const chartData = () => {
    if (Array.isArray(cat01)) {
      return cat01.map((d) => {
        return formatChartData(d)
      })
    } else {
      return [formatChartData(cat01)]
    }
  }

  return chartData()
}
