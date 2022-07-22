<template>
  <v-navigation-drawer v-model="drawer" absolute bottom right temporary>
    <!-- <v-card-title>設定</v-card-title> -->
    <v-spacer />
    <v-icon @click.stop="drawer = !drawer">mdi-close</v-icon>
    <v-divider />

    <v-col cols="12" class="py-2">
      <p>政令指定都市</p>

      <v-btn-toggle v-model="text" tile color="deep-purple accent-3" group>
        <v-btn value="left"> 統合 </v-btn>

        <v-btn value="center"> 分割 </v-btn>
      </v-btn-toggle>
    </v-col>
    <v-card-text>政令指定都市</v-card-text>
    <v-card-text>
      <v-btn-toggle v-model="text" color="primary">
        <v-btn value="left" style="text-transform: none"> 統合 </v-btn>
        <v-btn value="center" style="text-transform: none"> 分割 </v-btn>
      </v-btn-toggle>
    </v-card-text>
    <v-divider />
    <v-card-text>グラフの種類</v-card-text>
    <v-card-text>
      <v-btn color="primary" dark style="text-transform: none">
        MapChart
      </v-btn>
      <v-btn color="error" dark style="text-transform: none"> BarChart </v-btn>
    </v-card-text>
    <v-divider />
    <v-list nav dense>
      <v-list-item-group
        v-model="group"
        active-class="deep-purple--text text--accent-4"
      >
        <v-list-item>
          <v-list-item-title>総数</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>単位人口当たり</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>単位面積当たり</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>Buzz</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { mdiHeart } from '@mdi/js'

export default defineComponent({
  setup() {
    const drawer = ref<boolean>(false)
    const text = ref<string>('center')

    watch(text, () => {
      drawer.value = false
    })
    return {
      mdiHeart,
      drawer,
      text,
    }
  },
})
</script>
