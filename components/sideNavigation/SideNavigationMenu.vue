<template>
  <ul class="MenuList">
    <li
      v-for="(item, i) in items"
      :key="i"
      :class="['MenuList-Item', { '-border': item.divider }]"
      @click="
        clickSideNavigationMenu(item)
        $emit('click', $event)
      "
    >
      <app-link :to="item.link" class="MenuList-Link">
        <span v-if="item.svg || item.iconPath" class="MenuList-Icon">
          <svg
            :is="item.svg"
            v-if="item.svg"
            class="MenuList-SvgIcon"
            aria-hidden="true"
          />
          <v-icon v-if="item.iconPath" size="2rem" class="MenuList-MdIcon">
            {{ item.iconPath }}
          </v-icon>
        </span>
        <span class="MenuList-Title">{{ item.title }}</span>
      </app-link>
    </li>
  </ul>
</template>

<script lang="ts">
import CovidIcon from '@/static/covid.svg'
import MaskTrashIcon from '@/static/masktrash.svg'
import ParentIcon from '@/static/parent.svg'
import SupportIcon from '@/static/support.svg'
import { computed, defineComponent, useAsync } from '@nuxtjs/composition-api'
import {
  mdiWeatherPartlyCloudy,
  mdiAccountMultiple,
  mdiCashMultiple,
  mdiFish,
  mdiFactory,
  mdiStore,
  mdiOfficeBuilding,
  mdiHomeAnalytics,
  mdiWater,
  mdiTruck,
  mdiChartTimelineVariant,
  mdiSchool,
  mdiCashUsd,
  mdiEarth,
  mdiHospitalBox,
  mdiSeatbelt,
} from '@mdi/js'
import { useChangeRouter } from '@/composition/useChangeRouter'
import { useStatisticsField } from '~/composition/route-param/useStatisticsField'

type Item = {
  iconPath: string
  title: string
  id: string
  link: string
  divider?: boolean
}

export default defineComponent({
  components: { CovidIcon, MaskTrashIcon, ParentIcon, SupportIcon },
  setup() {
    // fieldListを設定
    const { setFieldListAsync, setCurrentField } = useStatisticsField()
    useAsync(async () => await setFieldListAsync())

    // メニューをクリックした時の処理
    const clickSideNavigationMenu = computed(() => {
      return function (item: Item) {
        setCurrentField(item.id)
      }
    })

    // リンクURLの生成
    const { generateSideNavigationLink } = useChangeRouter()

    // メニューリスト
    const items = computed((): Item[] => {
      return [
        {
          iconPath: mdiChartTimelineVariant,
          title: '基本情報',
          id: 'index',
          link: '/',
        },
        {
          iconPath: mdiWeatherPartlyCloudy,
          title: '国土・気象',
          id: 'landweather',
          link: generateSideNavigationLink.value('landweather'),
        },
        {
          iconPath: mdiAccountMultiple,
          title: '人口・世帯',
          id: 'population',
          link: generateSideNavigationLink.value('population'),
        },
        {
          iconPath: mdiCashMultiple,
          title: '労働・賃金',
          id: 'laborwage',
          link: generateSideNavigationLink.value('laborwage'),
        },
        {
          iconPath: mdiFish,
          title: '農林水産業',
          id: 'agriculture',
          link: generateSideNavigationLink.value('agriculture'),
        },
        {
          iconPath: mdiFactory,
          title: '鉱工業',
          id: 'miningindustry',
          link: generateSideNavigationLink.value('miningindustry'),
        },
        {
          iconPath: mdiStore,
          title: '商業・サービス業',
          id: 'commercial',
          link: generateSideNavigationLink.value('commercial'),
        },
        {
          iconPath: mdiOfficeBuilding,
          title: '企業・家計・経済',
          id: 'economy',
          link: generateSideNavigationLink.value('economy'),
        },
        {
          iconPath: mdiHomeAnalytics,
          title: '住宅・土地・建設',
          id: 'construction',
          link: generateSideNavigationLink.value('construction'),
        },
        {
          iconPath: mdiWater,
          title: 'エネルギー・水',
          id: 'energy',
          link: generateSideNavigationLink.value('energy'),
        },
        {
          iconPath: mdiTruck,
          title: '運輸・観光',
          id: 'tourism',
          link: generateSideNavigationLink.value('tourism'),
        },
        {
          iconPath: mdiSchool,
          title: '教育・文化・スポーツ',
          id: 'educationsports',
          link: generateSideNavigationLink.value('educationsports'),
        },
        {
          iconPath: mdiCashUsd,
          title: '行財政',
          id: 'administrativefinancial',
          link: generateSideNavigationLink.value('administrativefinancial'),
        },
        {
          iconPath: mdiSeatbelt,
          title: '司法・安全・環境',
          id: 'safetyenvironment',
          link: generateSideNavigationLink.value('safetyenvironment'),
        },
        {
          iconPath: mdiHospitalBox,
          title: '社会保障・衛生',
          id: 'socialsecurity',
          link: generateSideNavigationLink.value('socialsecurity'),
        },
        {
          iconPath: mdiEarth,
          title: '国際',
          id: 'international',
          link: generateSideNavigationLink.value('international'),
        },
      ]
    })
    return {
      items,
      clickSideNavigationMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
.MenuList {
  margin-top: 24px;
  padding: 12px 0;
  border-bottom: 1px solid $gray-4;

  @include largerThan($small) {
    border-top: 1px solid $gray-4;
  }
}

.MenuList-Item {
  list-style: none;
  line-height: 1.2;
  white-space: normal;
  @include font-size(14);
  @include lessThan($small) {
    font-weight: bold;
    @include font-size(14.5);
  }

  &.-border {
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid $gray-4;
  }
}

.MenuList-Link {
  display: flex;
  align-items: center;
  padding-top: 12px;
  padding-bottom: 12px;
  color: $gray-1;

  &:link,
  &:hover,
  &:focus,
  &:visited,
  &:active {
    color: inherit;
    text-decoration: none;
  }

  &:hover {
    font-weight: bold;
  }

  &:focus {
    font-weight: bold;
    outline: dotted $gray-3 1px;
  }

  &.nuxt-link-exact-active {
    font-weight: bold;

    &:link,
    &:hover,
    &:visited,
    &:active {
      color: $blue-1;
    }
    &:focus {
      color: $blue-1;
      outline: dotted $gray-3 1px;
    }
  }
}

.MenuList-Icon {
  margin-right: 3px;
  min-width: 24px;
}

.MenuList-MdIcon {
  color: $gray-2;

  .nuxt-link-exact-active & {
    color: $blue-1;
  }
}

.MenuList-SvgIcon {
  width: 20px;
  height: 20px;
  fill: $gray-2;

  .nuxt-link-exact-active & {
    fill: $blue-1;
  }
}

.MenuList ::v-deep .ExternalLinkIcon {
  margin-left: 5px;
  color: $gray-3;
  @include lessThan($small) {
    @include font-size(14, true);
  }
}
</style>
