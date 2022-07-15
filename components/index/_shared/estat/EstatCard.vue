<template>
  <lazy-component :is="cardComponent" v-bind="props" />
</template>

<script lang="ts">
import { defineComponent, useFetch } from '@nuxtjs/composition-api'
// import { EstatState } from '@/types/estat'
import { getContentfulCard } from '@/composition/utils/contentful'
import { useEstatChart } from '~/composition/useEstatChart'
// import { useEstatChart } from '@/composition/useEstatChart'

export default defineComponent({
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    // cardコンポーネントの設定
    const cardComponent = 'estat-column-card-all-break'

    const {
      // test,
      estatCardConfig,
      // estatResponse,
      // chartData,
      // tableHeader,
      // tableData,
      // additionalDescription,
      // source,
      // lastUpdate,
    } = useEstatChart()
    const { fetch } = useFetch(async () => {
      estatCardConfig.value = await getContentfulCard(props.card.cardId)
    })
    fetch()

    // console.log({
    //   estatCardConfig,
    //   chartData,
    //   tableHeader,
    //   tableData,
    //   additionalDescription,
    //   source,
    //   lastUpdate,
    // })

    const estatState = {
      title: '総人口',
      titleId: 'total-population',
      params: {
        statsDataId: '0000010101',
        cdCat01: ['A1101', 'A110101', 'A110102'],
      },
      series: [
        {
          id: 'cat01',
          code: 'A1101',
          name: '総人口',
        },
        {
          id: 'cat01',
          code: 'A110101',
          name: '男性',
        },
        {
          id: 'cat01',
          code: 'A110102',
          name: '女性',
        },
      ],
      annotation: [],
    }

    return {
      cardComponent,
      props: {
        estatState,
      },
    }
  },
})
</script>
