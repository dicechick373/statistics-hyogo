import {
  CLASS,
  CLASSOBJ,
  EstatResponse,
  EstatSource,
  EstatTimes,
  VALUE,
} from '~/types/estat'
import { HighchartsTimeChartSeries } from '~/types/highcharts'

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
  const CLASS_OBJ: CLASSOBJ[] =
    response.GET_STATS_DATA.STATISTICAL_DATA.CLASS_INF.CLASS_OBJ
  const value: VALUE[] = response.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE

  const cat01: CLASS | CLASS[] = CLASS_OBJ.find(
    (f) => f['@id'] === 'cat01'
  ).CLASS

  // chartDataを生成する関数
  const formatChartData = (data: CLASS): HighchartsTimeChartSeries => {
    return {
      code: data['@code'],
      name: data['@name'].replace(`${data['@code']}_`, ''),
      data: value
        .filter((f) => f['@cat01'] === data['@code'])
        .map((d) => {
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

export const formatChartDataPyramidChart = (response: EstatResponse) => {
  const CLASS_OBJ = response.GET_STATS_DATA.STATISTICAL_DATA.CLASS_INF.CLASS_OBJ
  const VALUE = response.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE

  const times = () => {
    return formatEstatTimeList(response)
  }
  // console.log({ CLASS_OBJ, VALUE })

  const cat01: CLASS | CLASS[] = CLASS_OBJ.find(
    (f) => f['@id'] === 'cat01'
  ).CLASS

  const result = (data) => {
    const res = []
    // let line = {}
    const key: keyof VALUE = `@cat01`
    cat01.reduce((_, cur) => {
      // カテゴリ名を整形
      const categoryName = cur['@name']
        .replace(`${cur['@code']}_`, '')
        .replace('（男）', '')
        .replace('（女）', '')

      // codeに一致する値（$）を返す関数
      const getValueMatchCode = (code: string) => {
        return parseInt(data.find((f) => f[key] === code).$)
      }

      const obj = cur['@name'].match('（男）')
        ? {
            man: getValueMatchCode(cur['@code']),
            unit: data[0]['@unit'],
          }
        : {
            woman: getValueMatchCode(cur['@code']),
            unit: data[0]['@unit'],
          }

      if (res.some((s) => s.name === categoryName)) {
        // line.name = categoryName
        const j = res.findIndex(({ name }) => name === categoryName)
        res[j].woman = getValueMatchCode(cur['@code'])
      } else {
        res.push(Object.assign({ name: categoryName }, obj))
      }
    }, [])
    // console.log(res)
    return res
  }
  // console.log({ result })

  const chartData = () => {
    return times().map((d) => {
      const dataByTime = VALUE.filter((f) => f['@time'] === d.yearStr)
      return {
        year: d.yearInt,
        data: result(dataByTime),
      }
    })
  }

  // console.log({ CLASS_OBJ, VALUE, cat01 })
  // console.log(chartData())

  // // chartDataを生成する関数
  // const formatChartData = (data: CLASS) => {
  //   return {
  //     code: data['@code'],
  //     name: data['@name'].replace(`${data['@code']}_`, ''),
  //     data: VALUE.filter((f) => f['@cat01'] === data['@code']).map((d) => {
  //       return {
  //         x: parseInt(d['@time'].substring(0, 4)),
  //         y: parseFloat(d.$),
  //         unit: d['@unit'],
  //       }
  //     }),
  //   }
  // }

  // const chartData = () => {
  //   if (Array.isArray(cat01)) {
  //     return cat01.map((d) => {
  //       return formatChartData(d)
  //     })
  //   } else {
  //     return [formatChartData(cat01)]
  //   }
  // }

  return chartData()
}
