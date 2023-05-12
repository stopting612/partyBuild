import { ThunkDispatch } from 'store'

export function addNotification(message: string) {
  return {
    type: '@@notifications/ADD_NOTIFICATION' as const,
    message
  }
}

export function removeNotification() {
  return {
    type: '@@notifications/REMOVE_NOTIFICATION' as const
  }
}

export type NotificationActions = ReturnType<
  typeof addNotification | typeof removeNotification
>

export function newNotification(message: string) {
  return (dispatch: ThunkDispatch) => {
    dispatch(addNotification(message))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 3000)
  }
}
