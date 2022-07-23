<template>
  <div class="SelectCity">
    <label
      ref="CityLabel"
      class="SelectCityLabel"
      for="SelectCity"
      tabindex="-1"
    >
      {{ '市区町村を選択' }}
    </label>
    <div class="SelectCity">
      <div class="SelectCity-Background">
        <earth-icon class="EarthIcon" aria-hidden="true" />
        <select-menu-icon class="SelectMenuIcon" aria-hidden="true" />
      </div>
      <select id="SelectCity" v-model="selectedCity" class="SelectCity-Menu">
        <option
          v-for="item in cityList"
          :key="item.cityCode"
          :value="item"
          :title="`Switch to ${item.cityName}`"
        >
          {{ item.cityName }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'
import EarthIcon from '@/static/earth.svg'
import SelectMenuIcon from '@/static/selectmenu.svg'
import { useChangeRouter } from '~/composition/useChangeRouter'
import { useCity } from '~/composition/resas-api/useCity'
import { City } from '~/types/resas'

export default defineComponent({
  components: {
    EarthIcon,
    SelectMenuIcon,
  },
  setup() {
    // 市区町村リストの設定
    const { getCityList, getCurrentCity } = useCity()
    const cityList = ref<City[]>(getCityList())
    const selectedCity = ref<City>(getCurrentCity())

    // 選択時の処理
    watch(selectedCity, () => change())
    const { changeRoute } = useChangeRouter()
    const change = () => {
      changeRoute(selectedCity.value.cityCode)
    }

    return {
      cityList,
      selectedCity,
    }
  },
})
</script>

<style lang="scss" scoped>
.SelectCity {
  position: relative;
}

.SelectCity-Background {
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

.SelectCity-Menu {
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
