<template>
  <div class="graph">
    <highcharts :constructor-type="'mapChart'" :options="chartOptions" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  PropType,
  useRoute,
} from '@nuxtjs/composition-api'
import { FeatureCollection } from 'geojson'
import { cloneDeep } from 'lodash'
import { HighchartsRankChartSeries } from '~/types/highcharts'

export default defineComponent({
  props: {
    displayData: {
      type: Array as () => HighchartsRankChartSeries[],
      required: true,
    },
    geoJson: {
      type: Object as PropType<FeatureCollection>,
      required: true,
    },
  },
  setup(props) {
    // 都道府県／市区町村の判定
    const route = useRoute()
    const { govType } = route.value.params

    // HighMaps用にseriesを整形
    const series = computed(() => {
      const series: HighchartsRankChartSeries[] = cloneDeep(props.displayData)
      if (govType === 'prefecture') {
        series[0].joinBy = ['N03_001', 'prefName']
        series[0].states = { hover: { color: '#a4edba' } }
      } else {
      }

      return series
    })

    const chartOptions = computed(() => {
      return {
        chart: {
          map: props.geoJson,
        },
        title: {
          text: null,
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            alignTo: 'spacingBox',
          },
        },
        legend: {
          enabled: true,
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'bottom',
        },
        colorAxis: {
          min: 0,
          max: props.displayData[0].max,
        },
        tooltip: {
          pointFormat:
            '<span style="color:{series.color}">{point.prefName}</span>: <b>{point.value}{point.unit}</b><br/>',
        },
        credits: {
          enabled: false,
        },
        series: series.value,
      }
    })
    return {
      chartOptions,
    }
  },
})
</script>

<style lang="sass" scoped>
.graph
  margin-top: 10px
  height: 100%
</style>
