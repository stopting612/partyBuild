import { ThunkDispatch } from 'store'
import { UserLikeList } from 'redux/User/Like/reducer'
import { error, finishLoading, startLoading } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'

export function getUserLikeList(result: UserLikeList) {
  return {
    type: '@@getUserLikeList' as const,
    result
  }
}

export function deleteUserFoodLikeToRedux(id: number) {
  return {
    type: '@@deleteUserFoodLikeRoute' as const,
    id
  }
}

export function deleteUserPartyLikeToRedux(id:number) {
  return {
    type: '@@deleteUserPartyLikeRoute' as const,
    id
  }
}

export function deleteUserAlcoholLikeToRedux(id:number) {
  return {
    type: '@@deleteUserAlcoholLikeRoute' as const,
    id
  }
}

export type GetUserLikeActions =
  | ReturnType<typeof getUserLikeList>
  | ReturnType<typeof deleteUserFoodLikeToRedux>
  | ReturnType<typeof deleteUserPartyLikeToRedux>
  | ReturnType<typeof deleteUserAlcoholLikeToRedux>

export function fetchGetUserLikeList() {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/favorite`,
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
        dispatch(getUserLikeList(result.data))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function deleteUserFoodList(id: number) {
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/favorite`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ type: 'food', id })
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
        return
      }
      dispatch(deleteUserFoodLikeToRedux(id))
    } catch {
      dispatch(error())
    }
  }
}

export function deletePartyRoomLike(id: number) {
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/favorite`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ type: 'partyRoom', id })
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
        return
      }
      dispatch(deleteUserPartyLikeToRedux(id))
    } catch {
      dispatch(error())
    }
  }
}

export function deleteBeverageLike(id: number) {
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/favorite`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ type: 'alcohol', id })
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
        return
      }
      dispatch(deleteUserAlcoholLikeToRedux(id))
    } catch {
      dispatch(error())
    }
  }
}
