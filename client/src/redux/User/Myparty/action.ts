import { ThunkDispatch } from 'store'
import { ShoppingBasket } from 'redux/User/PartyHistory/reducer'
import { error, finishLoading, startLoading } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'

export function getMyPartyList(result: ShoppingBasket[]) {
  return {
    type: '@@GET_MY_PARTY_LIST' as const,
    result
  }
}

export function deleteMyPartyList(basketID: number) {
  return {
    type: '@@DELETE_MY_PARTY_LIST' as const,
    basketID
  }
}

export type GetMyPartyListAction =
  | ReturnType<typeof getMyPartyList>
  | ReturnType<typeof deleteMyPartyList>

export function fetchGetMyPartyList(page: number = 1) {
  return async (dispatch: ThunkDispatch) => {
    // Get user’s shoppingBasket GET “/api/v1/users/shopping-basket?”
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/shopping-basket?page=${page}`,
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
        dispatch(getMyPartyList(result.data.shoppingBaskets))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function fetchDeleteMyPartyList(shoppingId: number) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/shopping-basket/${shoppingId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(deleteMyPartyList(shoppingId))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}
