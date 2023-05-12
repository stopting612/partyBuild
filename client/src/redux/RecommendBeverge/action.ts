import { error } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'
import { ThunkDispatch } from 'store'
import { RecommendBeverage } from './reducer'

export function getRecommendBeverage(result: RecommendBeverage) {
  return {
    type: '@@getRecommendBeverage' as const,
    result
  }
}

export type RecommendBeverageActions = ReturnType<typeof getRecommendBeverage>

export function fetchRecommendBeverage() {
  // Get recommend alcohol GET “/api/v1/alcohol/recommend/:id”
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/alcohol/recommend/34`,
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
      dispatch(getRecommendBeverage(result.data))
    } catch {
      dispatch(error())
    }
  }
}
