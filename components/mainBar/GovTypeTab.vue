<template>
  <v-tabs>
    <v-tab
      v-for="(item, i) in items"
      :key="i"
      :to="{ path: item.path }"
      nuxt
      exact
    >
      {{ item.label }}
    </v-tab>
  </v-tabs>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { EventBus, TOGGLE_EVENT } from '@/utils/tab-event-bus'
import { useChangeRouter } from '~/composition/useChangeRouter'

export default defineComponent({
  setup() {
    const { getGovTabLink } = useChangeRouter()
    const items = computed(() => {
      return [
        {
          label: `都道府県の統計`,
          path: getGovTabLink.value('prefecture'),
        },
        {
          label: `市区町村の統計`,
          path: getGovTabLink.value('city'),
        },
      ]
    })

    const change = (): void => {
      EventBus.$emit(TOGGLE_EVENT)
    }

    return {
      items,
      change,
    }
  },
})
</script>
