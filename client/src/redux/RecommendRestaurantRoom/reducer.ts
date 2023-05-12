import { RecommendRestaurantActions } from './action'

export interface RecommendRestaurant {
  id: number | null
  image: string | null
  name: string
  introduction: string
  numberOfRating: string
  avgRating: string
  price: string
  shippingFree: boolean
  shippingFees?: { id: number; price: string; area: string }[]
}

const initialState: RecommendRestaurant = {
  id: null,
  image: null,
  name: '',
  price: '',
  introduction: '',
  numberOfRating: '',
  avgRating: '',
  shippingFree: false
}

export const RecommendRestaurantRoomReducer = (
  state: RecommendRestaurant = initialState,
  action: RecommendRestaurantActions
): RecommendRestaurant => {
  if (action.type === '@@getRecommendRestaurant') {
    return {
      ...state,
      ...action.result
    }
  }
  return state
}
