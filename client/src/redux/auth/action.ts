import { push } from 'connected-react-router'
import { error, finishLoading, startLoading } from 'redux/loading/action'
import { newNotification } from 'redux/notifications/action'
import { logoutSuccess, ThunkDispatch } from 'store'

export function loginSuccess() {
  return {
    type: '@@auth/LOGIN_SUCCESS' as const
  }
}

export function businessLoginSuccess() {
  return {
    type: '@@auth/BUSINESS_LOGIN_SUCCESS' as const
  }
}

export function adminLoginSuccess() {
  return {
    type: '@@auth/ADMIN_LOGIN_SUCCESS' as const
  }
}

export function loginFailed(message: string) {
  return {
    type: '@@auth/LOGIN_FAILED' as const,
    message
  }
}

// export function logoutSuccess() {
//   return {
//     type: '@@auth/LOGOUT_SUCCESS' as const
//   }
// }

export function registerSuccess() {
  return {
    type: '@@auth/REGISTER_SUCCESS' as const
  }
}

export function registerFailed(message: string) {
  return {
    type: '@@auth/REGISTER_FAILED' as const,
    message
  }
}

export function errorMessage(message: string) {
  return {
    type: '@@auth/ERROR_MESSAGE' as const,
    message
  }
}

export function clearMessage() {
  return {
    type: '@@auth/CLEAR_MESSAGE' as const
  }
}

export function loadUserIcon(name: string, profilePic: string) {
  return {
    type: '@@auth/LOAD_USER_ICON' as const,
    name,
    profilePic
  }
}

export function checkLogin() {
  return {
    type: '@@auth/CHECK_LOGIN' as const
  }
}

export type AuthActions = ReturnType<
  | typeof loginSuccess
  | typeof businessLoginSuccess
  | typeof adminLoginSuccess
  | typeof loginFailed
  | typeof registerSuccess
  | typeof registerFailed
  | typeof errorMessage
  | typeof clearMessage
  | typeof loadUserIcon
  | typeof checkLogin
>

export function logout() {
  return async (dispatch: ThunkDispatch) => {
    localStorage.removeItem('token')
    localStorage.removeItem('type')
    dispatch(logoutSuccess())
    dispatch(checkLogin())
    dispatch(push('/'))
  }
}
export function fetchUserIcon() {
  return async (dispatch: ThunkDispatch) => {
    const res = await fetch(
      `${process.env.REACT_APP_API_SERVER}/users/name-picture`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    if (res.status !== 200) {
      dispatch(newNotification('Failed to load user'))
      dispatch(logout())
      return
    }
    const userIcon = await res.json()
    const { name, picture } = userIcon.data
    dispatch(loadUserIcon(name, picture))
  }
}

export function login(
  email: string,
  password: string,
  redirect: boolean = true
) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(loginFailed(result.message))
      } else {
        localStorage.setItem('token', result.token)
        localStorage.setItem('type', 'user')
        await dispatch(fetchUserIcon())
        dispatch(loginSuccess())
        if (redirect) {
          dispatch(push('/'))
        }
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function businessLogin(email: string, password: string) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/copartner/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        }
      )

      const result = await res.json()
      if (res.status !== 200) {
        dispatch(loginFailed(result.message))
      } else {
        localStorage.setItem('token', result.token)
        localStorage.setItem('type', 'business')
        await dispatch(fetchUserIcon())
        dispatch(businessLoginSuccess())
        dispatch(push('/business'))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function adminLogin(email: string, password: string) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/admin/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(loginFailed(result.message))
      } else {
        localStorage.setItem('token', result.token)
        localStorage.setItem('type', 'admin')
        await dispatch(fetchUserIcon())
        dispatch(adminLoginSuccess())
        dispatch(push('/admin/account-applications'))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function registerUser(name: string, password: string, email: string) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, password, email })
        }
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(registerFailed(result.message))
      } else {
        dispatch(registerSuccess())
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}

export function verifyUser(token: string | null) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(startLoading())
    if (!token) {
      dispatch(push('/'))
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER}/users/email-verification?token=${token}`
      )
      const result = await res.json()
      if (res.status !== 200) {
        dispatch(errorMessage(result.message))
      } else {
        localStorage.setItem('token', result.token)
        localStorage.setItem('type', 'user')
        dispatch(loginSuccess())
        dispatch(push('/user/my-party'))
      }
      dispatch(finishLoading())
    } catch {
      dispatch(error())
    }
  }
}
