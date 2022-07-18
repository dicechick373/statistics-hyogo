import { reactive, toRefs } from '@nuxtjs/composition-api'
import prefListMaster from '~/assets/json/preflist.json'
import { Pref } from '~/types/resas'
interface State {
  currentPref: Pref
  prefList: Pref[]
}

export const usePrefecture = () => {
  // state
  const state = reactive<State>({
    currentPref: { prefCode: 28, prefName: '兵庫県' },
    prefList: prefListMaster.result,
  })

  // codeに合致する都道府県を返す
  const getPrefecture = (code: string): Pref => {
    return (
      prefListMaster.result.find(
        (f) => f.prefCode === convertCodeToNumber(code)
      ) ?? prefListMaster.result[0]
    )
  }

  return {
    ...toRefs(state),
    getPrefecture,
  }
}

/**
 * codeから都道府県情報を返す関数
 * @param code -string('28000')
 * @returns - number(28)
 */
export const convertCodeToNumber = (code: string): number => {
  return +code.slice(0, 2)
}

/**
 * prefCode(number)をstringに変換する関数
 * @param code - number(28)
 * @returns - string('28000)
 */
export const convertCodeToString = (code: number): string => {
  return ('0000000000' + code).slice(-2) + '000'
}
