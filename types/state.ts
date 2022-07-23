import { Pref, City } from '@/types/resas'

export type StateType = {
  code: string
  FieldId: string
  routingPath: string
  prefList: Pref[]
  cityList: City[]
  selectedPref?: Pref
  selectedCity?: City
  governmentType: string
}

export type RouteParams = {
  code: string
  FieldId: string
  menuId: string
}
