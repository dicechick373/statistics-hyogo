<template>
  <div class="DataBlock">
    <v-lazy
      v-for="(row, i) in cardRows"
      :key="i"
      v-intersect="handler"
      v-scroll="onScroll"
      :value="actives[i]"
      :options="{ threshold: 0 }"
      min-height="600"
      min-width="50%"
    >
      <card-row v-if="actives[i]">
        <component
          :is="r.cardComponent"
          v-for="(r, j) in row"
          :key="j"
          :card-config="r.cardConfig"
        />
      </card-row>
    </v-lazy>
  </div>
</template>

<script lang="ts">
import { mdiChevronRight } from '@mdi/js'
import Vue from 'vue'

import CardRow from '~/components/card/CardRow.vue'
import { CardConfig } from '~/types/main'
// import { defineComponent, reactive } from '@nuxtjs/composition-api'

type Data = {
  actives: boolean[]
  scroll: boolean
  mdiChevronRight: string
}
type Methods = {
  handler: (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver,
    isIntersecting: boolean
  ) => void
  onScroll: () => void
}
type Computed = {}
type Props = {
  cardRows: {
    cardComponent: Vue[][]
    cardConfig: CardConfig
  }
}

export default Vue.extend<Data, Methods, Computed, Props>({
  components: {
    CardRow,
  },
  props: {
    cardRows: {
      type: Array,
      required: true,
    },
    // cards: {
    //   type: Object,
    //   required: true,
    // },
  },
  data() {
    return {
      actives: Array.from({ length: this.cardRows.length }, () => false),
      scroll: false,
      mdiChevronRight,
    }
  },
  methods: {
    handler(_entries, _observer, isIntersecting) {
      // console.log(this.cards)
      if (!isIntersecting) return
      this.$set(this.actives, this.actives.indexOf(false), true)
    },
    onScroll() {
      if (this.scroll) return
      this.scroll = true
      this.$set(this.actives, 0, true)
      this.$set(this.actives, 1, true)
    },
  },
})
</script>

<style lang="scss" scoped>
.DataBlock {
  margin-top: 20px;

  .DataCard {
    margin: 8px 0;
  }
}

.expansion-panel-text {
  color: $gray-1;

  @include font-size(16);
}
</style>
