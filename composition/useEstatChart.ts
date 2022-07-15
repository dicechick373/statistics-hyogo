import {
  computed,
  inject,
  ref,
  useContext,
  useRoute,
  watch,
} from '@nuxtjs/composition-api'
import { GlobalState, StateKey } from './useGlobalState'
import { useEstatApi } from './useEstatApi'
import {
  formatEstatSource,
  // formatEstatTimeChartData,
  formatEstatTimeList,
} from './utils/formatEstat'
import { EstatCardConfig, VALUE } from '~/types/estat'

export const useEstatChart = () => {
  // カード設定
  const estatCardConfig = ref<EstatCardConfig>()

  // カード設定からestatParamsを生成(paramsからcdAreaを設定)
  const { params } = useContext()
  const estatParams = computed(() => {
    return {
      statsDataId: estatCardConfig.value.statsDataId,
      cdCat01: estatCardConfig.value.cdCat01,
      cdArea: params.value.code,
    }
  })

  // カード設定の変更を検知してestatAPIからデータ取得
  const estatResponse = ref<EstatCardConfig>()
  const { $axios } = useContext()
  watch(estatCardConfig, async () => {
    estatResponse.value = await useEstatApi($axios, estatParams.value).getData()
  })

  // cardTitle
  const { getTitle } = inject(StateKey) as GlobalState
  const cardTitle = computed(() => {
    const title = estatCardConfig.value.cardTitle.replace('都道府県の', '')
    return getTitle(title)
  })

  // cardId
  const cardId = computed(() => {
    return estatCardConfig.value.cardId
  })
  // console.log(cardId)

  // path
  const route = useRoute()
  const path = computed(() => {
    return `${route.value.path}/${cardId.value}/`
  })

  // times
  const times = computed(() => {
    return formatEstatTimeList(estatResponse.value)
  })

  // chartData
  const chartData = computed(() => {
    const value: VALUE[] =
      estatResponse.value.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE
    return estatCardConfig.value.series.map((d, i) => {
      const key: keyof VALUE = `@cat01`
      return {
        name: d,
        data: value
          .filter((f) => f[key] === estatCardConfig.value.cdCat01[i])
          .map((d) => {
            return {
              x: parseInt(d['@time'].substr(0, 4)),
              y: parseFloat(d.$),
              unit: d['@unit'],
            }
          }),
        yAxis: estatCardConfig.value.yAxis[i],
        type: estatCardConfig.value.chartType[i],
      }
    })
  })

  const tableHeader = computed(() => {
    return [
      { text: '年', value: 'year', width: '80px' },
      ...chartData.value.map((d) => {
        return {
          text: d.name,
          value: d.name,
          align: 'center',
          width: '100px',
        }
      }),
    ]
  })

  const tableData = computed(() => {
    return times.value.map((d) => {
      return Object.assign(
        { year: `${d.yearInt}年` },
        ...chartData.value.map((item) => {
          const value = item.data.find((f) => f.x === d.yearInt)
          if (value) {
            return {
              [item.name]: value.y.toLocaleString() + item.data[0].unit,
            }
          } else {
            return ''
          }
        })
      )
    })
  })

  // 注釈
  const additionalDescription = computed(() => {
    const estatCredit: string[] = [
      'このサービスは、政府統計総合窓口(e-Stat)のAPI機能を使用していますが、サービスの内容は国によって保証されたものではありません',
    ]

    return estatCredit
  })

  // 出典
  const source = computed(() => {
    return formatEstatSource(estatResponse.value)
  })

  // 最終更新日
  const lastUpdate = computed(() => {
    if (process.browser) {
      const day = new Date(document.lastModified)
      return `${day.getFullYear()}年${day.getMonth() + 1}月${day.getDate()}日`
    } else {
      return ''
    }
  })

  return {
    estatCardConfig,
    cardTitle,
    cardId,
    chartData,
    tableHeader,
    tableData,
    path,
    additionalDescription,
    source,
    lastUpdate,
  }
}
