import { AuthActions } from './action'

export interface AuthState {
  isAuthenticated: boolean
  type: string | null
  name: string
  profilePic: string
  registerSuccess: boolean
  message: string
  location: string
}

const initialState: AuthState = {
  isAuthenticated: localStorage.getItem('token') != null,
  type: localStorage.getItem('type'),
  name: '',
  profilePic: '',
  registerSuccess: false,
  message: '',
  location: ''
}

export function authReducer(
  state: AuthState = initialState,
  action: AuthActions
): AuthState {
  if (action.type === '@@auth/ERROR_MESSAGE') {
    return {
      ...state,
      message: action.message
    }
  }
  if (action.type === '@@auth/LOGIN_SUCCESS') {
    return {
      ...state,
      isAuthenticated: true,
      type: 'user',
      message: ''
    }
  }
  if (action.type === '@@auth/BUSINESS_LOGIN_SUCCESS') {
    return {
      ...state,
      isAuthenticated: true,
      type: 'business',
      message: ''
    }
  }
  if (action.type === '@@auth/ADMIN_LOGIN_SUCCESS') {
    return {
      ...state,
      isAuthenticated: true,
      type: 'admin',
      message: ''
    }
  }
  if (action.type === '@@auth/LOGIN_FAILED') {
    return {
      ...state,
      message: action.message
    }
  }
  if (action.type === '@@auth/REGISTER_SUCCESS') {
    return {
      ...state,
      registerSuccess: true,
      message: ''
    }
  }
  if (action.type === '@@auth/REGISTER_FAILED') {
    return {
      ...state,
      message: action.message
    }
  }
  if (action.type === '@@auth/CLEAR_MESSAGE') {
    return {
      ...state,
      message: ''
    }
  }
  if (action.type === '@@auth/LOAD_USER_ICON') {
    return {
      ...state,
      name: action.name,
      profilePic: action.profilePic
    }
  }
  if (action.type === '@@auth/CHECK_LOGIN') {
    return {
      ...state,
      isAuthenticated: localStorage.getItem('token') != null,
      type: localStorage.getItem('type')
    }
  }
  return state
}
