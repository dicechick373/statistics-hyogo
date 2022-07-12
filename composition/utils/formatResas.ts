import prefListMaster from '~/assets/json/preflist.json'
import cityListMaster from '~/assets/json/citylist.json'
import { Pref, City, GovType } from '~/types/resas'

/**
 * codeから地方公共団体区分を返す関数
 * @param code -string
 * @returns - GovType
 */
export const convertCodeToGovType = (code: string): GovType => {
  return code.slice(-3) === '000' ? 'prefecture' : 'city'
}

/**
 * codeから都道府県情報を返す関数
 * @param code -string
 * @returns - Pref
 */
export const convertCodeToPrefCode = (code: string): number => {
  return +code.slice(0, 2)
}

/**
 * codeから都道府県情報を返す関数
 * @param code -string
 * @returns - string
 */
export const convertPrefCodeToCode = (code: number): string => {
  return ('0000000000' + code).slice(-2) + '000'
}

export const getPref = (prefCode: number): Pref => {
  return (
    prefListMaster.result.find((f) => f.prefCode === prefCode) ??
    prefListMaster.result[0]
  )
}

// 都道府県リストの取得
export const getResasPrefList = (): Pref[] => {
  return prefListMaster.result
}

export const getCity = (cityCode: string): City => {
  const prefCode = convertCodeToPrefCode(cityCode)
  const cityList = cityListMaster.result.filter((f) => f.prefCode === prefCode)
  return cityList.find((f) => f.cityCode === cityCode) ?? cityList[0]
}

// 市区町村リストの取得
export const getResasCityList = (
  prefCode: number,
  bigCityKind: string = 'all'
): City[] => {
  const cityListAll = cityListMaster.result.filter(
    (f) => f.prefCode === prefCode
  )

  if (bigCityKind === 'all') {
    return cityListAll
  } else if (bigCityKind === 'join') {
    return cityListAll.filter((f) => f.bigCityFlag !== '1')
  } else {
    return cityListAll.filter((f) => f.bigCityFlag !== '2')
  }
}
