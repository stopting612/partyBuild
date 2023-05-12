import { ThunkDispatch } from 'store'

export function isLoading() {
  return {
    type: '@@loading/IS_LOADING' as const
    // timeout
  }
}

export function notLoading() {
  return {
    type: '@@loading/NOT_LOADING' as const
  }
}

export function error() {
  return {
    type: '@@loading/ERROR' as const
  }
}

export type LoadingActions = ReturnType<
  typeof isLoading | typeof notLoading | typeof error
>

export function startLoading() {
  return async (dispatch: ThunkDispatch) => {
    // const timeout = window.setTimeout(() => {
    //   dispatch(error())
    // }, 5000)
    dispatch(isLoading())
  }
}

export function finishLoading() {
  return async (dispatch: ThunkDispatch) => {
    // const timeout = getState().loading.timeout
    // if (timeout) {
    //   window.clearTimeout(timeout)
    // }
    setTimeout(() => {
      dispatch(notLoading())
    }, 300)
  }
}
