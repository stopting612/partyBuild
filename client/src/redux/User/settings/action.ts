import { SettingsForm } from 'pages/User/Settings/Settings'
import { fetchUserIcon } from 'redux/auth/action'
import { error, finishLoading, startLoading } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'
import { RootState, ThunkDispatch } from 'store'
import { UserProfile } from './reducer'

export function loadUserProfile(result: UserProfile) {
  return {
    type: '@@settings/LOAD_USER_PROFILE' as const,
    result
  }
}

export function loadMessage(message: string) {
  return {
    type: '@@settings/LOAD_MESSAGE' as const,
    message
  }
}

export function resetMessage() {
  return {
    type: '@@settings/RESET_MESSAGE' as const
  }
}

export type UserProfileActions = ReturnType<
  typeof loadUserProfile | typeof loadMessage | typeof resetMessage
>

export function fetchUserProfile() {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    dispatch(startLoading())
    try {
      let api: string
      const type = getState().auth.type
      if (type === 'user') {
        api = `${process.env.REACT_APP_API_SERVER}/users/profile`
      } else if (type === 'business') {
        api = `${process.env.REACT_APP_API_SERVER}/copartner/profile`
      } else if (type === 'admin') {
        api = `${process.env.REACT_APP_API_SERVER}/admin/profile`
      } else {
        return
      }
      const res = await fetch(api, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(newNotification(result.message))
      } else {
        dispatch(loadUserProfile(result.data))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function updateProfile(data: SettingsForm) {
  return async (dispatch: ThunkDispatch) => {
    if (data.password !== data.passwordRepeat) {
      dispatch(loadMessage('密碼不正確'))
      return
    }
    dispatch(startLoading())
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('password', data.password)
    if (data.image?.length) {
      formData.append('image', data.image[0])
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_API_SERVER}/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(loadMessage(result.message))
      } else {
        dispatch(fetchUserIcon())
        dispatch(resetMessage())
        dispatch(newNotification('成功更改設定'))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}
