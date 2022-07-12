<template>
  <v-card>
    <div>
      <v-row>
        <!-- 都道府県／市区町村 -->
        <v-col cols="12" md="3">
          <gov-type-tab />
        </v-col>

        <!-- 統計項目セレクト -->
        <v-col cols="12" md="3">
          <menu-selector />
        </v-col>

        <!-- 市区町村セレクト -->
        <v-col v-if="isCity" cols="12" md="3">
          <city-selector />
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  onBeforeMount,
  ref,
} from '@nuxtjs/composition-api'
import { GlobalState, StateKey } from '~/composition/useGlobalState'

/** 役割
 * フォームの取得
 */
export default defineComponent({
  head: {},
  setup() {
    // 市区町村の判定（true:市区町村、false：都道府県）
    const isCity = ref<boolean>()
    const { getCurrentGovType } = inject(StateKey) as GlobalState
    onBeforeMount(() => {
      if (getCurrentGovType() === 'city') {
        isCity.value = true
      } else {
        isCity.value = false
      }
    })

    return {
      isCity,
    }
  },
})
</script>
