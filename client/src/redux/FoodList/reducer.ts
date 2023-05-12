import { getFoodListActions } from './action'

export interface FoodList {
  id: number
  image: string | null
  name: string
  numberOfRating: string
  price: string
  avgRating: string
  shippingFree?: boolean
  isFavorite?: boolean
}

export interface FoodState {
  foodLists: FoodList[]
}

const initialState: FoodState = {
  foodLists: []
}

export const getFoodListReducer = (
  state: FoodState = initialState,
  action: getFoodListActions
): FoodState => {
  if (action.type === '@@getFoodList') {
    return {
      ...state,
      foodLists: action.result
    }
  } else if (action.type === '@@updateFoodLikeRoute') {
    const newList = state.foodLists.map((item) => {
      if (item.id !== action.id) {
        return item
      }
      return {
        ...item,
        isFavorite: true
      }
    })
    return {
      foodLists: newList
    }
  } else if (action.type === '@@deletePartyLikeRoute') {
    const newList = state.foodLists.map((item) => {
      if (item.id !== action.id) {
        return item
      }
      return {
        ...item,
        isFavorite: false
      }
    })
    return {
      foodLists: newList
    }
  }
  return state
}
