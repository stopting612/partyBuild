import { error } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'
import { ThunkDispatch } from 'store'
import { Comments } from './reducer'

export function loadComments(result: Comments) {
  return {
    type: '@@comment/LOAD_COMMENTS' as const,
    result
  }
}

export function resetComments() {
  return {
    type: '@@comment/RESET_COMMENTS' as const
  }
}

export type CommentsActions = ReturnType<
  typeof loadComments | typeof resetComments
>

export function fetchComments(
  cat: 'partyRoom' | 'food' | 'beverage',
  id: number,
  page: number = 1
) {
  return async (dispatch: ThunkDispatch) => {
    let api = ''
    if (cat === 'partyRoom') {
      api = `${process.env.REACT_APP_API_SERVER}/party-room/rating/${id}/${page}`
    } else if (cat === 'food') {
      api = `${process.env.REACT_APP_API_SERVER}/restaurant/rating/${id}/${page}`
    } else if (cat === 'beverage') {
      api = `${process.env.REACT_APP_API_SERVER}/alcohol/rating/${id}/${page}`
    } else {
      return
    }
    try {
      const res = await fetch(api)
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification('Failed to get user comments'))
        return
      }
      dispatch(loadComments(result.data))
    } catch {
      dispatch(error())
    }
  }
}
