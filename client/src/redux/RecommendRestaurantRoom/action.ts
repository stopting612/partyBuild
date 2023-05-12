import { error } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'
import { ThunkDispatch } from 'store'
import { RecommendRestaurant } from './reducer'

export function getRecommendRestaurant(result: RecommendRestaurant) {
  return {
    type: '@@getRecommendRestaurant' as const,
    result
  }
}

export type RecommendRestaurantActions = ReturnType<
  typeof getRecommendRestaurant
>

export function fetchRecommendRestaurant() {
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/restaurant/recommend/21`,
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
      dispatch(getRecommendRestaurant(result.data))
    } catch {
      dispatch(error())
    }
  }
}
