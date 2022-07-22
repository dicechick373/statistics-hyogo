<template>
  <div>
    <v-app-bar dense>
      <v-toolbar-title />

      <v-spacer />

      <v-btn icon>
        <v-icon @click.stop="drawer = !drawer">mdi-cog-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <navi-drawer />
  </div>
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
