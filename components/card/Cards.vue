<template>
  <p v-if="$fetchState.pending" />
  <div v-else>
    <cards-lazy-row :card-rows="cardRows" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  ref,
  useFetch,
  useRoute,
  watch,
} from '@nuxtjs/composition-api'
import { getContentfulCardList } from '@/composition/utils/contentful'
import CardsLazyRow from '~/components/card/CardsLazyRow.vue'
import { GlobalState, StateKey } from '~/composition/useGlobalState'
import { CardConfig } from '~/types/main'

// TimeChartCard
const CardsTimeChart = () => {
  return import('~/components/estat/EstatTimeChartCard.vue')
}

// PyramidChartCard
const CardsPyramidChart = () => {
  return import('~/components/estat/EstatPyramidChartCard.vue')
}

// RankChartCard
const CardsRankChart = () => {
  return import('~/components/estat/EstatRankChartCard.vue')
}

type CardRow = {
  cardComponent: Vue.AsyncComponent
  cardConfig: CardConfig
}

export default defineComponent({
  components: {
    CardsLazyRow,
  },
  setup() {
    // Card
    const cardRows = ref<CardRow[][]>()

    // パスパラメータの取得
    const route = useRoute()
    const params = route.value.params
    const { govType, menuId } = params

    const { fetch } = useFetch(async () => {
      const cardList: CardConfig[] = await getContentfulCardList(
        govType,
        menuId
      )
      // console.log(cardList)
      cardRows.value = setCardRows(cardList)
    })
    fetch()

    // GlobalState
    const { isRank } = inject(StateKey) as GlobalState

    watch(isRank, () => change())
    const change = () => {
      fetch()
    }

    // cardRow{cardComponent,cardConfig}
    const setCardRow = (cardConfig: CardConfig): CardRow => {
      const component = isRank.value
        ? CardsRankChart
        : cardConfig.chartComponent === 'TimeChart'
        ? CardsTimeChart
        : CardsPyramidChart

      return {
        cardComponent: component,
        cardConfig,
      }
    }

    const setCardRows = (cardList: CardConfig[]) => {
      const result: CardRow[][] = []
      let line: CardRow[] = []

      cardList.reduce((_, cur, i, arr) => {
        if (i % 2 === 0) {
          line = []
          line[0] = setCardRow(cur)
          if (i === arr.length - 1) {
            result.push(line)
          }
        } else {
          line[1] = setCardRow(cur)
          result.push(line)
        }
      }, [])
      return result
    }

    return {
      cardRows,
    }
  },
})
</script>
