import { ThunkDispatch } from 'store'
import { IShoppingBasket } from 'redux/User/PartyHistory/reducer'
import { error, finishLoading, startLoading } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'

export function getHistoryShoppingList(result: IShoppingBasket) {
  return {
    type: '@@GET_HISTORY_SHOPPING_BASKET' as const,
    result
  }
}

export type GetHistoryShoppingBasketAction = ReturnType<
  typeof getHistoryShoppingList
>

export function fetchGetHistoryShopptingList(id: number = 1) {
  return async (dispatch: ThunkDispatch) => {
    // Get user History GET “/api/v1/users/shopping-basket-history?”
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/shopping-basket-history?page=${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(getHistoryShoppingList(result.data))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}
