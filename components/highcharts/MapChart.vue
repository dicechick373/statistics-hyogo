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
import { Options, SeriesMapOptions } from 'highcharts'
import { cloneDeep } from 'lodash'

export default defineComponent({
  props: {
    displayData: {
      type: Array as () => SeriesMapOptions[],
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

    // TODO joinByは上位コンポーネントで設定すること
    // HighMaps用にseriesを整形
    const series = computed((): SeriesMapOptions[] => {
      const series = cloneDeep(props.displayData)
      if (govType === 'prefecture') {
        series[0].joinBy = ['N03_001', 'prefName']
        series[0].states = { hover: { color: '#a4edba' } }
      } else {
        series[0].joinBy = ['N03_007', 'cityCode']
        series[0].states = { hover: { color: '#a4edba' } }
      }

      return series
    })

    const chartOptions = computed((): Options => {
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
