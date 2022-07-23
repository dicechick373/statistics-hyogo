<template>
  <v-tabs>
    <v-tab
      v-for="(item, i) in items"
      :key="i"
      :to="{ path: item.link }"
      nuxt
      exact
      @change="clickGovernmentTypeTab(item)"
    >
      {{ item.label }}
    </v-tab>
  </v-tabs>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { EventBus, TOGGLE_EVENT } from '@/utils/tab-event-bus'
import { useChangeRouter } from '~/composition/useChangeRouter'
import { useGovernmentType } from '~/composition/route-param/useGovernmentType'

type Item = {
  label: string
  governmentType: string
  link: string
}

export default defineComponent({
  setup() {
    // タブをクリックした時の処理
    const { setCurrentGovernmentType } = useGovernmentType()
    const clickGovernmentTypeTab = computed(() => {
      return function (item: Item) {
        setCurrentGovernmentType(item.governmentType)
      }
    })

    // タブ設定
    const { generateTabGovernmentTypeLink } = useChangeRouter()
    const items = computed((): Item[] => {
      return [
        {
          label: `都道府県の統計`,
          governmentType: 'prefecture',
          link: generateTabGovernmentTypeLink.value('prefecture'),
        },
        {
          label: `市区町村の統計`,
          governmentType: 'city',
          link: generateTabGovernmentTypeLink.value('city'),
        },
      ]
    })

    const change = (): void => {
      EventBus.$emit(TOGGLE_EVENT)
    }

    return {
      items,
      change,
      clickGovernmentTypeTab,
    }
  },
})
</script>
