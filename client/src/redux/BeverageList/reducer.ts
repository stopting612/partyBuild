import { getBeverageListActions } from './action'

export interface BeverageList {
  id: number
  image: string | null
  name: string
  numberOfRating: string
  avgRating: string
  pack?: string
  averagePrice?: string
  isFavorite?: boolean
}

export interface BeverageState {
  beverageLists: BeverageList[]
}

const initialState: BeverageState = {
  beverageLists: []
}

export const getBeverageReducer = (
  state: BeverageState = initialState,
  action: getBeverageListActions
): BeverageState => {
  if (action.type === '@@getBeverageList') {
    return {
      ...state,
      beverageLists: action.result
    }
  } else if (action.type === '@@updateBeverageLikeRoute') {
    const newList = state.beverageLists.map((item) => {
      if (item.id !== action.id) {
        return item
      }
      return {
        ...item,
        isFavorite: true
      }
    })
    return {
      beverageLists: newList
    }
  } else if (action.type === '@@deleteBeverageLikeRoute') {
    const newList = state.beverageLists.map((item) => {
      if (item.id !== action.id) {
        return item
      }
      return {
        ...item,
        isFavorite: false
      }
    })
    return {
      beverageLists: newList
    }
  }
  return state
}
