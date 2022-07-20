<template>
  <div class="SideNavigation-Language">
    <label
      ref="LanguageLabel"
      class="SideNavigation-LanguageLabel"
      for="LanguageSelector"
      tabindex="-1"
    >
      {{ '統計分野を選択' }}
    </label>
    <div class="LanguageSelector">
      <div class="LanguageSelector-Background">
        <earth-icon class="EarthIcon" aria-hidden="true" />
        <select-menu-icon class="SelectMenuIcon" aria-hidden="true" />
      </div>
      <select
        id="LanguageSelector"
        v-model="selectedMenu"
        class="LanguageSelector-Menu"
      >
        <option
          v-for="item in menuList"
          :key="item.menuId"
          :value="item"
          :title="`Switch to ${item.menuTitle}`"
        >
          {{ item.menuTitle }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  onBeforeMount,
  ref,
  watch,
} from '@nuxtjs/composition-api'
import EarthIcon from '@/static/earth.svg'
import SelectMenuIcon from '@/static/selectmenu.svg'
import { useChangeRouter } from '~/composition/useChangeRouter'
import { Menu } from '~/composition/utils/contentful'
import { GlobalState, StateKey } from '~/composition/useGlobalState'

export default defineComponent({
  components: {
    EarthIcon,
    SelectMenuIcon,
  },
  setup() {
    // セレクトメニューのアイテム
    const menuList = ref<Menu[]>()
    const selectedMenu = ref<Menu>()

    // GlobalStateからアイテムを取得
    const { getCurrentMenuList, getCurrentMenu } = inject(
      StateKey
    ) as GlobalState
    onBeforeMount(() => {
      menuList.value = getCurrentMenuList()
      selectedMenu.value = getCurrentMenu()
    })

    // 選択時の処理
    watch(selectedMenu, () => change())
    const { changeRouterMenu } = useChangeRouter()
    const change = () => {
      changeRouterMenu.value(selectedMenu)
    }

    return {
      menuList,
      selectedMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
.LanguageSelector {
  position: relative;
}

.LanguageSelector-Background {
  display: flex;
  align-items: center;
  padding: 0 6px;
  border-radius: 4px;
  height: 28px;

  .EarthIcon {
    order: -1;
  }

  .SelectMenuIcon {
    margin-left: auto;
  }
}

.LanguageSelector-Menu {
  // select 要素のリセット
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
  // IEで矢印ボタンを消す
  &::-ms-expand {
    display: none;
  }

  border: 1px solid $gray-4;

  // 背景に被せて位置など調整
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 25px;
  width: 100%;
  height: 28px;
  line-height: 28px;

  @include font-size(12);

  &:focus {
    border: 2px solid;
    outline: none;
  }

  @include lessThan($small) {
    padding-left: 70px;

    @include font-size(16);
  }
}
</style>
