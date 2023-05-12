import { AdminActions } from './action'

export interface AdminState {
  accountApplications: AccountApplications
  options: {
    districts: { id: number; name: string }[]
    facilities: { id: number; type: string }[]
  }
  storeList: StoreName[]
  storeData: StoreData | null
  resetForm: boolean
}

export interface AccountApplications {
  data: {
    id: number
    name: string
    email: string
    phoneNumber: string
    state: string
  }[]
  count: number
}

export interface StoreName {
  id: number
  name: string
}

export interface RegisterStoreForm {
  userEmail: string
  storeName: string
  address: string
  districtId: string
  area: string
  maxPeople: string
  minPeople: string
  introduction: string
  image: string
  facilities: Array<string>
  facilitiesDetail: string
  importantMatter: string
  contactPerson: string
  contactNumber: string
  whatsapp: string
  email: string
}

export interface StoreData {
  id: number
  name: string
  address: string
  districtId: number
  area: number
  maxPeople: number
  minPeople: number
  minNumberOfConsumers: number
  introduction: string
  image: string
  facilities: Array<{
    id: number
    name: string
    isAvailable: boolean
  }>
  facilitiesDetail: string
  importantMatter: string
  contactPerson: string
  contactNumber: number
  whatsapp: number
  email: string
}

const initialState: AdminState = {
  accountApplications: {
    data: [],
    count: 1
  },
  options: {
    districts: [],
    facilities: []
  },
  storeList: [],
  storeData: null,
  resetForm: false
}

export const adminReducer = (
  state: AdminState = initialState,
  action: AdminActions
): AdminState => {
  if (action.type === '@@admin/LOAD_APPLICATIONS') {
    return {
      ...state,
      accountApplications: {
        ...state.accountApplications,
        data: action.result.data,
        count: action.result.count
      }
    }
  }
  if (action.type === '@@admin/LOAD_DISTRICT_OPTIONS') {
    return {
      ...state,
      options: {
        ...state.options,
        districts: action.result
      }
    }
  }
  if (action.type === '@@admin/LOAD_FACILITY_OPTIONS') {
    return {
      ...state,
      options: {
        ...state.options,
        facilities: action.result
      }
    }
  }
  if (action.type === '@@admin/LOAD_STORE_LIST') {
    return {
      ...state,
      storeList: action.result
    }
  }
  if (action.type === '@@admin/LOAD_STORE_DATA') {
    return {
      ...state,
      storeData: {
        ...state.storeData,
        ...action.result
      }
    }
  }
  if (action.type === '@@admin/RESET_FORM') {
    return {
      ...state,
      resetForm: !state.resetForm
    }
  }
  return state
}
