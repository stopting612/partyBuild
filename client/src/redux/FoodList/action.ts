import { error, finishLoading, startLoading } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'
import { ThunkDispatch } from 'store'
import { FoodList } from './reducer'

export function getFoodList(result: FoodList[]) {
  return {
    type: '@@getFoodList' as const,
    result
  }
}

export function updateFoodLikeToRedux(id: number) {
  return {
    type: '@@updateFoodLikeRoute' as const,
    id
  }
}

export function deleteFoodLikeToRedux(id: number) {
  return {
    type: '@@deletePartyLikeRoute' as const,
    id
  }
}

export type getFoodListActions =
  | ReturnType<typeof getFoodList>
  | ReturnType<typeof updateFoodLikeToRedux>
  | ReturnType<typeof deleteFoodLikeToRedux>

export function fetchGetFoodList() {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/restaurant/menu`,
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
        dispatch(getFoodList(result.data.menus))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function fetchFoodFilterOption(data: {
  cuisine: []
  'people-number': number
}) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${
          process.env.REACT_APP_API_SERVER
        }/restaurant/menu?cuisine=${encodeURIComponent(
          JSON.stringify(data.cuisine)
        )}&people-number=${encodeURIComponent(data['people-number'])}`
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(getFoodList(result.data.menus))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function sortingFoodbyPriceAndAvgRating(sort: string) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/restaurant/menu?sort=${sort}`
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(getFoodList(result.data.menus))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function sortingFoodByWord(data: { type: string }) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/restaurant/menu?search-word=${data.type}`
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(getFoodList(result.data.menus))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function createFoodListLike(id: number) {
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/favorite`,
        {
          method: 'POST',
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
      dispatch(updateFoodLikeToRedux(id))
      dispatch(newNotification('已收藏'))
    } catch {
      dispatch(error())
    }
  }
}

export function deleteFoodListLike(id: number) {
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
      dispatch(deleteFoodLikeToRedux(id))
    } catch {
      dispatch(error())
    }
  }
}
