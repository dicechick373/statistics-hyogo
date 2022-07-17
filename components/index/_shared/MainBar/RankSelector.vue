<template>
  <div>
    <v-switch v-model="isRank" :label="`ランキング表示`" />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, watch } from '@nuxtjs/composition-api'
import { GlobalState, StateKey } from '~/composition/useGlobalState'

export default defineComponent({
  setup() {
    // GlobalState
    const { isRank } = inject(StateKey) as GlobalState

    // 選択時の処理
    watch(isRank, () => change())
    const change = () => {}

    return {
      isRank,
    }
  },
})
</script>
