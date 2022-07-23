import { reactive, toRefs } from '@nuxtjs/composition-api'

interface State {
  currentCode: string
}

export const useCode = () => {
  // state
  const state = reactive<State>({
    currentCode: '28000',
  })

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
