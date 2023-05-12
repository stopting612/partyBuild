import { RecommendBeverageActions } from './action'

export interface RecommendBeverage {
  id: number | null
  image: string | null
  name: string
  introduction: string
  numberOfRating: string
  avgRating: string
  averagePrice: string
  shippingFree: boolean
  pack: string
}

const initialState: RecommendBeverage = {
  id: null,
  image: null,
  name: '',
  averagePrice: '',
  introduction: '',
  numberOfRating: '',
  avgRating: '',
  shippingFree: false,
  pack: ''
}

export const RecommendBevergeReducer = (
  state: RecommendBeverage = initialState,
  action: RecommendBeverageActions
): RecommendBeverage => {
  if (action.type === '@@getRecommendBeverage') {
    return {
      ...state,
      ...action.result
    }
  }
  return state
}
