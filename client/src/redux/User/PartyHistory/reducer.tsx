import { GetHistoryShoppingBasketAction } from 'redux/User/PartyHistory/action'

export interface ShoppingBasket {
  id: number
  name: string
  date: string
  startTime: string
  endTime: string
  image: string
}

export interface IShoppingBasket {
  shoppingBaskets: ShoppingBasket[]
  count: number
}

const initialState: IShoppingBasket = {
  shoppingBaskets: [],
  count: 0
}

export const GetHistoryShoppingBasketReducer = (
  state: IShoppingBasket = initialState,
  action: GetHistoryShoppingBasketAction
): IShoppingBasket => {
  if (action.type === '@@GET_HISTORY_SHOPPING_BASKET') {
    return {
      ...state,
      shoppingBaskets: action.result.shoppingBaskets,
      count: action.result.count
    }
  }
  return state
}
