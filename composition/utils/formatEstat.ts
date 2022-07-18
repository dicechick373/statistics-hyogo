import {
  CLASS,
  CLASSOBJ,
  EstatRankChartData,
  EstatResponse,
  EstatSeries,
  EstatSource,
  EstatTimes,
  VALUE,
} from '~/types/estat'
import {
  // HighchartsRankChartData,
  // HighchartsRankChartSeries,
  HighchartsTimeChartSeries,
} from '~/types/highcharts'
// import { convertCodeToString } from '../usePrefecture'

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

/**
 * 統計分野、地方公共団体区分に合致するCardListを取得する関数
 * @param response -EstatResponse
 * @returns - HighchartsPyramidChartSeries[]
 */
export const formatChartDataPyramidChart = (response: EstatResponse) => {
  const CLASS_OBJ = response.GET_STATS_DATA.STATISTICAL_DATA.CLASS_INF.CLASS_OBJ
  const value = response.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE

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
      const dataByTime = value.filter((f) => f['@time'] === d.yearStr)
      return {
        year: d.yearInt,
        data: result(dataByTime),
      }
    })
  }

  return chartData()
}

/**
 * estatAPIのレスポンスからareaList一覧を取得する関数
 * @param response - EstatResponse
 * @returns - CLASS[]
 */
export const getEstatAreaList = (response: EstatResponse): CLASS[] => {
  return getCLASS(response, 'area')
}

/**
 * estatAPIのレスポンスからcategoryListを取得する関数
 * @param response - EstatResponse
 * @returns - CLASS[]
 */
export const getEstatCategoryList = (response: EstatResponse): CLASS[] => {
  return getCLASS(response, 'cat01')
}

/**
 * estatAPIのレスポンスからtimeListを取得する関数
 * @param response - EstatResponse
 * @returns - CLASS[]
 */
export const getEstatTimeList = (response: EstatResponse): CLASS[] => {
  const time = getCLASS(response, 'time').filter((f) =>
    isExistence(response, f)
  )
  return sortByDesc(time)
}

/**
 * estatAPIのレスポンスからCLASSを取得する関数
 * @param response - EstatResponse
 * @param property - 'time' | 'area' | 'cdCat01'
 * @returns - CLASS[]
 */
export const getCLASS = (
  response: EstatResponse,
  property: 'time' | 'area' | 'cat01'
) => {
  const CLASS_OBJ = response.GET_STATS_DATA.STATISTICAL_DATA.CLASS_INF.CLASS_OBJ
  const data = CLASS_OBJ.find((f) => f['@id'] === property).CLASS
  return Array.isArray(data) ? data : [data]
}

/**
 * classがvalueに存在するかどうか判定する関数
 * @param response - EstatResponse
 * @param time - CLASS
 * @returns - boolean
 */
export const isExistence = (response: EstatResponse, time: CLASS): boolean => {
  const value = response.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE
  return value.some((s) => s['@time'] === time['@code'])
}

// 降順で並べ替え
export const sortByDesc = (item: CLASS[]): CLASS[] => {
  return item.sort((a, b) => {
    if (a['@code'] > b['@code']) return -1
    if (a['@code'] < b['@code']) return 1
    return 0
  })
}

export const getValueListGroupByCategory = (
  value: VALUE[],
  categoryList: CLASS[]
) => {
  const key: keyof VALUE = `@cat01`
  return categoryList.map((d) => {
    return {
      category: d,
      value: value.filter((f) => f[key] === d['@code']),
    }
  })
}

export const getValueListGroupByTime = (value: VALUE[], timeList: CLASS[]) => {
  return timeList.map((d) => {
    return {
      time: d,
      value: value.filter((f) => f['@time'] === d['@code']),
    }
  })
}

/**
 * estatAPIのレスポンスをRankChartに変換する関数
 * @param response -EstatResponse
 * @returns - HighchartsPyramidChartSeries[]
 */
export const formatChartDataRankChart = (
  response: EstatResponse
): EstatRankChartData[] => {
  const value = response.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE
  const categoryList = getEstatCategoryList(response)
  const TimeList = getEstatTimeList(response)

  return getValueListGroupByCategory(value, categoryList)
    .map((c) => {
      return getValueListGroupByTime(c.value, TimeList).map((t) => {
        return {
          category: c.category,
          ...t,
        }
      })
    })
    .flat()
    .filter((f) => f.value.length > 0)
}

/**
 * カテゴリ名を整形する関数
 * @param category - CLASS
 * @returns - string
 */
export const formatEstatCategoryName = (category: CLASS): string => {
  return category['@name']
    .replace(`${category['@code']}_`, '')
    .replace('（男）', '')
    .replace('（女）', '')
}

/**
 * カテゴリを整形する関数
 * @param category - CLASS
 * @param series - EstatSeries(指定する場合)
 * @returns - string
 */
export const formatEstatCategory = (
  category: CLASS,
  series: EstatSeries[]
): CLASS => {
  if (series) {
    category['@name'] = series.find((f) => f.cdCat01 === category['@code']).name
  } else {
    category['@name'] = formatEstatCategoryName(category)
  }
  return category
}
