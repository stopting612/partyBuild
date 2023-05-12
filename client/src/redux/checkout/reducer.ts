import { CheckoutActions } from './action'

export interface CheckoutState {
  contactName: string
  phoneNumber: string
  shoppingBasketId: number
  date: string
  startTime: string
  address: string
  specialRequirement: string
}

const initialState: CheckoutState = {
  contactName: '',
  phoneNumber: '',
  shoppingBasketId: 0,
  date: '',
  startTime: '',
  address: '',
  specialRequirement: ''
}

export const checkoutReducer = (
  state: CheckoutState = initialState,
  action: CheckoutActions
): CheckoutState => {
  if (action.type === '@@checkout/LOAD_CHECKOUT_STATE') {
    return {
      ...state,
      ...action.result
    }
  }
  return state
}
