import { LoadingActions } from './action'

export interface LoadingState {
  isLoading: boolean
  error: boolean
  // timeout: number | null
}

const initialState: LoadingState = { isLoading: false, error: false }

export const loadingReducer = (
  state: LoadingState = initialState,
  action: LoadingActions
): LoadingState => {
  if (action.type === '@@loading/IS_LOADING') {
    return {
      ...state,
      isLoading: true,
      error: false
      // timeout: action.timeout
    }
  }
  if (action.type === '@@loading/NOT_LOADING') {
    return {
      ...state,
      isLoading: false,
      error: false
      // timeout: null
    }
  }
  if (action.type === '@@loading/ERROR') {
    return {
      ...state,
      isLoading: false,
      error: true
      // timeout: null
    }
  }
  return state
}
