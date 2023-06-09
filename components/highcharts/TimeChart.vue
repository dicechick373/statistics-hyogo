<template>
  <div class="graph">
    <highcharts :options="chartOptions" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@nuxtjs/composition-api'
import { cloneDeep } from 'lodash'
import * as Highcharts from 'highcharts'

export default defineComponent({
  props: {
    displayData: {
      type: Array as PropType<Highcharts.SeriesColumnOptions[]>,
      required: true,
    },
  },
  setup(props) {
    const series = computed((): Highcharts.SeriesColumnOptions[] => {
      return cloneDeep(props.displayData)
    })
    const chartOptions = computed((): Highcharts.Options => {
      return {
        chart: {
          height: 280,
          zoomType: 'xy',
          type: 'column',
        },
        title: {
          text: null,
        },
        xAxis: {
          min: 1990,
          max: 2020,
          scrollbar: {
            enabled: true,
          },
          crosshair: true,
        },
        yAxis: [
          {
            opposite: true,
            title: {
              text: '',
            },
          },
          {
            opposite: true,
            title: {
              text: '',
            },
          },
        ],
        plotOptions: {
          series: {
            pointWidth: 12,
            animation: false,
            label: {
              connectorAllowed: false,
            },
          },
          column: {
            stacking: 'normal',
          },
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          pointFormat:
            '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}{point.unit}</b> <br/>',
          shared: true,
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
