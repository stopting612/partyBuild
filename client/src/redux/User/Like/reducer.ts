import { PartyRoom } from 'redux/PartyRoomList/reducer'
import { FoodList } from 'redux/FoodList/reducer'
import { BeverageList } from 'redux/BeverageList/reducer'
import { GetUserLikeActions } from './action'

export interface UserLikeList {
  partyRoom: PartyRoom[]
  foodList: FoodList[]
  alcoholList: BeverageList[]
}

const initialState: UserLikeList = {
  partyRoom: [],
  foodList: [],
  alcoholList: []
}

export const getUserLikeReducer = (
  state: UserLikeList = initialState,
  action: GetUserLikeActions
): UserLikeList => {
  if (action.type === '@@getUserLikeList') {
    return {
      ...state,
      ...action.result
    }
  } else if (action.type === '@@deleteUserFoodLikeRoute') {
    const newList = state.foodList.filter((item) => item.id !== action.id)
    return {
      ...state,
      foodList: newList
    }
  } else if (action.type === '@@deleteUserPartyLikeRoute') {
    const newList = state.partyRoom.filter((item) => item.id !== action.id)
    return {
      ...state,
      partyRoom: newList
    }
  } else if (action.type === '@@deleteUserAlcoholLikeRoute') {
    const newList = state.alcoholList.filter((item) => item.id !== action.id)
    return {
      ...state,
      alcoholList: newList
    }
  }
  return state
}
