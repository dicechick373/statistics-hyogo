<template>
  <div class="graph">
    <highcharts :options="chartOptions" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { Options } from 'highcharts'
import { HighchartsPyramidChartSeries } from '~/types/highcharts'

export default defineComponent({
  props: {
    displayData: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const series = computed((): HighchartsPyramidChartSeries => {
      return [
        {
          name: '男性',
          data: props.displayData[0].data.map((d) => -1 * d.man),
          color: '#4169e1',
        },
        {
          name: '女性',
          data: props.displayData[0].data.map((d) => d.woman),
          color: '#ff69b4',
        },
      ]
    })
    const categories = computed(() => {
      // console.log(series.value)
      return props.displayData[0].data.map((d) => d.category)
    })

    const chartOptions = computed((): Options => {
      return {
        chart: {
          height: 350,
          type: 'bar',
          backgroundColor: 'transparent',
        },
        title: {
          text: null,
        },
        accessibility: {
          point: {
            valueDescriptionFormat: '{index}. {xDescription}, {value}.',
          },
        },
        xAxis: [
          {
            // 左軸
            categories: categories.value,
            reversed: false,
            labels: {
              step: 1,
            },
            accessibility: {
              description: '年齢（男性）',
            },
          },
          {
            // 右軸
            opposite: true,
            reversed: false,
            categories: categories.value,
            linkedTo: 0,
            labels: {
              step: 1,
            },
            accessibility: {
              description: '年齢（女性）',
            },
          },
        ],
        yAxis: {
          title: {
            text: null,
          },
          labels: {
            formatter() {
              return this.value.toLocaleString()
            },
          },
        },
        plotOptions: {
          series: {
            animation: false,
            stacking: 'normal',
          },
        },
        responsive: {
          rules: [
            {
              condition: {
                maxheight: 350,
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'right',
                  verticalAlign: 'top',
                },
              },
            },
          ],
        },
        tooltip: {
          crosshairs: true,
          shared: true,
          useHTML: true,
          formatter() {
            return this.points.map((point) => {
              return `
                <i style="
                  background-color:${point.color};
                  border-radius:50%;
                  display: inline-block;
                  height:6px;
                  margin-right:4px;
                  width:6px;"
                ></i>${point.series.name}: <b>${Math.abs(
                point.y
              ).toLocaleString()}人</b><br>`
            })
          },
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
