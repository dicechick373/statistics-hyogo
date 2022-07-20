<template>
  <v-select
    v-model="selectedItem"
    :items="items"
    item-text="@name"
    item-value="@code"
    return-object
    @change="$emit('input', $event)"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  PropType,
  ref,
} from '@nuxtjs/composition-api'
import { CLASS } from '~/types/estat'

export default defineComponent({
  components: {},
  props: {
    items: {
      type: Array as PropType<CLASS[]>,
      required: true,
    },
  },
  setup(props) {
    const selectedItem = ref<CLASS>()
    onMounted(() => {
      selectedItem.value = props.items[0]
    })

    return { selectedItem }
  },
})
</script>
