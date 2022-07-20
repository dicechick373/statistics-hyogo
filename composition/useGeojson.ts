import * as topojson from 'topojson-client'
import axios from 'axios'
import { GeometryCollection } from 'geojson'
import { ref, useRoute } from '@nuxtjs/composition-api'
// import { Topology } from 'topojson-specification'
import { convertCodeToNumber } from './usePrefecture'
import { GovType } from '~/types/main'

export const useGeojson = () => {
  // route情報の取得
  const route = useRoute()

  const geoJson = ref<any>()

  // geoJsonを取得
  const getGeoJsonAsync = async () => {
    const govType = route.value.params.govType
    const prefCode = convertCodeToNumber(route.value.params.code)
    const url = generateGeoShapeURL(govType, prefCode)
    const { data: topo } = await axios.get(url)
    return convertTopoToGeo(topo)
  }

  const setGeoJsonAsync = async () => {
    geoJson.value = await getGeoJsonAsync()
  }

  return { geoJson, setGeoJsonAsync, getGeoJsonAsync }
}

/**
 * geoshapeリポジトリのURLを生成する関数
 * @param govType - 'prefecture' | 'city
 * @param prefCode - number
 * @param designatedCity - 'join' | 'split'
 * @returns - string
 */
export const generateGeoShapeURL = (
  govType: GovType = 'prefecture',
  prefCode: number = 28,
  designatedCity: 'join' | 'split' = 'join'
) => {
  const baseURL = 'https://geoshape.ex.nii.ac.jp/city/topojson/20210101'

  return govType === 'prefecture'
    ? `${baseURL}/jp_pref.c.topojson`
    : designatedCity === 'join'
    ? `${baseURL}/${prefCode}/${prefCode}_city_dc.l.topojson`
    : `${baseURL}/${prefCode}/${prefCode}_city.l.topojson`
}

/**
 * topoJsonをgeoJsonに変換する関数
 * @param topo -
 * @returns - FeatureCollection
 */
const convertTopoToGeo = (topo): GeometryCollection => {
  // console.log(topo)
  return 'pref' in topo.objects
    ? topojson.feature(topo, topo.objects.pref)
    : topojson.feature(topo, topo.objects.city)
}
