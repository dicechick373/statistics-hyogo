import { reactive, toRefs } from '@nuxtjs/composition-api'
import { getContentfulFieldListAsync } from './utils/contentful'
import { IStatisticsFieldFields } from '~/types/contentful'

export type Field = Pick<
  IStatisticsFieldFields,
  'fieldId' | 'fieldTitle' | 'iconPath'
>

interface State {
  fieldList: Field[]
  currentField: Field
}

export const useField = () => {
  // state
  const state = reactive<State>({
    fieldList: null,
    currentField: null,
  })

  // setter
  const setFieldList = async () => {
    const contentfulFieldList = await getContentfulFieldListAsync()
    state.fieldList = contentfulFieldList.map((d) => formatField(d))
  }

  const setField = async (fieldId: string) => {
    if (!state.fieldList) {
      await setFieldList()
    }
    state.currentField = state.fieldList.find((f) => f.fieldId === fieldId)
  }

  // getter
  const getFieldList = () => {
    return state.fieldList
  }

  return {
    ...toRefs(state),
    setFieldList,
    setField,
    getFieldList,
  }
}

/**
 * contentfulのデータをformatする関数
 * @returns - Field
 */
const formatField = (contentfulField: IStatisticsFieldFields): Field => {
  return {
    fieldTitle: contentfulField.fieldTitle,
    fieldId: contentfulField.fieldId,
    iconPath: contentfulField.iconPath,
  }
}
