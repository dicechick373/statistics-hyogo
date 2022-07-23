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
  const setCurrentGovernmentType = (newGovernmentType: GovernmentType) => {
    if (state.currentGovernmentType !== newGovernmentType) {
      state.currentGovernmentType = newGovernmentType
    }
  }

  // getter
  const getCurrentGovernmentType = () => {
    return state.currentGovernmentType
  }

  return {
    ...toRefs(state),
    setCurrentGovernmentType,
    getCurrentGovernmentType,
  }
}
