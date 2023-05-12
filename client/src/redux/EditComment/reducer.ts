
import { getUserCommentActions } from './action'

export interface Comment {
  id: number
  name: string
  rating: number
  comment: string
  shoppingBasketId: number
}

export interface UserComment {
  partyRoom: Comment
  alcohols: Comment[]
  foods: Comment[]
}

const initialState: UserComment = {
  partyRoom: {
    id: 0,
    name: '',
    rating: 0,
    comment: '',
    shoppingBasketId: 0
  },
  alcohols: [],
  foods: []
}

export const getUserCommentReducer = (
  state: UserComment = initialState,
  action: getUserCommentActions
): UserComment => {
  if (action.type === '@@getUserComment') {
    return {
      ...state,
      ...action.result
    }
  } else if (action.type === '@@updatePArtyRoomRating') {
    return {
      ...state,
      partyRoom: { ...state.partyRoom, rating: action.rating }
    }
  } else if (action.type === '@@updteFoodRating') {
    const newList = state.foods.map((item) => {
      if (item.id !== action.id) {
        return item
      }
      return {
        ...item,
        rating: action.rating

      }
    })
    return {
      ...state,
      foods: newList
    }
  } else if (action.type === '@@updateAlcogholRating') {
    const newList = state.alcohols.map((item) => {
      if (item.id !== action.id) {
        return item
      }
      return {
        ...item,
        rating: action.rating

      }
    })
    return {
      ...state,
      alcohols: newList
    }
  } else if (action.type === '@@updatePartyRoomComment') {
    return {
      ...state,
      partyRoom: { ...state.partyRoom, comment: action.comment }
    }
  } else if (action.type === '@@updatefoodComment') {
    const newList = state.foods.map((item) => {
      if (item.id !== action.id) {
        return item
      }
      return {
        ...item,
        comment: action.comment

      }
    })
    return {
      ...state,
      foods: newList
    }
  } else if (action.type === '@@updateAlcoholComment') {
    const newList = state.alcohols.map((item) => {
      if (item.id !== action.id) {
        return item
      }
      return {
        ...item,
        comment: action.comment

      }
    })
    return {
      ...state,
      alcohols: newList
    }
  }
  return state
}
