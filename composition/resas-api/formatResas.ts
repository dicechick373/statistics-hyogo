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
 * codeをprefCodeに変換する関数
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
export const convertPrefCodeNumberToString = (code: number): string => {
  return ('0000000000' + code).slice(-2) + '000'
}

/**
 * 都道府県リストを返す関数
 * @returns - Pref[]
 */
export const getResasPrefList = (): Pref[] => {
  return prefListMaster.result
}

/**
 * 市区町村リストを返す関数
 * @param prefCode - number
 * @returns - City[]
 */
export const getResasCityList = (prefCode: number): City[] => {
  return cityListMaster.result.filter((f) => f.prefCode === prefCode)
}

/**
 * 市区町村を返す関数
 * @param cityCode - string
 * @returns - City
 * Note:入力値が'28000'の場合は'28100'を返す
 */
export const getCity = (cityCode: string): City => {
  const prefCode = convertCodeToPrefCode(cityCode)
  const cityList = cityListMaster.result.filter((f) => f.prefCode === prefCode)
  return cityList.find((f) => f.cityCode === cityCode) ?? cityList[0]
}

/**
 * 都道府県を返す関数
 * @param prefCode - number
 * @returns - Pref
 */
export const getPref = (prefCode: number): Pref => {
  return (
    prefListMaster.result.find((f) => f.prefCode === prefCode) ??
    prefListMaster.result[0]
  )
}
