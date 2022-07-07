<template>
  <p v-if="$fetchState.pending" />
  <div v-else />
</template>

<script lang="ts">
// <cards-lazy-row :rows="rows" :cards="cards" />
import CardsLazyRow from '@/components/index/_shared/CardsLazyRow.vue'
import {
  defineComponent,
  ref,
  // useAsync,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
import { getCardList } from '@/composition/utils/contentful'

// 総人口（男女別）
const TotalPopulation = () => {
  return import('~/components/index/_shared/estat/EstatCard.vue')
}
// 総人口ランキング
const TotalPopulationRank = () => {
  return import(
    '~/components/index/population/cards/population/totalPopulationRankPrefecture.vue'
  )
}

export default defineComponent({
  components: {
    CardsLazyRow,
  },
  setup() {
    // Card
    const rows = ref([[TotalPopulation, TotalPopulationRank]])

    // パスパラメータの取得
    const route = useRoute()
    const params = route.value.params
    const { govType, menuId } = params

    const cards = ref<Promise<Card[]>>()
    const { fetch } = useFetch(async () => {
      cards.value = await getCardList(menuId, govType)
      // console.log({ govType, menuId })
      // console.log({ test })
    })
    fetch()

    // const cards = useAsync(() => getCardList(menuId, govType))
    // console.log({ test, cards })

    return {
      rows,
      cards,
    }
  },
})
</script>
