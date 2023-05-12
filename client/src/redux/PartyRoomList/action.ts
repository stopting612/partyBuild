import { error, finishLoading, startLoading } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'
import { ThunkDispatch } from 'store'
import { PartyRoom } from './reducer'

export function getPartyRoomList(result: PartyRoom[]) {
  return {
    type: '@@getPartyRoomList' as const,
    result
  }
}

export function fetchFilterOption(data: {
  location: string[]
  facilities: string[]
}) {
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/party-room
        ?districts=${encodeURIComponent(JSON.stringify(data.location))}
        &facility=${encodeURIComponent(JSON.stringify(data.facilities))}`
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
        return
      }
      dispatch(getPartyRoomList(result.data.partyRooms))
    } catch {
      dispatch(error())
    }
  }
}

export function updatePartyLikeToRedux(id: number) {
  return {
    type: '@@updatePartyLikeRoute' as const,
    id
  }
}

export function deletePartyLikeToRedux(id: number) {
  return {
    type: '@@deletePartyLikeRoute' as const,
    id
  }
}

export function sortingPartyRoomByRatingAndPrice(sort: string) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/party-room?sort=${sort}`
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(getPartyRoomList(result.data.partyRooms))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

// export function sortingPartyRoomBySerach (sort: string){
//   return async (dispatch: ThunkDispatch) => {
//     const res = await fetch (
//       `${process.env.REACT_APP_API_SERVER}/party-room?`
//     )
//     const result = await res.json()
//     if (res.status !== 200) {
//       alert(result.message)
//       return
//     }
//     dispatch(getPartyRoomList(result.data.partyRooms))
//   }
// }

export type GetPartyRoomListActions =
  | ReturnType<typeof getPartyRoomList>
  | ReturnType<typeof updatePartyLikeToRedux>
  | ReturnType<typeof deletePartyLikeToRedux>

export function fetchGetPartyRoomList() {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/party-room`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(getPartyRoomList(result.data.partyRooms))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function sortingPartyRoomByWord(data: { type: string }) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/party-room?search-word=${data.type}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(getPartyRoomList(result.data.partyRooms))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function createPartyRoomLike(id: number) {
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/favorite`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ type: 'partyRoom', id })
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
        return
      }
      dispatch(updatePartyLikeToRedux(id))
      dispatch(newNotification('已收藏'))
    } catch {
      dispatch(error())
    }
  }
}

export function deletePartyRoomLike(id: number) {
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/favorite`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ type: 'partyRoom', id })
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
        return
      }
      dispatch(deletePartyLikeToRedux(id))
    } catch {
      dispatch(error())
    }
  }
}
