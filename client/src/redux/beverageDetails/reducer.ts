import { BeverageDetailsActions } from './action'

export interface BeverageDetails {
  id: number | null
  image: string
  phoneNumber: number | null
  name: string
  alcoholsSupplier: string
  pack: string
  averagePrice: number
  price: number
  introduction: string
  orderPrice: number
  addToCartPopUp: boolean
}

const initialState: BeverageDetails = {
  id: null,
  image: '',
  phoneNumber: null,
  name: '',
  alcoholsSupplier: '',
  pack: '',
  averagePrice: 0,
  price: 0,
  introduction: '',
  orderPrice: 0,
  addToCartPopUp: false
}

export const beverageDetailsReducer = (
  state: BeverageDetails = initialState,
  action: BeverageDetailsActions
): BeverageDetails => {
  if (action.type === '@@beverageDetails/UPDATE_BEVERAGE_ORDER_PRICE') {
    return {
      ...state,
      orderPrice: action.orderPrice
    }
  }
  if (action.type === '@@beverageDetails/LOAD_BEVERAGE_DETAILS') {
    return {
      ...state,
      ...action.result
    }
  }
  if (action.type === '@@beverageDetails/ADD_TO_CART_TOGGLE') {
    return {
      ...state,
      addToCartPopUp: !state.addToCartPopUp
    }
  }
  return state
}
