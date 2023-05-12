import { error, finishLoading, startLoading } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'
import { ThunkDispatch } from 'store'
import { BeverageList } from './reducer'

export function getBeverageList(result: BeverageList[]) {
  return {
    type: '@@getBeverageList' as const,
    result
  }
}

export function updateBeverageToRedux(id: number) {
  return {
    type: '@@updateBeverageLikeRoute' as const,
    id
  }
}

export function deleteBeverageLikeToRedux(id: number) {
  return {
    type: '@@deleteBeverageLikeRoute' as const,
    id
  }
}

export type getBeverageListActions =
  | ReturnType<typeof getBeverageList>
  | ReturnType<typeof updateBeverageToRedux>
  | ReturnType<typeof deleteBeverageLikeToRedux>

export function fetchGetBeverageList() {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(`${process.env.REACT_APP_API_SERVER}/alcohol`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(getBeverageList(result.data.alcohols))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function fetchBeverageOption(data: { type: [] }) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/alcohol?type=${JSON.stringify(
          data.type
        )}`
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(getBeverageList(result.data.alcohols))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function sortingBeverageByPriceAndAvgRating(sort: string) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/alcohol?sort=${sort}`
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(getBeverageList(result.data.alcohols))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function sortingBeverageByWord(data: { type: string }) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/alcohol?search-word=${data.type}`
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(getBeverageList(result.data.alcohols))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function createBeverageLike(id: number) {
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
          body: JSON.stringify({ type: 'alcohol', id })
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
        return
      }
      dispatch(updateBeverageToRedux(id))
      dispatch(newNotification('已收藏'))
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
      dispatch(deleteBeverageLikeToRedux(id))
    } catch {
      dispatch(error())
    }
  }
}
