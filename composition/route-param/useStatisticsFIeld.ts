import { reactive, toRefs } from '@nuxtjs/composition-api'
import { generateFieldListAsync } from '../utils/contentful'

export type Field = {
  fieldId: string
  fieldTitle: string
  initialMenuIdPref: string
  initialMenuIdCity: string
}

interface State {
  fieldList: Field[]
  currentField: Field
}

export const useStatisticsField = () => {
  // state
  const state = reactive<State>({
    fieldList: null,
    currentField: null,
  })

  // setter
  const setFieldListAsync = async () => {
    const contentfulFieldList = await generateFieldListAsync()
    state.fieldList = contentfulFieldList
  }

  const setCurrentFieldAsync = async (fieldId: string = 'landweather') => {
    if (!state.fieldList) {
      await setFieldListAsync()
    }
    state.currentField = state.fieldList.find((f) => f.fieldId === fieldId)
  }

  const setCurrentField = (fieldId: string) => {
    state.currentField = state.fieldList.find((f) => f.fieldId === fieldId)
  }

  // getter
  const getFieldListAsync = async () => {
    if (!state.fieldList) {
      await setFieldListAsync()
    }
    return state.fieldList
  }

  const getCurrentFieldAsync = async () => {
    if (!state.currentField) {
      await setCurrentFieldAsync()
    }
    return state.currentField
  }

  return {
    ...toRefs(state),
    setFieldListAsync,
    setCurrentFieldAsync,
    setCurrentField,
    getFieldListAsync,
    getCurrentFieldAsync,
  }
}
