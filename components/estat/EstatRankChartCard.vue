<template>
  <v-col cols="12" md="6" class="DataCard">
    <client-only>
      <template>
        <v-card :loading="$fetchState.pending">
          <card-app-bar />
          <p v-if="$fetchState.pending" />
          <data-view v-else :title="cardTitle" :route="path">
            <h4 :id="cardId" class="visually-hidden">
              {{ cardTitle }}
            </h4>

            <v-row>
              <v-col>
                <class-selector
                  v-model="selectedCategory"
                  :items="categoryList"
                />
              </v-col>
              <v-col>
                <class-selector v-model="selectedTime" :items="timeList"
              /></v-col>
            </v-row>

            <!-- <template v-slot:infoPanel>
              <data-view-data-set-panel :display-info="displayInfo" />
            </template> -->

            <lazy-component
              :is="chartComponent"
              v-show="true"
              :display-data="displayData"
              :geo-json="geoJson"
            />

            <template v-slot:description>
              <p>最終更新日:{{ lastUpdate }}</p>
              <slot name="description" />
            </template>

            <template v-slot:additionalDescription>
              <span>（注）</span>
              <ul>
                <li v-for="item in additionalDescription" :key="item">
                  {{ item }}
                </li>
              </ul>
              <slot name="additionalDescription" />
            </template>

            <!-- <template v-slot:dataTable>
              <client-only>
                <data-view-table :headers="tableHeader" :items="tableData" />
              </client-only>
            </template> -->

            <template v-slot:footer>
              <app-link :to="source.estatUrl">
                {{ source.estatName }}
              </app-link>
            </template>
          </data-view>
        </v-card>
      </template>
    </client-only>
  </v-col>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  useFetch,
  inject,
  useRoute,
} from '@nuxtjs/composition-api'
import { useGeojson } from '@/composition/useGeojson'
import { useEstatResponse } from '@/composition/useEstatResponse'
import { convertCodeToString, usePrefecture } from '~/composition/usePrefecture'
import { CLASS, EstatRankChartData, EstatSeries, VALUE } from '~/types/estat'
import { GlobalState, StateKey } from '~/composition/useGlobalState'
import {
  formatChartDataRankChart,
  formatEstatCategory,
  formatEstatSource,
  getEstatCategoryList,
  getEstatTimeList,
} from '~/composition/utils/formatEstatResponse'
import {
  HighchartsRankChartData,
  HighchartsRankChartSeries,
} from '~/types/highcharts'
import { CardConfig } from '~/types/main'
import { useCity } from '~/composition/useCity'

// MapChart
const MapChart = () => {
  return import('@/components/highcharts/MapChart.vue')
}
// BarChart
const BarChart = () => {
  return import('@/components/highcharts/BarChart.vue')
}

