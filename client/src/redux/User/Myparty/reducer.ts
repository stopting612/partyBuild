import {
  IShoppingBasket
} from 'redux/User/PartyHistory/reducer'
import { GetMyPartyListAction } from 'redux/User/Myparty/action'

const initialState: IShoppingBasket = {
  shoppingBaskets: [],
  count: 0
}

export const getMyPartyReducer = (
  state: IShoppingBasket = initialState,
  action: GetMyPartyListAction
): IShoppingBasket => {
  if (action.type === '@@DELETE_MY_PARTY_LIST') {
    const newList = state.shoppingBaskets.filter(order => order.id !== action.basketID)
    return {
      ...state,
      shoppingBaskets: newList
    }
  } else if (action.type === '@@GET_MY_PARTY_LIST') {
    return {
      ...state,
      shoppingBaskets: action.result
    }
  }
  return state
}
