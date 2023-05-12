import { UserProfileActions } from './action'

export interface SettingsState {
  profile: UserProfile
  message: string
}

export interface UserProfile {
  name: string
  email: string
}

const initialState: SettingsState = {
  profile: {
    name: '',
    email: ''
  },
  message: ''
}

export const settingsReducer = (
  state: SettingsState = initialState,
  action: UserProfileActions
): SettingsState => {
  if (action.type === '@@settings/LOAD_USER_PROFILE') {
    return {
      ...state,
      profile: {
        ...state.profile,
        ...action.result
      }
    }
  }
  if (action.type === '@@settings/LOAD_MESSAGE') {
    return {
      ...state,
      message: action.message
    }
  }
  if (action.type === '@@settings/RESET_MESSAGE') {
    return {
      ...state,
      message: ''
    }
  }
  return state
}
