import { error } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'
import { ThunkDispatch } from 'store'
import { RecommendPartyRoomList } from './reducer'

export function getRecommendPartyRoomList(result: RecommendPartyRoomList) {
  return {
    type: '@@getRecommondPartyRoomList' as const,
    result
  }
}

export type RecommendPartyRoomListActions = ReturnType<
  typeof getRecommendPartyRoomList
>
export function fetchRecommendDetail() {
  // Get recommend (小編推介) party room GET “/api/v1/party-room/recommend/:id”
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/party-room/recommend/43`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
        return
      }
      dispatch(getRecommendPartyRoomList(result.data))
    } catch {
      dispatch(error())
    }
  }
}
