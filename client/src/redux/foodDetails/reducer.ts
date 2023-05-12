import { FoodDetailsActions } from './action'

export interface FoodDetails {
  id: number | null,
  image: string
  phoneNumber: number | null
  name: string
  restaurant: string
  minNumberOfPeople: number
  maxNumberOfPeople: number
  price: number
  foods: {
    name: string
    quantity: number
    image: string
  }[]
  shippingFees: {
    id: number
    price: string
    area: string
  }[]
  orderPrice: number
  addToCartPopUp: boolean
}

const initialState: FoodDetails = {
  id: null,
  image: '',
  phoneNumber: null,
  name: '',
  restaurant: '',
  minNumberOfPeople: 0,
  maxNumberOfPeople: 0,
  price: 0,
  foods: [],
  shippingFees: [],
  orderPrice: 0,
  addToCartPopUp: false
}

export const foodDetailsReducer = (
  state: FoodDetails = initialState,
  action: FoodDetailsActions
): FoodDetails => {
  if (action.type === '@@foodDetails/UPDATE_FOOD_ORDER_PRICE') {
    return {
      ...state,
      orderPrice: action.orderPrice
    }
  }
  if (action.type === '@@foodDetails/LOAD_FOOD_DETAILS') {
    return {
      ...state,
      ...action.result
    }
  }
  if (action.type === '@@foodDetails/ADD_TO_CART_TOGGLE') {
    return {
      ...state,
      addToCartPopUp: !state.addToCartPopUp
    }
  }
  return state
}
