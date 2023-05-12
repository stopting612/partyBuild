import { Timeslot } from 'components/Business/BusinessAddSlot/BusinessAddSlot'
import { push } from 'connected-react-router'
import { EditStoreForm } from 'pages/Business/BranchInfo'
import { error, finishLoading, startLoading } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'
import { RootState, ThunkDispatch } from 'store'
import { LatestOrders, OpenTime, Store, StoreData, TodayOrders } from './state'

export function loadStores(result: Store[]) {
  return {
    type: '@@Business/LOAD_STORES' as const,
    result
  }
}

export function loadTodayOrders(result: TodayOrders[]) {
  return {
    type: '@@Business/LOAD_TODAY_ORDERS' as const,
    result
  }
}

export function loadLatestOrders(result: LatestOrders[]) {
  return {
    type: '@@Business/LOAD_LATEST_ORDERS' as const,
    result
  }
}

export function loadDistrictOptions(result: { id: number; name: string }[]) {
  return {
    type: '@@Business/LOAD_DISTRICT_OPTIONS' as const,
    result
  }
}

export function loadStoreData(result: StoreData) {
  return {
    type: '@@Business/LOAD_STORE_DATA' as const,
    result
  }
}

export function selectBranch(store: Store) {
  return {
    type: '@@Business/SELECT_BRANCH' as const,
    store
  }
}

export function loadOpenTime(result: OpenTime[]) {
  return {
    type: '@@Business/LOAD_OPEN_TIME' as const,
    result
  }
}

// export function updateOpenTime(result: OpenTime) {
//   return {
//     type: '@@Business/UPDATE_OPEN_TIME' as const,
//     result
//   }
// }

export function removeOpenTime(id: number) {
  return {
    type: '@@Business/REMOVE_OPEN_TIME' as const,
    id
  }
}

export function loadPowerBIToken(token: string) {
  return {
    type: '@@Business/LOAD_POWER_BI_TOKEN' as const,
    token
  }
}

export function loadErrorMessage(message: string) {
  return {
    type: '@@Business/LOAD_ERROR_MESSAGE' as const,
    message
  }
}

export function resetErrorMessage() {
  return {
    type: '@@Business/RESET_ERROR_MESSAGE' as const
  }
}

export type BusinessActions = ReturnType<
  | typeof loadStores
  | typeof loadTodayOrders
  | typeof loadLatestOrders
  | typeof loadDistrictOptions
  | typeof loadStoreData
  | typeof selectBranch
  | typeof loadOpenTime
  // | typeof updateOpenTime
  | typeof removeOpenTime
  | typeof loadPowerBIToken
  | typeof loadErrorMessage
  | typeof resetErrorMessage
>

export function fetchStoreList() {
  return async (dispatch: ThunkDispatch) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/copartner/stores`,
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
      dispatch(loadStores(result.data))
      dispatch(selectBranch(result.data[0]))
    } catch {
      dispatch(error())
    }
  }
}

export function fetchTodayOrders() {
  return async function (dispatch: ThunkDispatch) {
    const res = await fetch(
      `${process.env.REACT_APP_API_SERVER}/copartner/today-orders`,
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
    dispatch(loadTodayOrders(result.data))
  }
}

export function fetchLatestOrders() {
  return async function (dispatch: ThunkDispatch) {
    const res = await fetch(
      `${process.env.REACT_APP_API_SERVER}/copartner/orders`,
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
    dispatch(loadLatestOrders(result.data))
  }
}

export function fetchDistrictOptions() {
  return async function (dispatch: ThunkDispatch) {
    const res = await fetch(
      `${process.env.REACT_APP_API_SERVER}/party-room/districts`
    )
    const result = await res.json()
    if (res.status !== 200) {
      dispatch(newNotification(result.message))
      return
    }
    dispatch(loadDistrictOptions(result.data.districts))
  }
}

export function fetchStoreInfo(id: number) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/copartner/store-data/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
        dispatch(push('/business/branch'))
      } else {
        dispatch(loadStoreData(result.data))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function editStore(data: EditStoreForm, id: string) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    const formData = new FormData()
    formData.append('id', id)
    formData.append('storeName', data.storeName)
    formData.append('address', data.address)
    formData.append('districtId', data.districtId)
    formData.append('area', data.area)
    formData.append('maxPeople', data.maxPeople)
    formData.append('minPeople', data.minPeople)
    formData.append('introduction', data.introduction)
    formData.append('facilities', JSON.stringify(data.facilities))
    formData.append('facilitiesDetail', data.facilitiesDetail)
    formData.append('importantMatter', data.importantMatter)
    formData.append('contactPerson', data.contactPerson)
    formData.append('contactNumber', data.contactNumber)
    formData.append('whatsapp', data.whatsapp)
    formData.append('email', data.email)
    if (data.image?.length) {
      formData.append('image', data.image[0])
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/copartner/store-data`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        }
      )
      const result = await res.json()
      dispatch(newNotification(result.message))
      if (res.status === 200) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function fetchOpenTime(id: string) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/copartner/party-room-open-time/${id}`,
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
        dispatch(loadOpenTime(result.data))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function addOpenTime(timeslots: Timeslot[], callback: () => void) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    const partyRoomID = getState().business.selectedBranch.id
    const reqBody = {
      openTimes: timeslots
        .map((timeslot, index) => {
          return {
            ...timeslot,
            partyRoomId: partyRoomID,
            openTimeIndex: index
          }
        })
        .filter(
          (timeslot) => timeslot.date && timeslot.startTime && timeslot.endTime
        )
    }
    if (reqBody.openTimes.length === 0) {
      dispatch(loadErrorMessage('請填寫日期時段'))
      return
    }
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/copartner/party-room-open-time`,
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
      if (result.message === 'Have Repeat Time') {
        const conflicts = result.data.conflictIndex
          .map(
            (index: number) =>
              `${timeslots[index].date} ${timeslots[index].startTime} - ${timeslots[index].endTime}\n`
          )
          .reduce((acc: string, cur: string) => acc + cur, '以下時段出現衝突\n')
        dispatch(loadErrorMessage(conflicts))
      } else if (res.status !== 200) {
        dispatch(loadErrorMessage(result.message))
      } else {
        dispatch(fetchOpenTime(String(partyRoomID)))
        dispatch(newNotification(result.message))
        dispatch(resetErrorMessage())
        callback()
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function editOpenTime(editSlot: OpenTime, callback: () => void) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/copartner/party-room-open-time`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(editSlot)
        }
      )
      const result = await res.json()
      if (result.message === 'Have Repeat Time') {
        dispatch(loadErrorMessage('時段出現衝突'))
        dispatch(finishLoading())
        return
      }
      if (res.status === 200) {
        dispatch(newNotification(result.message))
        dispatch(resetErrorMessage())
        const partyRoomID = getState().business.selectedBranch.id
        dispatch(fetchOpenTime(String(partyRoomID)))
        callback()
      } else {
        dispatch(loadErrorMessage(result.message))
        dispatch(finishLoading())
      }
    } catch {
      dispatch(error())
    }
  }
}

export function deleteOpenTime(id: string) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/copartner/party-room-open-time/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const result = await res.json()
      if (res.status === 200) {
        dispatch(removeOpenTime(Number(id)))
      }
      dispatch(newNotification(result.message))
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function fetchPowerBIToken() {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/copartner/powerbi`,
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
        dispatch(loadPowerBIToken(result.token))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}
