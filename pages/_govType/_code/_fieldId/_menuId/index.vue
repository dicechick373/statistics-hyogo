<template>
  <p v-if="$fetchState.pending" />
  <div v-else>
    <main-bar />
    <!-- <v-row>
      <v-col cols="12" md="6">
        <select-menu />
      </v-col>
      <v-col v-if="isCity" cols="12" md="6">
        <select-city />
      </v-col>
    </v-row> -->
    <!-- <component :is="cardComponent" /> -->
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  // computed,
  useRoute,
  inject,
  useFetch,
} from '@nuxtjs/composition-api'
import { GlobalState, StateKey } from '~/composition/useGlobalState'

/** 役割
 * ①Routerのparamsを取得
 * ②GlobalStateの設定
 * ③Metaの設定
 */
export default defineComponent({
  head: {},
  setup() {
    // paramsの取得
    const route = useRoute()
    const params = route.value.params

    // GlobalStateの設定
    const { setState } = inject(StateKey) as GlobalState
    const { fetch } = useFetch(async () => {
      await setState(params)
    })
    fetch()

    // カードコンポーネントの設定
    // const cardComponent = computed((): string => {
    //   return `lazy-cards`
    // })

    // // メタ
    // const url = 'https://statistics-hyogo.com'
    // const { getMenuTitle } = useContents()
    // const ogpTitle = computed(() => {
    //   return `${getMenuTitle.value(menuId)} | 統計で見る兵庫県のすがた`
    // })

    // const mInfo = reactive<any>([
    //   {
    //     hid: 'og:url',
    //     property: 'og:url',
    //     content: `${url}/${govType}/${code}/${fieldId}/${menuId}`,
    //   },
    //   {
    //     hid: 'og:title',
    //     property: 'og:title',
    //     content: ogpTitle.value,
    //   },
    //   {
    //     hid: 'description',
    //     name: 'description',
    //     content: `当サイトは、兵庫県に関する統計をわかりやすく伝えることを目的として、いち兵庫県民が開設したサイトです。`,
    //   },
    //   {
    //     hid: 'og:description',
    //     property: 'og:description',
    //     content: `当サイトは、兵庫県に関する統計をわかりやすく伝えることを目的として、いち兵庫県民が開設したサイトです。`,
    //   },
    //   {
    //     hid: 'og:image',
    //     property: 'og:image',
    //     content: `https://statistice-hyogo.com/ogp.png`,
    //   },
    //   {
    //     hid: 'twitter:image',
    //     name: 'twitter:image',
    //     content: `https://statistice-hyogo.com/ogp.png`,
    //   },
    // ])

    // const { title, meta } = useMeta()
    // title.value = ogpTitle.value
    // meta.value = mInfo

    return {
      // isCity,
      // cardComponent,
    }
  },
})
</script>
