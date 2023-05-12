import { push } from 'connected-react-router'
import { error, finishLoading, startLoading } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'
import { ThunkDispatch } from 'store'
import { PartyRoomDetails } from './reducer'

export function loadPartyRoomDetails(result: PartyRoomDetails) {
  return {
    type: '@@partyRoomDetails/LOAD_PARTY_ROOM_DETAILS' as const,
    result
  }
}

export function updatePartyRoomOrderPrice(price: number) {
  return {
    type: '@@partyRoomDetails/UPDATE_PARTY_ROOM_ORDER_PRICE' as const,
    price
  }
}

export function resetPartyRoomDetails() {
  return {
    type: '@@partyRoomDetails/RESET_PARTY_ROOM_DETAILS' as const
  }
}

export function addToCartToggle() {
  return {
    type: '@@partyRoomDetails/ADD_TO_CART_TOGGLE' as const
  }
}

export type PartyRoomDetailsActions = ReturnType<
  | typeof loadPartyRoomDetails
  | typeof updatePartyRoomOrderPrice
  | typeof resetPartyRoomDetails
  | typeof addToCartToggle
>

export function fetchPartyRoomDetails(id: number) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/party-room/${id}`
      )
      if (res.status !== 200) {
        dispatch(push('/party-room'))
      } else {
        const result = await res.json()
        dispatch(loadPartyRoomDetails(result.data.partyRoom))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function fetchPartyRoomPrice(
  id: number,
  date: string,
  startTime: string,
  endTime: string,
  numberOfPeople: string
) {
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/party-room/price/?id=${id}&date=${date}&start=${startTime}&end=${endTime}&numberOfPeople=${numberOfPeople}`
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
        return
      }
      dispatch(updatePartyRoomOrderPrice(result.data.price))
    } catch {
      dispatch(error())
    }
  }
}

export function addToParty(
  partyRoomId: number,
  shoppingBagId: number,
  numberOfPeople: number,
  date: Date,
  startTime: string,
  endTime: string
) {
  return async (dispatch: ThunkDispatch) => {
    const reqBody = {
      partyRoomId,
      shoppingBagId,
      numberOfPeople,
      date,
      startTime,
      endTime
    }
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/add-party-room-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(reqBody)
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(newNotification('成功加入購物車'))
        dispatch(addToCartToggle())
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function createNewParty(
  name: string,
  id: number,
  data: {
    partyRoomPerson: string
    date: string
    startTime: string
    endTime: string
  }
) {
  return async (dispatch: ThunkDispatch) => {
    const reqBody = {
      name: name,
      partyRoom: {
        id: id,
        numberOfPeople: Number(data.partyRoomPerson),
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime
      }
    }
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/new-shopping-basket`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(reqBody)
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(newNotification('成功加入購物車'))
        dispatch(addToCartToggle())
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}
