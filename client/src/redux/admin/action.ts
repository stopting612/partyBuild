import { EditStoreForm } from 'pages/Admin/EditStore'
import { RegisterStoreForm } from 'redux/admin/reducer'
import { error, finishLoading, startLoading } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'
import { ThunkDispatch } from 'store'
import { AccountApplications, StoreData, StoreName } from './reducer'

export function loadApplications(result: AccountApplications) {
  return {
    type: '@@admin/LOAD_APPLICATIONS' as const,
    result
  }
}

export function loadDistrictOptions(result: { id: number; name: string }[]) {
  return {
    type: '@@admin/LOAD_DISTRICT_OPTIONS' as const,
    result
  }
}

export function loadFacilityOptions(result: { id: number; type: string }[]) {
  return {
    type: '@@admin/LOAD_FACILITY_OPTIONS' as const,
    result
  }
}

export function loadStoreList(result: StoreName[]) {
  return {
    type: '@@admin/LOAD_STORE_LIST' as const,
    result
  }
}

export function loadStoreData(result: StoreData) {
  return {
    type: '@@admin/LOAD_STORE_DATA' as const,
    result
  }
}

export function resetForm() {
  return {
    type: '@@admin/RESET_FORM' as const
  }
}

export type AdminActions = ReturnType<
  | typeof loadApplications
  | typeof loadDistrictOptions
  | typeof loadFacilityOptions
  | typeof loadStoreList
  | typeof loadStoreData
  | typeof resetForm
>

export function fetchAccountApplications(page: number = 1) {
  return async function (dispatch: ThunkDispatch) {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/admin/new-copartner?page=${page}`,
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
        dispatch(
          loadApplications({ data: result.data.newCopartners, count: result.data.count })
        )
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function updateApplicationStatus(id: number, state: string) {
  return async function (dispatch: ThunkDispatch) {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/admin/new-copartner`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id, state })
        }
      )
      const result = await res.json()
      dispatch(newNotification(result.message))
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function registerBusiness(email: string) {
  return async function (dispatch: ThunkDispatch) {
    dispatch(startLoading())
    try {
      const res = await fetch(`${process.env.REACT_APP_API_SERVER}/copartner`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      const result = await res.json()
      dispatch(newNotification(result.message))
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
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

export function fetchFacilityOptions() {
  return async function (dispatch: ThunkDispatch) {
    const res = await fetch(
      `${process.env.REACT_APP_API_SERVER}/party-room/facility-type`
    )
    const result = await res.json()
    if (res.status !== 200) {
      dispatch(newNotification(result.message))
      return
    }
    dispatch(loadFacilityOptions(result.data.facilityTypes))
  }
}

export function fetchStoreList() {
  return async function (dispatch: ThunkDispatch) {
    const res = await fetch(
      `${process.env.REACT_APP_API_SERVER}/admin/party-room`,
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
    dispatch(loadStoreList(result.data))
  }
}

export function fetchStoreData(id: number) {
  return async function (dispatch: ThunkDispatch) {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/admin/party-room/${id}`,
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
        dispatch(loadStoreData(result.data))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function registerStore(data: RegisterStoreForm) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    const formData = new FormData()
    formData.append('userEmail', data.userEmail)
    formData.append('storeName', data.storeName)
    formData.append('address', data.address)
    formData.append('districtId', data.districtId)
    formData.append('area', data.area)
    formData.append('maxPeople', data.maxPeople)
    formData.append('minPeople', data.minPeople)
    formData.append('minNumberOfConsumers', '4')
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
        `${process.env.REACT_APP_API_SERVER}/admin/party-room`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        }
      )
      const result = await res.json()
      dispatch(newNotification(result.message))
      if (res.status === 200) {
        dispatch(resetForm())
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function editStore(data: EditStoreForm) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('storeName', data.storeName)
    formData.append('address', data.address)
    formData.append('districtId', data.districtId)
    formData.append('area', data.area)
    formData.append('maxPeople', data.maxPeople)
    formData.append('minPeople', data.minPeople)
    formData.append('minNumberOfConsumers', '4')
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
        `${process.env.REACT_APP_API_SERVER}/admin/party-room`,
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
