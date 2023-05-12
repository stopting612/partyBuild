import { UserComment } from './reducer'
import { RootState, ThunkDispatch } from 'store'
import { push } from 'connected-react-router'
import { error, finishLoading, startLoading } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'

export function getUserComment(result: UserComment) {
  return {
    type: '@@getUserComment' as const,
    result
  }
}

export function updatePartyRoomRating(rating: number) {
  return {
    type: '@@updatePArtyRoomRating' as const,
    rating
  }
}

export function updateFoodRating(id: number, rating: number) {
  return {
    type: '@@updteFoodRating' as const,
    rating,
    id
  }
}

export function updateAlcoholRating(id: number, rating: number) {
  return {
    type: '@@updateAlcogholRating' as const,
    rating,
    id
  }
}

export function updatePartyRoomComment(comment: string) {
  return {
    type: '@@updatePartyRoomComment' as const,
    comment
  }
}

export function updateFoodComment(id: number, comment: string) {
  return {
    type: '@@updatefoodComment' as const,
    comment,
    id
  }
}

export function updateAlcoholComment(id: number, comment: string) {
  return {
    type: '@@updateAlcoholComment' as const,
    comment,
    id
  }
}

export type getUserCommentActions =
  | ReturnType<typeof getUserComment>
  | ReturnType<typeof updatePartyRoomRating>
  | ReturnType<typeof updateFoodRating>
  | ReturnType<typeof updateAlcoholRating>
  | ReturnType<typeof updatePartyRoomComment>
  | ReturnType<typeof updateFoodComment>
  | ReturnType<typeof updateAlcoholComment>

export function fetchGetMyComment(shoppingId: number) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/history-order?shopping-basket-id=${shoppingId}`,
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
        dispatch(getUserComment(result.data))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function updateComment() {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    dispatch(startLoading())
    const data = getState().getuserComment
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/rating`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )
      const result = await res.json()
      dispatch(newNotification(result.message))
      dispatch(push('/user/party-history'))
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}
