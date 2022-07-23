<template>
  <v-col cols="12" md="6" class="DataCard">
    <client-only>
      <template>
        <v-card :loading="$fetchState.pending">
          <p v-if="$fetchState.pending" />
          <data-view v-else :title="cardTitle" :route="path">
            <h4 :id="cardId" class="visually-hidden">
              {{ cardTitle }}
            </h4>

            <template v-slot:infoPanel>
              <data-view-data-set-panel :display-info="displayInfo" />
            </template>

            <toggle-break
              v-model="allbreak"
              :target-id="cardId"
              :style="{ display: canvas ? 'inline-block' : 'none' }"
            />

            <lazy-component
              :is="chartComponent"
              v-show="canvas"
              :display-data="displayData"
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

            <template v-slot:dataTable>
              <client-only>
                <data-view-table :headers="tableHeader" :items="tableData" />
              </client-only>
            </template>

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
  useRoute,
  useFetch,
  inject,
} from '@nuxtjs/composition-api'
// import { EstatCardConfig } from '~/types/estat'
import {
  formatEstatSource,
  formatEstatTimeChartData,
  formatEstatTimeList,
} from '~/composition/utils/formatEstatResponse'
import { GlobalState, StateKey } from '~/composition/useGlobalState'
import { HighchartsTimeChartSeries } from '~/types/highcharts'
import { useEstatResponse } from '~/composition/estat-api/useEstatResponse'
import { EstatCardConfig } from '~/types/main'

export default defineComponent({
  props: {
    cardConfig: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    // canvas
    const canvas = true

    // reactive値
    const estatCardConfig = ref<EstatCardConfig>(props.cardConfig)
    // const estatResponse = ref<EstatResponse>()

    const { estatResponse, setEstatResponseAsync } = useEstatResponse(
      props.cardConfig
    )
    // console.log(props.cardConfig)

    // eStat-APIからデータを取得

    const { fetch } = useFetch(async () => {
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
    // console.log(cardId)

    // path
    const route = useRoute()
    const path = computed(() => {
      return `${route.value.path}/${cardId.value}/`
    })

    // times
    const times = computed(() => {
      // console.log(estatResponse.value)
      return formatEstatTimeList(estatResponse.value)
    })

    const chartData = computed((): HighchartsTimeChartSeries[] => {
      return formatEstatTimeChartData(estatResponse.value).map((d, i) => {
        return {
          name: d.name,
          data: d.data,
          yAxis: parseInt(estatCardConfig.value.yAxis[i]),
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

    // chartの種類を設定
    const chartComponent = 'time-chart'

    // 総数／内訳の切替
    const allbreak = ref<string>('all')
    const displayData = computed((): HighchartsTimeChartSeries[] => {
      if (!estatCardConfig.value.isBreak) {
        return chartData.value
      } else if (allbreak.value === 'all') {
        return chartData.value.slice(0, 1)
      } else {
        return chartData.value.slice(1)
      }
    })

    const displayInfo = computed(() => {
      const d: HighchartsTimeChartSeries = chartData.value[0]
      const l: number = d.data.length
      return {
        lText: d.data[l - 1].y.toLocaleString(),
        sText: d.data[l - 1].x + '年の' + d.name,
        unit: d.data[l - 1].unit,
      }
    })

    return {
      cardTitle,
      cardId,
      path,
      lastUpdate,
      allbreak,
      displayData,
      additionalDescription,
      source,
      tableHeader,
      tableData,
      canvas,
      displayInfo,
      chartComponent,
    }
  },
})
</script>

function useField(): { fieldList: any } { throw new Error('Function not
implemented.') }
