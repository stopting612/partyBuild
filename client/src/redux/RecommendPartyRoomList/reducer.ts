import { RecommendPartyRoomListActions } from './action'

export interface RecommendPartyRoomList {
  id: number | null
  image: string | null
  name: string
  introduction: string
  district: string
  price: string
  numberOfRating: string
  avgRating: string
}

const initialState: RecommendPartyRoomList = {
  id: null,
  image: null,
  name: '',
  introduction: '',
  district: '',
  price: '',
  numberOfRating: '',
  avgRating: ''
}

export const recommendPartyRoomListReducer = (
  state: RecommendPartyRoomList = initialState,
  action: RecommendPartyRoomListActions
): RecommendPartyRoomList => {
  if (action.type === '@@getRecommondPartyRoomList') {
    return {
      ...state,
      ...action.result
    }
  }
  return state
}
