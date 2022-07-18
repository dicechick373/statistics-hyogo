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
  inject,
  ref,
  useFetch,
  useRoute,
  watch,
} from '@nuxtjs/composition-api'
import { getContentfulCardList } from '@/composition/utils/contentful'
import { GlobalState, StateKey } from '~/composition/useGlobalState'
import { CardInformation } from '~/types/main'

// TimeChartCard
const CardsTimeChart = () => {
  return import('~/components/index/_shared/estat/EstatTimeChartCard.vue')
}

// PyramidChartCard
const CardsPyramidChart = () => {
  return import('~/components/index/_shared/estat/EstatPyramidChartCard.vue')
}

// RankChartCard
const CardsRankChart = () => {
  return import('~/components/index/_shared/estat/EstatRankChartCard.vue')
}

type CardProps = {
  Component: Vue.Component
  Card: CardInformation
}

export default defineComponent({
  components: {
    CardsLazyRow,
  },
  setup() {
    // Card
    const rows = ref<CardInformation[][]>()

    // パスパラメータの取得
    const route = useRoute()
    const params = route.value.params
    const { govType, menuId } = params

    const { fetch } = useFetch(async () => {
      const cardList: CardInformation[] = await getContentfulCardList(
        govType,
        menuId
      )
      rows.value = getCards(cardList)
    })
    fetch()

    // GlobalState
    const { isRank } = inject(StateKey) as GlobalState

    watch(isRank, () => change())
    const change = () => {
      fetch()
    }

    const setCardProps = (newCard: CardInformation): CardProps => {
      if (isRank.value) {
        return { component: CardsRankChart, card: newCard }
      } else {
        return newCard.chartComponent === 'TimeChart'
          ? { component: CardsTimeChart, card: newCard }
          : { component: CardsPyramidChart, card: newCard }
      }
    }

    const getCards = (cardList: CardInformation) => {
      const result: CardInformation[][] = []
      let line: CardInformation[] = []

      cardList.reduce((_, cur, i, arr) => {
        const obj = setCardProps(cur)

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
