<template>
  <v-app-bar>
    <v-tabs align-with-title>
      <v-tab>Tab 1</v-tab>
      <v-tab>Tab 2</v-tab>
      <v-tab>Tab 3</v-tab>
    </v-tabs>

    <!-- 統計項目セレクト -->
    <v-col cols="12" md="3">
      <menu-selector />
    </v-col>

    <!-- 市区町村セレクト -->
    <v-col v-if="isCity" cols="12" md="3">
      <city-selector />
    </v-col>

    <v-spacer />

    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon> {{ mdiHeart }}</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { mdiHeart } from '@mdi/js'

export default defineComponent({
  setup() {
    return {
      mdiHeart,
    }
  },
})
</script>
