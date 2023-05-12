import { NotificationActions } from './action'

export interface NotificationState {
  messages: string[]
}

const initialState: NotificationState = {
  messages: []
}

export const notificationReducer = (
  state: NotificationState = initialState,
  action: NotificationActions
): NotificationState => {
  if (action.type === '@@notifications/ADD_NOTIFICATION') {
    const newMessages = state.messages.concat(action.message)
    return {
      ...state,
      messages: newMessages
    }
  }
  if (action.type === '@@notifications/REMOVE_NOTIFICATION') {
    return {
      ...state,
      messages: state.messages.slice(1)
    }
  }
  return state
}
