import { PartyRoomDetailsActions } from './action'

export interface PartyRoomDetails {
  id: number | null
  image: string | null
  phoneNumber: number | null
  name: string
  area: number
  maxNumberOfPeople: number
  minNumberOfPeople: number
  address: string
  introduction: string
  facilities: { id: number; name: string; isAvailable: boolean }[]
  facilitiesDetails: string[]
  price: {
    startTime: string
    endTime: string
    weekdayPrice: number
    weekendPrice: number
  }[]
  remark: (string | null)[]
  importantMatter: (string | null)[]
  priceOfOvertime: string
  orderPrice: number
  addToCartPopUp: boolean
}

const initialState: PartyRoomDetails = {
  id: null,
  image: null,
  phoneNumber: null,
  name: '',
  area: 0,
  maxNumberOfPeople: 0,
  minNumberOfPeople: 0,
  address: '',
  introduction: '',
  facilities: [],
  facilitiesDetails: [],
  price: [],
  remark: [],
  importantMatter: [],
  priceOfOvertime: '',
  orderPrice: 0,
  addToCartPopUp: false
}

export const partyRoomDetailsReducer = (
  state: PartyRoomDetails = initialState,
  action: PartyRoomDetailsActions
): PartyRoomDetails => {
  if (action.type === '@@partyRoomDetails/UPDATE_PARTY_ROOM_ORDER_PRICE') {
    return {
      ...state,
      orderPrice: action.price
    }
  }
  if (action.type === '@@partyRoomDetails/LOAD_PARTY_ROOM_DETAILS') {
    return {
      ...state,
      ...action.result
    }
  }
  if (action.type === '@@partyRoomDetails/RESET_PARTY_ROOM_DETAILS') {
    return initialState
  }
  if (action.type === '@@partyRoomDetails/ADD_TO_CART_TOGGLE') {
    return {
      ...state,
      addToCartPopUp: !state.addToCartPopUp
    }
  }
  return state
}
