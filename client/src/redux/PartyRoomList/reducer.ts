import { GetPartyRoomListActions } from './action'

export interface PartyRoom {
  id: number
  image: string | null
  name: string
  numberOfRating: string
  price: string
  avgRating: string
  district: string
  isFavorite?: boolean
}

export interface PartyRoomList {
  partyRooms: PartyRoom[]
}

const initialState: PartyRoomList = {
  partyRooms: []
}

export const getPartyRoomListReducer = (
  state: PartyRoomList = initialState,
  action: GetPartyRoomListActions
): PartyRoomList => {
  if (action.type === '@@getPartyRoomList') {
    return {
      ...state,
      partyRooms: action.result
    }
  } else if (action.type === '@@updatePartyLikeRoute') {
    const newList = state.partyRooms.map((item) => {
      if (item.id !== action.id) {
        return item
      }
      return {
        ...item,
        isFavorite: true
      }
    })
    return {
      partyRooms: newList
    }
  } else if (action.type === '@@deletePartyLikeRoute') {
    const newList = state.partyRooms.map((item) => {
      if (item.id !== action.id) {
        return item
      }
      return {
        ...item,
        isFavorite: false
      }
    })
    return {
      partyRooms: newList
    }
  }
  return state
}