export default defineComponent({
  props: {
    cardConfig: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    // canvas
    // const canvas = true

    // reactive値
    const estatCardConfig = ref<CardConfig>(props.cardConfig)

    // GeoJsonの設定
    const { geoJson, setGeoJsonAsync } = useGeojson()

    const { estatResponse, setEstatResponseAsync } = useEstatResponse(
      props.cardConfig
    )

    // APIからデータを取得してreactiveに格納
    const { fetch } = useFetch(async () => {
      await setGeoJsonAsync()
      await setEstatResponseAsync()
    })
    fetch()

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

    // path
    const route = useRoute()
    const path = computed(() => {
      return `${route.value.path}/${cardId.value}/`
    })

    // 系列セレクト
    const selectedCategory = ref<CLASS>()
    const categoryList = computed(() => {
      selectedCategory.value = getEstatCategoryList(estatResponse.value)[0]
      return getEstatCategoryList(estatResponse.value).map((d) =>
        formatEstatCategory(d, propSeries.value)
      )
    })

    // 年次セレクト
    const selectedTime = ref<CLASS>()
    const timeList = computed(() => {
      selectedTime.value = getEstatTimeList(estatResponse.value)[0]
      return getEstatTimeList(estatResponse.value)
    })
    // console.log(timeList)

    // 順位を付与
    // const withRankingData = computed(() => {
    //   let rank = 1
    //   return convertedCurrentValue.value
    //     .sort((a, b) => {
    //       if (a.value > b.value) return -1
    //       if (a.value < b.value) return 1
    //       return 0
    //     })
    //     .reduce((pre, cur, i, arr) => {
    //       if (i !== 0 && cur.value !== arr[i - 1].value) {
    //         rank = rank + 1
    //       }

    //       pre.push(Object.assign(cur, { rank }))
    //       return pre
    //     }, [])
    // })

    // const formatRankChartSeries = (item: EstatRankChartData) => {
    //   return {
    //     name: item.category,
    //     time: item.time,
    //     data: item.value.map((d: VALUE) => {
    //       return {
    //         prefCode: getPref(d['@code']),
    //       }
    //     }),
    //   }
    // }

    const chartData = computed(() => {
      return formatChartDataRankChart(estatResponse.value).map((d) => {
        d.category = formatEstatCategory(d.category, propSeries.value)
        return d
      })
    })

    const displayData = computed(() => {
      // category,timeに合致するデータ
      const data = chartData.value
        .filter((f) => Object.is(f.category, selectedCategory.value))
        .filter((f) => Object.is(f.time, selectedTime.value))

      // highchartsのseriesに整形
      return data.map((d) => formatHighchartsRankChartSeries(d))
    })

    const formatHighchartsRankChartSeries = (
      chartData: EstatRankChartData
    ): HighchartsRankChartSeries => {
      return {
        name: chartData.category['@name'],
        year: parseInt(chartData.time['@code'].substring(0, 4)),
        data: chartData.value.map((d) => formatHighchartsRankChartData(d)),
      }
    }

    const { getPrefecture } = usePrefecture()
    const { getCity } = useCity()
    const formatHighchartsRankChartData = (
      value: VALUE
    ): HighchartsRankChartData => {
      return {
        prefCode: convertCodeToString(getPrefecture(value['@area']).prefCode),
        prefName: getPrefecture(value['@area']).prefName,
        cityCode: getCity(value['@area']).cityCode,
        cityName: getCity(value['@area']).cityName,
        value: parseInt(value.$),
        unit: value['@unit'],
      }
    }

    // series生成
    const propSeries = computed((): EstatSeries[] => {
      return estatCardConfig.value.series.map((d, i: number) => {
        return {
          name: d,
          cdCat01: estatCardConfig.value.cdCat01[i],
          type: estatCardConfig.value.chartType[i],
          yAxis: estatCardConfig.value.yAxis[i],
        }
      })
    })

    // console.log({ chartData, displayData, propSeries })

    // console.log(getPref('28000'))

    // tableHeader
    // const tableHeader = computed(() => [
    //   { text: '都道府県名', value: 'prefName', width: '40px' },
    //   {
    //     text: `${currentSeries.value.name} [${currentTime.value.yearName}]`,
    //     value: 'value',
    //     width: '100px',
    //   },
    // ])

    // // tableData
    // const tableData = computed(() => {
    //   return prefList.map((d) => {
    //     const data = currentValue.value.find(
    //       (f) => f['@area'] === convertPrefCodeToString(d.prefCode)
    //     )
    //     return {
    //       prefName: d.prefName,
    //       value: `${parseInt(data.$).toLocaleString()}${data['@unit']}`,
    //     }
    //   })
    // })

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

    // MapChartとBarChartの切替
    const mapbar = ref<string>('map')
    const chartComponent = computed(() => {
      return mapbar.value === 'map' ? MapChart : BarChart
    })

    return {
      cardTitle,
      cardId,
      path,
      additionalDescription,
      source,
      chartComponent,
      lastUpdate,
      timeList,
      selectedTime,
      categoryList,
      selectedCategory,
      displayData,
      geoJson,
      // mapbar,
    }
  },
})
</script>

function useEstatResponse() { throw new Error('Function not implemented.') }
function getCity(arg0: string) { throw new Error('Function not implemented.') }
