import { CommentsActions } from './action'

export interface Comments {
  page: number
  avgRating: number | null
  numberOfRating: number | null
  ratings: {
    id: number
    name: string
    rating: number
    ratingDate: Date
    comment: string
  }[]
}

const initialState: Comments = {
  page: 1,
  avgRating: null,
  numberOfRating: null,
  ratings: []
}

export const commentsReducer = (
  state: Comments = initialState,
  action: CommentsActions
): Comments => {
  if (action.type === '@@comment/LOAD_COMMENTS') {
    const newRatings = state.ratings.concat(action.result.ratings)
    return {
      ...state,
      page: state.page + 1,
      avgRating: action.result.avgRating,
      numberOfRating: action.result.numberOfRating,
      ratings: newRatings
    }
  }
  if (action.type === '@@comment/RESET_COMMENTS') {
    return initialState
  }
  return state
}
