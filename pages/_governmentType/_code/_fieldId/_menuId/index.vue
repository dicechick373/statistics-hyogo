<template>
  <p v-if="$fetchState.pending" />
  <div v-else>
    <main-bar />
    <cards />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  useRoute,
  inject,
  useFetch,
} from '@nuxtjs/composition-api'
import { GlobalState, StateKey } from '~/composition/useGlobalState'
import { useGovernmentType } from '~/composition/route-param/useGovernmentType'

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

    const { setCurrentGovernmentType } = useGovernmentType()
    setCurrentGovernmentType(params.governmentType)

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
    //     content: `${url}/${governmentType}/${code}/${fieldId}/${menuId}`,
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
      // fieldId,
      // test,
      // isCity,
      // cardComponent,
    }
  },
})
</script>
