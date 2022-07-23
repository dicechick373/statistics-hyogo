import { reactive, toRefs } from '@nuxtjs/composition-api'

export type GovernmentType = 'prefecture' | 'city'

interface State {
  governmentType: GovernmentType
}

export const useGovernmentType = () => {
  // state
  const state = reactive<State>({
    governmentType: 'prefecture',
  })

  // setter
  const setGovernmentType = (newGovernmentType: GovernmentType) => {
    state.governmentType = newGovernmentType
  }

  // getter
  const getGovernmentType = () => {
    return state.governmentType
  }

  return {
    ...toRefs(state),
    setGovernmentType,
    getGovernmentType,
  }
}
