import { BusinessActions } from './action'
import { BusinessState } from './state'

const initialState: BusinessState = {
  storeList: [],
  todayOrders: [],
  latestOrders: [],
  editStoreInfo: null,
  options: {
    districts: []
  },
  selectedBranch: {
    id: 0,
    name: '',
    openTimes: []
  },
  powerbiToken: '',
  errorMessage: ''
}

export const businessReducer = (
  state: BusinessState = initialState,
  action: BusinessActions
): BusinessState => {
  if (action.type === '@@Business/LOAD_STORES') {
    return {
      ...state,
      storeList: action.result
    }
  }
  if (action.type === '@@Business/LOAD_TODAY_ORDERS') {
    return {
      ...state,
      todayOrders: action.result
    }
  }
  if (action.type === '@@Business/LOAD_LATEST_ORDERS') {
    return {
      ...state,
      latestOrders: action.result
    }
  }
  if (action.type === '@@Business/LOAD_STORE_DATA') {
    return {
      ...state,
      editStoreInfo: action.result
    }
  }
  if (action.type === '@@Business/LOAD_DISTRICT_OPTIONS') {
    return {
      ...state,
      options: {
        ...state.options,
        districts: action.result
      }
    }
  }
  if (action.type === '@@Business/SELECT_BRANCH') {
    return {
      ...state,
      selectedBranch: {
        ...state.selectedBranch,
        ...action.store
      }
    }
  }
  if (action.type === '@@Business/LOAD_OPEN_TIME') {
    return {
      ...state,
      selectedBranch: {
        ...state.selectedBranch,
        openTimes: action.result
      }
    }
  }
  if (action.type === '@@Business/REMOVE_OPEN_TIME') {
    const newOpenTimes = state.selectedBranch.openTimes.filter(
      (openTime) => openTime.id !== action.id
    )
    return {
      ...state,
      selectedBranch: {
        ...state.selectedBranch,
        openTimes: newOpenTimes
      }
    }
  }
  if (action.type === '@@Business/LOAD_POWER_BI_TOKEN') {
    return {
      ...state,
      powerbiToken: action.token
    }
  }
  if (action.type === '@@Business/LOAD_ERROR_MESSAGE') {
    return {
      ...state,
      errorMessage: action.message
    }
  }
  if (action.type === '@@Business/RESET_ERROR_MESSAGE') {
    return {
      ...state,
      errorMessage: ''
    }
  }
  return state
}
