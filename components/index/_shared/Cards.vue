<template>
  <p v-if="$fetchState.pending" />
  <div v-else>
    <cards-lazy-row :rows="rows" />
  </div>
</template>

<script lang="ts">
import CardsLazyRow from '@/components/index/_shared/CardsLazyRow.vue'
import {
  defineComponent,
  ref,
  // useAsync,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
import { Card, getContentfulCardList } from '@/composition/utils/contentful'

// TimeChartCard
const CardsTimeChart = () => {
  return import('~/components/index/_shared/estat/EstatTimeChartCard.vue')
}

// PyramidChartCard
const CardsPyramidChart = () => {
  return import('~/components/index/_shared/estat/EstatCard.vue')
}

type Cards = {
  Component: Vue.Component
  Card: Card
}

export default defineComponent({
  components: {
    CardsLazyRow,
  },
  setup() {
    // Card
    const rows = ref<Cards[][]>()
    // const cards = ref<Card[][]>()

    // パスパラメータの取得
    const route = useRoute()
    const params = route.value.params
    const { govType, menuId } = params

    const { fetch } = useFetch(async () => {
      const cardList = await getContentfulCardList(govType, menuId)
      rows.value = getCards(cardList)
    })
    fetch()

    // Cards配列の作成
    const getCards = (cardList: Card[]) => {
      // console.log(cardList)
      const result: Cards[][] = []
      let line: Cards[] = []

      // const component = CardsTimeChart

      cardList.reduce((_, cur, i, arr) => {
        const obj =
          cur.chartComponent === 'TimeChart'
            ? { component: CardsTimeChart, card: cur }
            : { component: CardsPyramidChart, card: cur }
        if (i % 2 === 0) {
          line = []

          line[0] = obj
          if (i === arr.length - 1) {
            result.push(line)
            // components.push(componentRows)
          }
        } else {
          line[1] = obj
          result.push(line)
        }
      }, [])
      // console.log(result)
      return result
    }

    // console.log(rows)
    return {
      rows,
    }
  },
})
</script>
