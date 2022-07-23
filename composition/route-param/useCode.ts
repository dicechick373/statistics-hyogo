import { reactive, toRefs } from '@nuxtjs/composition-api'
// import { useGovernmentType } from './useGovernmentType'

interface State {
  currentCode: string
}

export const useCode = () => {
  // state
  const state = reactive<State>({
    currentCode: '28000',
  })

  // const { getCurrentGovernmentType } = useGovernmentType()
  // console.log(getCurrentGovernmentType)

  // setter
  const setCode = (newCode: string) => {
    state.currentCode = newCode
  }

  // getter
  const getCode = () => {
    return state.currentCode
  }

  return {
    ...toRefs(state),
    setCode,
    getCode,
  }
}
