import { reactive, toRefs } from '@nuxtjs/composition-api'

export type GovernmentType = 'prefecture' | 'city'

interface State {
  currentGovernmentType: GovernmentType
}

export const useGovernmentType = () => {
  // state
  const state = reactive<State>({
    currentGovernmentType: 'prefecture',
  })

  // setter
  const setGovernmentType = (newGovernmentType: GovernmentType) => {
    state.currentGovernmentType = newGovernmentType
  }

  // getter
  const getGovernmentType = () => {
    return state.currentGovernmentType
  }

  return {
    ...toRefs(state),
    setGovernmentType,
    getGovernmentType,
  }
}
